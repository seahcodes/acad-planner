import { useState, useMemo } from "react";
import { 
  BookOpen, Plus, Trash2, Edit3, Save, X, 
  ChevronRight, ChevronDown, Archive, Check,
  Upload, Clock, FileText
} from "lucide-react";
import { MOCK_SYLLABUS } from "../data/mockData";
import { MOCK_SYLLABUS_VERSIONS } from "../data/mentorData";
import toast from "react-hot-toast";

export default function SyllabusManager() {
  const [syllabus, setSyllabus] = useState(MOCK_SYLLABUS);
  const [versions, setVersions] = useState(MOCK_SYLLABUS_VERSIONS);
  const [activeSubjectId, setActiveSubjectId] = useState(MOCK_SYLLABUS[0]?.id);
  const [expandedUnits, setExpandedUnits] = useState({});
  const [editingTopic, setEditingTopic] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showAddTopic, setShowAddTopic] = useState(null); // unitId
  const [newTopicName, setNewTopicName] = useState('');
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');
  const [showVersions, setShowVersions] = useState(false);

  const activeSubject = useMemo(() => syllabus.find(s => s.id === activeSubjectId), [syllabus, activeSubjectId]);
  const activeVersions = useMemo(() => versions.filter(v => v.subjectId === activeSubjectId), [versions, activeSubjectId]);

  const toggleUnit = (unitId) => {
    setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  // ─── Topic CRUD ─────────────────────────────────────────────────────────
  const handleEditTopic = (topicId, currentName) => {
    setEditingTopic(topicId);
    setEditValue(currentName);
  };

  const handleSaveEdit = (unitId, topicId) => {
    if (!editValue.trim()) return;
    setSyllabus(prev => prev.map(sub => {
      if (sub.id !== activeSubjectId) return sub;
      return {
        ...sub,
        units: sub.units.map(u => {
          if (u.id !== unitId) return u;
          return {
            ...u,
            topics: u.topics.map(t => t.id === topicId ? { ...t, name: editValue.trim() } : t)
          };
        })
      };
    }));
    setEditingTopic(null);
    toast.success('Topic updated');
  };

  const handleDeleteTopic = (unitId, topicId) => {
    setSyllabus(prev => prev.map(sub => {
      if (sub.id !== activeSubjectId) return sub;
      return {
        ...sub,
        units: sub.units.map(u => {
          if (u.id !== unitId) return u;
          return { ...u, topics: u.topics.filter(t => t.id !== topicId) };
        })
      };
    }));
    toast.success('Topic removed');
  };

  const handleAddTopic = (unitId) => {
    if (!newTopicName.trim()) return;
    const newId = `t_new_${Date.now()}`;
    setSyllabus(prev => prev.map(sub => {
      if (sub.id !== activeSubjectId) return sub;
      return {
        ...sub,
        units: sub.units.map(u => {
          if (u.id !== unitId) return u;
          return {
            ...u,
            topics: [...u.topics, { id: newId, name: newTopicName.trim(), strength: 'unset', score: 0 }]
          };
        })
      };
    }));
    setNewTopicName('');
    setShowAddTopic(null);
    toast.success('Topic added');
  };

  // ─── Unit CRUD ──────────────────────────────────────────────────────────
  const handleAddUnit = () => {
    if (!newUnitName.trim()) return;
    const newId = `u_new_${Date.now()}`;
    setSyllabus(prev => prev.map(sub => {
      if (sub.id !== activeSubjectId) return sub;
      return {
        ...sub,
        units: [...sub.units, { id: newId, name: newUnitName.trim(), topics: [] }]
      };
    }));
    setNewUnitName('');
    setShowAddUnit(false);
    toast.success('Unit added');
  };

  const handleDeleteUnit = (unitId) => {
    setSyllabus(prev => prev.map(sub => {
      if (sub.id !== activeSubjectId) return sub;
      return { ...sub, units: sub.units.filter(u => u.id !== unitId) };
    }));
    toast.success('Unit removed');
  };

  // ─── Version Management ─────────────────────────────────────────────────
  const handleArchiveVersion = (versionId) => {
    setVersions(prev => prev.map(v => v.id === versionId ? { ...v, status: 'archived' } : v));
    toast.success('Version archived');
  };

  const handleFileUpload = () => {
    toast.success('Syllabus PDF uploaded (mock)');
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full text-teal-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-4 h-4" /> Syllabus Manager
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Manage Syllabus</h1>
          <p className="text-slate-400 mt-1">Add, edit, and organize curriculum for your subjects</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowVersions(!showVersions)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              showVersions ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20' : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
            }`}
          >
            <Clock size={14} /> Version History
          </button>
          <button 
            onClick={handleFileUpload}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-500/10 border border-teal-500/20 text-teal-300 rounded-xl text-xs font-bold hover:bg-teal-500/20 transition-all"
          >
            <Upload size={14} /> Upload PDF
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Subject Tabs - Vertical */}
        <div className="w-56 shrink-0 space-y-2">
          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-2 mb-3">Subjects</h3>
          {syllabus.map(sub => (
            <button
              key={sub.id}
              onClick={() => setActiveSubjectId(sub.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                activeSubjectId === sub.id 
                  ? 'bg-teal-500/15 text-white border border-teal-500/20 shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className="text-lg">{sub.icon}</span>
              <span className="truncate">{sub.name}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {activeSubject && (
            <>
              {/* Subject Header */}
              <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-teal-500/10 rounded-xl">
                    <BookOpen size={24} className="text-teal-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{activeSubject.name}</h2>
                    <p className="text-sm text-slate-500">{activeSubject.units.length} Units • {activeSubject.units.reduce((a, u) => a + u.topics.length, 0)} Topics</p>
                  </div>
                </div>
              </div>

              {/* Units & Topics */}
              {activeSubject.units.map(unit => {
                const isExpanded = expandedUnits[unit.id] !== false; // default expanded
                
                return (
                  <div key={unit.id} className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden">
                    {/* Unit Header */}
                    <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={() => toggleUnit(unit.id)}>
                      <div className="flex items-center gap-3">
                        {isExpanded ? <ChevronDown size={18} className="text-teal-400" /> : <ChevronRight size={18} className="text-slate-500" />}
                        <h3 className="text-lg font-bold text-white">{unit.name || unit.title}</h3>
                        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-md text-slate-500 font-bold">{unit.topics.length} topics</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteUnit(unit.id); }}
                        className="p-2 text-slate-600 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete unit"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Topics */}
                    {isExpanded && (
                      <div className="border-t border-white/5 bg-slate-950/30 p-4 space-y-2">
                        {unit.topics.map(topic => (
                          <div key={topic.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-teal-500/20 transition-all group">
                            <div className="w-2 h-2 rounded-full bg-teal-500/40 shrink-0" />
                            
                            {editingTopic === topic.id ? (
                              <div className="flex-1 flex items-center gap-2">
                                <input 
                                  type="text" 
                                  value={editValue} 
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(unit.id, topic.id)}
                                  className="flex-1 bg-slate-950/50 border border-teal-500/30 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
                                  autoFocus
                                />
                                <button onClick={() => handleSaveEdit(unit.id, topic.id)} className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors">
                                  <Save size={14} />
                                </button>
                                <button onClick={() => setEditingTopic(null)} className="p-1.5 text-slate-500 hover:bg-white/5 rounded-lg transition-colors">
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <>
                                <span className="flex-1 text-sm text-slate-300 font-medium">{topic.name}</span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => handleEditTopic(topic.id, topic.name)} 
                                    className="p-1.5 text-slate-500 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-all"
                                  >
                                    <Edit3 size={13} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteTopic(unit.id, topic.id)} 
                                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}

                        {/* Add Topic */}
                        {showAddTopic === unit.id ? (
                          <div className="flex items-center gap-2 p-2">
                            <input 
                              type="text" 
                              value={newTopicName} 
                              onChange={(e) => setNewTopicName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddTopic(unit.id)}
                              placeholder="New topic name..." 
                              className="flex-1 bg-slate-950/50 border border-teal-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none"
                              autoFocus
                            />
                            <button onClick={() => handleAddTopic(unit.id)} className="p-2 bg-teal-500/10 text-teal-400 rounded-lg hover:bg-teal-500/20 transition-colors">
                              <Check size={16} />
                            </button>
                            <button onClick={() => { setShowAddTopic(null); setNewTopicName(''); }} className="p-2 text-slate-500 hover:bg-white/5 rounded-lg transition-colors">
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setShowAddTopic(unit.id)}
                            className="flex items-center gap-2 p-3 text-sm text-teal-400/70 hover:text-teal-400 hover:bg-teal-500/5 rounded-xl transition-all w-full"
                          >
                            <Plus size={16} /> Add Topic
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add Unit */}
              {showAddUnit ? (
                <div className="flex items-center gap-2 p-4 bg-slate-900/40 border border-teal-500/20 rounded-2xl">
                  <input 
                    type="text" 
                    value={newUnitName} 
                    onChange={(e) => setNewUnitName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddUnit()}
                    placeholder="New unit name..." 
                    className="flex-1 bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/30"
                    autoFocus
                  />
                  <button onClick={handleAddUnit} className="px-4 py-2.5 bg-teal-500/10 text-teal-400 rounded-lg text-sm font-bold hover:bg-teal-500/20 transition-colors">Add</button>
                  <button onClick={() => { setShowAddUnit(false); setNewUnitName(''); }} className="p-2.5 text-slate-500 hover:bg-white/5 rounded-lg transition-colors">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAddUnit(true)}
                  className="flex items-center gap-2 p-5 text-sm font-bold text-teal-400/70 hover:text-teal-400 bg-white/[0.01] hover:bg-teal-500/5 border border-dashed border-white/10 hover:border-teal-500/30 rounded-2xl transition-all w-full justify-center"
                >
                  <Plus size={18} /> Add New Unit
                </button>
              )}
            </>
          )}
        </div>

        {/* Version History Panel */}
        {showVersions && (
          <div className="w-72 shrink-0 bg-slate-900/40 border border-white/5 rounded-2xl p-5 space-y-4 h-fit">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} /> Version History
            </h3>
            {activeVersions.length === 0 && (
              <p className="text-xs text-slate-600">No versions recorded.</p>
            )}
            {activeVersions.map(v => (
              <div key={v.id} className={`p-4 rounded-xl border transition-all ${
                v.status === 'current' ? 'bg-teal-500/5 border-teal-500/20' : 'bg-white/[0.02] border-white/5'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">{v.version}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider ${
                    v.status === 'current' ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'bg-white/5 text-slate-500 border border-white/10'
                  }`}>
                    {v.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{v.description}</p>
                <div className="text-[10px] text-slate-600 space-y-0.5">
                  <p>Uploaded: {new Date(v.uploadedAt).toLocaleDateString()}</p>
                  <p>Modified: {new Date(v.modifiedAt).toLocaleDateString()}</p>
                </div>
                {v.status === 'current' && (
                  <button 
                    onClick={() => handleArchiveVersion(v.id)}
                    className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <Archive size={12} /> Archive this version
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
