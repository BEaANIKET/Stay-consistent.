import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodayLog, markTask } from '@/api/dailyLog';
import { Card, CardTitle, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { toast } from '@/components/ui/Toast';
import useAuthStore from '@/store/authStore';
import {
  CheckCircle2, XCircle, Clock, Flame,
  Shield, AlertTriangle, Zap, Trophy, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

function TaskCard({ taskLog, onMark, marking }) {
  const task = taskLog.taskId;
  if (!task) return null;

  const status = taskLog.status;
  const isPending = status === 'pending';
  const isDone = status === 'done';
  const isFailed = status === 'failed';
  const isMarking = marking === task._id;

  return (
    <div className={cn(
      'relative rounded-2xl border p-4 md:p-5 transition-all duration-300 animate-scale-in',
      isDone  && 'bg-green-500/[0.04] border-green-500/20',
      isFailed && 'bg-red-500/[0.04] border-red-500/20',
      isPending && 'bg-[#111] border-white/[0.07] hover:border-white/15',
    )}>
      {/* Left accent bar */}
      <div className={cn(
        'absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full',
        isDone   && 'bg-green-500',
        isFailed && 'bg-red-500',
        isPending && (task.type === 'positive' ? 'bg-blue-500/60' : 'bg-orange-500/60'),
      )} />

      <div className="pl-3 flex items-center justify-between gap-3">
        {/* Left: info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <p className={cn(
              'text-sm font-semibold',
              isDone ? 'text-white/70 line-through' : 'text-white'
            )}>
              {task.title}
            </p>
            <Badge variant={task.type === 'positive' ? 'positive' : 'negative'}>
              {task.type}
            </Badge>
            {task.required && <Badge variant="danger">required</Badge>}
          </div>
          <div className="flex items-center gap-3 text-xs text-white/30">
            <span className="flex items-center gap-1">
              <Flame size={10} className="text-orange-400" />
              <span className="text-white/50 font-medium">{task.currentStreak}</span> streak
            </span>
            <span className="flex items-center gap-1">
              <Trophy size={10} className="text-yellow-500/60" />
              {task.longestStreak} best
            </span>
            {task.type === 'negative' && task.relapseCount > 0 && (
              <span className="text-red-500/60">{task.relapseCount} relapses</span>
            )}
          </div>
        </div>

        {/* Right: actions or status */}
        {isPending && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="success"
              onClick={() => onMark(task._id, 'done')}
              disabled={isMarking}
              className="active:scale-90"
            >
              <CheckCircle2 size={13} />
              <span className="hidden sm:inline">Done</span>
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onMark(task._id, 'failed')}
              disabled={isMarking}
              className="active:scale-90"
            >
              <XCircle size={13} />
              <span className="hidden sm:inline">Fail</span>
            </Button>
          </div>
        )}

        {isDone && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-green-400 shrink-0">
            <CheckCircle2 size={15} />
            <span className="hidden sm:inline">Done</span>
          </div>
        )}

        {isFailed && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-red-400 shrink-0">
            <XCircle size={15} />
            <span className="hidden sm:inline">Failed</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [markingId, setMarkingId] = useState(null);

  const { data: log, isLoading } = useQuery({
    queryKey: ['todayLog'],
    queryFn: () => getTodayLog().then((r) => r.data.log),
    refetchInterval: 60000,
  });

  const { mutate: mark } = useMutation({
    mutationFn: ({ taskId, status }) => markTask({ taskId, status }),
    onMutate: ({ taskId }) => setMarkingId(taskId),
    onSettled: () => setMarkingId(null),
    onSuccess: (res) => {
      const msg = res.data.message;
      const scoreChange = res.data.scoreChange;
      toast(msg, scoreChange < 0 ? 'error' : 'success');
      queryClient.invalidateQueries({ queryKey: ['todayLog'] });
      if (user) updateUser({ ...user, disciplineScore: (user.disciplineScore || 100) + scoreChange });
    },
    onError: (err) => toast(err.response?.data?.message || 'Failed to mark task', 'error'),
  });

  const tasks = log?.tasks || [];
  const pending  = tasks.filter((t) => t.status === 'pending').length;
  const done     = tasks.filter((t) => t.status === 'done').length;
  const failed   = tasks.filter((t) => t.status === 'failed').length;
  const total    = tasks.length;
  const completionPct = total > 0 ? Math.round((done / total) * 100) : 0;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  const score = user?.disciplineScore ?? 100;
  const scoreColor = score >= 100 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-white/25 mb-1 tracking-widest uppercase">{today}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-white/35 mt-1">Stay consistent. Every day counts.</p>
        </div>
        {log?.dayStatus && (
          <div className="shrink-0 mt-1">
            {log.dayStatus === 'completed' && <Badge variant="success" className="text-xs px-3 py-1">All Complete</Badge>}
            {log.dayStatus === 'failed'    && <Badge variant="danger"  className="text-xs px-3 py-1">Day Failed</Badge>}
            {log.dayStatus === 'partial'   && <Badge variant="warning" className="text-xs px-3 py-1">Partial</Badge>}
            {log.dayStatus === 'pending'   && <Badge variant="neutral" className="text-xs px-3 py-1">In Progress</Badge>}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Discipline Score"
          value={score}
          sub="discipline points"
          valueClass={scoreColor}
          icon={<Zap size={16} />}
        />
        <StatCard
          title="Today's Progress"
          value={`${completionPct}%`}
          sub={`${done} of ${total} tasks done`}
          valueClass={completionPct === 100 ? 'text-green-400' : completionPct > 0 ? 'text-yellow-400' : 'text-white'}
        />
        <StatCard
          title="Pending"
          value={pending}
          sub={pending > 0 ? "tasks remaining" : "all marked"}
          valueClass={pending > 0 ? 'text-yellow-400' : 'text-white/30'}
        />
        <StatCard
          title="Failed Today"
          value={failed}
          sub={failed > 0 ? `−${failed * 10} points` : "clean so far"}
          valueClass={failed > 0 ? 'text-red-400' : 'text-white/30'}
        />
      </div>

      {/* Failure warning */}
      {failed > 0 && (
        <div className="flex items-start gap-3 bg-red-500/[0.07] border border-red-500/25 rounded-2xl p-4 pulse-red">
          <div className="w-8 h-8 bg-red-500/15 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-400">You broke your discipline.</p>
            <p className="text-xs text-red-500/70 mt-0.5">
              {failed} task{failed > 1 ? 's' : ''} failed today — −{failed * 10} discipline points deducted.
              Get back on track.
            </p>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
            Today's Tasks
          </h2>
          {pending > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <Clock size={12} />
              {pending} remaining
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1,2,3].map(i => (
              <div key={i} className="h-20 bg-white/[0.02] rounded-2xl border border-white/[0.04] animate-pulse" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <Card className="text-center py-14">
            <div className="w-12 h-12 bg-white/[0.03] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield size={22} className="text-white/20" />
            </div>
            <p className="text-sm text-white/30 font-medium">No tasks yet</p>
            <p className="text-xs text-white/15 mt-1">Add tasks from the Tasks page to start tracking.</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-2.5">
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

      {/* Streak grid */}
      {tasks.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-3">
            Streak Tracker
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {tasks.map((taskLog) => {
              const t = taskLog.taskId;
              if (!t) return null;
              return (
                <div
                  key={taskLog._id}
                  className="bg-[#111] border border-white/[0.06] rounded-2xl p-3.5 hover:border-white/12 transition-all"
                >
                  <p className="text-xs text-white/40 truncate mb-2">{t.title}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        <Flame size={13} className="text-orange-400" />
                        <span className="text-lg font-bold text-white">{t.currentStreak}</span>
                      </div>
                      <p className="text-[10px] text-white/25 mt-0.5">best: {t.longestStreak}</p>
                    </div>
                    {t.type === 'negative' && (
                      <p className="text-[10px] text-red-500/60">{t.relapseCount} relapses</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
