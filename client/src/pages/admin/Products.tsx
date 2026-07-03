import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

export default function AdminProducts() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [products] = useState([
    {
      id: 1,
      name: 'Sunset Riders Hoodie',
      sku: 'WK-HOOD-001',
      price: 89.99,
      stock: 45,
      embroidery: true,
      published: true,
      image: '🏍️',
    },
    {
      id: 2,
      name: 'Beach Biker Tee',
      sku: 'WK-TEE-001',
      price: 39.99,
      stock: 120,
      embroidery: false,
      published: true,
      image: '🌊',
    },
    {
      id: 3,
      name: 'Coastal Cap',
      sku: 'WK-CAP-001',
      price: 34.99,
      stock: 67,
      embroidery: true,
      published: false,
      image: '🧢',
    },
  ]);

  return (
    <AdminLayout currentPage="products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground mt-1">Manage your product catalog</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
            <Plus size={18} />
            Add Product
          </Button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <Card className="p-6 bg-accent">
            <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Product Name" />
              <Input placeholder="SKU" />
              <Input placeholder="Price" type="number" step="0.01" />
              <Input placeholder="Stock Quantity" type="number" />
              <div className="md:col-span-2">
                <Input placeholder="Product Description" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Embroidery Product</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Publish Immediately</span>
              </label>
              <div className="md:col-span-2 flex gap-2">
                <Button variant="default">Create Product</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Products Table */}
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">SKU</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Stock</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-accent">
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{product.image}</span>
                        {product.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">{product.sku}</td>
                    <td className="py-3 px-4">${product.price.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {product.embroidery ? (
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-teal/20 text-teal">
                          Embroidery
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-sea/20 text-sea">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {product.published ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600">
                          <Eye size={14} /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <EyeOff size={14} /> Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1.5 hover:bg-accent rounded">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-1.5 hover:bg-accent rounded text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
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
