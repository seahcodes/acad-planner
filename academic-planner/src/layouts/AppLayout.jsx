import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AppLayout() {
  return (
    <div className="flex h-screen w-full bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] font-sans antialiased text-white overflow-hidden selection:bg-indigo-500/30 selection:text-white">
      
      {/* Sidebar - fixed and glassy */}
      <Sidebar />

      {/* Main Area Scrollable */}
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden relative">
        
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content area with animated routing states (just styling for container) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
