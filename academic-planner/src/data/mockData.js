export const MOCK_SYLLABUS = [
  {
    id: "sub1",
    name: "Data Structures",
    icon: "📘",
    units: [
      {
        id: "u1",
        name: "Arrays & Strings",
        topics: [
          { id: "t1", name: "Basics of Arrays", strength: "strong", score: 3 },
          { id: "t2", name: "Two Pointer Technique", strength: "weak", score: 1 },
          { id: "t3", name: "Sliding Window", strength: "moderate", score: 2 },
          { id: "t8", name: "KMP Algorithm", strength: "weak", score: 1 },
        ],
      },
      {
        id: "u2",
        name: "Linked List & Trees",
        topics: [
          { id: "t4", name: "Singly Linked List", strength: "unset", score: 0 },
          { id: "t5", name: "Doubly Linked List", strength: "unset", score: 0 },
          { id: "t9", name: "Binary Tree Traversal", strength: "strong", score: 3 },
          { id: "t10", name: "BST Operations", strength: "moderate", score: 2 },
        ],
      },
    ],
  },
  {
    id: "sub2",
    name: "Operating Systems",
    icon: "💻",
    units: [
      {
        id: "u3",
        name: "Processes & Threads",
        topics: [
          { id: "t6", name: "Process Scheduling", strength: "weak", score: 1 },
          { id: "t7", name: "Deadlocks", strength: "moderate", score: 2 },
          { id: "t11", name: "Semaphores & Mutex", strength: "unset", score: 0 },
        ],
      },
      {
        id: "u4",
        name: "Memory Management",
        topics: [
          { id: "t12", name: "Paging & Segmentation", strength: "weak", score: 1 },
          { id: "t13", name: "Virtual Memory", strength: "strong", score: 3 },
        ],
      },
    ],
  },
  {
    id: "sub3",
    name: "Theory of Computation",
    icon: "⚙️",
    units: [
      {
        id: "u5",
        name: "Automata Theory",
        topics: [
          { id: "t14", name: "Finite Automata (DFA/NFA)", strength: "strong", score: 3 },
          { id: "t15", name: "Pushdown Automata (PDA)", strength: "weak", score: 1 },
          { id: "t16", name: "Greibach Normal Form (GNF)", strength: "weak", score: 1 },
        ],
      },
      {
        id: "u6",
        name: "Context Free Grammars",
        topics: [
          { id: "t17", name: "CFG Simplification", strength: "moderate", score: 2 },
          { id: "t18", name: "Turing Machines", strength: "unset", score: 0 },
        ],
      },
    ],
  },
  {
    id: "sub4",
    name: "Computer Networks",
    icon: "🌐",
    units: [
      {
        id: "u7",
        name: "Network Layers",
        topics: [
          { id: "t19", name: "OSI & TCP/IP Models", strength: "strong", score: 3 },
          { id: "t20", name: "IPv4 Addressing & Subnetting", strength: "weak", score: 1 },
          { id: "t21", name: "NAT & PAT", strength: "moderate", score: 2 },
        ],
      },
      {
        id: "u8",
        name: "Transport Layer",
        topics: [
          { id: "t22", name: "TCP vs UDP Headers", strength: "strong", score: 3 },
          { id: "t23", name: "Congestion Control", strength: "unset", score: 0 },
        ],
      },
    ],
  },
  {
    id: "sub5",
    name: "Data Science",
    icon: "📊",
    units: [
      {
        id: "u9",
        name: "Machine learning Basics",
        topics: [
          { id: "t24", name: "Types of learnings", strength: "weak", score: 1 },
          { id: "t25", name: "KNN vs K-Means", strength: "moderate", score: 2 },
          { id: "t26", name: "regression", strength: "unset", score: 0 },
          { id: "t27", name: "classification, optimization, regularization", strength: "unset", score: 0 },
        ],
      },
      {
        id: "u10",
        name: "Evaluation Metrics",
        topics: [
          { id: "t28", name: "Confusion Matrix", strength: "weak", score: 1 },
          { id: "t29", name: "Precision, Recall, F1 score", strength: "strong", score: 3 },
          { id: "t30", name: "Hypothesis testing", strength: "strong", score: 3 },
        ],
      },
    ],
  },
];

export const MOCK_EXAMS = [
  { id: 'ex_1', subjectId: 'sub1', subjectName: 'Data Structures', date: '2026-04-25' },
  { id: 'ex_2', subjectId: 'sub2', subjectName: 'Operating Systems', date: '2026-04-24' },
  { id: 'ex_3', subjectId: 'sub3', subjectName: 'Theory of Computation', date: '2026-04-23' },
  { id: 'ex_4', subjectId: 'sub4', subjectName: 'Computer Networks', date: '2026-04-22' },
  { id: 'ex_5', subjectId: 'sub5', subjectName: 'Data Science', date: '2026-04-21' },
];

/**
 * REVISION PLAN GENERATOR
 * Converts the nested syllabus into a flat daily schedule.
 */
export function generateRevisionPlan(syllabus) {
  const allTopics = [];

  // 1. Flatten the nested structure
  syllabus.forEach(sub => {
    sub.units.forEach(unit => {
      unit.topics.forEach(topic => {
        allTopics.push({
          ...topic,
          subjectName: sub.name,
          unitName: unit.name,
          status: topic.status || "pending", // Default to pending
          strength: topic.strength || "unset"
        });
      });
    });
  });

  // 2. Sort by Priority (Weakest Topics First)
  const priorityMap = { weak: 1, moderate: 2, unset: 3, strong: 4 };
  allTopics.sort((a, b) => priorityMap[a.strength] - priorityMap[b.strength]);

  // 3. Split into chunks (3 topics per day)
  const days = [];
  const topicsPerDay = 3;
  const startDate = new Date();

  for (let i = 0; i < allTopics.length; i += topicsPerDay) {
    const dayNumber = days.length;
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + dayNumber);

    days.push({
      day: dayNumber + 1,
      date: date.toDateString(),
      topics: allTopics.slice(i, i + topicsPerDay)
    });
  }

  return days;
}

// ─── USER DATA ──────────────────────────────────────────────────────────────

export const MOCK_STUDENT = {
  id: 'student_1',
  name: 'Aarav Sharma',
  role: 'student',
  institution: 'IIT Delhi',
  course: 'B.Tech CSE',
};

export const MOCK_ADMIN = {
  id: 'admin_1',
  name: 'System Admin',
  role: 'admin',
  institution: 'SyllabusIQ HQ',
};