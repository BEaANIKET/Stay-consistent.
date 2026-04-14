import { cn } from '@/lib/utils';

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-5',
        'bg-surface border-border',
        'shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.02)]',
        hover && [
          'transition-all duration-200 cursor-pointer',
          'hover:bg-surface-hover hover:border-border-subtle',
          'hover:shadow-[0_4px_16px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.04)]',
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return (
    <p className={cn(
      'text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted',
      className
    )}>
      {children}
    </p>
  );
}

export function CardValue({ children, className }) {
  return (
    <div className={cn('text-3xl font-bold tracking-tight text-text-primary mt-1', className)}>
      {children}
    </div>
  );
}

export function StatCard({ title, value, sub, valueClass, icon }) {
  return (
    <Card className="flex flex-col gap-2 group">
      <div className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {icon && (
          <span className="text-text-faint transition-colors duration-200 group-hover:text-text-muted">
            {icon}
          </span>
        )}
      </div>
      <div className={cn(
        'text-2xl font-bold tracking-tight tabular-nums',
        valueClass ?? 'text-text-primary'
      )}>
        {value}
      </div>
      {sub && <p className="text-[11px] text-text-muted leading-snug">{sub}</p>}
    </Card>
  );
}
