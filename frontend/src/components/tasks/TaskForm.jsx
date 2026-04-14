import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import ScheduleSection from './ScheduleSection';
import { cn } from '@/lib/utils';

export default function TaskForm({ open, onClose, form, setForm, onSubmit, adding }) {
  return (
    <Modal open={open} onClose={onClose} title="New Discipline Task">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
