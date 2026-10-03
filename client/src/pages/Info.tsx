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
    <InfoPage eyebrow="OUR STORY" title="ABOUT WET KITTY COASTAL" meta="Stay Salty. Ride Free. Life’s Better Wet." intro="Stay Salty. Ride Free. Life’s Better Wet.">
      <Block title="BORN ON THE COAST">
        <p>Wet Kitty Coastal was born in Panama City Beach, Florida — where boats, bikes, beach days and late nights are all part of the same life. We wanted a brand that actually belonged here. Not another souvenir shirt. Not another generic beach logo. Something built around the people who live for the water, the road, and whatever happens after sunset.</p>
      </Block>
      <Block title="ONE MORE SHOT">
        <p>Wet Kitty didn’t start with investors, a big company, or a safety net. It started with an idea and one guy trying to build something from the ground up when starting over was the only direction left to go.</p>
        <p>This is one more shot at building something that matters — a real brand from Panama City Beach that can grow far beyond it. Every order, every shirt in the wild, and every person who tells somebody about Wet Kitty becomes part of that story.</p>
      </Block>
      <Block title="MORE THAN A SHIRT">
        <p>Wet Kitty is about the life around the clothes. Boats tied up at the sandbar. Motorcycles headed toward the coast. Trucks, fishing, beach bars, bonfires, good friends and weekends that run longer than planned.</p>
        <p>Beach people and bike people may look like different crowds, but around here they end up watching the same sunset.</p>
        <p>Same sand. Different breed.</p>
      </Block>
      <Block title="MADE TO ORDER">
        <p>Most Wet Kitty apparel is made when you order it instead of sitting in a warehouse waiting to be sold. That lets us build the brand without filling shelves with leftovers and keeps the focus on creating designs people actually want to wear.</p>
      </Block>
      <Block title="GET IN EARLY">
        <p>Wet Kitty Coastal is still at the beginning. That is the point.</p>
        <p>The people finding us now aren’t showing up after the brand became something. They’re the people helping make it something.</p>
        <p>Years from now, if Wet Kitty is everywhere, we want the original crew to be able to say:</p>
        <p>“I was there before everybody knew the name.”</p>
      </Block>
      <div>
        <h2 className="mb-3 text-2xl">JOIN THE FOUNDING CREW</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>Be part of Wet Kitty from the beginning. Get early drops, Founding Crew benefits, and your place in the story while we’re still writing it.</p>
        </div>
        <div className="mt-3">
          <Link href="/founding-crew" className="btn btn-primary">JOIN THE FOUNDING CREW</Link>
        </div>
      </div>
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

function Mark({
  who,
  children,
}: {
  who: "WAYNE" | "COUNSEL";
  children: ReactNode;
}) {
  const label = who === "WAYNE" ? "NEEDS WAYNE" : "NEEDS COUNSEL";
  return (
    <strong className="text-foreground">
      [{label}] {children}
    </strong>
  );
}

export function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy Policy"
      meta="How Wet Kitty Coastal handles order, membership, and contact information. Draft for the private preview, not a lawyer-approved policy."
      intro="This page describes what this site actually does today. It is a draft for the private preview. It is not a finished legal policy."
    >
      <Block title="Who this is about">
        <p>
          The shop name on this site is Wet Kitty Coastal.{" "}
          <Mark who="WAYNE">
            Legal name of the seller, mailing address, and state of formation are not on this page.
          </Mark>
        </p>
        <p>
          Questions about your information: <EmailLink />.
        </p>
      </Block>
      <Block title="What we collect">
        <p>
          Apparel is made to order. Founding Crew is a separate one-time membership, not a product in the cart.
        </p>
        <p>
          Shop checkout is Stripe-hosted. PayPal is not offered. Stripe collects the payment details. This site does not store your full card number. Stripe also receives the name, email, and shipping address you enter so the order can be made and shipped.
        </p>
        <p>
          Founding Crew checkout is a Stripe payment link for a $147 one-time membership. The same Stripe-hosted collection applies. PayPal is not part of that checkout either.
        </p>
        <p>
          If you email <EmailLink />, we keep that email and whatever you send, including an order number or photos, so we can answer you.
        </p>
        <p>
          The shopping bag keeps a cart id in your browser&apos;s local storage so the bag can be reopened on this device.
        </p>
        <p>
          <Mark who="WAYNE">
            Confirm whether any extra fields (shirt size, wall name, phone) are collected on the live Founding Crew payment link. This page does not list fields that were not confirmed.
          </Mark>
        </p>
      </Block>
      <Block title="What we do not do">
        <p>
          This site does not run its own ad pixels, analytics tags, or a mailing-list signup in the code that ships with the storefront today.
        </p>
        <p>
          <Mark who="WAYNE">
            Say if a separate email tool, ad account, or analytics tool is already collecting visitor data outside this repo.
          </Mark>
        </p>
      </Block>
      <Block title="Who else sees it">
        <p>
          Stripe processes the payment. The printer who makes the gear receives what they need to print and ship the order (the item, size, and delivery address). We do not sell customer lists.
        </p>
        <p>
          <Mark who="COUNSEL">
            Name the fulfillment company in a customer-facing policy only if you want it public. Customer product pages do not name the printer.
          </Mark>
        </p>
        <p>
          <Mark who="COUNSEL">
            Whether GDPR, UK GDPR, CCPA/CPRA, or another privacy law applies, and what access, deletion, or opt-out rights to promise, is not decided here.
          </Mark>
        </p>
      </Block>
      <Block title="How long we keep it">
        <p>
          <Mark who="COUNSEL">
            Retention periods for orders, memberships, and support emails are not set.
          </Mark>
        </p>
      </Block>
      <Block title="Founding Crew count">
        <p>
          Founding Crew is capped at 1,500 memberships. The price is $147 once. The page counter is maintained by hand. The seeded figure in the site code is 58 sold (1,442 remaining). That seed is not a live count of Stripe charges, and this policy does not add any sales on top of it.
        </p>
        <p>
          <Mark who="WAYNE">
            Confirm that 58 is still the number you want shown before this page is treated as describing real memberships.
          </Mark>
        </p>
      </Block>
    </InfoPage>
  );
}

export function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms of Service"
      meta="Draft terms for Wet Kitty Coastal made-to-order apparel and the Founding Crew membership. Not lawyer-approved."
      intro="These terms are a draft so the private preview has a page to link. They are not a lawyer-approved contract."
    >
      <Block title="The seller">
        <p>
          You are buying from the Wet Kitty Coastal shop.{" "}
          <Mark who="WAYNE">
            Legal entity name, mailing address, and state of formation go here.
          </Mark>
        </p>
        <p>
          Support: <EmailLink />.
        </p>
      </Block>
      <Block title="Made-to-order apparel">
        <p>
          Tees, hoodies, hats, and the other gear are printed when you order them. They are not sitting in a warehouse waiting. That is why a change of mind or a wrong size is not a normal return. The <Link href="/returns" className="font-semibold text-teal underline underline-offset-2">Returns</Link> page says the same thing.
        </p>
        <p>
          If something arrives damaged, misprinted, or not what you ordered, email <EmailLink /> with the order number and clear photos.
        </p>
        <p>
          <Mark who="COUNSEL">
            A refund or replacement window was not provided, so none is stated here. Do not read the returns page as a 30-day policy.
          </Mark>
        </p>
      </Block>
      <Block title="Price, shipping, and payment">
        <p>
          The price on the product page is the item price in US dollars. Shipping is $5.99 for standard shipping, and free on orders over $100. Most made-to-order orders arrive in about 5–12 business days after you order. Shipping is shown again before you pay.
        </p>
        <p>
          <Mark who="COUNSEL">
            Sales tax is calculated at Stripe checkout. This page does not state a tax rate or which states are registered.
          </Mark>
        </p>
        <p>
          Shop checkout is hosted by Stripe. PayPal is not live and is not a way to pay. We do not store your full card number.
        </p>
        <p>
          The public shop is not open yet. These product terms apply when an order can actually be placed. Founding Crew can be purchased while the apparel shop is still closed.
        </p>
      </Block>
      <Block title="Founding Crew">
        <p>
          Founding Crew is a one-time $147 membership. It is not a subscription and it is not a monthly charge. Memberships are capped at 1,500. The on-site counter is manual. The seeded sold count in the code is 58, which the page turns into 1,442 remaining. This page does not claim any sales beyond that seed.
        </p>
        <p>
          <Mark who="WAYNE">
            Confirm the seeded 58 still matches the memberships you want counted, and list the kit and the permanent discount in numbers you will actually honor. The discount amount is not stated here because it was not provided.
          </Mark>
        </p>
        <p>
          Founding Crew payment runs through a Stripe-hosted payment link. PayPal is not offered.
        </p>
        <p>
          <Mark who="COUNSEL">
            Whether a Founding Crew membership is refundable, transferable, or numbered only after payment clears is not decided on this page.
          </Mark>
        </p>
      </Block>
      <Block title="Disputes">
        <p>
          <Mark who="COUNSEL">
            Governing law, venue, arbitration, class-action waiver, and any cap on damages are intentionally left out. Do not assume Florida law or an arbitration clause.
          </Mark>
        </p>
        <p>
          Until that is written, write to <EmailLink /> and we will try to fix a real order problem.
        </p>
      </Block>
      <Block title="The rest">
        <p>
          <Mark who="WAYNE">
            Minimum age to buy, and whether the brand&apos;s adult positioning is a rule of purchase, was not set for these terms.
          </Mark>
        </p>
        <p>
          <Mark who="COUNSEL">
            Trademark, user-content, and limitation-of-liability language is not included until counsel writes it.
          </Mark>
        </p>
        <p>Last drafted for the private preview on September 30, 2026. The shop is not published by this page.</p>
      </Block>
    </InfoPage>
  );
}
