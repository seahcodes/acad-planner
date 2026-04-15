import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('Fill all fields');
      return;
    }

    // mock register
    toast.success('Account created!');
    navigate('/login');
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
          <p className="text-sm text-gray-400 mt-2">Create your account</p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Full Name"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Course (e.g. B.Tech CSE)"
            className="input-field"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn-primary w-full">Create Account</button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400">Login</Link>
        </p>
      </div>
    </div>
  );
}