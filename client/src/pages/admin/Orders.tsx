import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export default function AdminOrders() {
  const orders = [
    {
      id: 'ORD-1001',
      customer: 'John Doe',
      email: 'john@example.com',
      amount: 189.98,
      items: 2,
      status: 'Shipped',
      shipping: 'In Transit',
      date: '2026-06-24',
    },
    {
      id: 'ORD-1002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      amount: 89.99,
      items: 1,
      status: 'Processing',
      shipping: 'Pending',
      date: '2026-06-25',
    },
    {
      id: 'ORD-1003',
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      amount: 249.97,
      items: 3,
      status: 'Delivered',
      shipping: 'Delivered',
      date: '2026-06-23',
    },
    {
      id: 'ORD-1004',
      customer: 'Sarah Williams',
      email: 'sarah@example.com',
      amount: 129.98,
      items: 2,
      status: 'Pending',
      shipping: 'Not Shipped',
      date: '2026-06-25',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout currentPage="orders">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage customer orders and shipping</p>
        </div>

        {/* Orders Table */}
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Items</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Order Status</th>
                  <th className="text-left py-3 px-4">Shipping</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-accent">
                    <td className="py-3 px-4 font-mono font-semibold">{order.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{order.items}</td>
                    <td className="py-3 px-4 font-semibold">${order.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-muted-foreground">{order.shipping}</span>
                    </td>
                    <td className="py-3 px-4 text-xs">{order.date}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye size={14} />
                        View
                      </Button>
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
