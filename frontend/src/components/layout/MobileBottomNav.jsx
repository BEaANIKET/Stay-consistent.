import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, BarChart2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks',     icon: CheckSquare,     label: 'Tasks'     },
  { to: '/reports',   icon: BarChart2,       label: 'Reports'   },
  { to: '/friends',   icon: Users,           label: 'Friends'   },
];

export default function MobileBottomNav() {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-4">
      <nav className="relative flex items-center rounded-2xl bg-[#0d0d0d]/80 backdrop-blur-2xl border border-white/8 shadow-[0_-4px_24px_rgba(0,0,0,0.5),0_8px_32px_rgba(0,0,0,0.4)] px-1 py-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className="relative flex flex-col items-center justify-center flex-1 py-2.5 gap-0.5 select-none"
            >
              {/* Sliding background pill */}
              {active && (
                <motion.div
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 rounded-xl bg-white/[0.07] border border-white/[0.07]"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}

              {/* Icon + Label */}
              <motion.div
                animate={{ scale: active ? 1.08 : 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                className="relative z-10 flex flex-col items-center gap-1"
              >
                <Icon
                  size={20}
                  className={cn(
                    'transition-colors duration-150',
                    active ? 'text-violet-400' : 'text-white/30'
                  )}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium transition-colors duration-150 leading-none',
                    active ? 'text-white' : 'text-white/50'
                  )}
                >
                  {label}
                </span>
              </motion.div>

              {/* Active underline dot */}
              {active && (
                <motion.div
                  layoutId="mobile-nav-dot"
                  className="absolute bottom-1 w-3.5 h-0.5 rounded-full bg-violet-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
