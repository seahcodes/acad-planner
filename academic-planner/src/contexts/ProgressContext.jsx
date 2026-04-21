import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { MOCK_SYLLABUS, generateRevisionPlan, MOCK_EXAMS } from "../data/mockData";
import { useAuth } from "./AuthContext";

const recalculateBacklog = (currentPlan) => {
  const todayStr = new Date().toLocaleDateString();
  const todayTime = new Date().setHours(0, 0, 0, 0);
  let backlog = [];

  const updatedPlan = currentPlan.map(day => {
    const dayDate = new Date(day.date).setHours(0, 0, 0, 0);
    if (dayDate < todayTime) {
      const missed = day.topics.filter(t => t.status === 'pending');
      backlog.push(...missed);
      return { ...day, topics: day.topics.filter(t => t.status === 'completed') };
    }
    return day;
  });

  if (backlog.length > 0) {
    return updatedPlan.map(day => {
      if (day.date === todayStr) {
        return { ...day, topics: [...backlog, ...day.topics] };
      }
      return day;
    });
  }
  return updatedPlan;
};

// Sort syllabus by exam date (soonest first)
const sortSyllabusByExamDate = (syllabus, exams) => {
  return [...syllabus].sort((a, b) => {
    const examA = exams.find(exam => exam.subjectId === a.id);
    const examB = exams.find(exam => exam.subjectId === b.id);
    if (!examA || !examB) return 0;
    return new Date(examA.date) - new Date(examB.date);
  });
};

// Get the nearest upcoming exam
const getNearestExam = (exams) => {
  const today = new Date();
  const upcoming = exams
    .filter(exam => new Date(exam.date) > today)  // Changed to > today (exclude today's exams)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  return upcoming[0];
};

// Generate checklist for nearest exam subject
const generateExamChecklist = (subject, examDate) => {
  const today = new Date();
  const exam = new Date(examDate);
  const daysUntilExam = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
  
  const allTopics = [];
  subject.units.forEach(unit => {
    unit.topics.forEach(topic => {
      allTopics.push({
        ...topic,
        subjectName: subject.name,
        unitName: unit.name,
      });
    });
  });

  // Divide topics across days before exam
  const topicsPerDay = Math.ceil(allTopics.length / Math.max(daysUntilExam, 1));
  const checklist = [];

  for (let day = 0; day < daysUntilExam; day++) {
    const startIdx = day * topicsPerDay;
    const endIdx = Math.min(startIdx + topicsPerDay, allTopics.length);
    const dayTopics = allTopics.slice(startIdx, endIdx);
    
    if (dayTopics.length > 0) {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() + day);
      
      checklist.push({
        day: day + 1,
        date: dayDate.toLocaleDateString(),
        topics: dayTopics,
      });
    }
  }

  return checklist;
};

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState({});
  const [revisionPlan, setRevisionPlan] = useState([]);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [examChecklist, setExamChecklist] = useState([]);

  // Load data from localStorage when user changes
  useEffect(() => {
    if (user?.email) {
      const storedProgress = localStorage.getItem(`progress_${user.email}`);
      const storedPlan = localStorage.getItem(`revisionPlan_${user.email}`);
      const storedCompleted = localStorage.getItem(`completedTopics_${user.email}`);
      
      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      } else {
        setProgress({});
      }
      
      if (storedCompleted) {
        setCompletedTopics(JSON.parse(storedCompleted));
      } else {
        setCompletedTopics([]);
      }
      
      let plan = storedPlan ? JSON.parse(storedPlan) : generateRevisionPlan(sortSyllabusByExamDate(MOCK_SYLLABUS, MOCK_EXAMS));
      
      // Check if the plan is outdated (first day not today)
      const todayStr = new Date().toLocaleDateString();
      if (plan.length === 0 || plan[0].date !== todayStr) {
        plan = generateRevisionPlan(sortSyllabusByExamDate(MOCK_SYLLABUS, MOCK_EXAMS));
      }
      
      setRevisionPlan(plan);

      // Generate exam checklist
      const storedChecklist = localStorage.getItem(`examChecklist_${user.email}`);
      const storedChecklistDate = localStorage.getItem(`examChecklistDate_${user.email}`);
      
      if (storedChecklist && storedChecklistDate === todayStr) {
        // Use stored checklist if it's from today
        setExamChecklist(JSON.parse(storedChecklist));
      } else {
        // Regenerate if it's a new day
        const nearestExam = getNearestExam(MOCK_EXAMS);
        if (nearestExam) {
          const subject = MOCK_SYLLABUS.find(sub => sub.id === nearestExam.subjectId);
          if (subject) {
            const checklist = generateExamChecklist(subject, nearestExam.date);
            setExamChecklist(checklist);
            // Save with today's date
            localStorage.setItem(`examChecklistDate_${user.email}`, todayStr);
            localStorage.setItem(`examChecklist_${user.email}`, JSON.stringify(checklist));
          }
        } else {
          setExamChecklist([]);
        }
      }
    } else {
      setProgress({});
      setRevisionPlan([]);
      setCompletedTopics([]);
      setExamChecklist([]);
    }
  }, [user]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`progress_${user.email}`, JSON.stringify(progress));
    }
  }, [progress, user]);

  useEffect(() => {
    if (user?.email && revisionPlan.length > 0) {
      localStorage.setItem(`revisionPlan_${user.email}`, JSON.stringify(revisionPlan));
    }
  }, [revisionPlan, user]);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`completedTopics_${user.email}`, JSON.stringify(completedTopics));
    }
  }, [completedTopics, user]);

  useEffect(() => {
    if (user?.email && examChecklist.length > 0) {
      const todayStr = new Date().toLocaleDateString();
      localStorage.setItem(`examChecklist_${user.email}`, JSON.stringify(examChecklist));
      localStorage.setItem(`examChecklistDate_${user.email}`, todayStr);
    }
  }, [examChecklist, user]);

  // Recalculate backlog on mount
  useEffect(() => {
    if (revisionPlan.length > 0) {
      setRevisionPlan(prev => recalculateBacklog(prev));
    }
  }, []);

  // Set strength
  const setTopicStrength = (topicId, strength) => {
    setProgress(prev => ({
      ...prev,
      [topicId]: strength,
    }));
  };

  // Toggle topic status in revision plan
  const toggleTopicStatus = (dayIndex, topicId) => {
    setRevisionPlan(prevPlan => prevPlan.map((day, dIdx) => {
      if (dIdx !== dayIndex) return day;
      return {
        ...day,
        topics: day.topics.map(topic => {
          if (topic.id !== topicId) return topic;
          const isDone = topic.status !== 'completed';
          return { ...topic, status: isDone ? 'completed' : 'pending' };
        })
      };
    }));
  };

  // Toggle completion for checklist
  const toggleCompletion = (topicId) => {
    setCompletedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
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
    <ProgressContext.Provider value={{ 
      progress, 
      setTopicStrength, 
      stats, 
      revisionPlan, 
      toggleTopicStatus,
      completedTopics,
      setCompletedTopics,
      toggleCompletion,
      examChecklist
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}