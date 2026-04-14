import { cn } from '@/lib/utils';

export default function PeriodToggle({ period, onChange }) {
  return (
    <div className="flex gap-1.5 p-1 bg-white/[0.04] border border-white/[0.07] rounded-full">
      <button
        onClick={() => onChange('weekly')}
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
        onClick={() => onChange('monthly')}
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
  );
}
