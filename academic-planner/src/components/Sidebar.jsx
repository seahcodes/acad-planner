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
    <div
      style={{
        width: "240px",
        background: "rgba(255,255,255,0.03)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Logo */}
      <h2 style={{ color: "white", fontSize: "18px" }}>📚 SyllabusIQ</h2>

      {/* Links */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {links.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;

          return (
            <Link
              key={to}
              to={to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                borderRadius: "10px",
                textDecoration: "none",
                color: active ? "white" : "#9ca3af",
                background: active ? "rgba(99,102,241,0.2)" : "transparent",
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}