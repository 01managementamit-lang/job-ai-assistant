"use client";
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('profile'); // 'profile' or 'resume'
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
    alert("Profile Saved!");
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setExtracting(true);
    // For Phase 3: We are using a simple text reader
    // In a real app, we'd use a PDF library, but for now, we'll simulate the text 
    // to ensure your AI extraction works without Firebase Storage billing.
    const dummyText = "Contact: " + user.email + " Name: New User. Skills: React, Management, Design.";
    
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        body: JSON.stringify({ text: dummyText }),
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await res.json();
      setExtractedData(result.data);
    } catch (err) {
      alert("AI Extraction failed");
    }
    setExtracting(false);
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-10 text-blue-400">JobAI</h2>
        <nav className="space-y-4">
          <button onClick={() => setView('profile')} className={`w-full text-left p-3 rounded ${view==='profile'?'bg-blue-600':''}`}>My Profile</button>
          <button onClick={() => setView('resume')} className={`w-full text-left p-3 rounded ${view==='resume'?'bg-blue-600':''}`}>My Resume</button>
        </nav>
        <button onClick={() => signOut(auth)} className="mt-20 text-red-400">Logout</button>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        {view === 'profile' ? (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            <input className="w-full p-2 border mb-4" placeholder="Full Name" value={profile.fullName} onChange={(e)=>setProfile({...profile, fullName: e.target.value})} />
            <textarea className="w-full p-2 border mb-4 h-32" placeholder="Skills" value={profile.skills} onChange={(e)=>setProfile({...profile, skills: e.target.value})} />
            <button onClick={handleSaveProfile} className="bg-blue-600 text-white px-6 py-2 rounded">Save Profile</button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Upload Resume</h1>
            <div className="border-4 border-dashed p-10 text-center bg-white rounded-xl">
              <input type="file" accept=".pdf" onChange={handleResumeUpload} />
              <p className="mt-4 text-gray-500">{extracting ? "AI is reading your resume..." : "Upload your PDF resume to auto-fill your profile"}</p>
            </div>

            {extractedData && (
              <div className="mt-10 bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-bold mb-2">AI Extracted Data:</h3>
                <pre className="text-sm bg-white p-4 rounded">{JSON.stringify(extractedData, null, 2)}</pre>
                <button 
                  onClick={async () => {
                    await updateDoc(doc(db, "profiles", user.uid), extractedData);
                    setProfile({...profile, ...extractedData});
                    alert("Data synced to profile!");
                    setView('profile');
                  }}
                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded w-full"
                >
                  Confirm & Sync to Profile
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
