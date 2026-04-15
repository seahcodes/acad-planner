import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Fill all fields');
      return;
    }

    const res = await login(email, password);

    if (res.success) {
      toast.success('Logged in!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      <div className="w-full max-w-md p-6 rounded-2xl bg-white/5 border border-white/10">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2">
            <BookOpen />
            <h1 className="text-lg font-bold">SyllabusIQ</h1>
          </div>
          <p className="text-sm text-gray-400 mt-2">Welcome back</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              placeholder="Password"
              className="input-field pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button className="btn-primary w-full">Login</button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-400">
          Don’t have an account?{' '}
          <Link to="/register" className="text-indigo-400">Register</Link>
        </p>
      </div>
    </div>
  );
}