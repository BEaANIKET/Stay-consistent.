import { cn } from '@/lib/utils';

const variants = {
  success:  'bg-green-500/10  text-green-400  border border-green-500/20',
  danger:   'bg-red-500/10    text-red-400    border border-red-500/20',
  neutral:  'bg-white/5       text-white/50   border border-white/10',
  warning:  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  positive: 'bg-blue-500/10   text-blue-400   border border-blue-500/20',
  negative: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
};

export function Badge({ children, variant = 'neutral', className }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
