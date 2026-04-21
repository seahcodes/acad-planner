import { useState, useMemo } from "react";
import { 
  FolderOpen, Search, Upload, Trash2, Edit3, 
  FileText, Video, Link as LinkIcon, StickyNote,
  Download, X, Check, Plus, Filter
} from "lucide-react";
import { MOCK_STUDY_MATERIALS } from "../data/mentorData";
import { MOCK_SYLLABUS } from "../data/mockData";
import toast from "react-hot-toast";

const TYPE_CONFIG = {
  pdf: { icon: FileText, color: 'rose', label: 'PDF' },
  video: { icon: Video, color: 'purple', label: 'Video' },
  link: { icon: LinkIcon, color: 'blue', label: 'Link' },
  notes: { icon: StickyNote, color: 'emerald', label: 'Notes' },
};

export default function MaterialsManager() {
  const [materials, setMaterials] = useState(MOCK_STUDY_MATERIALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // date, downloads, name
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Upload form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState(MOCK_SYLLABUS[0]?.id || '');
  const [newType, setNewType] = useState('pdf');

  const filtered = useMemo(() => {
    let result = materials.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = subjectFilter === 'all' || m.subjectId === subjectFilter;
      const matchesType = typeFilter === 'all' || m.type === typeFilter;
      return matchesSearch && matchesSubject && matchesType;
    });

    // Sort
    if (sortBy === 'date') result.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    else if (sortBy === 'downloads') result.sort((a, b) => b.downloads - a.downloads);
    else if (sortBy === 'name') result.sort((a, b) => a.title.localeCompare(b.title));

    return result;
  }, [materials, searchQuery, subjectFilter, typeFilter, sortBy]);

  // Stats
  const stats = useMemo(() => {
    const totalDownloads = materials.reduce((a, m) => a + m.downloads, 0);
    const typeCounts = {};
    materials.forEach(m => { typeCounts[m.type] = (typeCounts[m.type] || 0) + 1; });
    return { total: materials.length, totalDownloads, typeCounts };
  }, [materials]);

  const handleUpload = () => {
    if (!newTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }
    const subject = MOCK_SYLLABUS.find(s => s.id === newSubject);
    const newMaterial = {
      id: `mat_new_${Date.now()}`,
      title: newTitle.trim(),
      subjectId: newSubject,
      subjectName: subject?.name || 'Unknown',
      type: newType,
      size: newType === 'link' ? 'External' : `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString().split('T')[0],
      downloads: 0,
    };
    setMaterials(prev => [newMaterial, ...prev]);
    setNewTitle('');
    setShowUploadModal(false);
    toast.success('Material uploaded successfully');
  };

  const handleDelete = (id) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
    toast.success('Material deleted');
  };

  const handleEdit = (id, title) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleSaveEdit = (id) => {
    if (!editTitle.trim()) return;
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, title: editTitle.trim() } : m));
    setEditingId(null);
    toast.success('Title updated');
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full text-teal-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <FolderOpen className="w-4 h-4" /> Study Materials
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Study Materials</h1>
          <p className="text-slate-400 mt-1">Upload and manage resources for your students</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all active:scale-[0.98]"
        >
          <Upload size={16} /> Upload New
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 text-center">
          <div className="text-2xl font-black text-white">{stats.total}</div>
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">Total Materials</div>
        </div>
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 text-center">
          <div className="text-2xl font-black text-white">{stats.totalDownloads}</div>
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">Total Downloads</div>
        </div>
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 text-center">
          <div className="text-2xl font-black text-white">{stats.typeCounts['pdf'] || 0}</div>
          <div className="text-[9px] text-rose-400 font-bold uppercase tracking-wider mt-1">PDF Documents</div>
        </div>
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 text-center">
          <div className="text-2xl font-black text-white">{stats.typeCounts['video'] || 0}</div>
          <div className="text-[9px] text-purple-400 font-bold uppercase tracking-wider mt-1">Video Resources</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center gap-2 bg-slate-950/50 px-4 py-2.5 rounded-xl border border-white/10 flex-1 min-w-0 focus-within:border-teal-500/40 transition-all">
          <Search size={16} className="text-slate-500 shrink-0" />
          <input 
            type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search materials..." className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-600 w-full"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Filter size={14} className="text-slate-500" />
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="bg-slate-950/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold cursor-pointer focus:outline-none appearance-none">
            <option value="all" className="bg-slate-900">All Subjects</option>
            {MOCK_SYLLABUS.map(s => <option key={s.id} value={s.id} className="bg-slate-900">{s.name}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-slate-950/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold cursor-pointer focus:outline-none appearance-none">
            <option value="all" className="bg-slate-900">All Types</option>
            <option value="pdf" className="bg-slate-900">PDF</option>
            <option value="video" className="bg-slate-900">Video</option>
            <option value="link" className="bg-slate-900">Link</option>
            <option value="notes" className="bg-slate-900">Notes</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-slate-950/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold cursor-pointer focus:outline-none appearance-none">
            <option value="date" className="bg-slate-900">Newest First</option>
            <option value="downloads" className="bg-slate-900">Most Downloads</option>
            <option value="name" className="bg-slate-900">A → Z</option>
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(material => {
          const typeConfig = TYPE_CONFIG[material.type] || TYPE_CONFIG.pdf;
          const TypeIcon = typeConfig.icon;
          const isEditing = editingId === material.id;

          const iconBgColors = {
            rose: 'bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20',
            purple: 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20',
            blue: 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20',
            emerald: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20',
          };
          const badgeColors = {
            rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
            purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          };

          return (
            <div key={material.id} className="group bg-slate-900/40 border border-white/5 rounded-2xl p-5 hover:border-teal-500/20 transition-all hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl transition-colors shrink-0 ${iconBgColors[typeConfig.color]}`}>
                  <TypeIcon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(material.id)}
                        className="flex-1 bg-slate-950/50 border border-teal-500/30 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                        autoFocus
                      />
                      <button onClick={() => handleSaveEdit(material.id)} className="text-emerald-400 hover:bg-emerald-500/10 p-1 rounded"><Check size={14} /></button>
                      <button onClick={() => setEditingId(null)} className="text-slate-500 hover:bg-white/5 p-1 rounded"><X size={14} /></button>
                    </div>
                  ) : (
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-teal-300 transition-colors">{material.title}</h3>
                  )}
                  <p className="text-[10px] text-slate-500 font-medium mt-1">{material.subjectName}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider border ${badgeColors[typeConfig.color]}`}>
                    {typeConfig.label}
                  </span>
                  <span className="text-[10px] text-slate-600 font-medium">{material.size}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Download size={10} /> {material.downloads}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    {new Date(material.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(material.id, material.title)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all"
                >
                  <Edit3 size={12} /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(material.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          );
        })}

        {/* Upload Card */}
        <div 
          onClick={() => setShowUploadModal(true)}
          className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-teal-500/40 cursor-pointer transition-all group min-h-[180px]"
        >
          <div className="p-3 bg-teal-500/5 rounded-xl group-hover:bg-teal-500/10 transition-colors">
            <Plus className="text-teal-400/50 group-hover:text-teal-400" size={24} />
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider group-hover:text-teal-400 transition-colors">Upload New Material</span>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-16 text-center">
          <FolderOpen size={48} className="text-slate-700 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">No Materials Found</h2>
          <p className="text-slate-500 text-sm">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Upload Study Material</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Title</label>
                <input 
                  type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Binary Tree Traversal Notes" 
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Subject</label>
                <select 
                  value={newSubject} onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500/50 text-sm appearance-none cursor-pointer"
                >
                  {MOCK_SYLLABUS.map(s => <option key={s.id} value={s.id} className="bg-slate-900">{s.icon} {s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(TYPE_CONFIG).map(([type, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={type}
                        onClick={() => setNewType(type)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                          newType === type 
                            ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20' 
                            : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
                        }`}
                      >
                        <Icon size={18} />
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drop Zone */}
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-teal-500/30 transition-colors cursor-pointer">
                <Upload className="mx-auto text-slate-600 mb-2" size={28} />
                <p className="text-xs text-slate-500 font-medium">Click or drag files here</p>
                <p className="text-[10px] text-slate-700 mt-1">PDF, Video, or Note files accepted</p>
              </div>

              <button 
                onClick={handleUpload}
                className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all active:scale-[0.98] text-sm"
              >
                Upload Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
