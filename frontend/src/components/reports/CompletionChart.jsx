import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell,
} from 'recharts';
import { Card, CardTitle } from '@/components/ui/Card';
import CustomTooltip from './CustomTooltip';

export default function CompletionChart({ chartData }) {
  return (
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
  );
}
