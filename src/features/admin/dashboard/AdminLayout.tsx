import { ReactNode, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface NavItem {
  to: string;
  icon: ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/admin/martyrs', icon: <Users size={20} />, label: 'Martyrs' },
  { to: '/admin/memories', icon: <MessageSquare size={20} />, label: 'Pending Memories' },
];

export function AdminLayout() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation('admin');

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  return (
    <div className="min-h-screen bg-background texture-lines lg:pl-64">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col border-r border-neutral-300 bg-background text-neutral-900 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-300">
          <h1 className="text-xl font-bold tracking-tight uppercase">Archive Admin</h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors uppercase tracking-wider ${
                   isActive
                     ? 'bg-neutral-900 text-white'
                     : 'text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-300 bg-neutral-100/50">
          <div className="mb-4 px-2">
            <p className="text-sm font-bold text-neutral-900 truncate">
              {profile?.email}
            </p>
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mt-1">
              Role: {profile?.role}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-600 hover:text-white transition-colors uppercase tracking-wider border border-transparent hover:border-red-700"
          >
            <LogOut size={16} />
            <span className="ml-3">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-background border-b border-neutral-300 shadow-sm">
        <h1 className="text-lg font-bold uppercase tracking-tight text-neutral-900">Archive Admin</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-30 bg-background border-t border-neutral-300 flex flex-col shadow-2xl">
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-4 text-base font-medium transition-colors uppercase tracking-wider ${
                    isActive
                     ? 'bg-neutral-900 text-white'
                     : 'text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              );
            })}
            
            <div className="mt-4 pt-4 border-t border-neutral-300">
              <div className="mb-4 px-2">
                <p className="text-sm font-bold text-neutral-900 truncate">
                  {profile?.email}
                </p>
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mt-1">
                  Role: {profile?.role}
                </p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="flex items-center w-full px-4 py-4 text-base font-bold text-red-600 hover:bg-red-600 hover:text-white transition-colors uppercase tracking-wider"
              >
                <LogOut size={18} />
                <span className="ml-3">Sign Out</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-h-screen relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
