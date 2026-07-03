import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'domain', label: 'Domain' },
    { id: 'shopify', label: 'Shopify' },
    { id: 'printful', label: 'Printful' },
  ];

  return (
    <AdminLayout currentPage="settings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your store configuration</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-teal text-teal font-semibold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Website Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Store Name</label>
                  <Input defaultValue="Wet Kitty" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Store Description</label>
                  <Input
                    defaultValue="Premium coastal + biker lifestyle apparel"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Store Email</label>
                  <Input defaultValue="hello@wetkitty.com" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Support Email</label>
                  <Input defaultValue="support@wetkitty.com" className="mt-1" />
                </div>
                <Button>Save Changes</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Domain Settings */}
        {activeTab === 'domain' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Domain Configuration</h2>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">Primary Domain</p>
                    <p className="text-sm text-green-800">wetkittycoastal.com</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900">Secondary Domain</p>
                    <p className="text-sm text-blue-800">www.wetkittycoastal.com</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="font-semibold text-gray-900">Manus Default Domain</p>
                  <p className="text-sm text-gray-800">wetkittyshop-k2zek9pv.manus.space</p>
                </div>
                <Button variant="outline">Add Custom Domain</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Shopify Settings */}
        {activeTab === 'shopify' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Shopify Connection</h2>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">Connected</p>
                    <p className="text-sm text-green-800">nt8yrw-atlas-orbit-nebula.myshopify.com</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Store Domain</label>
                  <Input
                    defaultValue="nt8yrw-atlas-orbit-nebula.myshopify.com"
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Storefront API Token</label>
                  <Input
                    defaultValue="••••••••••••••••••••••••••••••••"
                    disabled
                    className="mt-1"
                  />
                </div>
                <Button variant="outline">Reconnect Shopify</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Printful Settings */}
        {activeTab === 'printful' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Printful Connection</h2>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">Connected</p>
                    <p className="text-sm text-green-800">Printful account linked to Shopify store</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Embroidery Settings</label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Enable embroidery customization</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Allow custom embroidery text</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Require embroidery approval before fulfillment</span>
                    </label>
                  </div>
                </div>
                <Button>Save Embroidery Settings</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
