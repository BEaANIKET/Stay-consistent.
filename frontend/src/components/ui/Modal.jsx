import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export function Modal({ open, onClose, title, children, className }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Sheet: slides up from bottom on mobile, centered on desktop */}
      <div className={cn(
        'relative z-10 w-full sm:max-w-md mx-0 sm:mx-4',
        'bg-[#141414] border border-white/10',
        'rounded-t-3xl sm:rounded-2xl',
        'p-6 pb-8 sm:pb-6',
        'shadow-[0_-20px_60px_rgba(0,0,0,0.6)] sm:shadow-[0_0_60px_rgba(0,0,0,0.6)]',
        'animate-fade-up',
        className
      )}>
        {/* Drag handle (mobile only) */}
        <div className="sm:hidden flex justify-center mb-4">
          <div className="w-9 h-1 bg-white/15 rounded-full" />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
          >
            <X size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
