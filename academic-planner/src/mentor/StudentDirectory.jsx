import { useState, useMemo } from "react";
import { 
  Users, Search, Filter, ChevronRight, ChevronDown,
  BookOpen, GraduationCap, Mail, Calendar
} from "lucide-react";
import { MOCK_STUDENTS, MOCK_STUDENT_PROGRESS, getStudentCompletion, getStudentStrengthDistribution } from "../data/mentorData";
import { MOCK_SYLLABUS } from "../data/mockData";

const BRANCHES = ['All', 'CSE', 'ECE', 'ME'];
const SECTIONS = ['All', 'A', 'B', 'C'];
const SEMESTERS = ['All', 2, 4, 6, 8];

export default function StudentDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  const filtered = useMemo(() => {
    return MOCK_STUDENTS.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           s.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBranch = branchFilter === 'All' || s.branch === branchFilter;
      const matchesSection = sectionFilter === 'All' || s.section === sectionFilter;
      const matchesSemester = semesterFilter === 'All' || s.semester === Number(semesterFilter);
      return matchesSearch && matchesBranch && matchesSection && matchesSemester;
    });
  }, [searchQuery, branchFilter, sectionFilter, semesterFilter]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full text-teal-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-4 h-4" /> Student Directory
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Your Students</h1>
          <p className="text-slate-400 mt-1">{MOCK_STUDENTS.length} students enrolled across all sections</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode('cards')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'cards' ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20' : 'bg-white/5 text-slate-400 border border-white/5'}`}
          >
            Cards
          </button>
          <button 
            onClick={() => setViewMode('table')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'table' ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20' : 'bg-white/5 text-slate-400 border border-white/5'}`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-950/50 px-4 py-2.5 rounded-xl border border-white/10 flex-1 min-w-0 focus-within:border-teal-500/40 transition-all">
          <Search size={16} className="text-slate-500 shrink-0" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-600 w-full"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-3 flex-wrap">
          <Filter size={14} className="text-slate-500" />
          
          <FilterSelect label="Branch" value={branchFilter} onChange={setBranchFilter} options={BRANCHES} />
          <FilterSelect label="Section" value={sectionFilter} onChange={setSectionFilter} options={SECTIONS} />
          <FilterSelect label="Semester" value={semesterFilter} onChange={setSemesterFilter} options={SEMESTERS} />
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          Showing {filtered.length} of {MOCK_STUDENTS.length} students
        </p>
      </div>

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((student) => {
            const completion = getStudentCompletion(student.id);
            const dist = getStudentStrengthDistribution(student.id);
            const isExpanded = expandedStudent === student.id;
            const isAtRisk = completion < 40;

            return (
              <div 
                key={student.id} 
                className={`bg-slate-900/40 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  isAtRisk ? 'border-rose-500/20 hover:border-rose-500/30' : 'border-white/5 hover:border-teal-500/20'
                }`}
              >
                {/* Card Header */}
                <div 
                  className="p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedStudent(isExpanded ? null : student.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                      isAtRisk 
                        ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white' 
                        : 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white'
                    }`}>
                      {student.avatar}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{student.name}</h3>
                      <p className="text-[10px] text-slate-500 font-medium truncate">{student.email}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge text={student.branch} color="teal" />
                        <Badge text={`Sec ${student.section}`} color="slate" />
                        <Badge text={`Sem ${student.semester}`} color="slate" />
                      </div>
                    </div>

                    {/* Completion Ring */}
                    <div className="flex flex-col items-center shrink-0">
                      <CompletionRing percentage={completion} size={44} isAtRisk={isAtRisk} />
                      <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Done</span>
                    </div>
                  </div>

                  {/* Strength Bar */}
                  <div className="mt-4 flex gap-1 h-2 rounded-full overflow-hidden bg-slate-800">
                    {dist.strong > 0 && <div className="bg-emerald-500 transition-all" style={{ width: `${(dist.strong / 30) * 100}%` }} />}
                    {dist.moderate > 0 && <div className="bg-amber-500 transition-all" style={{ width: `${(dist.moderate / 30) * 100}%` }} />}
                    {dist.weak > 0 && <div className="bg-rose-500 transition-all" style={{ width: `${(dist.weak / 30) * 100}%` }} />}
                    {dist.unset > 0 && <div className="bg-slate-700 transition-all" style={{ width: `${(dist.unset / 30) * 100}%` }} />}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[9px] text-emerald-400 font-bold">{dist.strong} Strong</span>
                    <span className="text-[9px] text-amber-400 font-bold">{dist.moderate} Mod</span>
                    <span className="text-[9px] text-rose-400 font-bold">{dist.weak} Weak</span>
                    <span className="text-[9px] text-slate-500 font-bold">{dist.unset} Unset</span>
                  </div>
                </div>

                {/* Expanded: Subject Breakdown */}
                {isExpanded && (
                  <div className="border-t border-white/5 bg-slate-950/50 p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject Breakdown</h4>
                    {MOCK_SYLLABUS.map(sub => {
                      const topicIds = sub.units.flatMap(u => u.topics.map(t => t.id));
                      const studentProg = MOCK_STUDENT_PROGRESS[student.id] || {};
                      let subStrong = 0, subMod = 0, subWeak = 0, subUnset = 0;
                      topicIds.forEach(tid => {
                        const s = studentProg[tid]?.strength || 'unset';
                        if (s === 'strong') subStrong++;
                        else if (s === 'moderate') subMod++;
                        else if (s === 'weak') subWeak++;
                        else subUnset++;
                      });
                      const total = topicIds.length;
                      const done = subStrong + subMod + subWeak;
                      const pct = total ? Math.round((done / total) * 100) : 0;

                      return (
                        <div key={sub.id} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                          <span className="text-base">{sub.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-300 truncate">{sub.name}</p>
                            <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden bg-slate-800 mt-1.5">
                              {subStrong > 0 && <div className="bg-emerald-500" style={{ width: `${(subStrong / total) * 100}%` }} />}
                              {subMod > 0 && <div className="bg-amber-500" style={{ width: `${(subMod / total) * 100}%` }} />}
                              {subWeak > 0 && <div className="bg-rose-500" style={{ width: `${(subWeak / total) * 100}%` }} />}
                            </div>
                          </div>
                          <span className="text-xs font-black text-white shrink-0">{pct}%</span>
                        </div>
                      );
                    })}
                    
                    {/* Metadata */}
                    <div className="flex items-center gap-4 pt-2 text-[10px] text-slate-600">
                      <span className="flex items-center gap-1"><Mail size={10} />{student.email}</span>
                      <span className="flex items-center gap-1"><Calendar size={10} />Enrolled {student.enrollmentYear}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Student</th>
                  <th className="text-left p-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Branch</th>
                  <th className="text-left p-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Section</th>
                  <th className="text-left p-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Semester</th>
                  <th className="text-left p-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Completion</th>
                  <th className="text-left p-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Strong</th>
                  <th className="text-left p-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Weak</th>
                  <th className="text-left p-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => {
                  const completion = getStudentCompletion(student.id);
                  const dist = getStudentStrengthDistribution(student.id);
                  const isAtRisk = completion < 40;

                  return (
                    <tr key={student.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
                            isAtRisk ? 'bg-rose-500/20 text-rose-400' : 'bg-teal-500/20 text-teal-400'
                          }`}>
                            {student.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{student.name}</p>
                            <p className="text-[10px] text-slate-600">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4"><Badge text={student.branch} color="teal" /></td>
                      <td className="p-4 text-sm text-slate-400">{student.section}</td>
                      <td className="p-4 text-sm text-slate-400">{student.semester}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${isAtRisk ? 'bg-rose-500' : 'bg-teal-500'}`} style={{ width: `${completion}%` }} />
                          </div>
                          <span className={`text-xs font-bold ${isAtRisk ? 'text-rose-400' : 'text-teal-400'}`}>{completion}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-bold text-emerald-400">{dist.strong}</td>
                      <td className="p-4 text-sm font-bold text-rose-400">{dist.weak}</td>
                      <td className="p-4 text-xs text-slate-500">{new Date(student.lastActive).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-16 text-center backdrop-blur-xl">
          <Users size={48} className="text-slate-700 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">No Students Found</h2>
          <p className="text-slate-500 text-sm">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-slate-600 font-bold uppercase">{label}:</span>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-950/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold cursor-pointer focus:outline-none focus:border-teal-500/40 transition-colors appearance-none"
      >
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
        ))}
      </select>
    </div>
  );
}

function Badge({ text, color }) {
  const colors = {
    teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    slate: 'bg-white/5 text-slate-400 border-white/10',
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${colors[color]}`}>
      {text}
    </span>
  );
}

function CompletionRing({ percentage, size = 44, isAtRisk }) {
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={center} cy={center} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} fill="none" />
        <circle 
          cx={center} cy={center} r={radius} 
          stroke={isAtRisk ? '#f43f5e' : '#14b8a6'}
          strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
        {percentage}%
      </span>
    </div>
  );
}
