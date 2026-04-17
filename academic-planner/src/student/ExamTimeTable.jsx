import React from 'react';
import { AlarmClock } from 'lucide-react';
import { MOCK_EXAMS } from '../data/mockData'; 

export default function ExamTimetable() {
  const getDaysLeft = (examDate) => {
    const today = new Date();
    const target = new Date(examDate);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-7 text-white shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-indigo-400 uppercase text-[10px] font-black tracking-widest">
          <AlarmClock size={14} /> Exam Schedule
        </div>
        <span className="text-[9px] bg-indigo-500/10 px-2 py-1 rounded-md text-indigo-300 font-bold">2026 MID-SEM</span>
      </div>
      
      <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
        {MOCK_EXAMS.map((exam) => {
          const daysLeft = getDaysLeft(exam.date);
          const isUrgent = daysLeft <= 2;

          return (
            <div key={exam.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">
                  {new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className="text-sm font-bold leading-tight group-hover:text-indigo-400 transition-colors">
                  {exam.subjectName}
                </p>
              </div>
              <div className={`text-[9px] font-black px-3 py-1 rounded-lg ${
                isUrgent ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' : 'bg-white/5 text-slate-300'
              }`}>
                {daysLeft <= 0 ? 'Today' : `${daysLeft}d`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}