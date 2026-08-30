"use client";
import { useState } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");
    setUploading(true);

    try {
      // 1. Upload to Firebase Storage
      const storageRef = ref(storage, `resumes/${auth.currentUser.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // 2. Call our AI Extraction tool (we will build this API next)
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: JSON.stringify({ url }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      setExtractedData(result.data);
    } catch (error) {
      alert("Error: " + error.message);
    }
    setUploading(false);
  };

  const saveToProfile = async () => {
    try {
      await updateDoc(doc(db, "profiles", auth.currentUser.uid), extractedData);
      alert("Profile updated with resume data!");
      setExtractedData(null);
    } catch (error) {
      alert("Error saving to profile");
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Resume</h1>
      <div className="bg-white p-8 rounded-xl shadow-md border-2 border-dashed border-gray-300 text-center">
        <input type="file" accept=".pdf" onChange={handleFileChange} className="mb-4" />
        <button 
          onClick={handleUpload} 
          disabled={uploading}
          className="block w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
        >
          {uploading ? "Analyzing Resume with AI..." : "Upload & Extract Data"}
        </button>
      </div>

      {extractedData && (
        <div className="mt-10 bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h2 className="text-xl font-bold mb-4">AI Extracted Information</h2>
          <p className="text-sm text-gray-600 mb-4 font-medium italic">Review the information below before adding it to your profile.</p>
          <div className="space-y-4 bg-white p-4 rounded shadow-inner max-h-96 overflow-y-auto">
             {Object.entries(extractedData).map(([key, value]) => (
               <div key={key}>
                 <span className="font-bold text-gray-700 capitalize">{key}:</span>
                 <p className="text-gray-600">{value || "Not found"}</p>
               </div>
             ))}
          </div>
          <button 
            onClick={saveToProfile}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-bold"
          >
            Confirm & Save to My Profile
          </button>
        </div>
      )}
    </div>
  );
}
