// MOCK SYLLABUS STRUCTURE

export const MOCK_SYLLABUS = [
  {
    id: "sub1",
    name: "Data Structures",
    icon: "📘",
    units: [
      {
        id: "u1",
        name: "Arrays",
        topics: [
          { id: "t1", name: "Basics of Arrays" },
          { id: "t2", name: "Two Pointer Technique" },
          { id: "t3", name: "Sliding Window" },
        ],
      },
      {
        id: "u2",
        name: "Linked List",
        topics: [
          { id: "t4", name: "Singly Linked List" },
          { id: "t5", name: "Doubly Linked List" },
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
        name: "Processes",
        topics: [
          { id: "t6", name: "Process Scheduling" },
          { id: "t7", name: "Deadlocks" },
        ],
      },
    ],
  },
];


// GENERATE REVISION PLAN

export function generateRevisionPlan(syllabus) {
  const allTopics = [];

  syllabus.forEach(sub =>
    sub.units.forEach(unit =>
      unit.topics.forEach(topic => {
        allTopics.push({
          ...topic,
          subjectName: sub.name,
          unitName: unit.name,
          strength: topic.strength || "unset",
        });
      })
    )
  );

  // Priority sorting
  const priority = { weak: 1, moderate: 2, strong: 3, unset: 4 };

  allTopics.sort((a, b) => priority[a.strength] - priority[b.strength]);

  const days = [];
  const topicsPerDay = 3;

  for (let i = 0; i < allTopics.length; i += topicsPerDay) {
    days.push({
      day: days.length + 1,
      date: new Date(Date.now() + days.length * 86400000).toDateString(),
      topics: allTopics.slice(i, i + topicsPerDay),
    });
  }

  return days;
}