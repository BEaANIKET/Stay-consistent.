import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import { Zap } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/tasks':     'Tasks',
  '/reports':   'Reports',
  '/friends':   'Friends',
  '/profile':   'Profile',
};

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  duration: 0.2,
  ease: 'easeInOut',
};

export default function AppLayout() {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'DisciplineOS';

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] overflow-hidden">

      {/* ── Desktop Sidebar (hidden on mobile) ── */}
      <div className="hidden md:flex h-full border-r border-white/[0.05] shrink-0">
        <Sidebar />
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0d0d0d]/90 backdrop-blur-xl shrink-0 sticky top-0 z-40">
          {/* Logo + page title */}
          <div className="flex items-center gap-1.5">
            <Zap size={13} className="text-violet-500" />
            <span className="text-sm font-bold text-white">{pageTitle}</span>
          </div>

          {/* Avatar → taps to Profile */}
          <button
            onClick={() => navigate('/profile')}
            className="relative w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center active:scale-90 transition-transform"
            aria-label="Go to profile"
          >
            <span className="text-xs font-bold text-white">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </span>
            {/* online dot */}
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-[#0d0d0d]" />
          </button>
        </header>

        {/* Page scroll area */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="max-w-300 mx-auto px-4 md:px-8 lg:px-12 py-6 pb-28 md:pb-8 md:py-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── Mobile Bottom Nav (hidden on desktop) ── */}
      <MobileBottomNav />
    </div>
  );
}
