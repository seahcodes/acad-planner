import { useState, useMemo } from "react";
import { 
  BarChart3, Search, ChevronDown, ChevronRight, 
  User, BookOpen, AlertTriangle, TrendingUp,
  Eye
} from "lucide-react";
import { MOCK_SYLLABUS } from "../data/mockData";
import { MOCK_STUDENTS, MOCK_STUDENT_PROGRESS, getStudentCompletion, getStudentStrengthDistribution } from "../data/mentorData";

export default function ProgressTracker() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [viewMode, setViewMode] = useState('student'); // 'student' or 'classwide'
  const [classwideTopic, setClasswideTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const studentProgress = useMemo(() => {
    if (!selectedStudent) return null;
    return MOCK_STUDENT_PROGRESS[selectedStudent.id] || {};
  }, [selectedStudent]);

  // Get topics for the selected subject filter
  const filteredTopics = useMemo(() => {
    if (selectedSubject === 'all') {
      return MOCK_SYLLABUS.flatMap(sub => 
        sub.units.flatMap(u => u.topics.map(t => ({ ...t, subjectName: sub.name, subjectIcon: sub.icon, unitName: u.name || u.title })))
      );
    }
    const sub = MOCK_SYLLABUS.find(s => s.id === selectedSubject);
    if (!sub) return [];
    return sub.units.flatMap(u => u.topics.map(t => ({ ...t, subjectName: sub.name, subjectIcon: sub.icon, unitName: u.name || u.title })));
  }, [selectedSubject]);

  // Class-wide stats for a topic
  const classwideStats = useMemo(() => {
    if (!classwideTopic) return null;
    const stats = { strong: 0, moderate: 0, weak: 0, unset: 0, students: [] };
    MOCK_STUDENTS.forEach(s => {
      const prog = MOCK_STUDENT_PROGRESS[s.id]?.[classwideTopic.id];
      const strength = prog?.strength || 'unset';
      stats[strength]++;
      stats.students.push({ ...s, strength, score: prog?.score || 0 });
    });
    return stats;
  }, [classwideTopic]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full text-teal-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <BarChart3 className="w-4 h-4" /> Progress Tracker
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Student Progress</h1>
          <p className="text-slate-400 mt-1">Track individual student performance across all topics</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { setViewMode('student'); setClasswideTopic(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'student' ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20' : 'bg-white/5 text-slate-400 border border-white/5'}`}
          >
            <User size={14} className="inline mr-1.5" /> Student View
          </button>
          <button 
            onClick={() => setViewMode('classwide')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'classwide' ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20' : 'bg-white/5 text-slate-400 border border-white/5'}`}
          >
            <Eye size={14} className="inline mr-1.5" /> Class-wide View
          </button>
        </div>
      </div>

      {/* ─── STUDENT VIEW ─────────────────────────────────────────────────── */}
      {viewMode === 'student' && (
        <div className="flex gap-6">
          
          {/* Student Picker */}
          <div className="w-72 shrink-0 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 max-h-[calc(100vh-220px)] overflow-y-auto">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Select Student</h3>
            <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-2 rounded-xl border border-white/10 mb-4 focus-within:border-teal-500/30 transition-all">
              <Search size={14} className="text-slate-500" />
              <input 
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..." className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-600 w-full"
              />
            </div>
            <div className="space-y-1.5">
              {filteredStudents.map(s => {
                const comp = getStudentCompletion(s.id);
                const isAtRisk = comp < 40;
                const isSelected = selectedStudent?.id === s.id;

                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudent(s)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      isSelected 
                        ? 'bg-teal-500/15 border border-teal-500/20' 
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                      isAtRisk ? 'bg-rose-500/20 text-rose-400' : 'bg-teal-500/20 text-teal-400'
                    }`}>
                      {s.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{s.name}</p>
                      <p className="text-[10px] text-slate-600">{s.branch} • Sec {s.section}</p>
                    </div>
                    <span className={`text-[10px] font-black ${isAtRisk ? 'text-rose-400' : 'text-teal-400'}`}>{comp}%</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress Grid */}
          <div className="flex-1">
            {selectedStudent ? (
              <div className="space-y-6">
                {/* Student Summary */}
                <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-lg font-black text-white">
                      {selectedStudent.avatar}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedStudent.name}</h2>
                      <p className="text-sm text-slate-500">{selectedStudent.branch} • Section {selectedStudent.section} • Semester {selectedStudent.semester}</p>
                    </div>
                  </div>
                  {/* Summary Stats */}
                  {(() => {
                    const dist = getStudentStrengthDistribution(selectedStudent.id);
                    const comp = getStudentCompletion(selectedStudent.id);
                    return (
                      <div className="grid grid-cols-5 gap-3">
                        <MiniStat label="Completion" value={`${comp}%`} color="teal" />
                        <MiniStat label="Strong" value={dist.strong} color="emerald" />
                        <MiniStat label="Moderate" value={dist.moderate} color="amber" />
                        <MiniStat label="Weak" value={dist.weak} color="rose" />
                        <MiniStat label="Unset" value={dist.unset} color="slate" />
                      </div>
                    );
                  })()}
                </div>

                {/* Subject Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Filter:</span>
                  <button 
                    onClick={() => setSelectedSubject('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedSubject === 'all' ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20' : 'bg-white/5 text-slate-400 border border-white/5'}`}
                  >
                    All Subjects
                  </button>
                  {MOCK_SYLLABUS.map(sub => (
                    <button 
                      key={sub.id}
                      onClick={() => setSelectedSubject(sub.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedSubject === sub.id ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20' : 'bg-white/5 text-slate-400 border border-white/5'}`}
                    >
                      {sub.icon} {sub.name}
                    </button>
                  ))}
                </div>

                {/* Topic Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredTopics.map(topic => {
                    const prog = studentProgress?.[topic.id];
                    const strength = prog?.strength || 'unset';
                    const score = prog?.score || 0;
                    const lastUpdated = prog?.lastUpdated;

                    const strengthColors = {
                      strong: 'border-emerald-500/20 bg-emerald-500/5',
                      moderate: 'border-amber-500/20 bg-amber-500/5',
                      weak: 'border-rose-500/20 bg-rose-500/5',
                      unset: 'border-white/5 bg-white/[0.02]',
                    };
                    const badgeColors = {
                      strong: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                      moderate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                      weak: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
                      unset: 'bg-white/5 text-slate-500 border-white/10',
                    };

                    return (
                      <div key={topic.id} className={`p-4 rounded-xl border transition-all hover:shadow-md ${strengthColors[strength]}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{topic.name}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{topic.subjectIcon} {topic.subjectName} • {topic.unitName}</p>
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider border shrink-0 ${badgeColors[strength]}`}>
                            {strength}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                              <div key={i} className={`w-6 h-1.5 rounded-full ${i <= score ? 
                                (strength === 'strong' ? 'bg-emerald-500' : strength === 'moderate' ? 'bg-amber-500' : strength === 'weak' ? 'bg-rose-500' : 'bg-slate-700') 
                                : 'bg-slate-800'}`} 
                              />
                            ))}
                          </div>
                          {lastUpdated && (
                            <span className="text-[9px] text-slate-600 font-medium">{new Date(lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-slate-900/20 border border-white/5 rounded-2xl">
                <div className="text-center opacity-40">
                  <User size={48} className="mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-wider">Select a student to view their progress</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── CLASS-WIDE VIEW ──────────────────────────────────────────────── */}
      {viewMode === 'classwide' && (
        <div className="flex gap-6">
          {/* Topic Picker */}
          <div className="w-80 shrink-0 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 max-h-[calc(100vh-220px)] overflow-y-auto">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Select a Topic</h3>
            {MOCK_SYLLABUS.map(sub => (
              <div key={sub.id} className="mb-4">
                <h4 className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-2 px-1 flex items-center gap-1.5">
                  <span>{sub.icon}</span> {sub.name}
                </h4>
                <div className="space-y-1">
                  {sub.units.flatMap(u => u.topics).map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => setClasswideTopic(topic)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-all ${
                        classwideTopic?.id === topic.id 
                          ? 'bg-teal-500/15 text-white font-bold border border-teal-500/20' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {topic.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Class-wide Heatmap */}
          <div className="flex-1">
            {classwideTopic && classwideStats ? (
              <div className="space-y-6">
                <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-1">{classwideTopic.name}</h2>
                  <p className="text-sm text-slate-500 mb-6">Class-wide performance across {MOCK_STUDENTS.length} students</p>
                  
                  {/* Distribution Bar */}
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    <MiniStat label="Strong" value={classwideStats.strong} color="emerald" />
                    <MiniStat label="Moderate" value={classwideStats.moderate} color="amber" />
                    <MiniStat label="Weak" value={classwideStats.weak} color="rose" />
                    <MiniStat label="Unset" value={classwideStats.unset} color="slate" />
                  </div>

                  {/* Visual Bar */}
                  <div className="flex gap-1 h-4 rounded-full overflow-hidden bg-slate-800 mb-2">
                    {classwideStats.strong > 0 && <div className="bg-emerald-500 transition-all" style={{ width: `${(classwideStats.strong / MOCK_STUDENTS.length) * 100}%` }} />}
                    {classwideStats.moderate > 0 && <div className="bg-amber-500 transition-all" style={{ width: `${(classwideStats.moderate / MOCK_STUDENTS.length) * 100}%` }} />}
                    {classwideStats.weak > 0 && <div className="bg-rose-500 transition-all" style={{ width: `${(classwideStats.weak / MOCK_STUDENTS.length) * 100}%` }} />}
                    {classwideStats.unset > 0 && <div className="bg-slate-700 transition-all" style={{ width: `${(classwideStats.unset / MOCK_STUDENTS.length) * 100}%` }} />}
                  </div>
                </div>

                {/* Student List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {classwideStats.students
                    .sort((a, b) => {
                      const order = { strong: 0, moderate: 1, weak: 2, unset: 3 };
                      return order[a.strength] - order[b.strength];
                    })
                    .map(s => {
                      const colors = {
                        strong: 'border-emerald-500/20 bg-emerald-500/5',
                        moderate: 'border-amber-500/20 bg-amber-500/5',
                        weak: 'border-rose-500/20 bg-rose-500/5',
                        unset: 'border-white/5 bg-white/[0.02]',
                      };
                      const textColors = {
                        strong: 'text-emerald-400',
                        moderate: 'text-amber-400',
                        weak: 'text-rose-400',
                        unset: 'text-slate-500',
                      };
                      return (
                        <div key={s.id} className={`p-4 rounded-xl border transition-all ${colors[s.strength]}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
                              s.strength === 'strong' ? 'bg-emerald-500/20 text-emerald-400' :
                              s.strength === 'moderate' ? 'bg-amber-500/20 text-amber-400' :
                              s.strength === 'weak' ? 'bg-rose-500/20 text-rose-400' :
                              'bg-white/5 text-slate-500'
                            }`}>
                              {s.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{s.name}</p>
                              <p className="text-[10px] text-slate-600">{s.branch} • Sec {s.section}</p>
                            </div>
                            <span className={`text-xs font-black capitalize ${textColors[s.strength]}`}>{s.strength}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-slate-900/20 border border-white/5 rounded-2xl">
                <div className="text-center opacity-40">
                  <BarChart3 size={48} className="mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-wider">Select a topic to see class performance</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, color }) {
  const colors = {
    teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    slate: 'bg-white/5 text-slate-400 border-white/10',
  };
  return (
    <div className={`p-3 rounded-xl border text-center ${colors[color]}`}>
      <div className="text-xl font-black text-white">{value}</div>
      <div className="text-[9px] font-bold uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}
