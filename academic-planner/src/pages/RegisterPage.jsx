import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, BookOpen, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import ThreeBackground from '../components/ThreeBackground';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password) {
      toast.error('Fill all fields');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 500);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      {/* 3D background */}
      <ThreeBackground />

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8">
          <img src="/Favicon-logo.png" alt="SyllabusIQ" className="h-16 w-16 p-1 mb-4" />
          <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
          <p className="text-slate-400 mt-2">Join SyllabusIQ today</p>
        </div>

        <form onSubmit={handleRegister} className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-5">
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">Full Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Course */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">Course</label>
              <div className="relative group">
                <BookOpen size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  placeholder="B.Tech CSE"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all mt-2 active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900/60 text-slate-400">Already have an account?</span>
            </div>
          </div>

          <Link
            to="/login"
            className="w-full py-3.5 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all text-center"
          >
            Sign In
          </Link>
        </form>
      </div>
    </div>
  );
}