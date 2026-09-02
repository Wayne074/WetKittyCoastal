export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border/60 bg-card">
        <div className="container max-w-4xl py-12 md:py-16">
          <span className="eyebrow mb-3 block">Order support</span>
          <h1 className="text-3xl md:text-5xl">Returns &amp; Problem Orders</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">Every Wet Kitty item is made to order. Our policy follows the fulfillment provider&apos;s made-to-order return rules.</p>
        </div>
      </section>

      <section className="container max-w-4xl space-y-10 py-10 md:py-14">
        <div>
          <h2 className="mb-3 text-2xl">We&apos;ll make fulfillment problems right</h2>
          <p className="text-muted-foreground">Contact Wet Kitty within 30 days of delivery if an item arrives damaged, defective, misprinted, or incorrect. Lost-in-transit claims must be reported within 30 days of the estimated delivery date. Approved claims qualify for a replacement or refund.</p>
        </div>

        <div>
          <h2 className="mb-3 text-2xl">What we&apos;ll need</h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Your order number and a description of the problem.</li>
            <li>Clear photos showing damage, defects, or printing errors.</li>
            <li>One photo showing all affected items when several products have the same issue.</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-2xl">Made-to-order items</h2>
          <p className="text-muted-foreground">Returns and exchanges are not accepted for buyer&apos;s remorse, choosing the wrong size or color, or changing your mind after delivery. Please check the product details and size information before ordering.</p>
        </div>

        <div>
          <h2 className="mb-3 text-2xl">Address problems</h2>
          <p className="text-muted-foreground">If you entered the wrong delivery address, contact us immediately. We may be able to correct it before shipment. Once shipped, rerouting is not guaranteed, and reshipping charges may apply.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-2 text-xl">Need help with an order?</h2>
          <p className="mb-5 text-muted-foreground">Have your order number and photos ready so the claim can be handled without delay.</p>
          <p className="text-sm font-semibold text-teal">Customer-support contact details will be added before ordering opens.</p>
        </div>
      </section>
    </div>
  );
}
