import { Link, useLocation } from "react-router-dom";
import { BookOpen, Calendar, AlertTriangle, LayoutDashboard } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/syllabus", label: "Syllabus", icon: BookOpen },
  { to: "/revision-plan", label: "Revision Plan", icon: Calendar },
  { to: "/weak-topics", label: "Weak Topics", icon: AlertTriangle },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 p-5 flex flex-col gap-6 shadow-2xl relative z-10 transition-all duration-300">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-2">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-white text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          SyllabusIQ
        </h2>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-2">
        {links.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;

          return (
            <Link
              key={to}
              to={to}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${active 
                  ? "text-white bg-indigo-500/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-indigo-500/20" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                }
              `}
            >
              <Icon 
                className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  active ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-300"
                }`} 
              />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
