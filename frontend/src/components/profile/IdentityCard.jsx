import { Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import ScoreBar from './ScoreBar';
import { cn } from '@/lib/utils';

export default function IdentityCard({ user, score, scoreColor, scoreLabel, scoreBadge, memberSince }) {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Avatar with glow ring */}
        <div className="relative shrink-0">
          <div className={cn(
            'absolute inset-[-4px] rounded-2xl opacity-40',
            score >= 100 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
          )} style={{ filter: 'blur(8px)' }} />
          <div className="relative w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-2xl font-bold text-white">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
            <Badge variant={scoreBadge}>{scoreLabel}</Badge>
          </div>
          <p className="text-sm text-white/35">{user?.email}</p>
          <div className="flex items-center gap-1.5 text-xs text-white/25">
            <Calendar size={11} /> Member since {memberSince}
          </div>
        </div>

        {/* Score */}
        <div className="sm:text-right w-full sm:w-auto shrink-0">
          <p className={cn('text-3xl font-bold tracking-tight', scoreColor)}>{score}</p>
          <p className="text-xs text-white/30 mt-0.5">discipline points</p>
          <div className="mt-2 w-full sm:w-28">
            <ScoreBar score={score} />
          </div>
        </div>
      </div>
    </Card>
  );
}
