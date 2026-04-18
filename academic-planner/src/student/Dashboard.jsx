

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
      <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white mb-2">Focus Mode: <span className="text-indigo-400">Active</span></h1>
          <p className="text-slate-400 text-lg">You're mastering <b>{stats.total} topics</b>.</p>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-3xl text-center">
          <div className="text-5xl font-black text-white">{completionPercentage}%</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Syllabus" value={stats.total} icon={Layers} color="indigo" onClick={() => navigate('/syllabus')} />
        <Card title="Strong" value={stats.strong} icon={CheckCircle2} color="emerald" onClick={() => navigate('/syllabus')} />
        <Card title="Moderate" value={stats.moderate} icon={TrendingUp} color="amber" onClick={() => navigate('/syllabus')} />
        <Card title="Needs Review" value={stats.weak} icon={AlertTriangle} color="rose" onClick={() => navigate('/weak-topics')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content: Daily Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-black text-white flex items-center gap-3"><Calendar className="text-indigo-500" /> DAILY ROADMAP</h3>
          <div className="space-y-4">
            {revisionPlan.slice(0, 3).map((day, dayIdx) => (
              <div key={day.day} className="bg-slate-900/20 border border-white/5 rounded-[2rem] p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-black">DAY {day.day}</span>
                  <span className="text-[10px] text-slate-500 font-bold">{day.date}</span>
                </div>
                <div className="space-y-3">
                  {day.topics.map((topic) => (
                    <div key={topic.id} onClick={() => toggleTopicStatus(dayIdx, topic.id)} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border ${topic.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60' : 'bg-slate-950/40 border-white/5'}`}>
                      <div className="flex items-center gap-4">
                        {topic.status === 'completed' ? <CheckCircle2 className="text-emerald-500" size={20} /> : <Circle className="text-slate-700" size={20} />}
                        <p className={`font-bold text-sm ${topic.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{topic.name}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-800" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
  const colors = {
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };
  return (
    <div onClick={onClick} className={`cursor-pointer rounded-[2rem] border backdrop-blur-xl p-6 transition-all hover:-translate-y-2 ${colors[color] || colors.indigo} bg-slate-900/40`}>
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 rounded-2xl bg-white/5"><Icon className="w-6 h-6" /></div>
        <span className="text-4xl font-black text-white">{value}</span>
      </div>
      <h3 className="text-slate-500 font-bold tracking-widest text-[10px] uppercase">{title}</h3>
    </div>
  );
}
