import { useQuery } from '@tanstack/react-query';
import { getWeeklyReport } from '@/api/reports';
import { getTasks } from '@/api/tasks';
import { Card, CardTitle, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import useAuthStore from '@/store/authStore';
import { Flame, Trophy, Zap, Calendar, LogOut, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

function ScoreBar({ score }) {
  const pct = Math.min(100, Math.max(0, (score / 200) * 100));
  const color = score >= 100 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

export default function Profile() {
  const { user, logout } = useAuthStore();

  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks().then((r) => r.data.tasks),
  });

  const { data: weeklyData } = useQuery({
    queryKey: ['weekly'],
    queryFn: () => getWeeklyReport().then((r) => r.data),
  });

  const allTasks = tasks || [];
  const maxStreak    = allTasks.reduce((m, t) => Math.max(m, t.currentStreak), 0);
  const longestEver  = allTasks.reduce((m, t) => Math.max(m, t.longestStreak), 0);
  const totalRelapses = allTasks.filter(t => t.type === 'negative').reduce((s, t) => s + t.relapseCount, 0);

  const score = user?.disciplineScore ?? 100;
  const scoreLabel = score >= 150 ? 'Elite' : score >= 100 ? 'Disciplined' : score >= 50 ? 'Struggling' : 'Broken';
  const scoreBadge  = score >= 100 ? 'success' : score >= 50 ? 'warning' : 'danger';
  const scoreColor  = score >= 100 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  const consistency = weeklyData?.overallConsistency ?? 0;
  const failureRate  = weeklyData?.failureRate ?? 0;

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Profile</h1>
        <p className="text-sm text-white/35 mt-1">Your discipline record</p>
      </div>

      {/* Identity card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar with ring */}
          <div className="relative shrink-0">
            <div className={cn(
              'absolute inset-[-4px] rounded-2xl opacity-40',
              score >= 100 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            )} style={{ filter: 'blur(8px)' }} />
            <div className="relative w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-2xl font-bold text-white">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white">{user?.name}</h2>
              <Badge variant={scoreBadge}>{scoreLabel}</Badge>
            </div>
            <p className="text-sm text-white/35">{user?.email}</p>
            <div className="flex items-center gap-1.5 text-xs text-white/25">
              <Calendar size={11} /> Member since {memberSince}
            </div>
          </div>

          {/* Score */}
          <div className="sm:text-right w-full sm:w-auto shrink-0">
            <p className={cn('text-3xl font-bold tracking-tight', scoreColor)}>{score}</p>
            <p className="text-xs text-white/30 mt-0.5">discipline points</p>
            <div className="mt-2 w-full sm:w-28">
              <ScoreBar score={score} />
            </div>
          </div>
        </div>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          title="Current Best Streak"
          value={`${maxStreak}d`}
          sub="across all tasks"
          valueClass="text-orange-400"
          icon={<Flame size={16} />}
        />
        <StatCard
          title="Longest Streak Ever"
          value={`${longestEver}d`}
          sub="personal record"
          valueClass="text-yellow-400"
          icon={<Trophy size={16} />}
        />
        <StatCard
          title="Weekly Consistency"
          value={`${consistency}%`}
          sub="last 7 days"
          valueClass={consistency >= 80 ? 'text-green-400' : consistency >= 50 ? 'text-yellow-400' : 'text-red-400'}
        />
        <StatCard
          title="Failure Rate"
          value={`${failureRate}%`}
          sub="last 7 days"
          valueClass={failureRate === 0 ? 'text-green-400' : failureRate < 30 ? 'text-yellow-400' : 'text-red-400'}
        />
        <StatCard
          title="Active Tasks"
          value={allTasks.length}
          sub={`${allTasks.filter(t => t.type === 'negative').length} habit controls`}
        />
        <StatCard
          title="Total Relapses"
          value={totalRelapses}
          sub="negative habits, all time"
          valueClass={totalRelapses === 0 ? 'text-green-400' : 'text-red-400'}
        />
      </div>

      {/* Task breakdown */}
      {allTasks.length > 0 && (
        <Card>
          <CardTitle className="mb-4">Task Breakdown</CardTitle>
          <div className="space-y-1">
            {allTasks.map((task, i) => (
              <div
                key={task._id}
                className={cn(
                  'flex items-center gap-3 py-3 transition-colors',
                  i < allTasks.length - 1 && 'border-b border-white/[0.04]'
                )}
              >
                <div className={cn(
                  'w-1 h-8 rounded-full shrink-0',
                  task.type === 'positive' ? 'bg-blue-500/50' : 'bg-orange-500/50'
                )} />
                <p className="text-sm text-white/70 flex-1 min-w-0 truncate">{task.title}</p>
                <div className="flex items-center gap-4 text-xs shrink-0">
                  <span className="flex items-center gap-1 text-orange-400">
                    <Flame size={10} />
                    <span className="font-semibold">{task.currentStreak}</span>
                  </span>
                  <span className="flex items-center gap-1 text-yellow-500/60">
                    <Trophy size={10} />
                    <span>{task.longestStreak}</span>
                  </span>
                  {task.type === 'negative' && (
                    <span className={cn(
                      'font-medium',
                      task.relapseCount === 0 ? 'text-green-500/60' : 'text-red-500/60'
                    )}>
                      {task.relapseCount === 0 ? 'Clean' : `${task.relapseCount}r`}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Sign out */}
      <Button variant="danger" onClick={logout} className="w-full sm:w-auto">
        <LogOut size={14} /> Sign Out
      </Button>
    </div>
  );
}
