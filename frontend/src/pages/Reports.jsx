import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWeeklyReport, getMonthlyReport } from '@/api/reports';
import { StatCard } from '@/components/ui/Card';
import PeriodToggle from '@/components/reports/PeriodToggle';
import CompletionChart from '@/components/reports/CompletionChart';
import WeeklyTrendChart from '@/components/reports/WeeklyTrendChart';
import CalendarHeatmap from '@/components/reports/CalendarHeatmap';

export default function Reports() {
  const [period, setPeriod] = useState('weekly');

  const { data: weeklyData, isLoading: wl } = useQuery({
    queryKey: ['weekly'],
    queryFn: () => getWeeklyReport().then((r) => r.data),
  });
  const { data: monthlyData, isLoading: ml } = useQuery({
    queryKey: ['monthly'],
    queryFn: () => getMonthlyReport().then((r) => r.data),
  });

  const data      = period === 'weekly' ? weeklyData : monthlyData;
  const isLoading = period === 'weekly' ? wl : ml;

  const chartData = data?.report?.map((d) => ({
    name: new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
    }),
    completion: d.completionRate,
    status: d.status,
  })) || [];

  const consistency = data?.overallConsistency ?? 0;
  const failureRate = data?.failureRate ?? 0;
  const daysTracked = data?.report?.filter((d) => d.status !== 'no-data').length ?? 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Reports</h1>
          <p className="text-sm text-white/35 mt-1">Your discipline analytics</p>
        </div>
        <PeriodToggle period={period} onChange={setPeriod} />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white/2 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="h-56 bg-white/2 rounded-2xl animate-pulse" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard
              title="Consistency"
              value={`${consistency}%`}
              sub="days fully completed"
              valueClass={consistency >= 80 ? 'text-green-400' : consistency >= 50 ? 'text-yellow-400' : 'text-red-400'}
            />
            <StatCard
              title="Failure Rate"
              value={`${failureRate}%`}
              sub="days failed or partial"
              valueClass={failureRate === 0 ? 'text-green-400' : failureRate < 30 ? 'text-yellow-400' : 'text-red-400'}
            />
            <StatCard
              title="Days Tracked"
              value={daysTracked}
              sub={`of ${data?.period === '7d' ? 7 : 30} days in period`}
            />
          </div>

          <CompletionChart chartData={chartData} />

          {period === 'monthly' && (
            <WeeklyTrendChart data={monthlyData?.weeklyBreakdown} />
          )}

          <CalendarHeatmap report={data?.report || []} />
        </>
      )}
    </div>
  );
}
