import {
  LayoutDashboard, MessageSquare, Users, BarChart3,
  CreditCard, Building2, UserCircle, Zap, ChevronLeft, ChevronRight,
  Shield, Target, BookOpen, HelpCircle
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  unreadCount: number;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'coaching', label: 'AI Coach', icon: MessageSquare },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'notes', label: 'Notes & Insights', icon: BookOpen },
  { id: 'profile', label: 'My Profile', icon: UserCircle },
  { id: 'team', label: 'Team Management', icon: Users },
  { id: 'analytics', label: 'HR Analytics', icon: BarChart3 },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function Sidebar({ currentPage, onNavigate, collapsed, onToggle, unreadCount: _unreadCount }: SidebarProps) {
  return (
    <aside className={`fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col ${collapsed ? 'w-[68px]' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/50">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-spark-400 to-spark-600 flex items-center justify-center shadow-lg shadow-spark-500/20 anim-pulse-ring cursor-pointer interactive"
        >
          <Zap className="w-5 h-5 text-white" />
        </button>
        {!collapsed && (
          <div className="overflow-hidden anim-fade-in-left">
            <h1 className="text-lg font-bold tracking-tight cursor-pointer" onClick={() => onNavigate('dashboard')}>Worksparks</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">AI Leadership Coach</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto stagger">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group btn-ripple anim-fade-in-left
                ${isActive
                  ? 'bg-gradient-to-r from-spark-500/20 to-spark-600/10 text-spark-400 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${isActive ? 'text-spark-400 scale-110' : 'text-slate-500 group-hover:text-slate-300 group-hover:scale-105'}`} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-spark-400 anim-pop" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-700/50 space-y-1">
        <button
          onClick={() => onNavigate('pricing')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all btn-ripple ${currentPage === 'pricing' ? 'bg-gradient-to-r from-spark-500/20 to-spark-600/10 text-spark-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          title={collapsed ? 'Pricing' : undefined}
        >
          <CreditCard className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>View Plans</span>}
        </button>
        <button
          onClick={() => onNavigate('help')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all btn-ripple ${currentPage === 'help' ? 'bg-gradient-to-r from-spark-500/20 to-spark-600/10 text-spark-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          title={collapsed ? 'Help' : undefined}
        >
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Help & FAQ</span>}
        </button>
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-all"
        >
          {collapsed ? <ChevronRight className="w-5 h-5 transition-transform" /> : <ChevronLeft className="w-5 h-5 transition-transform" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
