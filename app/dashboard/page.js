"use client";
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('profile'); // Switch between 'profile' and 'resume'
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [profile, setProfile] = useState({
    fullName: '', email: '', phone: '', city: '', state: '', country: '', linkedin: '', portfolio: '',
    headline: '', yearsExperience: '', currentTitle: '', skills: '', experience: '', education: ''
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docSnap = await getDoc(doc(db, "profiles", user.uid));
        if (docSnap.exists()) setProfile(docSnap.data());
        setLoading(false);
      } else { router.push('/login'); }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSaveProfile = async () => {
    await setDoc(doc(db, "profiles", user.uid), profile);
    alert("Profile Saved successfully!");
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setExtracting(true);
    
    // Logic to read a PDF file as plain text
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      
      try {
        const res = await fetch('/api/extract', {
          method: 'POST',
          body: JSON.stringify({ text: text.substring(0, 4000) }), // Send first 4000 chars to AI
          headers: { 'Content-Type': 'application/json' }
        });
        const result = await res.json();
        setExtractedData(result.data);
      } catch (err) {
        alert("AI Extraction failed. Please try again.");
      } finally {
        setExtracting(false);
      }
    };
    reader.readAsText(file); // This reads the file content
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading JobAI...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white p-6 shadow-xl">
        <h2 className="text-2xl font-extrabold mb-10 text-blue-400 tracking-tight">JobAI</h2>
        <nav className="space-y-2">
          <button 
            onClick={() => setView('profile')} 
            className={`w-full text-left p-3 rounded-lg transition ${view==='profile'?'bg-blue-600 font-bold shadow-lg':'hover:bg-slate-800 text-gray-400'}`}
          >
            My Profile
          </button>
          <button 
            onClick={() => setView('resume')} 
            className={`w-full text-left p-3 rounded-lg transition ${view==='resume'?'bg-blue-600 font-bold shadow-lg':'hover:bg-slate-800 text-gray-400'}`}
          >
            My Resume
          </button>
        </nav>
        <button onClick={() => signOut(auth)} className="mt-20 text-red-400 hover:text-red-300 text-sm font-medium">Logout</button>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-10 overflow-y-auto">
        {view === 'profile' ? (
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">My Professional Profile</h1>
                <button onClick={handleSaveProfile} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md">Save Changes</button>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Full Name</label>
                        <input className="w-full p-3 border rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none" value={profile.fullName} onChange={(e)=>setProfile({...profile, fullName: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Email Address</label>
                        <input className="w-full p-3 border rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none" value={profile.email} onChange={(e)=>setProfile({...profile, email: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Professional Skills</label>
                    <textarea className="w-full p-3 border rounded-xl mt-1 h-32 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Project Management, Python, Team Leadership..." value={profile.skills} onChange={(e)=>setProfile({...profile, skills: e.target.value})} />
                </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4 text-slate-800">Upload Your Resume</h1>
            <p className="text-gray-500 mb-8">Upload your existing resume, and our AI will automatically fill out your profile for you.</p>
            
            <div className="border-4 border-dashed border-gray-200 p-16 bg-white rounded-3xl hover:border-blue-400 transition cursor-pointer group">
              <input type="file" accept=".pdf,.txt" onChange={handleResumeUpload} className="hidden" id="resume-upload" />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <div className="text-5xl mb-4 text-gray-300 group-hover:text-blue-500 transition">📄</div>
                <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-bold">Select PDF File</span>
              </label>
              {extracting && <p className="mt-6 text-blue-600 animate-pulse font-bold">AI is reading your resume... please wait.</p>}
            </div>

            {extractedData && (
              <div className="mt-10 bg-green-50 p-8 rounded-2xl border-2 border-green-100 text-left animate-in fade-in slide-in-from-bottom-4">
                <h3 className="font-extrabold text-green-800 text-lg mb-4 flex items-center gap-2">
                    <span>✅</span> AI Extracted Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-gray-400 font-bold uppercase text-[10px]">Name</p>
                        <p className="font-semibold text-gray-700">{extractedData.fullName}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-gray-400 font-bold uppercase text-[10px]">Skills Found</p>
                        <p className="font-semibold text-gray-700 truncate">{extractedData.skills}</p>
                    </div>
                </div>
                <button 
                  onClick={async () => {
                    const finalData = {...profile, ...extractedData};
                    await updateDoc(doc(db, "profiles", user.uid), finalData);
                    setProfile(finalData);
                    alert("Data synced to your profile!");
                    setView('profile');
                  }}
                  className="bg-green-600 text-white px-8 py-4 rounded-xl w-full font-bold shadow-lg hover:bg-green-700 transition"
                >
                  Confirm & Sync to My Profile
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
