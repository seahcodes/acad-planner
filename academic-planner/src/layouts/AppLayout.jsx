import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/navbar";

export default function AppLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <div
          style={{
            flex: 1,
            padding: "24px",
            background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
          }}
        >
          <Outlet />
        </div>

      </div>
    </div>
  );
}