import { MOCK_SYLLABUS } from '../../data/mockData';
import { useProgress } from '../../contexts/ProgressContext';

export default function WeakTopics() {
  const { progress } = useProgress();

  const weak = [];

  MOCK_SYLLABUS.forEach(sub =>
    sub.units.forEach(unit =>
      unit.topics.forEach(t => {
        if (progress[t.id] === 'weak') {
          weak.push({ ...t, subject: sub.name, unit: unit.name });
        }
      })
    )
  );

  return (
    <div className="page">
      <h1>⚠️ Weak Topics</h1>

      {weak.length === 0 ? (
        <p>No weak topics yet 🎉</p>
      ) : (
        weak.map(t => (
          <div key={t.id} className="card">
            <h3>{t.name}</h3>
            <p>{t.subject} • {t.unit}</p>
          </div>
        ))
      )}
    </div>
  );
}