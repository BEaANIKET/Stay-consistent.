import { cn } from '@/lib/utils';

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-[#111] border border-white/[0.07] rounded-2xl p-5',
        'shadow-[0_0_30px_rgba(0,0,0,0.35)]',
        hover && 'transition-all duration-300 hover:scale-[1.02] hover:border-white/15 cursor-pointer',
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
    <p className={cn('text-xs font-medium uppercase tracking-widest text-white/40', className)}>
      {children}
    </p>
  );
}

export function CardValue({ children, className }) {
  return (
    <div className={cn('text-3xl font-bold text-white mt-1 tracking-tight', className)}>
      {children}
    </div>
  );
}

export function StatCard({ title, value, sub, valueClass, icon }) {
  return (
    <Card className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {icon && <span className="text-white/20">{icon}</span>}
      </div>
      <div className={cn('text-2xl md:text-3xl font-bold tracking-tight', valueClass ?? 'text-white')}>
        {value}
      </div>
      {sub && <p className="text-xs text-white/35">{sub}</p>}
    </Card>
  );
}
