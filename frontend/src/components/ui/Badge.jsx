import { cn } from '@/lib/utils';

const variants = {
  success:  'bg-success-muted  text-success-text  border border-success-border',
  danger:   'bg-danger-muted   text-danger-text   border border-danger-border',
  warning:  'bg-warning-muted  text-warning-text  border border-warning-border',
  neutral:  'bg-surface-raised text-text-muted    border border-border',
  positive: 'bg-info-muted     text-info-text     border border-info-border',
  negative: 'bg-accent-muted   text-accent-text   border border-accent-border',
  brand:    'bg-brand-muted    text-violet-400    border border-brand-border',
};

export function Badge({ children, variant = 'neutral', className }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
