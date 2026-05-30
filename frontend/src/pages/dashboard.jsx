import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis } from 'recharts';
import { FiExternalLink, FiBookOpen, FiCheckCircle, FiAlertTriangle, FiZap, FiTarget } from "react-icons/fi";

const Dashboard = ({ data }) => {
  if (!data) return <div className="text-white text-center mt-20">Analyzing Resume...</div>;

  const chartData = [
    { name: 'Skills', score: data.breakdown?.skills || 0 },
    { name: 'Exp', score: data.breakdown?.experience || 0 },
    { name: 'Proj', score: data.breakdown?.projects || 0 },
    { name: 'Edu', score: data.breakdown?.education || 0 },
  ];

  const matchCount = data.matching_skills?.length || 0;
  const missCount = data.missing_skills?.length || 0;
  const total = (matchCount + missCount) || 1;
  const matchPercent = (matchCount / total) * 100;
  const missPercent = (missCount / total) * 100;

  return (
    <div className="p-4 md:p-6 bg-[#020617] min-h-screen text-white font-sans">
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* ROW 1: ATS SCORE & BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-card p-4 flex items-center justify-between col-span-1 min-h-[120px]">
            <div className="w-24 h-24 flex-shrink-0 relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{v: data.ats_score}, {v: 100-data.ats_score}]} innerRadius={30} outerRadius={40} dataKey="v" stroke="none">
                      <Cell fill="#38bdf8" />
                      <Cell fill="#1e293b" />
                    </Pie>
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">{data.ats_score}%</div>
            </div>
            <div className="ml-4 space-y-2">
              <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider italic">Quick Insights</h3>
              <div className="flex items-center gap-2 text-[10px] text-gray-300">
                <FiZap className="text-yellow-400" /> <span>{data.ats_score > 70 ? "High Match" : "Low Match"}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-300">
                <FiTarget className="text-purple-400" /> <span>{matchCount} Skills Matched</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 col-span-1 lg:col-span-2 min-h-[120px]">
            <h3 className="text-[10px] font-bold mb-2 text-gray-500 uppercase">Resume Strength Breakdown</h3>
            <div className="h-[80px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                    <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={35} />
                  </BarChart>
                </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ROW 2: SKILLS (CIRCULAR PATTERN) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Matching Skills */}
          <div className="glass-card p-4 flex items-center gap-4 border-b-2 border-green-500/30">
            <div className="w-20 h-20 flex-shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{v: matchPercent}, {v: 100-matchPercent}]} innerRadius={25} outerRadius={32} dataKey="v" stroke="none">
                    <Cell fill="#22c55e" />
                    <Cell fill="#14532d" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center text-green-500"><FiCheckCircle size={18} /></div>
            </div>
            <div className="flex-1">
              <h4 className="text-[10px] font-bold text-green-400 uppercase mb-2">Matching Skills ({matchCount})</h4>
              <div className="flex flex-wrap gap-1">
                {data.matching_skills?.map(s => (
                  <span key={s} className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-[9px] border border-green-500/20">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Missing Skills */}
          <div className="glass-card p-4 flex items-center gap-4 border-b-2 border-red-500/30">
            <div className="w-20 h-20 flex-shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{v: missPercent}, {v: 100-missPercent}]} innerRadius={25} outerRadius={32} dataKey="v" stroke="none">
                    <Cell fill="#ef4444" />
                    <Cell fill="#7f1d1d" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center text-red-500"><FiAlertTriangle size={18} /></div>
            </div>
            <div className="flex-1">
              <h4 className="text-[10px] font-bold text-red-400 uppercase mb-2">Missing Skills ({missCount})</h4>
              <div className="flex flex-wrap gap-1">
                {data.missing_skills?.map(s => (
                  <span key={s} className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-[9px] border border-red-500/20">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: LEARNING RESOURCES */}
        <div className="glass-card p-4">
          <h4 className="text-[10px] font-bold text-blue-400 mb-3 flex items-center gap-2 uppercase">
            <FiBookOpen /> Recommended Learning
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.resources?.map((item, idx) => (
              <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5 hover:border-blue-500/40 transition-all group">
                <span className="text-[10px] font-medium text-gray-300 truncate">Master {item.skill}</span>
                <FiExternalLink size={10} className="text-gray-500 group-hover:text-blue-400" />
              </a>
            ))}
          </div>
        </div>

        {/* Verdict Strip */}
        <div className="p-2 text-center bg-blue-500/5 rounded-lg border border-blue-500/10">
            <p className="text-[10px] text-gray-400 italic">Verdict: <span className="text-white font-medium">{data.feedback}</span></p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;