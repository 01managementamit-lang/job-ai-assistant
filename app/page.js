import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-blue-600">JobAI</div>
        <div className="space-x-6">
          <Link href="/login" className="text-gray-600 font-medium">Log in</Link>
          <Link href="/signup" className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium shadow-md">Sign Up</Link>
        </div>
      </nav>
      <main className="flex flex-col items-center justify-center mt-24 px-4 text-center">
        <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">
          Your AI-Powered <span className="text-blue-600">Career Wingman.</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-2xl">
          From company research to tailored resumes, we help you land the job you actually want. 
          Stop applying blindly. Start winning.
        </p>
        <div className="mt-10">
          <Link href="/signup" className="bg-slate-900 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-2xl hover:bg-slate-800">
            Get Started for Free
          </Link>
        </div>
      </main>
    </div>
  );
}
