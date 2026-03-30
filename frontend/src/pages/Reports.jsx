import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWeeklyReport, getMonthlyReport } from '@/api/reports';
import { Card, CardTitle, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Cell, Area, AreaChart,
} from 'recharts';

const STATUS_COLORS = {
  completed: '#22c55e',
  failed:    '#ef4444',
  partial:   '#f59e0b',
  pending:   '#404040',
  'no-data': '#1f1f1f',
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a]/95 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs shadow-xl backdrop-blur-xl">
      <p className="text-white/40 font-medium mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
}

function CalendarHeatmap({ report }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {report.map((day) => {
        const color = STATUS_COLORS[day.status] ?? STATUS_COLORS['no-data'];
        const d = new Date(day.date + 'T00:00:00').getDate();
        return (
          <div
            key={day.date}
            title={`${day.date} — ${day.status} (${day.completionRate}%)`}
            className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center text-[10px] font-semibold cursor-default transition-transform hover:scale-110"
            style={{
              background: color + '18',
              border: `1px solid ${color}30`,
              color: color,
            }}
          >
            {d}
          </div>
        );
      })}
    </div>
  );
}

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

  const data = period === 'weekly' ? weeklyData : monthlyData;
  const isLoading = period === 'weekly' ? wl : ml;

  const chartData = data?.report?.map((d) => ({
    name: new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
    }),
    completion: d.completionRate,
    status: d.status,
  })) || [];

  const consistency = data?.overallConsistency ?? 0;
  const failureRate  = data?.failureRate ?? 0;
  const daysTracked  = data?.report?.filter((d) => d.status !== 'no-data').length ?? 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Reports</h1>
          <p className="text-sm text-white/35 mt-1">Your discipline analytics</p>
        </div>
        <div className="flex gap-1.5 p-1 bg-white/[0.04] border border-white/[0.07] rounded-full">
          <button
            onClick={() => setPeriod('weekly')}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
              period === 'weekly'
                ? 'bg-white text-black shadow'
                : 'text-white/40 hover:text-white'
            )}
          >
            7 Days
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
              period === 'monthly'
                ? 'bg-white text-black shadow'
                : 'text-white/40 hover:text-white'
            )}
          >
            30 Days
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-white/[0.02] rounded-2xl animate-pulse" />)}
          </div>
          <div className="h-56 bg-white/[0.02] rounded-2xl animate-pulse" />
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

          {/* Completion bar chart */}
          <Card>
            <CardTitle className="mb-5">Daily Completion Rate</CardTitle>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -22 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }}
                  axisLine={false} tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }} />
                <Bar dataKey="completion" radius={[6, 6, 2, 2]} name="Completion" maxBarSize={40}>
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.status === 'completed' ? '#22c55e' :
                        entry.status === 'failed'    ? '#ef4444' :
                        entry.status === 'partial'   ? '#f59e0b' :
                        'rgba(255,255,255,0.06)'
                      }
                      opacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Monthly weekly trend */}
          {period === 'monthly' && monthlyData?.weeklyBreakdown && (
            <Card>
              <CardTitle className="mb-5">Weekly Trend</CardTitle>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart
                  data={monthlyData.weeklyBreakdown}
                  margin={{ top: 4, right: 4, bottom: 4, left: -22 }}
                >
                  <defs>
                    <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="week"
                    tickFormatter={(w) => `W${w}`}
                    tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }}
                    axisLine={false} tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="completionRate"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#redGrad)"
                    dot={{ fill: '#ef4444', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#ef4444', strokeWidth: 0 }}
                    name="Completion"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Heatmap */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Failure Heatmap</CardTitle>
              <div className="flex items-center gap-3">
                {[['completed','#22c55e'],['partial','#f59e0b'],['failed','#ef4444']].map(([label, color]) => (
                  <span key={label} className="flex items-center gap-1.5 text-[10px] text-white/30">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color + '50' }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <CalendarHeatmap report={data?.report || []} />
          </Card>
        </>
      )}
    </div>
  );
}
