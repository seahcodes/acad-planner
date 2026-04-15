import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BookOpen, User, Lock, ExternalLink } from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(email, password, role);
    if (res.success) {
      toast.success('Logged in successfully!');
      navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } else {
      toast.error(res.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 selection:bg-indigo-500/30 selection:text-white relative overflow-hidden">
      {/* 3D background */}
      <ThreeBackground />

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_30px_rgba(99,102,241,0.3)] mb-4">
            <BookOpen size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 mt-2">Sign in to your SyllabusIQ account</p>
        </div>

        <form onSubmit={handleLogin} className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-5">
          {/* Role Switcher */}
          <div className="flex bg-slate-950/50 p-1.5 rounded-xl border border-white/5 mb-2">
            {['student', 'admin'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold capitalize transition-all duration-300 ${
                  role === r
                    ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">Email Address</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="email" 
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  value={email} onChange={e => setEmail(e.target.value)} 
                  required placeholder="you@demo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                <input 
                  type="password" 
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  value={password} onChange={e => setPassword(e.target.value)} 
                  required placeholder="••••••"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all mt-2 active:scale-[0.98]">
            Sign In
          </button>
          
          <div className="text-center mt-2">
            <Link to="/register" className="inline-flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors">
              Don't have an account? <ExternalLink size={14} />
            </Link>
          </div>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500 flex flex-col gap-1">
          <span>Demo Student: student@demo.com / demo123</span>
          <span>Demo Admin: admin@demo.com / demo123</span>
        </div>
      </div>
    </div>
  );
}
