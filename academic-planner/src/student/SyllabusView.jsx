import { useState } from "react";
import { Link } from "react-router-dom"; // Added for the Pro-Tip linking
import { MOCK_SYLLABUS } from "../data/mockData";
import { useProgress } from "../contexts/ProgressContext";
import { BookOpen, CheckCircle2, ChevronRight, Circle } from "lucide-react";

export default function SyllabusView() {
  const { progress, setTopicStrength } = useProgress();
  const [expandedSub, setExpandedSub] = useState(MOCK_SYLLABUS[0]?.id);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-4 h-4" /> Curriculum
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Syllabus Overview</h1>
          <p className="text-slate-400 mt-2 text-lg">Mark your comfort level on each topic.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {MOCK_SYLLABUS.map((sub) => {
          const isExpanded = expandedSub === sub.id;

          return (
            <div key={sub.id} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-xl transition-all duration-300">
              
              {/* Subject Header */}
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedSub(isExpanded ? null : sub.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl transition-colors duration-300 ${isExpanded ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" : "bg-white/5 text-slate-400"}`}>
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{sub.name}</h2>
                    <p className="text-sm text-slate-400 font-medium">{sub.units.length} Units</p>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-90 bg-indigo-500/20 text-indigo-400" : ""}`}>
                  <ChevronRight size={24} />
                </div>
              </div>

              {/* Units List */}
              {isExpanded && (
                <div className="bg-slate-950/50 p-6 border-t border-white/5 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
                  {sub.units.map((unit) => (
                    <div key={unit.id} className="bg-white/5 border border-white/5 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                        <h4 className="text-lg font-bold text-slate-200">{unit.title}</h4>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-900 px-3 py-1 rounded-lg">Unit</span>
                      </div>

                      <div className="flex flex-col gap-3">
                        {unit.topics.map((topic) => {
                          const status = progress[topic.id] || "unset";

                          return (
                            <div 
                              key={topic.id} 
                              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-300 ${
                                status !== "unset" ? "bg-indigo-500/5 border-indigo-500/20" : "bg-slate-900/50 border-transparent hover:border-white/10"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {status === "strong" ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                ) : status === "weak" ? (
                                  <Circle className="w-5 h-5 text-rose-400 shrink-0" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                                )}
                                
                                {/* Pro-Tip: Linking the topic name to the Knowledge Vault */}
                                <Link 
                                  to="/notes" 
                                  state={{ activeTopicId: topic.id }} 
                                  className={`font-medium transition-all hover:text-indigo-400 hover:underline underline-offset-4 decoration-indigo-500/30 ${
                                    status !== "unset" ? "text-slate-200" : "text-slate-400"
                                  }`}
                                >
                                  {topic.name}
                                </Link>
                              </div>

                              {/* Status Buttons */}
                              <div className="flex bg-slate-950 rounded-lg p-1 border border-white/5 shrink-0 ml-8 sm:ml-0">
                                <button
                                  className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                                    status === "strong" ? "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "text-slate-500 hover:text-emerald-400"
                                  }`}
                                  onClick={() => setTopicStrength(topic.id, "strong")}
                                >
                                  Strong
                                </button>
                                <button
                                  className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                                    status === "moderate" ? "bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.3)]" : "text-slate-500 hover:text-amber-400"
                                  }`}
                                  onClick={() => setTopicStrength(topic.id, "moderate")}
                                >
                                  Mod
                                </button>
                                <button
                                  className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                                    status === "weak" ? "bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]" : "text-slate-500 hover:text-rose-400"
                                  }`}
                                  onClick={() => setTopicStrength(topic.id, "weak")}
                                >
                                  Weak
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}