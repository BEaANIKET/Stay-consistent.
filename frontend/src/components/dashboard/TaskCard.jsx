import { CheckCircle2, XCircle, Flame, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const STATUS = {
  done:    { card: 'bg-success-muted border-success-border', bar: 'bg-success' },
  failed:  { card: 'bg-danger-muted  border-danger-border',  bar: 'bg-danger'  },
  pending: { card: 'bg-surface       border-border',          bar: null         },
};

export default function TaskCard({ taskLog, onMark, marking }) {
  const task = taskLog.taskId;
  if (!task) return null;

  const status    = taskLog.status;
  const isPending = status === 'pending';
  const isDone    = status === 'done';
  const isFailed  = status === 'failed';
  const isMarking = marking === task._id;

  const style      = STATUS[status] ?? STATUS.pending;
  const pendingBar = task.type === 'positive' ? 'bg-info' : 'bg-accent';

  return (
    <div className={cn(
      'group relative rounded-2xl border px-4 py-3.5 transition-all duration-200 animate-scale-in',
      style.card,
      isPending && 'hover:border-border-subtle hover:bg-surface-hover',
    )}>
      {/* Left accent bar */}
      <div className={cn(
        'absolute left-0 top-3 bottom-3 w-0.75 rounded-r-full',
        style.bar ?? pendingBar,
        (isDone || isFailed) ? 'opacity-60' : 'opacity-40',
      )} />

      <div className="pl-3.5 flex items-center justify-between gap-3">

        {/* ── Left: task info ── */}
        <div className="flex-1 min-w-0">
          {/* Title + badges */}
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <p className={cn(
              'text-sm font-semibold leading-snug',
              isDone ? 'text-text-muted line-through' : 'text-text-primary',
            )}>
              {task.title}
            </p>
            <Badge variant={task.type === 'positive' ? 'positive' : 'negative'}>
              {task.type}
            </Badge>
            {task.required && <Badge variant="danger">required</Badge>}
          </div>

          {/* Streak meta */}
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Flame size={10} className="text-accent-text" />
              <span className="text-text-secondary font-medium tabular-nums">{task.currentStreak}</span>
              <span>streak</span>
            </span>
            <span className="flex items-center gap-1">
              <Trophy size={10} className="text-warning-text opacity-60" />
              <span className="tabular-nums">{task.longestStreak}</span>
              <span>best</span>
            </span>
            {task.type === 'negative' && task.relapseCount > 0 && (
              <span className="text-danger-text opacity-70">
                {task.relapseCount} relapse{task.relapseCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* ── Right: actions / status ── */}
        {isPending && (
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              size="sm"
              variant="success"
              onClick={() => onMark(task._id, 'done')}
              disabled={isMarking}
            >
              <CheckCircle2 size={12} />
              <span className="hidden sm:inline">Done</span>
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onMark(task._id, 'failed')}
              disabled={isMarking}
            >
              <XCircle size={12} />
              <span className="hidden sm:inline">Miss</span>
            </Button>
          </div>
        )}

        {isDone && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-success-text shrink-0">
            <CheckCircle2 size={14} />
            <span className="hidden sm:inline">Done</span>
          </div>
        )}

        {isFailed && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-danger-text shrink-0">
            <XCircle size={14} />
            <span className="hidden sm:inline">Missed</span>
          </div>
        )}
      </div>
    </div>
  );
}
