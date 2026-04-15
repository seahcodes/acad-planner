import { MOCK_SYLLABUS } from '../../data/mockData';
import { useProgress } from '../../contexts/ProgressContext';

export default function RevisionPlanner() {
  const { progress } = useProgress();

  const topics = [];

  MOCK_SYLLABUS.forEach(sub =>
    sub.units.forEach(unit =>
      unit.topics.forEach(t => {
        const strength = progress[t.id];
        if (strength) {
          topics.push({ ...t, strength });
        }
      })
    )
  );

  const sorted = [
    ...topics.filter(t => t.strength === 'weak'),
    ...topics.filter(t => t.strength === 'moderate'),
    ...topics.filter(t => t.strength === 'strong'),
  ];

  return (
    <div className="page">
      <h1>📅 Revision Plan</h1>

      {sorted.map((t, i) => (
        <div key={t.id} className="card">
          <h3>Day {i + 1}</h3>
          <p>{t.name}</p>
          <small>{t.strength}</small>
        </div>
      ))}
    </div>
  );
}