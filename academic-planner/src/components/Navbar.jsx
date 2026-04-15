export default function Navbar() {
  return (
    <div
      style={{
        height: "60px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      {/* Title */}
      <h3 style={{ margin: 0, color: "white" }}>
        Academic Planner
      </h3>

      {/* Right side */}
      <div style={{ color: "#9ca3af", fontSize: "14px" }}>
        Student Mode
      </div>
    </div>
  );
}