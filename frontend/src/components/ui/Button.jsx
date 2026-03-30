import { cn } from '@/lib/utils';

const variants = {
  default:   'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-600/20',
  outline:   'border border-white/10 hover:border-white/20 hover:bg-white/5 text-white/70 hover:text-white bg-transparent',
  ghost:     'hover:bg-white/5 text-white/50 hover:text-white bg-transparent',
  success:   'bg-green-600 hover:bg-green-500 active:bg-green-700 text-white shadow-lg shadow-green-600/20',
  danger:    'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300',
  secondary: 'bg-white/5 hover:bg-white/10 border border-white/8 text-white/80 hover:text-white',
};

const sizes = {
  sm: 'px-3.5 py-1.5 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
};

export function Button({ children, variant = 'default', size = 'md', className, disabled, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium',
        'transition-all duration-200 active:scale-95',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
        'select-none',
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
