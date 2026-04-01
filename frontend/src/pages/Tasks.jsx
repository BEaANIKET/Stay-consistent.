import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, deleteTask } from '@/api/tasks';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import {
  Plus, Trash2, Flame, Trophy, AlertTriangle, Shield,
  CheckCircle2, XCircle, Repeat2, CalendarDays,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── constants ────────────────────────────────────────────────────────────────

const DAY_SHORT  = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_LABEL  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PRESETS = [
  { label: 'Every day', scheduleType: 'daily',  daysOfWeek: []        },
  { label: 'Weekdays',  scheduleType: 'custom', daysOfWeek: [1,2,3,4,5] },
  { label: 'Weekends',  scheduleType: 'custom', daysOfWeek: [0,6]     },
];

const todayISO = () => {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
};

const EMPTY_FORM = () => ({
  title:        '',
  type:         'positive',
  required:     true,
  scheduleType: 'daily',   // 'daily' | 'custom' | 'one-time'
  daysOfWeek:   [],
  startDate:    todayISO(),
  endDate:      '',
});

// ─── helpers ──────────────────────────────────────────────────────────────────

function getScheduleLabel(task) {
  const s = task.scheduleType || 'daily';
  if (s === 'one-time') return `Once · ${task.startDate ?? ''}`;
  if (s === 'daily' || !task.daysOfWeek?.length) return 'Every day';
  const days = [...task.daysOfWeek].sort((a, b) => a - b).map(d => DAY_LABEL[d]);
  return days.join(', ');
}

function presetMatch(form, preset) {
  if (form.scheduleType !== preset.scheduleType) return false;
  const a = [...form.daysOfWeek].sort().join(',');
  const b = [...preset.daysOfWeek].sort().join(',');
  return a === b;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function DayChip({ day, selected, onClick }) {
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

function TaskRow({ task, onDelete }) {
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
          {/* Schedule badge */}
          <span className="flex items-center gap-1 text-white/25 ml-auto">
            {(task.scheduleType === 'one-time')
              ? <CalendarDays size={10} className="text-violet-400/50" />
              : <Repeat2      size={10} className="text-violet-400/50" />}
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

// ─── schedule form section ────────────────────────────────────────────────────

function ScheduleSection({ form, setForm }) {
  const isOneTime = form.scheduleType === 'one-time';

  const setScheduleMode = (oneTime) => {
    if (oneTime) {
      setForm(f => ({ ...f, scheduleType: 'one-time', daysOfWeek: [] }));
    } else {
      setForm(f => ({ ...f, scheduleType: 'daily', daysOfWeek: [] }));
    }
  };

  const applyPreset = (preset) => {
    setForm(f => ({ ...f, scheduleType: preset.scheduleType, daysOfWeek: preset.daysOfWeek }));
  };

  const toggleDay = (day) => {
    setForm(f => {
      const days = f.daysOfWeek.includes(day)
        ? f.daysOfWeek.filter(d => d !== day)
        : [...f.daysOfWeek, day].sort((a, b) => a - b);
      return { ...f, daysOfWeek: days, scheduleType: days.length === 0 ? 'daily' : 'custom' };
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium uppercase tracking-widest text-white/40">Schedule</span>

      {/* One-time vs Repeat toggle */}
      <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.07]">
        {[
          { label: 'One-time', value: true  },
          { label: 'Repeat',   value: false },
        ].map(({ label, value }) => (
          <button
            key={label}
            type="button"
            onClick={() => setScheduleMode(value)}
            className={cn(
              'flex-1 py-1.5 text-xs font-medium rounded-lg transition-all',
              isOneTime === value
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-white/40 hover:text-white/60'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {isOneTime ? (
        /* Specific date picker */
        <Input
          label="Date"
          type="date"
          value={form.startDate}
          onChange={(e) => setForm(f => ({ ...f, startDate: e.target.value }))}
          style={{ colorScheme: 'dark' }}
        />
      ) : (
        <div className="space-y-3">
          {/* Preset chips */}
          <div className="flex gap-1.5 flex-wrap">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs border transition-all',
                  presetMatch(form, preset)
                    ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                    : 'bg-white/[0.03] border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Day chips  Sun Mon … Sat */}
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4, 5, 6].map(day => (
              <DayChip
                key={day}
                day={day}
                selected={form.daysOfWeek.includes(day)}
                onClick={toggleDay}
              />
            ))}
          </div>

          {/* Optional end date */}
          <Input
            label="End date (optional)"
            type="date"
            value={form.endDate}
            min={form.startDate}
            onChange={(e) => setForm(f => ({ ...f, endDate: e.target.value }))}
            style={{ colorScheme: 'dark' }}
          />
        </div>
      )}
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function Tasks() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM());

  const { data, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn:  () => getTasks().then((r) => r.data.tasks),
  });

  const { mutate: addTask, isPending: adding } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['todayLog'] });
      setShowModal(false);
      setForm(EMPTY_FORM());
      toast('Task added successfully', 'success');
    },
    onError: (err) => toast(err.response?.data?.message || 'Failed to add task', 'error'),
  });

  const { mutate: removeTask } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast('Task removed', 'info');
    },
  });

  const tasks    = data || [];
  const positive = tasks.filter((t) => t.type === 'positive');
  const negative = tasks.filter((t) => t.type === 'negative');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const payload = {
      title:        form.title.trim(),
      type:         form.type,
      required:     form.required,
      scheduleType: form.scheduleType,
      daysOfWeek:   form.daysOfWeek,
      startDate:    form.startDate || todayISO(),
      endDate:      form.endDate   || undefined,
    };
    addTask(payload);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY_FORM());
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Tasks</h1>
          <p className="text-sm text-white/35 mt-1">Manage your daily disciplines</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="hidden sm:inline-flex">
          <Plus size={15} /> Add Task
        </Button>
      </div>

      {/* Summary pills */}
      {tasks.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-xs text-white/50">
            <Shield size={11} /> {tasks.length} total
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/8 border border-blue-500/15 text-xs text-blue-400">
            <CheckCircle2 size={11} /> {positive.length} positive habits
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/8 border border-orange-500/15 text-xs text-orange-400">
            <XCircle size={11} /> {negative.length} habit controls
          </span>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-white/[0.02] rounded-2xl border border-white/[0.04] animate-pulse" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-14 h-14 bg-white/[0.03] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={24} className="text-white/15" />
          </div>
          <p className="text-sm font-semibold text-white/40">No tasks yet</p>
          <p className="text-xs text-white/20 mt-1 mb-5">Add your first discipline task to begin tracking.</p>
          <Button onClick={() => setShowModal(true)} className="mx-auto">
            <Plus size={14} /> Add First Task
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {positive.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Positive Habits</span>
                <span className="text-xs text-white/20 ml-auto">{positive.length}</span>
              </div>
              <div className="space-y-2">
                {positive.map((task) => (
                  <TaskRow key={task._id} task={task} onDelete={removeTask} />
                ))}
              </div>
            </section>
          )}

          {negative.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Habit Control</span>
                <span className="text-xs text-white/20 ml-auto">{negative.length}</span>
              </div>
              <div className="flex items-start gap-2.5 bg-orange-500/[0.05] border border-orange-500/15 rounded-2xl p-3.5 mb-2.5">
                <AlertTriangle size={13} className="text-orange-400/70 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-400/60 leading-relaxed">
                  Mark <strong className="text-orange-400">Done</strong> when you maintained control.
                  A relapse is marked as <strong className="text-red-400">Failed</strong> and is permanently recorded.
                </p>
              </div>
              <div className="space-y-2">
                {negative.map((task) => (
                  <TaskRow key={task._id} task={task} onDelete={removeTask} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Mobile FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="sm:hidden fixed bottom-24 right-6 w-14 h-14 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white rounded-full shadow-xl shadow-violet-600/30 flex items-center justify-center transition-all active:scale-90 z-30"
      >
        <Plus size={22} />
      </button>

      {/* Add task modal */}
      <Modal open={showModal} onClose={closeModal} title="New Discipline Task">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Task Title"
            placeholder="e.g. Workout, NoFap, Study 2h"
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            required
            autoFocus
          />
          <Select
            label="Type"
            value={form.type}
            onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
          >
            <option value="positive">Positive Habit — do this daily</option>
            <option value="negative">Habit Control — avoid this daily</option>
          </Select>

          {/* Schedule */}
          <ScheduleSection form={form} setForm={setForm} />

          {/* Non-negotiable toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setForm(f => ({ ...f, required: !f.required }))}
              className={cn(
                'w-10 h-6 rounded-full border transition-all duration-200 flex items-center px-0.5',
                form.required ? 'bg-violet-600 border-violet-600' : 'bg-white/5 border-white/10'
              )}
            >
              <div className={cn(
                'w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
                form.required ? 'translate-x-4' : 'translate-x-0'
              )} />
            </div>
            <div>
              <p className="text-xs font-medium text-white/70">Non-negotiable</p>
              <p className="text-[10px] text-white/30">Required every single day</p>
            </div>
          </label>

          <div className="flex gap-2 mt-1">
            <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={adding} className="flex-1">
              {adding ? 'Adding…' : 'Add Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
