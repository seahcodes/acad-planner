import { Link, useLocation } from "react-router-dom";
import { 
  BookOpen, 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  FolderOpen,
  GraduationCap,
  LogOut
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const links = [
  { to: "/mentor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/mentor/students", label: "Students", icon: Users },
  { to: "/mentor/syllabus", label: "Syllabus", icon: BookOpen },
  { to: "/mentor/progress", label: "Progress Tracker", icon: BarChart3 },
  { to: "/mentor/materials", label: "Study Materials", icon: FolderOpen },
];

export default function MentorSidebar() {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900/80 to-slate-950 backdrop-blur-xl border-r border-white/5 p-5 flex flex-col gap-6 shadow-xl relative z-10 transition-all duration-300 h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-2">
        <img src="/Favicon-logo.png" alt="SyllabusIQ" className="h-10 w-10 rounded-lg shadow-lg shadow-teal-500/20" />
        <div>
          <h2 className="text-white text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            SyllabusIQ
          </h2>
          <span className="text-[8px] font-black text-teal-400 uppercase tracking-[0.25em] bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
            Mentor
          </span>
        </div>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-2 flex-1">
        {links.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;

          return (
            <Link
              key={to}
              to={to}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${active 
                  ? "text-white bg-teal-500/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-teal-500/20" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                }
              `}
            >
              <Icon 
                className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  active ? "text-teal-400" : "text-slate-500 group-hover:text-teal-300"
                }`} 
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200 border border-transparent hover:border-rose-500/10"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
}
