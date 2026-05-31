
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [jd, setJd] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);
    const [readinessScore, setReadinessScore] = useState(null);
    
    // Smart Tracking State: Stores the unique hash identifier of current uploads
    const [currentSessionKey, setCurrentSessionKey] = useState("");

    // Load score from localStorage on initial page paint/refresh
    useEffect(() => {
        const score = localStorage.getItem("interviewReadiness");
        if (score) {
            setReadinessScore(score);
        }
        
        // Retain the session fingerprint layout across soft refreshes if available
        const savedKey = localStorage.getItem("currentSessionFingerprint");
        if (savedKey) {
            setCurrentSessionKey(savedKey);
        }
    }, []);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!file || !jd.trim()) {
            alert("Upload resume and type JD first!");
            return;
        }
        
        setLoading(true);

        // 🕵️‍♂️ Smart Fingerprinting: Combines File properties with unique substring metadata of JD text
        const newSessionKey = `${file.name}-${file.size}-${jd.trim().substring(0, 30)}`;

        // Check if user changed the physical file OR changed the target Job Description context
        if (currentSessionKey && currentSessionKey !== newSessionKey) {
            // Clear previous history records immediately to provision a clean canvas
            localStorage.removeItem("interviewReadiness");
            localStorage.removeItem("latestSessionReport");
            localStorage.removeItem("currentSessionFingerprint");
            setReadinessScore(null);
        }
        
        // Commit the current session footprint parameters to active memory loops
        setCurrentSessionKey(newSessionKey);
        localStorage.setItem("currentSessionFingerprint", newSessionKey);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("job_description", jd);
        
        try {
            const res = await axios.post("http://localhost:8000/analyze", formData);
            setAnalysisData(res.data);
        } catch (err) {
            alert("Analysis operation crashed.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 font-sans antialiased">
            {/* Header / Top Operations Bar */}
            <div className="max-w-6xl mx-auto flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                <h1 className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    AI Career Copilot 🚀
                </h1>
                <button 
                    onClick={() => navigate('/interview')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow transition duration-150"
                >
                    Start Voice Interview 🎤
                </button>
            </div>

            {/* Core Application Grid Layout */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Left Control Column: Inputs Panel + Persistent Profile Status */}
                <div className="space-y-4">
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700/70 shadow-sm">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-3">Input Center</h2>
                        <form onSubmit={handleAnalyze} className="space-y-3">
                            <input 
                                type="file" accept=".pdf" onChange={handleFileChange}
                                className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600 cursor-pointer"
                            />
                            <textarea 
                                value={jd} onChange={(e) => setJd(e.target.value)}
                                placeholder="Paste target Job Description here..." rows={4}
                                className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-xs transition duration-150"
                            >
                                {loading ? "Analyzing Profile Layer..." : "Analyze Profile"}
                            </button>
                        </form>
                    </div>

                    {/* Smart State Performance Widget */}
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700/70 flex flex-col justify-center shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                                    Last Assessment Score
                                </span>
                                <span className="text-[11px] text-gray-400 block">
                                    {readinessScore ? "Performance matches active profile footprint" : "No interview history found for this profile"}
                                </span>
                            </div>
                            <span className={`text-2xl font-black ${readinessScore ? "text-purple-400" : "text-gray-600"}`}>
                                {readinessScore ? `${readinessScore}%` : "N/A"}
                            </span>
                        </div>
                        {readinessScore && (
                            <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden mt-3">
                                <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${readinessScore}%` }}></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Analytics Column: Output Dashboards */}
                <div className="lg:col-span-2 space-y-4">
                    {analysisData ? (
                        <div className="space-y-4">
                            {/* Score Matrix Cards Header */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center shadow-sm">
                                    <span className="text-[10px] font-bold uppercase text-gray-400 mb-1">ATS Score</span>
                                    <span className="text-3xl font-black text-emerald-400">{analysisData.ats_score}%</span>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 sm:col-span-3 flex items-center shadow-sm">
                                    <p className="text-gray-300 text-xs leading-relaxed">
                                        <strong className="text-indigo-400">Strategic Feedback: </strong>{analysisData.feedback}
                                    </p>
                                </div>
                            </div>

                            {/* Section breakdown metrics bars */}
                            {analysisData.breakdown && (
                                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm grid grid-cols-2 gap-4">
                                    {Object.entries(analysisData.breakdown).map(([key, val]) => (
                                        <div key={key}>
                                            <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase mb-0.5">
                                                <span>{key}</span>
                                                <span>{val}%</span>
                                            </div>
                                            <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-indigo-500 h-full" style={{ width: `${val}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Skills Comparison Matrix Box */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gray-800 p-3 rounded-xl border border-gray-700">
                                    <h4 className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wide">Matching Skills</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {analysisData.matching_skills?.map((s, idx) => (
                                            <span key={idx} className="bg-emerald-950/40 text-emerald-300 border border-emerald-900/60 text-[10px] px-2 py-0.5 rounded">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-gray-800 p-3 rounded-xl border border-gray-700">
                                    <h4 className="text-xs font-bold text-rose-400 mb-2 uppercase tracking-wide">Missing Skills</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {analysisData.missing_skills?.map((s, idx) => (
                                            <span key={idx} className="bg-rose-950/40 text-rose-300 border border-rose-900/60 text-[10px] px-2 py-0.5 rounded">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* AI Action Roadmap Blocks */}
                            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                                <h3 className="text-xs font-bold text-indigo-400 mb-3 uppercase tracking-wide">🎯 AI Learning Roadmap</h3>
                                <div className="space-y-2">
                                    {analysisData.resources?.map((item, idx) => (
                                        <div key={idx} className="bg-gray-900 p-2.5 rounded-lg border border-gray-800 flex items-center justify-between text-xs gap-4">
                                            <div className="flex items-center gap-3 truncate">
                                                <span className="bg-indigo-950 text-indigo-300 font-bold px-2 py-0.5 rounded text-[10px] border border-indigo-900 uppercase shrink-0">
                                                    {item.skill}
                                                </span>
                                                <p className="text-gray-300 text-xs truncate">{item.recommendation}</p>
                                            </div>
                                            <a href={item.link} target="_blank" rel="noreferrer" className="text-emerald-400 font-bold text-[11px] shrink-0">Docs ↗</a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 text-center min-h-[260px] flex flex-col items-center justify-center">
                            <p className="text-gray-500 text-sm">No profile data parsed yet. Process files in the Input Center to build analytics charts.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;




