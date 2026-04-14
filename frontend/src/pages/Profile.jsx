import { useQuery } from '@tanstack/react-query';
import { getWeeklyReport } from '@/api/reports';
import { getTasks } from '@/api/tasks';
import { StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import useAuthStore from '@/store/authStore';
import { Flame, Trophy, LogOut } from 'lucide-react';
import IdentityCard from '@/components/profile/IdentityCard';
import TaskBreakdown from '@/components/profile/TaskBreakdown';

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

  const allTasks      = tasks || [];
  const maxStreak     = allTasks.reduce((m, t) => Math.max(m, t.currentStreak), 0);
  const longestEver   = allTasks.reduce((m, t) => Math.max(m, t.longestStreak), 0);
  const totalRelapses = allTasks
    .filter(t => t.type === 'negative')
    .reduce((s, t) => s + t.relapseCount, 0);

  const score       = user?.disciplineScore ?? 100;
  const scoreLabel  = score >= 150 ? 'Elite' : score >= 100 ? 'Disciplined' : score >= 50 ? 'Struggling' : 'Broken';
  const scoreBadge  = score >= 100 ? 'success' : score >= 50 ? 'warning' : 'danger';
  const scoreColor  = score >= 100 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  const consistency = weeklyData?.overallConsistency ?? 0;
  const failureRate = weeklyData?.failureRate ?? 0;

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Profile</h1>
        <p className="text-sm text-white/35 mt-1">Your discipline record</p>
      </div>

      <IdentityCard
        user={user}
        score={score}
        scoreColor={scoreColor}
        scoreLabel={scoreLabel}
        scoreBadge={scoreBadge}
        memberSince={memberSince}
      />

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

      <TaskBreakdown tasks={allTasks} />

      <Button variant="danger" onClick={logout} className="w-full sm:w-auto">
        <LogOut size={14} /> Sign Out
      </Button>
    </div>
  );
}
