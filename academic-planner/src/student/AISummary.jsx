import { useLocation } from 'react-router-dom';

export default function AISummary() {
  const location = useLocation();
  const topic = location.state?.topic || 'Unknown Topic';

  return (
    <div className="page">
      <h1>✨ AI Summary</h1>

      <div className="card">
        <h2>{topic}</h2>

        <p>
          This is a placeholder AI summary.
          You can later connect OpenAI API here.
        </p>
      </div>
    </div>
  );
}