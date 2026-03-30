import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import Sidebar from './Sidebar';
import { Menu, Zap } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/tasks':     'Tasks',
  '/reports':   'Reports',
  '/friends':   'Friends',
  '/profile':   'Profile',
};

export default function AppLayout() {
  const { isAuthenticated } = useAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Close drawer on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setDrawerOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'DisciplineOS';

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] overflow-hidden">

      {/* ── Desktop Sidebar ── */}
      <div className="hidden md:flex h-full border-r border-white/[0.05] shrink-0">
        <Sidebar />
      </div>

      {/* ── Mobile Drawer overlay ── */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative z-10 h-full">
            <Sidebar isMobile onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05] bg-[#0d0d0d]/90 backdrop-blur-xl shrink-0 sticky top-0 z-40">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all active:scale-90"
          >
            <Menu size={17} />
          </button>
          <div className="flex items-center gap-1.5">
            <Zap size={13} className="text-red-500" />
            <span className="text-sm font-bold text-white">{pageTitle}</span>
          </div>
          <div className="w-8" /> {/* spacer */}
        </header>

        {/* Page scroll area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8 animate-fade-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
