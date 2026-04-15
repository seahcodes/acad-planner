import { createContext, useContext, useState, useMemo } from "react";
import { MOCK_SYLLABUS } from "../data/mockData";

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState({});

  // Set strength
  const setTopicStrength = (topicId, strength) => {
    setProgress(prev => ({
      ...prev,
      [topicId]: strength,
    }));
  };

  // 🔥 GLOBAL STATS (used everywhere)
  const stats = useMemo(() => {
    let total = 0,
      strong = 0,
      moderate = 0,
      weak = 0,
      unset = 0;

    MOCK_SYLLABUS.forEach(sub =>
      sub.units.forEach(unit =>
        unit.topics.forEach(topic => {
          total++;
          const s = progress[topic.id] || "unset";

          if (s === "strong") strong++;
          else if (s === "moderate") moderate++;
          else if (s === "weak") weak++;
          else unset++;
        })
      )
    );

    const completed = strong + moderate + weak;
    const completionPct = total ? Math.round((completed / total) * 100) : 0;

    return { total, strong, moderate, weak, unset, completed, completionPct };
  }, [progress]);

  return (
    <ProgressContext.Provider value={{ progress, setTopicStrength, stats }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}