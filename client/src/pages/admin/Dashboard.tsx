import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Total Orders',
      value: '1,234',
      icon: ShoppingCart,
      color: 'from-teal to-sea',
    },
    {
      label: 'Total Revenue',
      value: '$45,678',
      icon: TrendingUp,
      color: 'from-sea to-teal',
    },
    {
      label: 'Products',
      value: '89',
      icon: Package,
      color: 'from-sand to-cream',
    },
    {
      label: 'Customers',
      value: '456',
      icon: Users,
      color: 'from-ink to-sand',
    },
  ];

  return (
    <AdminLayout currentPage="dashboard">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back to Wet Kitty Admin</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon size={24} className="text-cream" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Add New Product
              </Button>
              <Button variant="outline" className="w-full justify-start">
                View Recent Orders
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Manage Inventory
              </Button>
              <Button variant="outline" className="w-full justify-start">
                View Settings
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <span className="text-sm">Shopify Connection</span>
                <span className="text-xs font-semibold text-green-600">Connected</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <span className="text-sm">Printful Connection</span>
                <span className="text-xs font-semibold text-green-600">Connected</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <span className="text-sm">Database</span>
                <span className="text-xs font-semibold text-green-600">Healthy</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-2 px-4">Order ID</th>
                  <th className="text-left py-2 px-4">Customer</th>
                  <th className="text-left py-2 px-4">Amount</th>
                  <th className="text-left py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-border hover:bg-accent">
                    <td className="py-3 px-4 font-mono text-xs">ORD-{1000 + i}</td>
                    <td className="py-3 px-4">Customer {i}</td>
                    <td className="py-3 px-4">${(100 + i * 50).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                        Shipped
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
