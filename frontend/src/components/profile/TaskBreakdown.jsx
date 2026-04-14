import { Flame, Trophy } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export default function TaskBreakdown({ tasks }) {
  if (tasks.length === 0) return null;

  return (
    <Card>
      <CardTitle className="mb-4">Task Breakdown</CardTitle>
      <div className="space-y-1">
        {tasks.map((task, i) => (
          <div
            key={task._id}
            className={cn(
              'flex items-center gap-3 py-3 transition-colors',
              i < tasks.length - 1 && 'border-b border-white/[0.04]'
            )}
          >
            <div className={cn(
              'w-1 h-8 rounded-full shrink-0',
              task.type === 'positive' ? 'bg-blue-500/50' : 'bg-orange-500/50'
            )} />
            <p className="text-sm text-white/70 flex-1 min-w-0 truncate">{task.title}</p>
            <div className="flex items-center gap-4 text-xs shrink-0">
              <span className="flex items-center gap-1 text-orange-400">
                <Flame size={10} />
                <span className="font-semibold">{task.currentStreak}</span>
              </span>
              <span className="flex items-center gap-1 text-yellow-500/60">
                <Trophy size={10} />
                <span>{task.longestStreak}</span>
              </span>
              {task.type === 'negative' && (
                <span className={cn(
                  'font-medium',
                  task.relapseCount === 0 ? 'text-green-500/60' : 'text-red-500/60'
                )}>
                  {task.relapseCount === 0 ? 'Clean' : `${task.relapseCount}r`}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
