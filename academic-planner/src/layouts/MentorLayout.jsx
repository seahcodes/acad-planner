import { Outlet } from "react-router-dom";
import MentorSidebar from "../components/MentorSidebar";
import MentorNavbar from "../components/MentorNavbar";

export default function MentorLayout() {
  return (
    <div className="flex h-screen w-full bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.08),rgba(255,255,255,0))] font-sans antialiased text-white overflow-hidden selection:bg-teal-500/30 selection:text-white">
      
      {/* Sidebar - fixed and glassy */}
      <MentorSidebar />

      {/* Main Area Scrollable */}
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden relative">
        
        {/* Top Navbar */}
        <MentorNavbar />

        {/* Page Content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
