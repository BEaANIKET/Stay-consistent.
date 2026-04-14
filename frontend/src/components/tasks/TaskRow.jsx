import { useState } from 'react';
import { Trash2, Flame, Trophy, CalendarDays, Repeat2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const DAY_LABEL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getScheduleLabel(task) {
  const s = task.scheduleType || 'daily';
  if (s === 'one-time') return `Once · ${task.startDate ?? ''}`;
  if (s === 'daily' || !task.daysOfWeek?.length) return 'Every day';
  const days = [...task.daysOfWeek].sort((a, b) => a - b).map(d => DAY_LABEL[d]);
  return days.join(', ');
}

export default function TaskRow({ task, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(task._id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 2500);
    }
  };

  return (
    <div className="group flex items-center gap-4 p-4 md:p-5 bg-[#111] border border-white/[0.06] rounded-2xl hover:border-white/12 transition-all duration-200 animate-scale-in">
      {/* Accent bar */}
      <div className={cn(
        'w-[3px] self-stretch rounded-full shrink-0',
        task.type === 'positive' ? 'bg-blue-500/60' : 'bg-orange-500/60'
      )} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="text-sm font-semibold text-white">{task.title}</p>
          <Badge variant={task.type === 'positive' ? 'positive' : 'negative'}>
            {task.type}
          </Badge>
          {task.required && <Badge variant="danger">required</Badge>}
        </div>
        <div className="flex items-center gap-4 text-xs text-white/30 flex-wrap">
          <span className="flex items-center gap-1">
            <Flame size={10} className="text-orange-400" />
            <span className="text-white/50 font-medium">{task.currentStreak}</span>
            <span>streak</span>
          </span>
          <span className="flex items-center gap-1">
            <Trophy size={10} className="text-yellow-500/50" />
            <span>{task.longestStreak}</span>
            <span>best</span>
          </span>
          {task.type === 'negative' && (
            <span className={cn(
              'font-medium',
              task.relapseCount > 0 ? 'text-red-500/70' : 'text-green-500/50'
            )}>
              {task.relapseCount === 0 ? 'Clean' : `${task.relapseCount} relapses`}
            </span>
          )}
          <span className="flex items-center gap-1 text-white/25 ml-auto">
            {task.scheduleType === 'one-time'
              ? <CalendarDays size={10} className="text-violet-400/50" />
              : <Repeat2 size={10} className="text-violet-400/50" />}
            <span className="text-[10px]">{getScheduleLabel(task)}</span>
          </span>
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className={cn(
          'shrink-0 text-xs flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all active:scale-90',
          confirmDelete
            ? 'bg-red-500/15 border-red-500/30 text-red-400'
            : 'opacity-0 group-hover:opacity-100 bg-transparent border-transparent text-white/20 hover:text-red-400 hover:bg-red-500/8 hover:border-red-500/20'
        )}
      >
        <Trash2 size={12} />
        <span className="hidden sm:inline">{confirmDelete ? 'Confirm?' : 'Remove'}</span>
      </button>
    </div>
  );
}
