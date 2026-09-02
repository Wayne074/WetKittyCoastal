import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { ExternalLink, KeyRound } from "lucide-react";

const connections = [
  {
    name: "Printful",
    purpose: "Live products, variants, printing, and shipping",
    keys: "PRINTFUL_API_TOKEN and PRINTFUL_STORE_ID",
    href: "https://developers.printful.com/",
  },
  {
    name: "Stripe",
    purpose: "Secure payment, address collection, receipts, and order handoff",
    keys: "STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET",
    href: "https://dashboard.stripe.com/",
  },
];

export default function AdminSettings() {
  return (
    <AdminLayout currentPage="settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Store Connections</h1>
          <p className="mt-1 text-muted-foreground">
            Wet Kitty uses Printful for fulfillment and Stripe for payments.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {connections.map(connection => (
            <Card key={connection.name} className="p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{connection.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {connection.purpose}
                  </p>
                </div>
                <KeyRound className="h-5 w-5 text-teal" />
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm">
                <strong className="block">Private hosting settings</strong>
                <span className="text-muted-foreground">{connection.keys}</span>
              </div>
              <a
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal"
                href={connection.href}
                target="_blank"
                rel="noreferrer"
              >
                Open {connection.name} <ExternalLink className="h-4 w-4" />
              </a>
            </Card>
          ))}
        </div>
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Domain</h2>
          <p className="mt-2 text-muted-foreground">
            Primary storefront: wetkittycoastal.com
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Private keys are never displayed or saved in the website.
          </p>
        </Card>
      </div>
    </AdminLayout>
  );
}
