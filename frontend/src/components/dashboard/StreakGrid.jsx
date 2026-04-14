import { Flame, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

function StreakCard({ taskLog }) {
  const t = taskLog.taskId;
  if (!t) return null;

  const isActive = t.currentStreak > 0;
  const isHot    = t.currentStreak >= 7;
  const isPB     = t.currentStreak > 0 && t.currentStreak === t.longestStreak;

  return (
    <div className={cn(
      'rounded-2xl border p-4 flex flex-col gap-2.5 transition-all duration-200',
      'bg-surface border-border hover:border-border-subtle hover:bg-surface-hover',
      isHot && 'pulse-streak',
    )}>
      {/* Task name */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-text-secondary leading-snug truncate flex-1">
          {t.title}
        </p>
        {isPB && (
          <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wider text-warning-text bg-warning-muted border border-warning-border px-1.5 py-0.5 rounded">
            PB
          </span>
        )}
      </div>

      {/* Streak value */}
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <Flame
            size={14}
            className={cn(
              'mb-0.5',
              isHot ? 'text-accent-text' : isActive ? 'text-accent-text opacity-60' : 'text-text-faint',
            )}
          />
          <span className={cn(
            'text-2xl font-bold tracking-tight tabular-nums',
            isHot ? 'text-text-primary' : isActive ? 'text-text-secondary' : 'text-text-muted',
          )}>
            {t.currentStreak}
          </span>
          <span className="text-xs text-text-muted mb-0.5">days</span>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-text-muted">
          <Trophy size={9} className="text-warning-text opacity-50" />
          <span className="tabular-nums">{t.longestStreak}</span>
        </div>
      </div>

      {/* Progress bar: current vs best */}
      {t.longestStreak > 0 && (
        <div className="h-0.5 bg-border rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700',
              isHot ? 'bg-accent' : 'bg-brand opacity-50',
            )}
            style={{ width: `${Math.min(100, (t.currentStreak / t.longestStreak) * 100)}%` }}
          />
        </div>
      )}

      {/* Relapse count for negative tasks */}
      {t.type === 'negative' && t.relapseCount > 0 && (
        <p className="text-[10px] text-danger-text opacity-70">
          {t.relapseCount} relapse{t.relapseCount > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

export default function StreakGrid({ tasks }) {
  if (tasks.length === 0) return null;

  return (
    <div>
      <h2 className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-3">
        Streak Tracker
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 stagger">
        {tasks.map((taskLog) => (
          <StreakCard key={taskLog._id} taskLog={taskLog} />
        ))}
      </div>
    </div>
  );
}
