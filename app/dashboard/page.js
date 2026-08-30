"use client";
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '', email: '', phone: '', city: '', state: '', country: '', linkedin: '', portfolio: '',
    headline: '', yearsExperience: '', currentTitle: '', skills: '', experience: '', education: '',
    certifications: '', projects: '', achievements: '', languages: ''
  });
  const router = useRouter();

  // 1. Security Check: Are you logged in?
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // 2. Fetch existing profile data from the vault
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
        setLoading(false);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  // 3. Save to Vault
  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "profiles", user.uid), profile);
      alert("Profile saved successfully!");
    } catch (error) {
      alert("Error saving profile: " + error.message);
    }
    setSaving(false);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-10 text-center">Loading your profile...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-10 text-blue-400">JobAI</h2>
        <nav className="space-y-4">
  <button 
    onClick={() => setView('profile')} 
    className={`w-full text-left p-3 rounded-lg ${view === 'profile' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
  >
    My Profile
  </button>
  <button 
    onClick={() => setView('resume')} 
    className={`w-full text-left p-3 rounded-lg ${view === 'resume' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
  >
    My Resume
  </button>
  <div className="p-3 text-gray-500 cursor-not-allowed">Job Search (Soon)</div>
</nav>
        <button onClick={() => signOut(auth)} className="mt-20 text-red-400 hover:text-red-300">Logout</button>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Professional Profile</h1>
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </header>

          <div className="space-y-8">
            {/* PERSONAL INFORMATION */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-blue-600 border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input name="fullName" value={profile.fullName} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input name="email" value={profile.email} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input name="phone" value={profile.phone} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="+1 234 567 890" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                  <input name="linkedin" value={profile.linkedin} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="linkedin.com/in/..." />
                </div>
              </div>
            </section>

            {/* PROFESSIONAL INFORMATION */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-blue-600 border-b pb-2">Professional Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Professional Headline</label>
                  <input name="headline" value={profile.headline} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="e.g. Senior Marketing Manager with 10 years experience" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Job Title</label>
                    <input name="currentTitle" value={profile.currentTitle} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Years of Experience</label>
                    <input name="yearsExperience" value={profile.yearsExperience} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Skills (Comma separated)</label>
                  <textarea name="skills" value={profile.skills} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md h-20" placeholder="Python, Project Management, Public Speaking..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Work History & Education</label>
                  <textarea name="experience" value={profile.experience} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md h-32" placeholder="List your previous roles and education here..." />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
