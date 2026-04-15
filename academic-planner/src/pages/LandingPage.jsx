import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Sparkles, Target, Calendar, ChevronRight } from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden bg-transparent selection:bg-indigo-500/30 selection:text-white">
      {/* High-end interactive WebGL Canvas */}
      <ThreeBackground />

      {/* Navbar/Header area */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 mix-blend-screen mix-blend-plus-lighter">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
            <BookOpen size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
            SyllabusIQ
          </h1>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2 text-sm font-bold text-white hover:text-indigo-300 transition-colors bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md border border-white/10">
            Sign In
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto z-10 animate-in fade-in slide-in-from-bottom-12 duration-[1500ms]">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/40 border border-indigo-500/30 text-indigo-300 text-sm font-semibold mb-8 backdrop-blur-xl shadow-lg">
          <Sparkles size={16} className="text-indigo-400" />
          <span>The smarter way to conquer your academic goals</span>
        </div>
        
        <h2 className="text-6xl md:text-8xl font-black mb-6 leading-[1] tracking-tighter text-white drop-shadow-2xl">
          Study Smarter,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Not Harder
          </span>
        </h2>

        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium backdrop-blur-sm drop-shadow-md">
          Track your syllabus, instantly identify weak topics, and let AI generate personalized revision plans to keep you ahead of the curve.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link to="/register" className="group relative flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.4)] overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]" />
            Start Planning Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login" className="group flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg text-white bg-slate-900/50 border border-white/20 hover:bg-white/10 transition-all backdrop-blur-xl shadow-xl">
            Existing User <ChevronRight size={20} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Feature Highlights Grid - Floating Glass panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full z-10 animate-in fade-in slide-in-from-bottom-8 duration-[2000ms]">
        {[
          { icon: Target, title: 'Weak Topic Detection', desc: 'Automatically pinpoint the subjects holding you back.', color: 'indigo' },
          { icon: Calendar, title: 'AI Revision Planner', desc: 'Generate custom schedules optimized for your exams.', color: 'purple' },
          { icon: Sparkles, title: 'Smart Summaries', desc: 'Get bite-sized AI summaries of complex curriculum topics.', color: 'pink' },
        ].map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="p-8 rounded-[2rem] bg-slate-900/20 backdrop-blur-2xl border border-white/10 hover:border-white/30 hover:-translate-y-3 hover:bg-slate-900/40 transition-all duration-500 group shadow-2xl text-left">
            <div className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center bg-${color}-500/20 text-${color}-400 border border-${color}-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-[0_0_30px_rgba(currentColor,0.5)]`}>
              <Icon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
            <p className="text-slate-400/90 leading-relaxed font-medium">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
