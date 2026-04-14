import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodayLog, markTask } from '@/api/dailyLog';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { toast } from '@/components/ui/Toast';
import useAuthStore from '@/store/authStore';
import { Clock, Shield } from 'lucide-react';
import MotivationalBanner from '@/components/dashboard/MotivationalBanner';
import StatsRow from '@/components/dashboard/StatsRow';
import FailureWarning from '@/components/dashboard/FailureWarning';
import TaskCard from '@/components/dashboard/TaskCard';
import StreakGrid from '@/components/dashboard/StreakGrid';

const DAY_STATUS_BADGE = {
  completed: { variant: 'success', label: 'All Complete' },
  failed:    { variant: 'danger',  label: 'Day Failed'   },
  partial:   { variant: 'warning', label: 'Partial'      },
  pending:   { variant: 'neutral', label: 'In Progress'  },
};

function TaskListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-17 rounded-2xl skeleton border border-border" />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user, updateUser } = useAuthStore();
  const queryClient          = useQueryClient();
  const [markingId, setMarkingId] = useState(null);

  const { data: log, isLoading } = useQuery({
    queryKey: ['todayLog'],
    queryFn:  () => getTodayLog().then((r) => r.data.log),
    refetchInterval: 60000,
  });

  const { mutate: mark } = useMutation({
    mutationFn: ({ taskId, status }) => markTask({ taskId, status }),
    onMutate:   ({ taskId }) => setMarkingId(taskId),
    onSettled:  () => setMarkingId(null),
    onSuccess:  (res) => {
      const { message, scoreChange } = res.data;
      toast(message, scoreChange < 0 ? 'error' : 'success');
      queryClient.invalidateQueries({ queryKey: ['todayLog'] });
      if (user) updateUser({ ...user, disciplineScore: (user.disciplineScore || 100) + scoreChange });
    },
    onError: (err) => toast(err.response?.data?.message || 'Failed to mark task', 'error'),
  });

  const tasks         = log?.tasks || [];
  const pending       = tasks.filter(t => t.status === 'pending').length;
  const done          = tasks.filter(t => t.status === 'done').length;
  const failed        = tasks.filter(t => t.status === 'failed').length;
  const total         = tasks.length;
  const completionPct = total > 0 ? Math.round((done / total) * 100) : 0;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  const score      = user?.disciplineScore ?? 100;
  const scoreColor = score >= 100 ? 'text-success-text'
                   : score >= 50  ? 'text-warning-text'
                   : 'text-danger-text';

  const dayBadge = log?.dayStatus ? DAY_STATUS_BADGE[log.dayStatus] : null;

  return (
    <div className="space-y-7 animate-fade-up">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-1">
            {today}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
            Dashboard
          </h1>
          <p className="text-sm text-text-muted mt-1">Stay consistent. Every day counts.</p>
        </div>
        {dayBadge && (
          <Badge variant={dayBadge.variant} className="mt-1.5 shrink-0 px-3 py-1 text-[11px]">
            {dayBadge.label}
          </Badge>
        )}
      </div>

      {/* ── Motivational banner + insight ── */}
      <MotivationalBanner log={log} />

      {/* ── Stats ── */}
      <StatsRow
        score={score}
        scoreColor={scoreColor}
        completionPct={completionPct}
        done={done}
        total={total}
        pending={pending}
        failed={failed}
      />

      {/* ── Failure warning ── */}
      <FailureWarning failed={failed} />

      {/* ── Task list ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
            Today's Tasks
          </h2>
          {pending > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Clock size={11} />
              <span>{pending} remaining</span>
            </div>
          )}
        </div>

        {isLoading ? (
          <TaskListSkeleton />
        ) : tasks.length === 0 ? (
          <Card className="text-center py-14">
            <div className="w-11 h-11 bg-surface-raised border border-border rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield size={20} className="text-text-faint" />
            </div>
            <p className="text-sm font-medium text-text-muted">No tasks yet</p>
            <p className="text-xs text-text-faint mt-1">
              Add tasks from the Tasks page to start tracking.
            </p>
          </Card>
        ) : (
          <div className="flex flex-col gap-2 stagger">
            {tasks.map((taskLog) => (
              <TaskCard
                key={taskLog._id}
                taskLog={taskLog}
                marking={markingId}
                onMark={(taskId, status) => mark({ taskId, status })}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Streak grid ── */}
      <StreakGrid tasks={tasks} />
    </div>
  );
}
