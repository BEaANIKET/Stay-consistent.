import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, BarChart2,
  User, Users, LogOut, Zap, X
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks',     icon: CheckSquare,     label: 'Tasks'     },
  { to: '/reports',   icon: BarChart2,       label: 'Reports'   },
  { to: '/friends',   icon: Users,           label: 'Friends'   },
  { to: '/profile',   icon: User,            label: 'Profile'   },
];

function ScoreRing({ score }) {
  const pct = Math.min(100, Math.max(0, score));
  const r = 14; const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  const color = score >= 100 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="36" height="36" className="rotate-[-90deg]">
      <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
      <circle
        cx="18" cy="18" r={r} fill="none"
        stroke={color} strokeWidth="2.5"
        strokeDasharray={`${dash} ${c}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    </svg>
  );
}

export default function Sidebar({ onClose, isMobile }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const handleLogout = () => { logout(); onClose?.(); };

  return (
    <aside className={cn(
      'flex flex-col h-full w-64',
      'bg-[#0d0d0d]',
      isMobile && 'animate-slide-in',
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/30">
            <Zap size={14} fill="white" stroke="white" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">DisciplineOS</span>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium',
                'transition-all duration-150 group',
                active
                  ? 'bg-white/8 text-white border border-white/8'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5'
              )}
            >
              <Icon
                size={16}
                className={cn(
                  'shrink-0 transition-colors',
                  active ? 'text-red-400' : 'text-white/30 group-hover:text-white/60'
                )}
              />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <ScoreRing score={user?.disciplineScore ?? 100} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-white/35 mt-0.5">
              {user?.disciplineScore ?? 100} pts
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-500/10 text-white/25 hover:text-red-400 transition-all"
            title="Sign out"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
