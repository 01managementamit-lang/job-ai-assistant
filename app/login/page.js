"use client";
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push('/dashboard');
    } catch (e) { alert(e.message); }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (e) { alert(e.message); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
        <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-2 border p-3 rounded-lg mb-4 hover:bg-gray-50">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" />
          Continue with Google
        </button>
        <div className="text-center text-gray-400 mb-4">or</div>
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" onChange={(e)=>setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg" onChange={(e)=>setPassword(e.target.value)} />
          <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold">Log In</button>
        </form>
        <p className="mt-4 text-center text-sm">Don't have an account? <Link href="/signup" className="text-blue-600">Sign Up</Link></p>
      </div>
    </div>
  );
}
