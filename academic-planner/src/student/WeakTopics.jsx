import { MOCK_SYLLABUS } from '../data/mockData';
import { useProgress } from '../contexts/ProgressContext';
import { AlertTriangle, BookOpen, ChevronRight, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WeakTopics() {
  const { progress } = useProgress();
  const navigate = useNavigate();

  const weak = [];
  MOCK_SYLLABUS.forEach(sub =>
    sub.units.forEach(unit =>
      unit.topics.forEach(t => {
        if (progress[t.id] === 'weak') {
          weak.push({ ...t, subject: sub.name, unit: unit.name, subjectId: sub.id });
        }
      })
    )
  );

  // Group by subject
  const grouped = weak.reduce((acc, t) => {
    if (!acc[t.subject]) acc[t.subject] = [];
    acc[t.subject].push(t);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] p-8 backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-500/10 rounded-xl">
              <AlertTriangle size={22} className="text-rose-400" />
            </div>
            <h1 className="text-3xl font-black text-white">Weak Topics</h1>
          </div>
          <p className="text-slate-400 text-sm">
            {weak.length === 0
              ? 'All clear — no weak topics!'
              : `${weak.length} topic${weak.length > 1 ? 's' : ''} need your attention`}
          </p>
        </div>
        {weak.length > 0 && (
          <div className="bg-rose-500/10 border border-rose-500/20 px-5 py-3 rounded-2xl text-center">
            <div className="text-4xl font-black text-rose-400">{weak.length}</div>
            <div className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-0.5">To Tackle</div>
          </div>
        )}
      </div>

      {/* Empty state */}
      {weak.length === 0 && (
        <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-16 text-center backdrop-blur-xl">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-white mb-2">You're Crushing It!</h2>
          <p className="text-slate-400">No weak topics marked. Keep reviewing your syllabus regularly.</p>
        </div>
      )}

      {/* Grouped by Subject */}
      {Object.entries(grouped).map(([subjectName, topics]) => (
        <div key={subjectName} className="flex flex-col gap-3">
          {/* Subject Header */}
          <div className="flex items-center gap-3 px-2">
            <BookOpen size={14} className="text-rose-400" />
            <h2 className="text-xs font-black text-rose-400 uppercase tracking-widest">{subjectName}</h2>
            <div className="flex-1 h-px bg-rose-500/10"></div>
            <span className="text-xs text-rose-500 font-bold">{topics.length} topic{topics.length > 1 ? 's' : ''}</span>
          </div>

          {/* Topic Cards */}
          <div className="flex flex-col gap-2">
            {topics.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate(`/study/${t.id}`)}
                className="group bg-slate-900/30 border border-white/5 hover:border-rose-500/30 hover:bg-rose-500/5 rounded-[1.5rem] p-5 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-4"
              >
                {/* Flame icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                  <Flame size={16} className="text-rose-400" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5 truncate">{t.unit}</p>
                </div>

                {/* Badge */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-wider">
                    Weak
                  </span>
                  <ChevronRight size={14} className="text-slate-700 group-hover:text-rose-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}