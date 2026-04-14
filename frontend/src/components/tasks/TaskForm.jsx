import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import ScheduleSection from './ScheduleSection';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TaskForm({ open, onClose, form, setForm, onSubmit, adding }) {
  const hasTime = !!form.availableFrom;

  return (
    <Modal open={open} onClose={onClose} title="New Discipline Task">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">

        {/* Title */}
        <Input
          label="Task Title"
          placeholder="e.g. Workout, NoFap, Study 2h"
          value={form.title}
          onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
          required
          autoFocus
        />

        {/* Type */}
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

        {/* ── Available-from time ── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-white/40">
              Available From
            </span>
            {/* Clear button */}
            {hasTime && (
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, availableFrom: '' }))}
                className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Time input */}
            <div className="relative flex-1">
              <Clock
                size={13}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
              />
              <input
                type="time"
                value={form.availableFrom}
                onChange={(e) => setForm(f => ({ ...f, availableFrom: e.target.value }))}
                className={cn(
                  'w-full bg-white/3 border border-white/10 rounded-xl pl-9 pr-4 py-2.5',
                  'text-sm text-white',
                  'focus:outline-none focus:border-violet-500/60 focus:bg-white/5',
                  'transition-all duration-200',
                  'scheme-dark',
                  hasTime && 'border-violet-500/30 bg-violet-500/4',
                )}
              />
            </div>

            {/* Quick-pick buttons */}
            <div className="flex gap-1.5 shrink-0">
              {['06:00', '09:00', '18:00', '21:00'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, availableFrom: t }))}
                  className={cn(
                    'px-2 py-1.5 rounded-lg text-[10px] font-medium border transition-all',
                    form.availableFrom === t
                      ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                      : 'bg-white/3 border-white/10 text-white/35 hover:border-white/20 hover:text-white/60'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Hint */}
          <p className="text-[11px] text-white/25 leading-snug">
            {hasTime
              ? `Done / Miss buttons will be locked until ${form.availableFrom} each day.`
              : 'Optional — leave empty to allow marking at any time.'}
          </p>
        </div>

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
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={adding} className="flex-1">
            {adding ? 'Adding…' : 'Add Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
