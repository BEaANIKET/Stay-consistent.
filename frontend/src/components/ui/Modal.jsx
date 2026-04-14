import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export function Modal({ open, onClose, title, children, className }) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const contentRef = useRef(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      // Scroll content to top whenever modal opens
      if (contentRef.current) contentRef.current.scrollTop = 0;
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Track visual viewport — gives us the true visible area above the keyboard
  useEffect(() => {
    if (!open) return;

    const update = () => {
      if (window.visualViewport) {
        const vvh = window.visualViewport.height;
        const vvOffset = window.visualViewport.offsetTop;
        const kbH = window.innerHeight - vvh - vvOffset;
        setKeyboardHeight(Math.max(0, kbH));
        setViewportHeight(vvh);
      } else {
        setKeyboardHeight(0);
        setViewportHeight(window.innerHeight);
      }
    };

    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    update();

    return () => {
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      setKeyboardHeight(0);
      setViewportHeight(window.innerHeight);
    };
  }, [open]);

  if (!open) return null;

  const keyboardOpen = keyboardHeight > 50;

  // On mobile: the sheet must fit within the visible viewport above the keyboard.
  // We subtract 16px so the backdrop peeks through at the top (gives depth).
  const mobileMaxHeight = keyboardOpen
    ? viewportHeight - 16
    : viewportHeight * 0.92;   // 92vh when keyboard is closed — matches old sheet behaviour

  return (
    <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={cn(
          'relative z-10 w-full sm:max-w-md mx-0 sm:mx-4',
          'bg-[#141414] border border-white/8',
          'rounded-t-3xl sm:rounded-2xl',
          'shadow-[0_-20px_60px_rgba(0,0,0,0.6)] sm:shadow-[0_0_60px_rgba(0,0,0,0.6)]',
          'flex flex-col',             // column layout so header is fixed, content scrolls
          'animate-fade-up',
          className
        )}
        style={{
          // Mobile: sit right above the keyboard
          marginBottom: keyboardOpen ? `${keyboardHeight}px` : undefined,
          // Constrain total height so nothing can go off-screen
          maxHeight: `${mobileMaxHeight}px`,
          transition: 'margin-bottom 0.18s ease, max-height 0.18s ease',
        }}
      >
        {/* ── Drag handle (mobile only) ── */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-9 h-1 bg-white/15 rounded-full" />
        </div>

        {/* ── Sticky header — never scrolls away ── */}
        <div className="flex items-center justify-between px-6 pt-4 pb-4 shrink-0 border-b border-white/5">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Scrollable content area ── */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto overscroll-contain px-6 py-5"
          style={{
            // Extra bottom padding so the last field/button clears the
            // bottom nav when keyboard is closed, but not when keyboard is open.
            paddingBottom: keyboardOpen ? '1.5rem' : '4.5rem',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
