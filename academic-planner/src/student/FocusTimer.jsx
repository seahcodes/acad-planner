import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

export default function FocusTimer() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(seconds - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-[2.5rem] p-7 text-white shadow-xl border border-white/10">
      <div className="flex items-center gap-2 mb-4 text-indigo-200 uppercase text-[10px] font-black tracking-widest">
        <Timer size={14} className={isActive ? "animate-pulse" : ""} /> Focus Session
      </div>
      <div className="text-6xl font-black mb-6 font-mono tracking-tighter text-center">
        {formatTime(seconds)}
      </div>
      <div className="flex gap-3">
        <button 
          onClick={() => setIsActive(!isActive)}
          className="flex-1 bg-white text-indigo-700 py-3 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all"
        >
          {isActive ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />} 
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button 
          onClick={() => {setIsActive(false); setSeconds(25 * 60)}}
          className="p-3 bg-white/20 rounded-2xl hover:bg-white/30 transition-all text-white border border-white/10"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
}