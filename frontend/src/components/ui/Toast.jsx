import { create } from 'zustand';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

const useToastStore = create((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({ toasts: [...state.toasts, { id: Date.now(), ...toast }] })),
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function toast(message, type = 'info') {
  useToastStore.getState().addToast({ message, type });
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const t = setTimeout(onRemove, 4000);
    return () => clearTimeout(t);
  }, [onRemove]);

  const map = {
    success: {
      icon: <CheckCircle2 size={15} className="shrink-0 text-green-400" />,
      cls:  'border-green-500/20 bg-green-500/8',
    },
    error: {
      icon: <XCircle size={15} className="shrink-0 text-red-400" />,
      cls:  'border-red-500/20 bg-red-500/8',
    },
    info: {
      icon: <Info size={15} className="shrink-0 text-white/40" />,
      cls:  'border-white/10 bg-white/5',
    },
  };
  const { icon, cls } = map[toast.type] ?? map.info;

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-2xl border',
        'text-sm text-white/85 backdrop-blur-xl',
        'shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
        'animate-fade-up',
        cls
      )}
      style={{ background: 'rgba(15,15,15,0.9)' }}
    >
      {icon}
      <span>{toast.message}</span>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  return (
    <div className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-[200] flex flex-col gap-2 sm:max-w-xs ml-auto pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={() => removeToast(t.id)} />
        </div>
      ))}
    </div>
  );
}
