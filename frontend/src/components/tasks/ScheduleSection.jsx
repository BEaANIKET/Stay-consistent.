import { Input } from '@/components/ui/Input';
import DayChip from './DayChip';
import { cn } from '@/lib/utils';

const PRESETS = [
  { label: 'Every day', scheduleType: 'daily',  daysOfWeek: []          },
  { label: 'Weekdays',  scheduleType: 'custom', daysOfWeek: [1,2,3,4,5] },
  { label: 'Weekends',  scheduleType: 'custom', daysOfWeek: [0,6]       },
];

function presetMatch(form, preset) {
  if (form.scheduleType !== preset.scheduleType) return false;
  const a = [...form.daysOfWeek].sort().join(',');
  const b = [...preset.daysOfWeek].sort().join(',');
  return a === b;
}

export default function ScheduleSection({ form, setForm }) {
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

          {/* Day chips Sun Mon … Sat */}
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
