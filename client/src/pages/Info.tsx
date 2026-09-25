import { useEffect, type ReactNode } from "react";
import { Link } from "wouter";
import { SUPPORT_EMAIL, SHIPPING_SUMMARY, setPageMeta } from "@/const";

function InfoPage({ eyebrow, title, intro, meta, children }: { eyebrow: string; title: string; intro: string; meta: string; children: ReactNode }) {
  useEffect(() => {
    setPageMeta(`${title} | Wet Kitty Coastal`, meta);
  }, [title, meta]);
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border/60 bg-card">
        <div className="container max-w-4xl py-12 md:py-16">
          <span className="eyebrow mb-3 block">{eyebrow}</span>
          <h1 className="text-3xl md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{intro}</p>
        </div>
      </section>
      <section className="container max-w-4xl space-y-10 py-10 md:py-14">{children}</section>
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-2xl">{title}</h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </div>
  );
}

export function EmailLink() {
  return (
    <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-teal underline underline-offset-2">
      {SUPPORT_EMAIL}
    </a>
  );
}

export function AboutPage() {
  return (
    <InfoPage eyebrow="Our story" title="About Wet Kitty Coastal" meta="Wet Kitty Coastal is beach and biker lifestyle apparel, inspired by and born in Panama City Beach." intro="Stay Salty. Ride Free. Life's Better Wet.">
      <Block title="Born on the coast">
        <p>Wet Kitty Coastal started in Panama City Beach, where the beach crowd and the bike crowd share the same sunsets. We make tees, hoodies, hats and accessories for the riders, the beach lovers and the good-time chasers.</p>
      </Block>
      <Block title="Made to order">
        <p>Every piece is printed when you order it, just for you. That means less waste and no warehouse full of leftovers.</p>
      </Block>
      <Block title="Join the crew">
        <p>Want in early? The <Link href="/founding-crew" className="font-semibold text-teal underline underline-offset-2">Founding Crew</Link> is open now.</p>
      </Block>
    </InfoPage>
  );
}

export function ShippingPage() {
  return (
    <InfoPage eyebrow="Order info" title="Shipping" meta={SHIPPING_SUMMARY} intro={SHIPPING_SUMMARY}>
      <Block title="Rates">
        <p><strong className="text-foreground">$5.99</strong> flat-rate standard shipping.</p>
        <p><strong className="text-foreground">Free</strong> standard shipping on orders over $100.</p>
        <p>Shipping is shown before you pay at checkout.</p>
      </Block>
      <Block title="Timing">
        <p>Each item is made to order. Most orders arrive in about 5–12 business days from when you order.</p>
        <p>You&apos;ll get an email with tracking when your order ships.</p>
      </Block>
      <Block title="Questions?">
        <p>Email us at <EmailLink />.</p>
      </Block>
    </InfoPage>
  );
}

export function FaqPage() {
  const faqs: [string, ReactNode][] = [
    ["How much is shipping?", <>$5.99 flat, and free on orders over $100. See <Link href="/shipping" className="font-semibold text-teal underline underline-offset-2">Shipping</Link>.</>],
    ["How long will my order take?", "Everything is made to order. Most orders arrive in about 5–12 business days."],
    ["How do the tees and hoodies fit?", "Our tees and hoodies are a classic, relaxed fit. The women's tees, raglan baby tees and crop tanks are a closer, fitted cut. If you're between sizes, size up."],
    ["How should I wash my gear?", "Wash inside out in cold water and tumble dry low or hang dry. Don't iron directly on the print."],
    ["Can I return or exchange an item?", <>Because every item is made just for you, we can&apos;t take returns for a change of mind or the wrong size. If something is wrong with your order, email <EmailLink /> with your order number and photos. See <Link href="/returns" className="font-semibold text-teal underline underline-offset-2">Returns</Link>.</>],
    ["How do I contact you?", <>Email <EmailLink />.</>],
  ];
  return (
    <InfoPage eyebrow="Help" title="FAQ" meta="Answers about Wet Kitty Coastal shipping, sizing, care, returns and contact." intro="Quick answers to the questions we get the most.">
      {faqs.map(([q, a]) => (
        <Block key={q} title={q}><p>{a}</p></Block>
      ))}
    </InfoPage>
  );
}

export function ContactPage() {
  return (
    <InfoPage eyebrow="Get in touch" title="Contact" meta={`Contact Wet Kitty Coastal at ${SUPPORT_EMAIL}.`} intro="Questions, order help, or just want to say hey? Send us an email.">
      <Block title="Email">
        <p className="text-lg"><EmailLink /></p>
        <p>For order help, include your order number and, if something looks wrong, a few clear photos.</p>
      </Block>
    </InfoPage>
  );
}
