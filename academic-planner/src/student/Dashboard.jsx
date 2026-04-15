import { useMemo } from "react";
import { useProgress } from "../contexts/ProgressContext";
import { MOCK_SYLLABUS } from "../data/mockData";
import { CheckCircle2, AlertTriangle, LightbulbIcon, Layers, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { progress } = useProgress();

  const stats = useMemo(() => {
    let total = 0,
      strong = 0,
      weak = 0,
      moderate = 0;

    MOCK_SYLLABUS.forEach((sub) =>
      sub.units.forEach((unit) =>
        unit.topics.forEach((t) => {
          total++;
          const s = progress[t.id] || "unset";
          if (s === "strong") strong++;
          if (s === "weak") weak++;
          if (s === "moderate") moderate++;
        })
      )
    );

    return { total, strong, weak, moderate };
  }, [progress]);

  const completionPercentage = stats.total
    ? Math.round(((stats.strong + stats.moderate) / stats.total) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[100px] -translate-y-1/2 translate-x-1/4 rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <CheckCircle2 className="w-4 h-4" /> Keep it up!
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Student</span> 👋
          </h1>
          <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
            Your progress is looking solid. Let's conquer those weak topics before finals.
          </p>
        </div>
        <div className="hidden md:flex relative z-10 items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10 shrink-0">
          <div className="text-center px-4">
            <p className="text-slate-400 font-medium text-sm mb-1 uppercase tracking-wider">Progress</p>
            <div className="text-4xl font-black text-indigo-400">{completionPercentage}%</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Topics" value={stats.total} icon={Layers} color="indigo" />
        <Card title="Strong Subjects" value={stats.strong} icon={CheckCircle2} color="emerald" />
        <Card title="Moderate Grasp" value={stats.moderate} icon={TrendingUp} color="amber" />
        <Card title="Needs Review" value={stats.weak} icon={AlertTriangle} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Section */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white tracking-tight">Curriculum Mastery</h3>
            <span className="text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">{completionPercentage}%</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-emerald-400">{stats.strong} Strong</span>
              <span className="text-amber-400">{stats.moderate} Moderate</span>
              <span className="text-rose-400">{stats.weak} Weak</span>
            </div>
            {/* Multi-segment progress bar */}
            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex gap-1 group shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)]">
              <div
                 className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-700 ease-out"
                 style={{ width: `${(stats.strong / stats.total) * 100 || 0}%` }}
              />
              <div
                 className="h-full bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-700 ease-out delay-100"
                 style={{ width: `${(stats.moderate / stats.total) * 100 || 0}%` }}
              />
              <div
                 className="h-full bg-gradient-to-r from-rose-500 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)] transition-all duration-700 ease-out delay-200"
                 style={{ width: `${(stats.weak / stats.total) * 100 || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Suggestion / Spotlight */}
        <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-indigo-500/20 group-hover:scale-110 transition-transform duration-700 origin-bottom-left">
            <LightbulbIcon size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex py-1 px-3 bg-indigo-500/30 text-indigo-200 text-xs font-bold uppercase rounded-lg mb-4 backdrop-blur-md">
                Smart Focus
              </div>
              <h3 className="text-xl font-bold text-white mb-2 leading-snug">Priority Recommendation</h3>
              <p className="text-indigo-200 leading-relaxed font-medium">
                You have <span className="text-white text-xl font-black mx-1">{stats.weak}</span>
                topics marked as weak. Tackling just 2 of these today will boost your confidence enormously.
              </p>
            </div>
            
            <button className="mt-8 w-full bg-white text-indigo-900 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]">
              Review Weak Topics
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

// Reusable card with dynamic colors
function Card({ title, value, icon: Icon, color }) {
  const colorMap = {
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose-500/10",
  };

  const styleConfig = colorMap[color] || colorMap.indigo;

  return (
    <div className={`
      relative overflow-hidden rounded-3xl border backdrop-blur-xl p-6 transition-all duration-300
      hover:-translate-y-1 hover:shadow-2xl hover:brightness-110
      ${styleConfig} bg-slate-900/40
    `}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${styleConfig.split(' ')[1]}`}>
          <Icon className={`w-6 h-6 ${styleConfig.split(' ')[0]}`} />
        </div>
        <span className="text-3xl font-black text-white">{value}</span>
      </div>
      <h3 className="text-slate-400 font-semibold tracking-wide text-sm uppercase">{title}</h3>
    </div>
  );
}
