"use client";
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (e) { alert(e.message); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 border rounded" onChange={(e)=>setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded" onChange={(e)=>setPassword(e.target.value)} />
          <button className="w-full bg-blue-600 text-white p-3 rounded font-bold">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
