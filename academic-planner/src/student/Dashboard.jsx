import { useMemo } from "react";
import { useProgress } from "../../contexts/ProgressContext";
import { MOCK_SYLLABUS } from "../../data/mockData";

export default function Dashboard() {
  const { progress } = useProgress();

  const stats = useMemo(() => {
    let total = 0;
    let strong = 0;
    let weak = 0;
    let moderate = 0;

    MOCK_SYLLABUS.forEach(sub =>
      sub.units.forEach(unit =>
        unit.topics.forEach(t => {
          total++;
          const s = progress[t.id] || "unset";
          if (s === "strong") strong++;
          if (s === "weak") weak++;
          if (s === "moderate") moderate++;
        })
      )
    );

    return { total, strong, weak, moderate };
  }, [progress]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: "26px", marginBottom: "6px" }}>
          👋 Welcome back
        </h1>
        <p style={{ color: "#9ca3af" }}>
          Track your progress and focus on what matters most
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        <Card title="Total Topics" value={stats.total} color="#6366f1" />
        <Card title="Strong" value={stats.strong} color="#10b981" />
        <Card title="Moderate" value={stats.moderate} color="#f59e0b" />
        <Card title="Weak" value={stats.weak} color="#ef4444" />
      </div>

      {/* Progress Section */}
      <div className="card">
        <h3 style={{ marginBottom: "10px" }}>Overall Progress</h3>
        <ProgressBar
          value={
            stats.total
              ? Math.round(((stats.strong + stats.moderate) / stats.total) * 100)
              : 0
          }
        />
      </div>

      {/* Suggestion */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))",
        }}
      >
        <h3>📌 Focus Recommendation</h3>
        <p style={{ color: "#cbd5f5" }}>
          You have <b>{stats.weak}</b> weak topics. Start with those to improve faster.
        </p>
      </div>
    </div>
  );
}


// Small reusable card
function Card({ title, value, color }) {
  return (
    <div
      className="card"
      style={{
        borderLeft: `4px solid ${color}`,
      }}
    >
      <p style={{ color: "#9ca3af", fontSize: "13px" }}>{title}</p>
      <h2 style={{ margin: "6px 0", color }}>{value}</h2>
    </div>
  );
}


// Progress bar
function ProgressBar({ value }) {
  return (
    <div
      style={{
        width: "100%",
        height: "8px",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
        }}
      />
    </div>
  );
}