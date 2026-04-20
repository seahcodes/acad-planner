import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MOCK_SYLLABUS } from "../data/mockData";
import { FileText, Link as LinkIcon, Plus, ChevronDown, ChevronRight } from "lucide-react";
import AISummary from "./AISummary";

export default function Notes() {
  const location = useLocation();
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Auto-select topic if coming from SyllabusView
  useEffect(() => {
    if (location.state?.activeTopicId) {
      const foundTopic = MOCK_SYLLABUS
        .flatMap(subject => subject.units)
        .flatMap(unit => unit.topics)
        .find(topic => topic.id === location.state.activeTopicId);

      if (foundTopic) {
        setSelectedTopic(foundTopic);
        const parentUnit = MOCK_SYLLABUS
          .flatMap(subject => subject.units)
          .find(unit => unit.topics.some(t => t.id === foundTopic.id));
        
        if (parentUnit) setExpandedUnit(parentUnit.id);
      }
    }
  }, [location.state]);

  // Hidden File Input Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Uploading ${file.name} to ${selectedTopic.name}...`);
      // Logic for storage goes here
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex gap-6 h-[calc(100vh-120px)] animate-in fade-in duration-500">
      
      {/* LEFT: The Syllabus Navigation */}
      <div className="w-1/3 bg-slate-900/40 border border-white/10 rounded-[2rem] overflow-y-auto p-6 backdrop-blur-xl">
        <h2 className="text-2xl font-black text-white mb-6">Knowledge Vault</h2>
        
        {MOCK_SYLLABUS.map((subject) => (
          <div key={subject.id} className="mb-6">
            <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
              <span>{subject.icon}</span> {subject.name}
            </h3>
            <div className="space-y-2">
              {subject.units.map((unit, unitIndex) => (
                <div key={unit.id} className="rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}
                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <span className="text-sm font-bold text-slate-200">Unit {unitIndex + 1}: {unit.name}</span>
                    {expandedUnit === unit.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  
                  {expandedUnit === unit.id && (
                    <div className="bg-slate-950/40 border-x border-b border-white/5 p-2 space-y-1">
                      {unit.topics.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => setSelectedTopic(topic)}
                          className={`w-full text-left p-3 rounded-xl text-xs transition-all ${
                            selectedTopic?.id === topic.id 
                            ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                          }`}
                        >
                          {topic.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: The Content Area */}
      <div className="flex-1 bg-slate-900/20 border border-white/5 rounded-[2rem] overflow-y-auto p-8 relative">
        <input type="file" id="file-input" className="hidden" onChange={handleFileUpload} />
        
        {selectedTopic ? (
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-black text-white mb-2">{selectedTopic.name}</h1>
                <p className="text-slate-500 font-medium">Resources & AI Insights</p>
              </div>
              <button 
                onClick={() => document.getElementById('file-input').click()}
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-2xl shadow-lg transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <AISummary topicId={selectedTopic.id} topicName={selectedTopic.name} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResourceCard type="pdf" name="Lecture_Slides.pdf" size="2.4 MB" />
              <ResourceCard type="link" name="Study Guide" size="External Link" />
              
              {/* Functional Drop Zone */}
              <div 
                onClick={() => document.getElementById('file-input').click()}
                className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-indigo-500/40 cursor-pointer transition-all group"
              >
                <Plus className="text-slate-600 group-hover:text-indigo-400" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Upload New Note</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <FileText size={64} className="mb-4 text-slate-600" />
            <p className="text-slate-500 font-bold tracking-widest text-sm uppercase">Select a topic to view notes</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ResourceCard({ type, name, size }) {
  return (
    <div className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl flex items-center gap-4 hover:border-indigo-500/30 cursor-pointer transition-all group">
      <div className="p-3 bg-white/5 rounded-xl group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all">
        {type === 'pdf' ? <FileText size={20} /> : <LinkIcon size={20} />}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-200">{name}</p>
        <p className="text-[10px] text-slate-500 uppercase font-black">{size}</p>
      </div>
    </div>
  );
}