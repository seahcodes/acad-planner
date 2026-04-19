

import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../contexts/ProgressContext";
import { MOCK_SYLLABUS, generateRevisionPlan } from "../data/mockData";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  TrendingUp, 
  Circle, 
  Calendar,
  ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";
// 1. IMPORT the new component
import FocusTimer from "./FocusTimer";
import ExamTimetable from "./ExamTimetable";

const recalculateBacklog = (currentPlan) => {
  const todayStr = new Date().toLocaleDateString();
  const todayTime = new Date().setHours(0, 0, 0, 0);
  let backlog = [];

  const updatedPlan = currentPlan.map(day => {
    const dayDate = new Date(day.date).setHours(0, 0, 0, 0);
    if (dayDate < todayTime) {
      const missed = day.topics.filter(t => t.status === 'pending');
      backlog.push(...missed);
      return { ...day, topics: day.topics.filter(t => t.status === 'completed') };
    }
    return day;
  });

  if (backlog.length > 0) {
    return updatedPlan.map(day => {
      if (day.date === todayStr) {
        return { ...day, topics: [...backlog, ...day.topics] };
      }
      return day;
    });
  }
  return updatedPlan;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [revisionPlan, setRevisionPlan] = useState(() => generateRevisionPlan(MOCK_SYLLABUS));

  useEffect(() => {
    setRevisionPlan(prev => recalculateBacklog(prev));
  }, []);

  const stats = useMemo(() => {
    let total = 0, strong = 0, weak = 0, moderate = 0;
    MOCK_SYLLABUS.forEach((sub) =>
      sub.units.forEach((unit) =>
        unit.topics.forEach((t) => {
          total++;
          const s = progress[t.id] || t.strength || "unset";
          if (s === "strong") strong++;
          if (s === "weak") weak++;
          if (s === "moderate") moderate++;
        })
      )
    );
    return { total, strong, weak, moderate };
  }, [progress]);

  const completionPercentage = stats.total ? Math.round(((stats.strong + stats.moderate) / stats.total) * 100) : 0;

  const toggleTopicStatus = (dayIndex, topicId) => {
    setRevisionPlan(prevPlan => prevPlan.map((day, dIdx) => {
      if (dIdx !== dayIndex) return day;
      return {
        ...day,
        topics: day.topics.map(topic => {
          if (topic.id !== topicId) return topic;
          const isDone = topic.status !== 'completed';
          if (isDone) toast.success(`Done: ${topic.name}`);
          return { ...topic, status: isDone ? 'completed' : 'pending' };
        })
      };
    }));
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
        {/* Main Content: Daily Roadmap */}
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-xs font-black text-slate-500 tracking-[0.3em] uppercase">Daily Roadmap</h3>
          {revisionPlan.slice(0, 3).map((day, dayIdx) => (
            <div key={day.day} className="relative group">
              <div className="absolute -left-4 top-0 bottom-0 w-px bg-white/5 group-hover:bg-indigo-500/30 transition-colors" />
              <div className="ml-6 space-y-4">
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Day {day.day} • {day.date}</div>
                {day.topics.map((topic) => (
                  <div key={topic.id} onClick={() => toggleTopicStatus(dayIdx, topic.id)} 
                    className={`flex items-center justify-between p-5 rounded-[1.5rem] cursor-pointer transition-all border ${topic.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'}`}>
                    <p className={`font-bold text-sm ${topic.status === 'completed' ? 'text-slate-600 line-through' : 'text-slate-200'}`}>{topic.name}</p>
                    <ChevronRight size={16} className={topic.status === 'completed' ? 'text-emerald-500' : 'text-slate-700'} />
                  </div>
                ))}
              </div>
            </div>
          ))}
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
