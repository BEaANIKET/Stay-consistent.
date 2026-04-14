import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { Card, CardTitle } from '@/components/ui/Card';
import CustomTooltip from './CustomTooltip';

export default function WeeklyTrendChart({ data }) {
  if (!data?.length) return null;

  return (
    <Card>
      <CardTitle className="mb-5">Weekly Trend</CardTitle>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -22 }}>
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
  );
}
