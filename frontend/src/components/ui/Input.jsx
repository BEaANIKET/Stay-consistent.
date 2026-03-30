import { cn } from '@/lib/utils';

export function Input({ className, label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium uppercase tracking-widest text-white/40">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5',
          'text-sm text-white placeholder-white/20',
          'focus:outline-none focus:border-red-500/60 focus:bg-white/[0.05]',
          'transition-all duration-200',
          error && 'border-red-500/50',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

export function Select({ className, label, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium uppercase tracking-widest text-white/40">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5',
          'text-sm text-white',
          'focus:outline-none focus:border-red-500/60',
          'transition-all duration-200',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
