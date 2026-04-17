import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateRevisionPlan, MOCK_SYLLABUS } from '../data/mockData';
import { 
  CheckCircle2, 
  Circle, 
  RefreshCw, 
  Calendar, 
  ChevronRight, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudyPlanner() {
  const [plan, setPlan] = useState([]);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const navigate = useNavigate();

  // Load the initial plan on component mount
  useEffect(() => {
    // We use the function from your mockData.js to ensure data consistency
    const generatedPlan = generateRevisionPlan(MOCK_SYLLABUS);
    setPlan(generatedPlan);
  }, []);

  // Toggle completion status of a topic
  const toggleComplete = (dayId, topicId) => {
    setPlan(prevPlan => prevPlan.map(day => {
      if (day.day === dayId) {
        return {
          ...day,
          topics: day.topics.map(topic => 
            topic.id === topicId 
              ? { ...topic, status: topic.status === 'completed' ? 'pending' : 'completed' }
              : topic
          )
        };
      }
      return day;
    }));
  };

  // Logic for the Recalculate Path button
  const handleRecalculate = () => {
    setIsRecalculating(true);
    toast.loading("Analyzing missed topics and rescheduling...", { duration: 2000 });

    setTimeout(() => {
      // For now, this just refreshes the UI toast
      // We will add the actual "Redistribute" math here next
      setIsRecalculating(false);
      toast.success("Path recalculated! Check your updated Day 2.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Calendar className="text-indigo-500" />
              Your Revision Path
            </h1>
            <p className="text-slate-400 mt-1">Adaptive schedule based on your subject strengths.</p>
          </div>
          
          <button 
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
              isRecalculating 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 active:scale-95'
            }`}
          >
            <RefreshCw size={18} className={isRecalculating ? "animate-spin" : ""} />
            {isRecalculating ? "Recalculating..." : "Recalculate Path"}
          </button>
        </div>

        {/* The Checklist Grid */}
        <div className="grid grid-cols-1 gap-8">
          {plan.map((day) => (
            <div key={day.day} className="relative group">
              {/* Day Indicator Line */}
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-xl border border-indigo-500/20">
                      {day.day}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Day {day.day}</h3>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-widest flex items-center gap-1">
                        <Clock size={12} /> {day.date}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Topics for the Day */}
                <div className="grid gap-3">
                  {day.topics.map((topic) => (
                    <div 
                      key={topic.id}
                      onClick={() => toggleComplete(day.day, topic.id)}
                      className={`group/item flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${
                        topic.status === 'completed' 
                          ? 'bg-emerald-500/5 border-emerald-500/20' 
                          : 'bg-slate-950/40 border-white/5 hover:border-indigo-500/40 hover:bg-slate-950/60'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="transition-transform group-active/item:scale-90">
                          {topic.status === 'completed' ? (
                            <CheckCircle2 className="text-emerald-500" size={24} />
                          ) : (
                            <Circle className="text-slate-700 group-hover/item:text-indigo-400" size={24} />
                          )}
                        </div>
                        <div>
                          <p className={`font-semibold transition-all ${
                            topic.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-200'
                          }`}>
                            {topic.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{topic.subjectName}</span>
                            <span className="text-slate-700">•</span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{topic.unitName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Strength Badge */}
                        <span className={`text-[9px] px-2 py-1 rounded-lg uppercase font-black tracking-tighter border ${
                          topic.strength === 'weak' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                          topic.strength === 'moderate' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}>
                          {topic.strength}
                        </span>
                        <ChevronRight size={16} className="text-slate-700 group-hover/item:text-white transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer help */}
        <div className="mt-12 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
          <AlertTriangle className="text-amber-500 shrink-0" size={20} />
          <p className="text-sm text-amber-200/70 leading-relaxed">
            <strong>Pro Tip:</strong> If you fall behind, hit the <strong>Recalculate</strong> button. SyllabusIQ will analyze your pending topics and redistribute them across your remaining days to ensure you finish before your exams.
          </p>
        </div>
      </div>
    </div>
  );
}