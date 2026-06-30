import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ToastContainer from './components/Toast';
import NotificationPanel from './components/NotificationPanel';
import Dashboard from './pages/Dashboard';
import Coaching from './pages/Coaching';
import Profile from './pages/Profile';
import TeamManagement from './pages/TeamManagement';
import Analytics from './pages/Analytics';
import Billing from './pages/Billing';
import Pricing from './pages/Pricing';
import Organization from './pages/Organization';
import Security from './pages/Security';
import Goals from './pages/Goals';
import Notes from './pages/Notes';
import Help from './pages/Help';
import Onboarding from './pages/Onboarding';
import { useStore } from './store/useStore';
import { Bell, Search, Menu, X, Sparkles } from 'lucide-react';

export default function App() {
  const store = useStore();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageKey, setPageKey] = useState(0);

  const unreadCount = store.notifications.filter(n => !n.read).length;

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
      if (e.key === 'Escape') { setShowSearch(false); setShowNotifications(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const navigate = (page: string) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setPageKey(k => k + 1);
  };

  if (showOnboarding) {
    return (
      <>
        <Onboarding onComplete={() => { setShowOnboarding(false); store.addToast('success', 'Welcome to Worksparks! Your profile has been set up.'); }} />
        <ToastContainer store={store} />
      </>
    );
  }

  const pages: Record<string, { title: string; items: string[] }> = {
    dashboard: { title: 'Dashboard', items: ['overview', 'stats', 'sessions', 'goals'] },
    coaching: { title: 'AI Coach', items: ['chat', 'frameworks', 'feedback'] },
    goals: { title: 'Goals', items: ['leadership goals', 'milestones', 'progress'] },
    notes: { title: 'Notes & Insights', items: ['session notes', 'pinned', 'insights'] },
    profile: { title: 'My Profile', items: ['personal info', 'settings', 'plan'] },
    team: { title: 'Team Management', items: ['employees', 'invite', 'csv upload'] },
    analytics: { title: 'HR Analytics', items: ['charts', 'departments', 'export'] },
    billing: { title: 'Billing', items: ['subscription', 'invoices', 'payment'] },
    pricing: { title: 'Plans & Pricing', items: ['individual', 'team', 'enterprise'] },
    organization: { title: 'Organization', items: ['settings', 'admins', 'security'] },
    security: { title: 'Security', items: ['firestore rules', 'api auth', 'compliance'] },
    help: { title: 'Help & FAQ', items: ['faq', 'support', 'contact'] },
  };

  const searchResults = searchQuery.trim() ? Object.entries(pages).filter(([, v]) =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.items.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : Object.entries(pages);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard store={store} onNavigate={navigate} />;
      case 'coaching': return <Coaching store={store} />;
      case 'goals': return <Goals store={store} />;
      case 'notes': return <Notes store={store} />;
      case 'profile': return <Profile store={store} />;
      case 'team': return <TeamManagement store={store} />;
      case 'analytics': return <Analytics store={store} />;
      case 'billing': return <Billing store={store} />;
      case 'pricing': return <Pricing store={store} />;
      case 'organization': return <Organization store={store} />;
      case 'security': return <Security store={store} />;
      case 'help': return <Help store={store} />;
      default: return <Dashboard store={store} onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80">
      {/* Mobile overlay */}
      {mobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden anim-overlay" onClick={() => setMobileMenuOpen(false)} />}

      {/* Sidebar */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
        <Sidebar currentPage={currentPage} onNavigate={navigate} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} unreadCount={unreadCount} />
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-100">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg lg:hidden transition-colors"><Menu className="w-5 h-5" /></button>
              <div>
                <h2 className="font-semibold text-slate-900">{pages[currentPage]?.title || 'Dashboard'}</h2>
                <p className="text-xs text-slate-500 hidden sm:block">Worksparks AI Leadership Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search Trigger */}
              <button onClick={() => setShowSearch(true)} className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-400 w-56 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer">
                <Search className="w-4 h-4" /><span>Search...</span><kbd className="ml-auto text-xs bg-white px-1.5 py-0.5 rounded border border-slate-200">⌘K</kbd>
              </button>

              {/* Onboarding Demo */}
              <button onClick={() => setShowOnboarding(true)} className="hidden sm:flex px-3 py-2 text-xs font-medium text-spark-600 bg-spark-50 border border-spark-200 rounded-xl hover:bg-spark-100 transition-all items-center gap-1.5 interactive">
                <Sparkles className="w-3.5 h-3.5" /> Onboarding
              </button>

              {/* Notifications */}
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl relative transition-all interactive">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-spark-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center anim-pop">{unreadCount}</span>
                  )}
                </button>
                <NotificationPanel store={store} open={showNotifications} onClose={() => setShowNotifications(false)} />
              </div>

              {/* Avatar */}
              <button onClick={() => navigate('profile')} className="flex items-center gap-3 pl-3 border-l border-slate-200 interactive">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">{store.user.name}</p>
                  <p className="text-xs text-slate-500">{store.user.role}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-spark-400 to-spark-600 flex items-center justify-center text-white text-xs font-bold shadow-sm hover:shadow-md transition-shadow">
                  {store.user.avatar}
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8" key={pageKey}>
          {renderPage()}
        </main>
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh] p-4" onClick={() => setShowSearch(false)}>
          <div className="absolute inset-0 bg-black/40 anim-overlay" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden anim-modal" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search pages, features..." className="flex-1 text-sm focus:outline-none placeholder:text-slate-400" autoFocus />
              <button onClick={() => setShowSearch(false)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2">
              {searchResults.map(([key, val]) => (
                <button key={key} onClick={() => { navigate(key); setShowSearch(false); setSearchQuery(''); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-spark-50 transition-colors group flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-spark-100 flex items-center justify-center transition-colors">
                    <Search className="w-4 h-4 text-slate-400 group-hover:text-spark-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 group-hover:text-spark-600 transition-colors">{val.title}</p>
                    <p className="text-xs text-slate-400">{val.items.join(' · ')}</p>
                  </div>
                </button>
              ))}
              {searchResults.length === 0 && (
                <div className="text-center py-8 text-slate-400"><Search className="w-6 h-6 mx-auto mb-2 opacity-40" /><p className="text-sm">No results found</p></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <ToastContainer store={store} />
    </div>
  );
}
