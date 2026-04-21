import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  FolderOpen, 
  ChevronRight,
  BookOpen,
  BarChart3,
  Upload,
  Eye
} from "lucide-react";
import { MOCK_SYLLABUS } from "../data/mockData";
import { 
  MOCK_STUDENTS, 
  MOCK_STUDY_MATERIALS, 
  MOCK_ACTIVITY_FEED,
  MOCK_STUDENT_PROGRESS,
  getStudentCompletion, 
  getAtRiskStudents,
  getSubjectPerformance
} from "../data/mentorData";

export default function MentorDashboard() {
  const navigate = useNavigate();

  const analytics = useMemo(() => {
    const completions = MOCK_STUDENTS.map(s => getStudentCompletion(s.id));
    const avgCompletion = completions.length 
      ? Math.round(completions.reduce((a, b) => a + b, 0) / completions.length) 
      : 0;
    const atRisk = getAtRiskStudents();
    const subjectPerf = getSubjectPerformance(MOCK_SYLLABUS);

    // Count weak topics across all students
    let totalWeak = 0;
    Object.values(MOCK_STUDENT_PROGRESS).forEach(sp => {
      Object.values(sp).forEach(t => {
        if (t.strength === 'weak') totalWeak++;
      });
    });

    return { avgCompletion, atRisk, subjectPerf, totalWeak };
  }, []);

  // Weekly activity data (mock)
  const weeklyData = [
    { day: 'Mon', value: 72 },
    { day: 'Tue', value: 85 },
    { day: 'Wed', value: 64 },
    { day: 'Thu', value: 91 },
    { day: 'Fri', value: 78 },
    { day: 'Sat', value: 45 },
    { day: 'Sun', value: 32 },
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <header className="relative mt-4 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Good Evening, <span className="text-teal-400">Dr. Kapoor</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium mt-1">
              Here's how your students are performing today.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/mentor/materials')}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-500/10 border border-teal-500/20 text-teal-300 rounded-xl text-sm font-bold hover:bg-teal-500/20 transition-all"
            >
              <Upload size={16} /> Upload Material
            </button>
            <button 
              onClick={() => navigate('/mentor/students')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/10 transition-all"
            >
              <Eye size={16} /> View Students
            </button>
          </div>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={MOCK_STUDENTS.length} 
          icon={Users} 
          color="teal"
          subtitle={`${MOCK_STUDENTS.filter(s => s.branch === 'CSE').length} CSE • ${MOCK_STUDENTS.filter(s => s.branch === 'ECE').length} ECE • ${MOCK_STUDENTS.filter(s => s.branch === 'ME').length} ME`}
          onClick={() => navigate('/mentor/students')}
        />
        <StatCard 
          title="Avg. Completion" 
          value={`${analytics.avgCompletion}%`} 
          icon={TrendingUp} 
          color="emerald"
          subtitle="Across all students"
          chart={<DonutMini percentage={analytics.avgCompletion} />}
          onClick={() => navigate('/mentor/progress')}
        />
        <StatCard 
          title="At Risk Students" 
          value={analytics.atRisk.length} 
          icon={AlertTriangle} 
          color="rose"
          subtitle="Below 40% completion"
          pulse
          onClick={() => navigate('/mentor/students')}
        />
        <StatCard 
          title="Materials Uploaded" 
          value={MOCK_STUDY_MATERIALS.length} 
          icon={FolderOpen} 
          color="amber"
          subtitle={`${MOCK_STUDY_MATERIALS.reduce((a, m) => a + m.downloads, 0)} total downloads`}
          onClick={() => navigate('/mentor/materials')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subject Performance */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-7">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-teal-400" />
              <h3 className="text-sm font-black text-slate-300 uppercase tracking-wider">Subject Performance</h3>
            </div>
            <span className="text-[9px] bg-teal-500/10 px-2.5 py-1 rounded-md text-teal-300 font-bold border border-teal-500/20">AVG SCORES</span>
          </div>
          <div className="space-y-4">
            {Object.values(analytics.subjectPerf).map((sub) => (
              <div key={sub.name} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{sub.icon}</span>
                    <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{sub.name}</span>
                  </div>
                  <span className="text-sm font-black text-white">{sub.avgPerformance}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${sub.avgPerformance}%`,
                      background: sub.avgPerformance >= 70 
                        ? 'linear-gradient(90deg, #14b8a6, #10b981)' 
                        : sub.avgPerformance >= 50 
                          ? 'linear-gradient(90deg, #f59e0b, #eab308)' 
                          : 'linear-gradient(90deg, #f43f5e, #ef4444)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-7">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-teal-400" />
              <h3 className="text-sm font-black text-slate-300 uppercase tracking-wider">Weekly Engagement</h3>
            </div>
            <span className="text-[9px] bg-teal-500/10 px-2.5 py-1 rounded-md text-teal-300 font-bold border border-teal-500/20">THIS WEEK</span>
          </div>
          <div className="flex items-end justify-between gap-3 h-48 px-2">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400">{d.value}%</span>
                <div className="w-full bg-slate-800 rounded-xl overflow-hidden relative" style={{ height: '160px' }}>
                  <div 
                    className="absolute bottom-0 w-full rounded-xl transition-all duration-700 ease-out"
                    style={{ 
                      height: `${d.value}%`,
                      background: d.value >= 70 
                        ? 'linear-gradient(180deg, #14b8a6, #0d9488)' 
                        : d.value >= 50 
                          ? 'linear-gradient(180deg, #f59e0b, #d97706)' 
                          : 'linear-gradient(180deg, #64748b, #475569)'
                    }}
                  />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Actions + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-1">Quick Actions</h3>
          <QuickAction 
            icon={Upload} 
            title="Upload Material" 
            desc="Share study resources with students" 
            color="teal"
            onClick={() => navigate('/mentor/materials')}
          />
          <QuickAction 
            icon={Users} 
            title="View Students" 
            desc="Browse full student directory" 
            color="emerald"
            onClick={() => navigate('/mentor/students')}
          />
          <QuickAction 
            icon={BookOpen} 
            title="Manage Syllabus" 
            desc="Edit subjects, units & topics" 
            color="amber"
            onClick={() => navigate('/mentor/syllabus')}
          />
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-7">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-5">Recent Activity</h3>
          <div className="space-y-3">
            {MOCK_ACTIVITY_FEED.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                <span className="text-xl mt-0.5">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">{activity.message}</p>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mt-1">{activity.time}</p>
                </div>
                <ChevronRight size={14} className="text-slate-700 group-hover:text-teal-400 transition-colors mt-1 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* At-Risk Students Alert */}
      {analytics.atRisk.length > 0 && (
        <div className="bg-rose-500/5 border border-rose-500/15 rounded-3xl p-6 flex items-start gap-4">
          <div className="p-2 bg-rose-500/10 rounded-xl shrink-0">
            <AlertTriangle size={20} className="text-rose-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-300 mb-1">Students Needing Attention</h4>
            <p className="text-sm text-rose-300/70 mb-3">
              {analytics.atRisk.length} student{analytics.atRisk.length > 1 ? 's are' : ' is'} below 40% completion. Consider reaching out.
            </p>
            <div className="flex flex-wrap gap-2">
              {analytics.atRisk.map(s => (
                <span key={s.id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs font-bold text-rose-300">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[8px] font-black">{s.avatar}</span>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function StatCard({ title, value, icon: Icon, color, subtitle, chart, pulse, onClick }) {
  const colors = {
    teal: "text-teal-400 bg-teal-500/5 border-teal-500/10",
    emerald: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
    rose: "text-rose-400 bg-rose-500/5 border-rose-500/10",
    amber: "text-amber-400 bg-amber-500/5 border-amber-500/10",
  };

  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer rounded-3xl border bg-white/[0.02] backdrop-blur-md p-7 transition-all hover:-translate-y-1 hover:shadow-lg ${colors[color]}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-2.5 rounded-xl ${color === 'teal' ? 'bg-teal-500/10' : color === 'emerald' ? 'bg-emerald-500/10' : color === 'rose' ? 'bg-rose-500/10' : 'bg-amber-500/10'}`}>
          <Icon className={`w-5 h-5 ${pulse ? 'animate-pulse' : ''}`} />
        </div>
        {chart || <span className="text-3xl font-black text-white">{value}</span>}
      </div>
      {!chart && null}
      {chart && <div className="text-3xl font-black text-white mb-2">{value}</div>}
      <h3 className="text-[10px] text-slate-500 font-black tracking-[0.2em] uppercase mb-1">{title}</h3>
      {subtitle && <p className="text-[10px] text-slate-600 font-medium">{subtitle}</p>}
    </div>
  );
}

function DonutMini({ percentage }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width="44" height="44" className="transform -rotate-90">
      <circle cx="22" cy="22" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
      <circle 
        cx="22" cy="22" r={radius} 
        stroke="#14b8a6" strokeWidth="4" fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000"
      />
    </svg>
  );
}

function QuickAction({ icon: Icon, title, desc, color, onClick }) {
  const bgColors = {
    teal: 'hover:bg-teal-500/5 hover:border-teal-500/20',
    emerald: 'hover:bg-emerald-500/5 hover:border-emerald-500/20',
    amber: 'hover:bg-amber-500/5 hover:border-amber-500/20',
  };
  const iconColors = {
    teal: 'bg-teal-500/10 text-teal-400 group-hover:bg-teal-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20',
  };

  return (
    <div 
      onClick={onClick}
      className={`group flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 cursor-pointer transition-all hover:-translate-y-0.5 ${bgColors[color]}`}
    >
      <div className={`p-3 rounded-xl transition-colors ${iconColors[color]}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <ChevronRight size={16} className="text-slate-700 group-hover:text-white transition-colors" />
    </div>
  );
}
