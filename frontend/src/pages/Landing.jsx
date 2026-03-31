import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Shield, TrendingUp, AlertTriangle, Flame, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/[0.06] sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-600/30">
            <Zap size={14} fill="white" stroke="white" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">DisciplineOS</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="text-sm text-white/50 hover:text-white px-4 py-2 rounded-full hover:bg-white/5 transition-all"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white px-5 py-2 rounded-full font-semibold transition-all shadow-lg shadow-violet-600/25"
          >
            Start Now
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 md:py-24">

        {/* Tag */}
        <div className="inline-flex items-center gap-2 bg-violet-500/8 border border-violet-500/20 text-violet-400 text-xs px-4 py-2 rounded-full mb-8 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          No excuses. No shortcuts. No days off.
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6 max-w-3xl">
          Build discipline.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">
            Break the cycle.
          </span>
        </h1>

        <p className="text-white/45 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
          The strictest accountability system for people serious about self-discipline.
          Every missed day is recorded. Every failure costs you. No mercy.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all shadow-xl shadow-violet-600/25 w-full sm:w-auto justify-center"
          >
            Start for free <ArrowRight size={16} />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/8 border border-white/10 text-white/70 hover:text-white px-8 py-3.5 rounded-full text-sm font-medium transition-all w-full sm:w-auto justify-center"
          >
            Sign in
          </Link>
        </div>

        {/* Social proof */}
        <p className="text-white/20 text-xs mt-6">No credit card. No fluff. Just discipline.</p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-20 max-w-3xl w-full text-left">
          {[
            {
              icon: <Shield size={18} className="text-violet-400" />,
              title: 'Strict Mode',
              desc: 'Cannot edit past days. Miss a day — auto fail. No backdating, no excuses.',
            },
            {
              icon: <Zap size={18} className="text-yellow-400" />,
              title: 'Failure Cost',
              desc: '−10 discipline points every time you fail. Your streak resets to zero immediately.',
            },
            {
              icon: <TrendingUp size={18} className="text-green-400" />,
              title: 'Full Analytics',
              desc: 'Consistency %, failure heatmap, streak history. See exactly where you break.',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white/[0.025] hover:bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="mb-3 w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                {f.icon}
              </div>
              <p className="text-sm font-semibold text-white mb-1.5">{f.title}</p>
              <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Habit types */}
        <div className="mt-16 w-full max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-widest text-white/25 mb-6">What you can track</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: 'Workout', type: 'positive' },
              { label: 'Study 2h', type: 'positive' },
              { label: 'Read', type: 'positive' },
              { label: 'NoFap', type: 'negative' },
              { label: 'No Alcohol', type: 'negative' },
              { label: 'Cold Shower', type: 'positive' },
              { label: 'Meditation', type: 'positive' },
              { label: 'No Social Media', type: 'negative' },
            ].map((h) => (
              <span
                key={h.label}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border ${
                  h.type === 'positive'
                    ? 'bg-green-500/8 border-green-500/20 text-green-400'
                    : 'bg-orange-500/8 border-orange-500/20 text-orange-400'
                }`}
              >
                {h.type === 'positive'
                  ? <CheckCircle2 size={10} />
                  : <Flame size={10} />}
                {h.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <footer className="text-center py-6 text-xs text-white/15 border-t border-white/[0.04]">
        DisciplineOS — Built for the committed
      </footer>
    </div>
  );
}
