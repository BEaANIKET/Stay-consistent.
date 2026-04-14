import { useState, useEffect } from 'react';
import { Flame, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const QUOTES = [
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The successful person has the habit of doing the things failures don't like to do.", author: "E.M. Gray" },
  { text: "It's not about having time, it's about making time.", author: null },
  { text: "Small disciplines repeated with consistency lead to great achievements.", author: "John Maxwell" },
  { text: "One day at a time. One task at a time. Just keep going.", author: null },
  { text: "You will never always be motivated. You have to learn to be disciplined.", author: null },
  { text: "The pain of discipline is nothing compared to the pain of regret.", author: null },
];

function buildInsight({ log }) {
  if (!log) return null;

  const tasks      = log.tasks || [];
  const failed     = tasks.filter(t => t.status === 'failed');
  const done       = tasks.filter(t => t.status === 'done');
  const pending    = tasks.filter(t => t.status === 'pending');
  const total      = tasks.length;
  const bestStreak = tasks.reduce((m, t) => Math.max(m, t.taskId?.currentStreak ?? 0), 0);

  if (failed.length > 0) {
    const name = failed[0]?.taskId?.title;
    return {
      type: 'danger',
      icon: <AlertTriangle size={12} />,
      text: failed.length === 1 && name
        ? `You missed "${name}" today — don't let it slide.`
        : `${failed.length} tasks failed today. Reset and finish strong.`,
    };
  }

  if (bestStreak >= 7) {
    return {
      type: 'streak',
      icon: <Flame size={12} />,
      text: `${bestStreak}-day streak active — you're building something real.`,
    };
  }

  if (total > 0 && pending.length === 0) {
    return {
      type: 'success',
      icon: <CheckCircle2 size={12} />,
      text: `All ${done.length} tasks marked. Solid day.`,
    };
  }

  if (bestStreak >= 2) {
    return {
      type: 'streak',
      icon: <Flame size={12} />,
      text: `${bestStreak}-day streak — momentum is building. Keep going.`,
    };
  }

  if (pending.length > 0) {
    return {
      type: 'neutral',
      icon: <TrendingUp size={12} />,
      text: `${pending.length} task${pending.length > 1 ? 's' : ''} still open. Finish what you started.`,
    };
  }

  return null;
}

const INSIGHT_CLS = {
  danger:  'bg-danger-muted  border-danger-border  text-danger-text',
  success: 'bg-success-muted border-success-border text-success-text',
  streak:  'bg-accent-muted  border-accent-border  text-accent-text',
  neutral: 'bg-surface-raised border-border        text-text-secondary',
};

export default function MotivationalBanner({ log }) {
  const [quoteIdx, setQuoteIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [visible,  setVisible]  = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setQuoteIdx(i => (i + 1) % QUOTES.length);
        setVisible(true);
      }, 300);
    }, 12000);
    return () => clearInterval(id);
  }, []);

  const quote   = QUOTES[quoteIdx];
  const insight = buildInsight({ log });

  return (
    <div className="flex flex-col gap-2.5">

      {/* Quote card */}
      <div className="relative rounded-2xl border border-border bg-surface-raised overflow-hidden px-5 py-4">
        {/* Subtle brand glow top-right */}
        <div className="pointer-events-none absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-[0.05] bg-brand blur-2xl" />

        <div
          style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? 'translateY(0)' : 'translateY(-5px)',
            transition: 'opacity 0.28s ease, transform 0.28s ease',
          }}
        >
          <p className="text-sm font-medium leading-relaxed text-text-secondary italic">
            "{quote.text}"
          </p>
          {quote.author && (
            <p className="mt-1.5 text-[11px] text-text-muted not-italic">
              — {quote.author}
            </p>
          )}
        </div>
      </div>

      {/* Insight pill — only renders when there's something to say */}
      {insight && (
        <div className={cn(
          'inline-flex items-center gap-2 self-start px-3.5 py-2 rounded-xl border text-xs font-medium leading-snug',
          INSIGHT_CLS[insight.type],
        )}>
          {insight.icon}
          <span>{insight.text}</span>
        </div>
      )}
    </div>
  );
}
