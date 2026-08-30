"use client";
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) { setUser(user); } 
      else { router.push('/login'); }
    });
    return () => unsubscribe();
  }, []);

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <button onClick={() => signOut(auth)} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
      <div className="bg-white p-6 shadow rounded-lg border border-blue-100">
        <h2 className="text-xl mb-2">Welcome, {user.email}</h2>
        <p className="text-gray-600 font-medium">Status: Phase 1 Active ✅</p>
        <p className="mt-4 text-sm text-gray-400 italic">Your foundation is ready. Phase 2 will enable resume uploads here.</p>
      </div>
    </div>
  );
}
