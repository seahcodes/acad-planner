import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Sparkles, Target, Calendar } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative">

      {/* soft gradient bg */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full -z-10" />

      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
          <BookOpen size={20} color="white" />
        </div>
        <h1 className="text-xl font-bold">SyllabusIQ</h1>
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
        Study Smarter,
        <span className="text-indigo-500"> Not Harder</span>
      </h2>

      <p className="text-gray-400 max-w-xl mb-8">
        Track your syllabus, identify weak topics, and generate AI-powered revision plans —
        all in one place.
      </p>

      {/* CTA */}
      <div className="flex gap-4">
        <Link to="/register" className="btn-primary flex items-center gap-2">
          Get Started <ArrowRight size={16} />
        </Link>
        <Link to="/login" className="btn-secondary">
          Login
        </Link>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl w-full">
        {[
          { icon: Target, title: 'Weak Topic Detection' },
          { icon: Calendar, title: 'Revision Planner' },
          { icon: Sparkles, title: 'AI Summaries' },
        ].map(({ icon: Icon, title }) => (
          <div key={title} className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <Icon className="mb-3 text-indigo-400" />
            <p className="font-medium">{title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}