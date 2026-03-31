import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '@/api/auth';
import useAuthStore from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      setAuth(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-600/30 mb-4">
            <Zap size={18} fill="white" stroke="white" />
          </div>
          <h1 className="text-xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-white/35 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
          {error && (
            <div className="flex items-start gap-2.5 bg-red-500/8 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl mb-5">
              <span className="shrink-0 mt-0.5">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-widest text-white/40">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.05] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-1" size="lg">
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </div>

        <p className="text-xs text-white/30 text-center mt-5">
          No account?{' '}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
