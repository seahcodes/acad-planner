import { Search, Bell, GraduationCap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function MentorNavbar() {
  const { user } = useAuth();
  const mentorName = user?.name || "Mentor";
  const initials = mentorName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="h-16 w-full border-b border-white/5 bg-slate-900/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
      
      {/* Title */}
      <div className="flex items-center gap-4">
        <h3 className="text-white/90 font-medium tracking-wide">
          Mentor Dashboard
        </h3>
      </div>

      {/* Right side - User controls */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-white/50 focus-within:border-teal-500/50 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
          <Search className="w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="bg-transparent border-none outline-none text-sm w-40 text-white placeholder:text-white/30"
          />
        </div>
        
        <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full shadow-[0_0_8px_rgba(20,184,166,0.8)]"></span>
        </button>

        <div className="h-8 w-px bg-white/10 mx-1"></div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium text-white/90 group-hover:text-teal-300 transition-colors">Mentor Mode</span>
            <span className="text-xs text-slate-500">{user?.department || 'CSE Dept.'}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-teal-500/20 ring-2 ring-white/10 group-hover:ring-teal-400/50 transition-all text-xs">
            {initials}
          </div>
        </div>
      </div>

    </div>
  );
}
