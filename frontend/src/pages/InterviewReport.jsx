import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const InterviewReport = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState([]);
  const [summaryText, setSummaryText] = useState("");
  const [fetchingSummary, setFetchingSummary] = useState(false);

  useEffect(() => {
    const structuralCache = localStorage.getItem("latestSessionReport");
    if (structuralCache) {
      const parsedData = JSON.parse(structuralCache);
      setReportData(parsedData);
      triggerReportAggregation(parsedData);
    }
  }, []);

  const triggerReportAggregation = async (historyLog) => {
    setFetchingSummary(true);
    try {
      const res = await axios.post("http://localhost:8000/interview-summary", {
        history: historyLog,
      });
      setSummaryText(
        res.data.overall_feedback || "Summary processing complete.",
      );
    } catch (err) {
      setSummaryText(
        "Consolidated analytics engine synthesis failed to connect downstream.",
      );
    }
    setFetchingSummary(false);
  };

  const calculationOverallAverage =
    reportData.length > 0
      ? Math.round(
          reportData.reduce((acc, c) => acc + c.score, 0) / reportData.length,
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header operations */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-3">
          <h1 className="text-xl font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            AI Voice Assessment Scorecard
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold py-1.5 px-3 rounded-lg border border-gray-700/60"
          >
            Return Dashboard
          </button>
        </div>

        {/* Macro Overview Card row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center flex flex-col justify-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Average Evaluation Metric
            </span>
            <span className="text-4xl font-black text-purple-400">
              {calculationOverallAverage} / 10
            </span>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 md:col-span-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
              Executive AI Summary Matrix
            </span>
            <p className="text-xs text-gray-300 leading-relaxed font-medium">
              {fetchingSummary
                ? "Synthesizing full session report logs via LLM parameters..."
                : summaryText}
            </p>
          </div>
        </div>

        {/* Individual Cards Loop breaking down granular logs */}
        <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wide mt-6 mb-2">
          Granular Question-Level Metrics
        </h3>

        <div className="space-y-3">
          {reportData.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-xl border border-gray-700/80 space-y-3"
            >
              <div className="flex items-start justify-between gap-4 border-b border-gray-700/50 pb-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">
                    Question #{index + 1}
                  </span>
                  <p className="text-xs font-bold text-gray-200">
                    {item.question}
                  </p>
                </div>
                <div className="text-right shrink-0 flex items-center gap-4">
                  <div>
                    <span className="block text-[9px] font-bold uppercase text-gray-500">
                      Confidence
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      {item.confidence}%
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase text-gray-500">
                      Score
                    </span>
                    <span className="text-sm font-black text-emerald-400">
                      {item.score}/10
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 p-2.5 rounded-lg border border-gray-800 text-xs space-y-1">
                <p className="text-gray-400 italic">" {item.user_answer} "</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1">
                <div className="bg-gray-900/40 p-2 rounded-lg border border-gray-800">
                  <strong className="text-emerald-400 block mb-0.5 font-bold uppercase text-[9px] tracking-wide">
                    Core Strengths
                  </strong>
                  <span className="text-gray-300 leading-normal">
                    {item.strengths}
                  </span>
                </div>
                <div className="bg-gray-900/40 p-2 rounded-lg border border-gray-800">
                  <strong className="text-rose-400 block mb-0.5 font-bold uppercase text-[9px] tracking-wide">
                    Structural Gaps
                  </strong>
                  <span className="text-gray-300 leading-normal">
                    {item.weaknesses}
                  </span>
                </div>
                <div className="bg-gray-900/40 p-2 rounded-lg border border-gray-800">
                  <strong className="text-indigo-400 block mb-0.5 font-bold uppercase text-[9px] tracking-wide">
                    Actionable Roadmap Fix
                  </strong>
                  <span className="text-gray-300 leading-normal">
                    {item.improvement}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewReport;
