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

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-neutral-200">
          <div className="flex items-center justify-center h-16 px-4 border-b border-neutral-200">
            <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-neutral-200">
            <div className="mb-3">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {profile?.email}
              </p>
              <p className="text-xs text-neutral-500 capitalize">{profile?.role}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span className="ml-2">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-neutral-200 z-40">
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className="text-lg font-bold text-primary">Admin Panel</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-neutral-200 bg-white">
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="px-4 pb-4 border-t border-neutral-200 pt-4">
              <div className="mb-3">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {profile?.email}
                </p>
                <p className="text-xs text-neutral-500 capitalize">{profile?.role}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span className="ml-2">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="pt-16 md:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
