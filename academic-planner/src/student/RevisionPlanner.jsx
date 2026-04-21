import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MOCK_SYLLABUS, MOCK_EXAMS } from '../data/mockData';
import { useProgress } from '../contexts/ProgressContext';
import { Calendar, Flame, TrendingUp, CheckCircle2, Clock, Sparkles, Loader2, AlertCircle, BookOpen, Target } from 'lucide-react';

const apiKey = "AIzaSyANkioAqNXPdaQLUKjid4yuWh8818lIPkQ";
const genAI = new GoogleGenAI({ apiKey: apiKey });

const subjectColors = {
  'Data Structures': { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-500' },
  'Operating Systems': { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', dot: 'bg-purple-500' },
  'Theory of Computation': { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', dot: 'bg-pink-500' },
  'Computer Networks': { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  'Data Science': { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-500' },
};

const strengthConfig = {
  weak: { label: 'Needs Focus', icon: Flame, priority: 1 },
  moderate: { label: 'Revise', icon: TrendingUp, priority: 2 },
  strong: { label: 'Quick Review', icon: CheckCircle2, priority: 3 },
};

export default function RevisionPlanner() {
  const { progress } = useProgress();
  const [aiPlan, setAiPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Collect weak topics and exams
  const getRevisionData = () => {
    const weakTopics = [];
    const allTopics = [];

    MOCK_SYLLABUS.forEach(sub =>
      sub.units.forEach(unit =>
        unit.topics.forEach(t => {
          const strength = progress[t.id];
          allTopics.push({ ...t, strength, subject: sub.name, unit: unit.name });
          if (strength === 'weak') {
            weakTopics.push({ ...t, subject: sub.name, unit: unit.name });
          }
        })
      )
    );

    // Calculate days until each exam
    const today = new Date();
    const examsWithDays = MOCK_EXAMS.map(exam => {
      const examDate = new Date(exam.date);
      const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
      return { ...exam, daysLeft };
    });

    return { weakTopics, allTopics, exams: examsWithDays };
  };

  // Generate AI revision plan
  const generateAIPlan = async () => {
    const { weakTopics, exams } = getRevisionData();

    if (weakTopics.length === 0) {
      setError('No weak topics found. Mark topics as weak to generate a plan.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const prompt = `You are an expert academic revision planner. A student needs to revise these weak topics before their exams.

WEAK TOPICS TO COVER:
${weakTopics.map((t, i) => `${i + 1}. ${t.name} (${t.subject} - ${t.unit})`).join('\n')}

UPCOMING EXAMS:
${exams.filter(e => e.daysLeft > 0).map(e => `- ${e.subjectName}: ${e.daysLeft} days away (${e.date})`).join('\n')}

TOTAL WEAK TOPICS: ${weakTopics.length}
TOTAL DAYS AVAILABLE: ${Math.min(...exams.filter(e => e.daysLeft > 0).map(e => e.daysLeft)) || 7}

Create a detailed, day-by-day revision schedule. Format the response as JSON with this structure:
{
  "overview": "2-3 sentence summary of the revision strategy",
  "totalDays": <number>,
  "dailySchedule": [
    {
      "day": <number>,
      "date": "<date>",
      "topics": [
        {
          "name": "<topic name>",
          "subject": "<subject>",
          "timeInMinutes": <number>,
          "reviewPoints": [<key points to focus on>],
          "practiceType": "<problems/theory/mixed>"
        }
      ],
      "totalMinutes": <number>,
      "focusArea": "<brief note on what this day focuses>"
    }
  ],
  "tips": [<3-4 study tips specific to these topics>],
  "examPrep": {
    "mockTestDays": [<days recommended for mock tests>],
    "revisionTechniques": [<3-4 specific techniques to use>],
    "criticalTopics": [<most important topics to prioritize>]
  }
}

Be strategic: prioritize weak topics, distribute work across days, ensure all weak topics are covered, and leave buffer days for reviews and practice.`;

      const result = await genAI.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      const responseText = result.text;

      // Parse JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse AI response');
      }

      const parsedPlan = JSON.parse(jsonMatch[0]);
      setAiPlan(parsedPlan);
    } catch (err) {
      console.error('Error generating plan:', err);
      setError(`Failed to generate plan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateAIPlan();
  }, [progress]);

  const { weakTopics } = getRevisionData();

  // Empty state
  if (weakTopics.length === 0) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-16 text-center backdrop-blur-xl">
          <Calendar size={48} className="text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">No Weak Topics</h2>
          <p className="text-slate-400">Mark topics as weak in the Syllabus view to generate an AI-powered revision plan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-[2.5rem] p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <Sparkles size={22} className="text-indigo-400" />
          </div>
          <h1 className="text-3xl font-black text-white">AI-Powered Revision Plan</h1>
        </div>
        <p className="text-slate-400 text-sm mt-2">{weakTopics.length} weak topics • Exam-focused strategy</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-12 backdrop-blur-xl text-center">
          <Loader2 size={48} className="text-indigo-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-bold text-white mb-2">Generating Your Revision Plan</h3>
          <p className="text-slate-400">Our AI is analyzing your weak topics and exam schedule...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-[2.5rem] p-6 backdrop-blur-xl flex gap-4">
          <AlertCircle size={24} className="text-rose-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-white font-bold mb-1">Plan Generation Error</h3>
            <p className="text-rose-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* AI Plan Display */}
      {aiPlan && !loading && (
        <>
          {/* Overview Section */}
          <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <Target size={24} className="text-indigo-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-white font-bold text-lg mb-2">Strategy Overview</h2>
                <p className="text-slate-300 leading-relaxed">{aiPlan.overview}</p>
              </div>
            </div>
          </div>

          {/* Daily Schedule Timeline */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Calendar size={20} className="text-indigo-400" />
              Daily Revision Schedule
            </h2>

            <div className="space-y-3">
              {aiPlan.dailySchedule?.map((day, dayIndex) => (
                <div key={dayIndex} className="bg-slate-900/30 border border-white/5 rounded-[1.5rem] p-6 backdrop-blur-sm hover:border-indigo-500/20 transition-all duration-300">
                  {/* Day Header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                      <span className="text-lg font-black text-indigo-300">Day {day.day}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{day.focusArea}</p>
                      <p className="text-slate-400 text-sm">{day.totalMinutes} minutes • {day.topics.length} topic(s)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-xs">Date</p>
                      <p className="text-white font-bold text-sm">{day.date}</p>
                    </div>
                  </div>

                  {/* Topics for the day */}
                  <div className="space-y-3 ml-18">
                    {day.topics?.map((topic, topicIndex) => {
                      const subjectColor = subjectColors[topic.subject] || subjectColors['Data Structures'];
                      return (
                        <div
                          key={topicIndex}
                          className={`border-l-4 ${subjectColor.border} ${subjectColor.bg} rounded-lg p-4 backdrop-blur-sm transition-all hover:shadow-lg`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className={`font-semibold ${subjectColor.text} mb-1`}>{topic.name}</p>
                              <p className="text-slate-500 text-xs">{topic.subject}</p>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-xs flex-shrink-0 ml-4">
                              <Clock size={12} />
                              <span>{topic.timeInMinutes} min</span>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-white/5">
                            <p className="text-slate-400 text-xs font-semibold uppercase mb-2">Key Focus Points:</p>
                            <ul className="space-y-1">
                              {topic.reviewPoints?.map((point, pIdx) => (
                                <li key={pIdx} className="text-slate-300 text-xs flex gap-2">
                                  <span className="text-indigo-400 flex-shrink-0">•</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase ${subjectColor.bg} ${subjectColor.text}`}>
                              {topic.practiceType}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips and Techniques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Study Tips */}
            <div className="bg-slate-900/30 border border-white/5 rounded-[1.5rem] p-6 backdrop-blur-sm">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Flame size={18} className="text-rose-400" />
                Study Tips
              </h3>
              <ul className="space-y-3">
                {aiPlan.tips?.map((tip, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-indigo-400 font-bold text-lg flex-shrink-0">{idx + 1}</span>
                    <span className="text-slate-300 text-sm leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exam Prep Strategy */}
            <div className="bg-slate-900/30 border border-white/5 rounded-[1.5rem] p-6 backdrop-blur-sm">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Target size={18} className="text-emerald-400" />
                Exam Preparation
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-xs uppercase font-bold mb-2">Mock Test Days</p>
                  <div className="flex gap-2 flex-wrap">
                    {aiPlan.examPrep?.mockTestDays?.map((day, idx) => (
                      <span key={idx} className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-lg text-sm font-semibold">
                        Day {day}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase font-bold mb-2">Critical Topics</p>
                  <div className="space-y-1">
                    {aiPlan.examPrep?.criticalTopics?.map((topic, idx) => (
                      <p key={idx} className="text-slate-300 text-sm flex gap-2">
                        <span className="text-rose-400">★</span>
                        <span>{topic}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tips */}
          <div className="bg-slate-900/30 border border-white/5 rounded-[1.5rem] p-6 backdrop-blur-sm">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-amber-400" />
              Recommended Techniques
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiPlan.examPrep?.revisionTechniques?.map((technique, idx) => (
                <div key={idx} className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                  <p className="text-amber-300 font-semibold text-sm">{technique}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}