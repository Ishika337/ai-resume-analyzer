import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SpeechRecorder from '../components/SpeechRecorder';

const Interview = () => {
    const navigate = useNavigate();
    const [skillsInput, setSkillsInput] = useState('');
    const [difficulty, setDifficulty] = useState('Intermediate');
    const [interviewStarted, setInterviewStarted] = useState(false);
    
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [transcriptText, setTranscriptText] = useState('');
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [sessionHistory, setSessionHistory] = useState([]);

    const triggerQuestionGeneration = async (e) => {
        e.preventDefault();
        if (!skillsInput.trim()) return;
        setLoadingQuestions(true);
        try {
            const skillsArray = skillsInput.split(',').map(s => s.trim());
            const res = await axios.post('http://localhost:8000/generate-interview', {
                skills: skillsArray,
                difficulty: difficulty
            });
            if (res.data?.questions) {
                setQuestions(res.data.questions);
                setInterviewStarted(true);
            }
        } catch (err) {
            alert("Error requesting AI interview configuration sheets.");
        }
        setLoadingQuestions(false);
    };

    const handleSpeechPiece = (text) => setTranscriptText((prev) => prev + text);

    const proceedNextEvaluation = async () => {
        if (!transcriptText.trim()) return;
        setIsEvaluating(true);
        try {
            // Safety Check: Resolving object format issues if backend returns object structures
            const currentQuestionObj = questions[currentIdx];
            const currentQuestionText = typeof currentQuestionObj === 'object' && currentQuestionObj !== null
                ? (currentQuestionObj.question || JSON.stringify(currentQuestionObj))
                : currentQuestionObj;

            const evalRes = await axios.post('http://localhost:8000/evaluate-answer', {
                question: currentQuestionText,
                user_answer: transcriptText
            });

            const currentElement = {
                question: currentQuestionText,
                user_answer: transcriptText,
                score: evalRes.data.score || 6,
                strengths: evalRes.data.strengths || "Response recorded cleanly.",
                weaknesses: evalRes.data.weaknesses || "Review specific reference criteria.",
                improvement: evalRes.data.improvement || "Consult core framework guides.",
                confidence: evalRes.data.confidence || 75
            };

            const incrementalHistory = [...sessionHistory, currentElement];
            setSessionHistory(incrementalHistory);
            setTranscriptText('');

            if (currentIdx + 1 < questions.length) {
                setCurrentIdx((prev) => prev + 1);
            } else {
                localStorage.setItem("latestSessionReport", JSON.stringify(incrementalHistory));
                const finalAverage = Math.round((incrementalHistory.reduce((acc, c) => acc + c.score, 0) / incrementalHistory.length) * 10);
                localStorage.setItem("interviewReadiness", finalAverage);
                navigate('/interview-report');
            }
        } catch (err) {
            alert("Error syncing audio packet downstream.");
        }
        setIsEvaluating(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
                {!interviewStarted ? (
                    <form onSubmit={triggerQuestionGeneration} className="space-y-4">
                        <h2 className="text-xl font-black text-indigo-400 uppercase tracking-wide">Configure AI Voice Matrix</h2>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Target Skills</label>
                            <input 
                                type="text" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} required
                                placeholder="React, Python, SQL..."
                                className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Difficulty</label>
                            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                <option value="Junior">Junior Tier</option>
                                <option value="Intermediate">Intermediate Infrastructure</option>
                                <option value="Senior">Senior Lead Architecture</option>
                            </select>
                        </div>
                        <button type="submit" disabled={loadingQuestions} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition duration-150 shadow-md">
                            {loadingQuestions ? "Building Engine Tracks..." : "Launch Session Metrics"}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between text-xs font-bold text-indigo-300 uppercase">
                            <span>Question {currentIdx + 1} of {questions.length}</span>
                            <span>{Math.round((currentIdx / questions.length) * 100)}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
                        </div>
                        
                        {/* Interactive Board Section - Fixed Object Render Error */}
                        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                            <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">Active AI Prompt</span>
                            <p className="text-sm font-semibold text-gray-200 mt-1 leading-relaxed">
                                {typeof questions[currentIdx] === 'object' && questions[currentIdx] !== null
                                    ? (questions[currentIdx].question || JSON.stringify(questions[currentIdx]))
                                    : questions[currentIdx]
                                }
                            </p>
                        </div>

                        <SpeechRecorder onTranscriptComplete={handleSpeechPiece} isProcessing={isEvaluating} />
                        <textarea 
                            readOnly value={transcriptText} placeholder="Voice transcript logs streaming canvas..." rows={4}
                            className="w-full p-3 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-300 focus:outline-none resize-none leading-relaxed"
                        />
                        <button 
                            onClick={proceedNextEvaluation} disabled={isEvaluating || !transcriptText.trim()}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 text-xs rounded-xl transition disabled:opacity-40 shadow"
                        >
                            {isEvaluating ? "Analyzing Track Data..." : (currentIdx + 1 === questions.length ? "Compile Reports" : "Verify & Advance")}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Interview;