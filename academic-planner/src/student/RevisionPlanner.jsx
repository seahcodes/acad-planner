import { MOCK_SYLLABUS } from '../data/mockData';
import { useProgress } from '../contexts/ProgressContext';
import { Calendar, Flame, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

const strengthConfig = {
  weak:     { label: 'Needs Focus',  color: 'rose',    dot: 'bg-rose-500',    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',    bar: 'bg-rose-500',    priority: 'HIGH',    icon: Flame },
  moderate: { label: 'Revise',       color: 'amber',   dot: 'bg-amber-400',   badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',   bar: 'bg-amber-400',   priority: 'MEDIUM',  icon: TrendingUp },
  strong:   { label: 'Quick Review', color: 'emerald', dot: 'bg-emerald-500', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', bar: 'bg-emerald-500', priority: 'LOW',   icon: CheckCircle2 },
};

export default function RevisionPlanner() {
  const { progress } = useProgress();

  const topics = [];
  MOCK_SYLLABUS.forEach(sub =>
    sub.units.forEach(unit =>
      unit.topics.forEach(t => {
        const strength = progress[t.id];
        if (strength) {
          topics.push({ ...t, strength, subject: sub.name, unit: unit.name });
        }
      })
    )
  );

  const sorted = [
    ...topics.filter(t => t.strength === 'weak'),
    ...topics.filter(t => t.strength === 'moderate'),
    ...topics.filter(t => t.strength === 'strong'),
  ];

  const counts = {
    weak: topics.filter(t => t.strength === 'weak').length,
    moderate: topics.filter(t => t.strength === 'moderate').length,
    strong: topics.filter(t => t.strength === 'strong').length,
  };

  if (sorted.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-16 text-center backdrop-blur-xl">
          <Calendar size={48} className="text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">No Plan Yet</h2>
          <p className="text-slate-400">Mark topics as weak, moderate, or strong in the Syllabus view to generate your plan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-xl">
              <Calendar size={22} className="text-indigo-400" />
            </div>
            <h1 className="text-3xl font-black text-white">Revision Plan</h1>
          </div>
          <p className="text-slate-400 text-sm">{sorted.length} topics scheduled · Prioritised by weakness</p>
        </div>

        {/* Summary pills */}
        <div className="flex gap-3 flex-wrap">
          {counts.weak > 0 && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-2xl">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="text-rose-400 font-bold text-sm">{counts.weak} Focus</span>
            </div>
          )}
          {counts.moderate > 0 && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="text-amber-400 font-bold text-sm">{counts.moderate} Revise</span>
            </div>
          )}
          {counts.strong > 0 && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-emerald-400 font-bold text-sm">{counts.strong} Review</span>
            </div>
          )}
        </div>
      </div>

      {/* Topic List */}
      <div className="flex flex-col gap-3">
        {sorted.map((t, i) => {
          const cfg = strengthConfig[t.strength] || strengthConfig.moderate;
          const Icon = cfg.icon;
          return (
            <div
              key={t.id}
              className="group bg-slate-900/30 border border-white/5 hover:border-white/10 rounded-[1.5rem] p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-5"
            >
              {/* Day Number */}
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-800/60 border border-white/5 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase leading-none">Day</span>
                <span className="text-lg font-black text-white leading-tight">{i + 1}</span>
              </div>

              {/* Strength indicator bar */}
              <div className="flex-shrink-0 w-1 h-10 rounded-full bg-slate-800 overflow-hidden">
                <div className={`w-full h-full ${cfg.bar} rounded-full`}></div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{t.name}</p>
                <p className="text-slate-500 text-xs mt-0.5 truncate">{t.subject} · {t.unit}</p>
              </div>

              {/* Priority badge */}
              <div className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${cfg.badge}`}>
                <Icon size={12} />
                {cfg.label}
              </div>

              {/* Time estimate */}
              <div className="flex-shrink-0 flex items-center gap-1.5 text-slate-600 text-xs">
                <Clock size={12} />
                <span>{t.strength === 'weak' ? '45' : t.strength === 'moderate' ? '30' : '15'} min</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}