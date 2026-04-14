import { cn } from '@/lib/utils';

const variants = {
  default: [
    'bg-brand hover:bg-brand-hover text-white',
    'shadow-[0_0_0_1px_rgba(124,58,237,0.5),0_2px_8px_rgba(124,58,237,0.25)]',
    'hover:shadow-[0_0_0_1px_rgba(124,58,237,0.6),0_4px_16px_rgba(124,58,237,0.3)]',
  ],
  outline: [
    'border border-border-subtle hover:border-border-subtle',
    'bg-transparent hover:bg-surface-hover',
    'text-text-secondary hover:text-text-primary',
  ],
  ghost: [
    'bg-transparent hover:bg-surface-hover',
    'text-text-muted hover:text-text-primary',
  ],
  success: [
    'bg-success-muted hover:bg-[rgba(34,197,94,0.14)]',
    'border border-success-border hover:border-[rgba(34,197,94,0.28)]',
    'text-success-text',
  ],
  danger: [
    'bg-danger-muted hover:bg-[rgba(239,68,68,0.12)]',
    'border border-danger-border hover:border-[rgba(239,68,68,0.28)]',
    'text-danger-text',
  ],
  secondary: [
    'bg-surface-raised hover:bg-surface-hover',
    'border border-border',
    'text-text-secondary hover:text-text-primary',
  ],
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2 text-sm gap-2 rounded-xl',
  lg: 'px-6 py-3 text-base gap-2.5 rounded-xl',
};

export function Button({ children, variant = 'default', size = 'md', className, disabled, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium',
        'transition-all duration-150 active:scale-[0.96]',
        'disabled:opacity-35 disabled:cursor-not-allowed disabled:active:scale-100',
        'select-none focus-ring',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
