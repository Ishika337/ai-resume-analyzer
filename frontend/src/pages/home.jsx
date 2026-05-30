
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiSearch, FiFileText, FiCheckCircle } from "react-icons/fi";
import Dashboard from "./dashboard"; // Make sure path is correct

export default function Home() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file || !jd) {
      alert("Bhai, Resume aur Job Description dono zaroori hain!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jd);

    try {
      const response = await axios.post("http://localhost:8000/analyze", formData);
      setResult(response.data);
      
      // History save karne ke liye (Optional Day 19 feature)
      const history = JSON.parse(localStorage.getItem("resumeHistory") || "[]");
      localStorage.setItem("resumeHistory", JSON.stringify([response.data, ...history].slice(0, 5)));
      
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Backend se connect nahi ho pa raha. Check if server is running!");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button 
          onClick={() => setResult(null)} 
          className="ml-8 mt-4 text-blue-400 hover:text-blue-300 flex items-center gap-2"
        >
          ← Back to Analyzer
        </button>
        <Dashboard data={result} />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 flex flex-col items-center font-sans">
      {/* Header Section */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          AI Career Copilot 🚀
        </h1>
        <p className="text-gray-400 text-lg">Optimize your resume for ATS in seconds.</p>
      </motion.div>

      {/* Main Analyzer Card */}
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        
        {/* Upload Area */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer
            ${file ? 'border-green-500/50 bg-green-500/5' : 'border-blue-500/30 bg-blue-500/5 hover:border-blue-400'}`}
        >
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="fileInput"
          />
          <div className="flex flex-col items-center">
            {file ? (
              <>
                <FiCheckCircle size={50} className="text-green-400 mb-4" />
                <p className="text-green-400 font-medium text-lg">File Uploaded: {file.name}</p>
                <p className="text-gray-500 text-sm mt-1">Click or drag to change file</p>
              </>
            ) : (
              <>
                <FiUploadCloud size={50} className="text-blue-400 mb-4" />
                <p className="text-xl text-gray-200">Drag & Drop Resume or <span className="text-blue-400 font-bold">Browse</span></p>
                <p className="text-gray-500 text-sm mt-2 font-light">PDF or DOCX supported (Max 5MB)</p>
              </>
            )}
          </div>
        </motion.div>

        {/* Job Description Input */}
        <div className="mt-8">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-3 ml-1">
            <FiFileText /> JOB DESCRIPTION
          </label>
          <textarea 
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
            placeholder="Paste the job requirements here to compare..."
            rows="5"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
        </div>

        {/* Action Button */}
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className={`w-full mt-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform
            ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 active:scale-[0.98]'}`}
        >
          {loading ? (
            <>
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-6 h-6 border-3 border-white border-t-transparent rounded-full" 
              />
              <span>AI is Analyzing...</span>
            </>
          ) : (
            <>
              <FiSearch size={22} />
              <span>Analyze Now</span>
            </>
          )}
        </button>
      </div>

      {/* Footer Info */}
      <p className="mt-12 text-gray-600 text-sm">
        Powered by AI • Optimized for Modern Tech Roles
      </p>
    </div>
  );
}