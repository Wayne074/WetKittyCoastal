import { useState } from 'react';
import { Menu, X, LogOut, BarChart3, Package, Users, Settings, Zap } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export default function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/admin' },
    { id: 'orders', label: 'Orders', icon: Package, href: '/admin/orders' },
    { id: 'products', label: 'Products', icon: Package, href: '/admin/products' },
    { id: 'customers', label: 'Customers', icon: Users, href: '/admin/customers' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 hover:bg-accent lg:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal to-sea flex items-center justify-center">
                <span className="text-sm font-bold text-cream">WK</span>
              </div>
              <h1 className="text-lg font-semibold">Wet Kitty Admin</h1>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } border-r border-border bg-background transition-all duration-300 overflow-hidden lg:w-64`}
        >
          <nav className="space-y-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-teal text-cream'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Connection Status */}
          <div className="border-t border-border p-4 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase">
              Connections
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Shopify Connected</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Printful Connected</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
