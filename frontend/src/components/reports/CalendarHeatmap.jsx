import { Card, CardTitle } from '@/components/ui/Card';

const STATUS_COLORS = {
  completed: '#22c55e',
  failed:    '#ef4444',
  partial:   '#f59e0b',
  pending:   '#404040',
  'no-data': '#1f1f1f',
};

const LEGEND = [
  ['completed', '#22c55e'],
  ['partial',   '#f59e0b'],
  ['failed',    '#ef4444'],
];

export default function CalendarHeatmap({ report }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <CardTitle>Failure Heatmap</CardTitle>
        <div className="flex items-center gap-3">
          {LEGEND.map(([label, color]) => (
            <span key={label} className="flex items-center gap-1.5 text-[10px] text-white/30">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color + '50' }} />
              {label}
            </span>
          ))}
        </div>
      </div>
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
                color,
              }}
            >
              {d}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
