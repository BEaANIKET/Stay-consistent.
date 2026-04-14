import { cn } from '@/lib/utils';

const DAY_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function DayChip({ day, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(day)}
      className={cn(
        'flex-1 h-9 rounded-xl text-xs font-semibold transition-all duration-150',
        selected
          ? 'bg-violet-600 text-white border border-violet-500'
          : 'bg-white/[0.04] text-white/40 border border-white/10 hover:border-white/20 hover:text-white/60'
      )}
    >
      {DAY_SHORT[day]}
    </button>
  );
}
