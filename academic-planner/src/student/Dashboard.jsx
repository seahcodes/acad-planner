

import { useNavigate } from "react-router-dom";
import { useProgress } from "../contexts/ProgressContext";
import { MOCK_SYLLABUS } from "../data/mockData";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  TrendingUp
} from "lucide-react";
import toast from "react-hot-toast";
// 1. IMPORT the new component
import FocusTimer from "./FocusTimer";
import ExamTimetable from "./ExamTimetable";

export default function Dashboard() {
  const navigate = useNavigate();
  const { progress, stats, revisionPlan, toggleTopicStatus, completedTopics, toggleCompletion, examChecklist } = useProgress();

  const completionPercentage = stats.total ? Math.round(((stats.strong + stats.moderate) / stats.total) * 100) : 0;

  const handleToggleTopicStatus = (dayIndex, topicId) => {
    const day = revisionPlan[dayIndex];
    const topic = day.topics.find(t => t.id === topicId);
    const isDone = topic.status !== 'completed';
    if (isDone) toast.success(`Done: ${topic.name}`);
    toggleTopicStatus(dayIndex, topicId);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-12">
      {/* Header */}
     <header className="relative mt-12 mb-12 bg-white/[0.02] border border-white/[0.05] rounded-[3rem] p-10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-5xl font-black text-white mb-3 italic tracking-tight">Focus Mode: <span className="text-indigo-400">Active</span></h1>
            <p className="text-slate-400 text-lg font-medium">You're mastering <b className="text-indigo-300">{stats.total} topics</b>.</p>
          </div>
          <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 flex items-center justify-center">
            <span className="text-2xl font-black text-white">{completionPercentage}%</span>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Syllabus" value={stats.total} icon={Layers} color="indigo" onClick={() => navigate('/syllabus')} />
        <Card title="Strong" value={stats.strong} icon={CheckCircle2} color="emerald" onClick={() => navigate('/syllabus')} />
        <Card title="Moderate" value={stats.moderate} icon={TrendingUp} color="amber" onClick={() => navigate('/syllabus')} />
        <Card title="Needs Review" value={stats.weak} icon={AlertTriangle} color="rose" onClick={() => navigate('/weak-topics')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content: Daily Checklist */}
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-xs font-black text-slate-500 tracking-[0.3em] uppercase">Daily Checklist</h3>
          {examChecklist.length > 0 && examChecklist[0].topics.length > 0 ? (
            <div className="relative group">
              <div className="absolute -left-4 top-0 bottom-0 w-px bg-white/5 group-hover:bg-indigo-500/30 transition-colors" />
              <div className="ml-6 space-y-4">
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">
                  Today • {examChecklist[0].date} • {examChecklist[0].topics[0].subjectName}
                </div>
                {examChecklist[0].topics.map((topic) => (
                  <div key={topic.id} className="flex items-center justify-between p-5 rounded-[1.5rem] border bg-white/[0.02] border-white/5 hover:bg-white/[0.05] transition-all">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={completedTopics.includes(topic.id)}
                        onChange={() => toggleCompletion(topic.id)}
                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className={`font-bold text-sm ${completedTopics.includes(topic.id) ? 'text-slate-600 line-through' : 'text-slate-200'}`}>
                        {topic.name}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {topic.unitName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-slate-400 text-lg mb-4">📝 No exams scheduled</div>
              <p className="text-slate-500">Check back later for your study checklist.</p>
            </div>
          )}
        </div>

      
        <div className="lg:sticky lg:top-24 flex flex-col gap-6">
  <FocusTimer />
  <ExamTimetable />
</div>
      </div>
    </div>
  );
}

function Card({ title, value, icon: Icon, color, onClick }) {
  const colorStyles = {
    indigo: "text-slate-300 bg-white/5 border-white/10",
    emerald: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/5 border-amber-500/10",
    rose: "text-rose-400 bg-rose-500/5 border-rose-500/10",
  };
  return (
    <div onClick={onClick} className={`cursor-pointer rounded-[2.5rem] border border-white/[0.05] bg-white/[0.02] backdrop-blur-md p-8 transition-all hover:-translate-y-2 ${colorStyles[color]}`}>
      <div className="flex justify-between items-start mb-8">
        <Icon className="w-6 h-6 opacity-50" />
        <span className="text-4xl font-black text-white">{value}</span>
      </div>
      <h3 className="text-slate-500 font-bold tracking-[0.2em] text-[9px] uppercase">{title}</h3>
    </div>
  );
}
