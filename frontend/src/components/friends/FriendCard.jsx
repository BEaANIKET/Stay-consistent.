import { Flame, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_MAP = {
  completed: { label: 'Completed', cls: 'text-green-400 bg-green-500/8 border-green-500/20'     },
  failed:    { label: 'Failed',    cls: 'text-red-400   bg-red-500/8   border-red-500/20'        },
  partial:   { label: 'Partial',   cls: 'text-yellow-400 bg-yellow-500/8 border-yellow-500/20'  },
  pending:   { label: 'Pending',   cls: 'text-white/30  bg-white/5     border-white/10'          },
  'no-data': { label: '—',         cls: 'text-white/15  bg-transparent border-transparent'      },
};

export default function FriendCard({ friend }) {
  const status = STATUS_MAP[friend.todayStatus] ?? STATUS_MAP['no-data'];
  const initials = friend.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const scoreColor = friend.disciplineScore >= 100
    ? 'text-green-400'
    : friend.disciplineScore >= 50
      ? 'text-yellow-400'
      : 'text-red-400';

  return (
    <div className="flex items-center gap-4 p-4 md:p-5 bg-[#111] border border-white/[0.06] rounded-2xl hover:border-white/12 transition-all group">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.07] flex items-center justify-center text-sm font-bold text-white/70 shrink-0">
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{friend.name}</p>
        <p className="text-xs text-white/30 truncate">{friend.email}</p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-xs text-white/50">
            <Flame size={11} className="text-orange-400" />
            <span className="font-semibold text-white/70">{friend.currentStreak}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/30">
            <Zap size={11} className="text-yellow-500/50" />
            <span className={cn('font-semibold', scoreColor)}>{friend.disciplineScore}</span>
          </div>
        </div>

        <span className={cn(
          'text-[10px] font-semibold px-2.5 py-1 rounded-full border',
          status.cls
        )}>
          {status.label}
        </span>
      </div>
    </div>
  );
}
