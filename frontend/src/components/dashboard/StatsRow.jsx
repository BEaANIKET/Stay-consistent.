import { Zap, Target, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

function StatTile({ label, value, sub, valueColor, icon: Icon, accentColor }) {
  return (
    <div className={cn(
      'relative rounded-2xl border p-4 flex flex-col gap-1.5 overflow-hidden',
      'bg-surface border-border',
      'transition-all duration-200 hover:border-border-subtle hover:bg-surface-hover',
      'shadow-[0_1px_3px_rgba(0,0,0,0.3)]',
    )}>
      {/* Ambient top-edge glow */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px opacity-20 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor ?? 'rgba(255,255,255,0.3)'}, transparent)` }}
      />

      {/* Label row */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          {label}
        </p>
        {Icon && <Icon size={13} className="text-text-faint" />}
      </div>

      {/* Value */}
      <p className={cn('text-2xl font-bold tracking-tight tabular-nums', valueColor ?? 'text-text-primary')}>
        {value}
      </p>

      {/* Sub-label */}
      {sub && <p className="text-[11px] text-text-muted leading-snug">{sub}</p>}
    </div>
  );
}

export default function StatsRow({ score, scoreColor, completionPct, done, total, pending, failed }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger">
      <StatTile
        label="Discipline Score"
        value={score}
        sub="points today"
        valueColor={scoreColor}
        icon={Zap}
        accentColor="rgba(124,58,237,0.6)"
      />
      <StatTile
        label="Completion"
        value={`${completionPct}%`}
        sub={`${done} of ${total} done`}
        valueColor={
          completionPct === 100 ? 'text-success-text'
          : completionPct > 0   ? 'text-warning-text'
          : 'text-text-primary'
        }
        icon={Target}
        accentColor={completionPct === 100 ? 'rgba(34,197,94,0.5)' : 'rgba(245,158,11,0.4)'}
      />
      <StatTile
        label="Pending"
        value={pending}
        sub={pending > 0 ? 'tasks remaining' : 'all marked'}
        valueColor={pending > 0 ? 'text-warning-text' : 'text-text-muted'}
        icon={Clock}
        accentColor={pending > 0 ? 'rgba(245,158,11,0.4)' : undefined}
      />
      <StatTile
        label="Failed Today"
        value={failed}
        sub={failed > 0 ? `−${failed * 10} pts deducted` : 'clean so far'}
        valueColor={failed > 0 ? 'text-danger-text' : 'text-text-muted'}
        icon={XCircle}
        accentColor={failed > 0 ? 'rgba(239,68,68,0.5)' : undefined}
      />
    </div>
  );
}
