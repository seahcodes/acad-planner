import { useState } from "react";
import { MOCK_SYLLABUS } from "../../data/mockData";
import { useProgress } from "../../contexts/ProgressContext";

export default function SyllabusView() {
  const { progress, setTopicStrength } = useProgress();

  const [openSubjects, setOpenSubjects] = useState({});
  const [openUnits, setOpenUnits] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleSubject = (id) => {
    setOpenSubjects((p) => ({ ...p, [id]: !p[id] }));
  };

  const toggleUnit = (id) => {
    setOpenUnits((p) => ({ ...p, [id]: !p[id] }));
  };

  const setStrength = (topicId, strength) => {
    setTopicStrength(topicId, strength);
    setActiveDropdown(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h1>📚 Syllabus</h1>

      {MOCK_SYLLABUS.map((sub) => {
        const isOpen = openSubjects[sub.id];

        return (
          <div key={sub.id} className="card">

            {/* SUBJECT */}
            <div
              onClick={() => toggleSubject(sub.id)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <h3>
                {sub.icon} {sub.name}
              </h3>
              <span>{isOpen ? "−" : "+"}</span>
            </div>

            {/* UNITS */}
            {isOpen &&
              sub.units.map((unit) => {
                const uOpen = openUnits[unit.id];

                return (
                  <div key={unit.id} style={{ marginTop: "10px", paddingLeft: "10px" }}>
                    
                    {/* UNIT */}
                    <div
                      onClick={() => toggleUnit(unit.id)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        color: "#cbd5f5",
                      }}
                    >
                      <span>{unit.name}</span>
                      <span>{uOpen ? "−" : "+"}</span>
                    </div>

                    {/* TOPICS */}
                    {uOpen &&
                      unit.topics.map((topic) => {
                        const strength = progress[topic.id] || "unset";
                        const isOpenDrop = activeDropdown === topic.id;

                        return (
                          <div
                            key={topic.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: "8px",
                              padding: "8px",
                              borderRadius: "8px",
                              background:
                                strength === "weak"
                                  ? "rgba(239,68,68,0.1)"
                                  : strength === "strong"
                                  ? "rgba(16,185,129,0.1)"
                                  : "transparent",
                            }}
                          >
                            <span>{topic.name}</span>

                            {/* DROPDOWN */}
                            <div style={{ position: "relative" }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdown(isOpenDrop ? null : topic.id);
                                }}
                                className="btn-secondary"
                              >
                                {strength}
                              </button>

                              {isOpenDrop && (
                                <div
                                  style={{
                                    position: "absolute",
                                    right: 0,
                                    top: "110%",
                                    background: "#1f2937",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                  }}
                                >
                                  {["strong", "moderate", "weak"].map((s) => (
                                    <div
                                      key={s}
                                      onClick={() => setStrength(topic.id, s)}
                                      style={{
                                        padding: "6px 12px",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                      }}
                                    >
                                      {s}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}