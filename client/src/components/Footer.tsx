import { Link } from "wouter";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Men", href: "/collections/men" },
      { label: "Women", href: "/collections/women" },
      { label: "Collections", href: "/collections/apparel" },
      { label: "Beach", href: "/collections/coastal-ride" },
      { label: "Accessories", href: "/collections/accessories" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/about" },
      { label: "Founding Crew", href: "/founding-crew" },
      { label: "Community", href: "/community" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQs", href: "/faq" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: "#071417", color: "#f6efe4" }}>
      <div className="container py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-4" aria-label="Wet Kitty Coastal home">
              <img
                src="/images/brand/wet-kitty-mark.png"
                alt="Wet Kitty Coastal"
                className="h-24 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(246,239,228,0.72)" }}>
              Stay Salty. Ride Free. Life&apos;s Better Wet.
            </p>
            <a href="mailto:bigcat@wetkittycoastal.com" className="mt-4 inline-block text-sm font-semibold text-[#7fd8d4]">
              bigcat@wetkittycoastal.com
            </a>
          </div>

          {columns.map(column => (
            <div key={column.title} className="lg:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] mb-4" style={{ color: "#e7c56a" }}>
                {column.title}
              </h4>
              <nav className="flex flex-col gap-2.5">
                {column.links.map(item => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-sm transition-colors hover:text-[#7fd8d4]"
                    style={{ color: "rgba(246,239,228,0.72)" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] mb-4" style={{ color: "#e7c56a" }}>
              Follow the Tide
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(246,239,228,0.72)" }}>
              Stay Salty. Ride Free.
            </p>
            <p className="mt-6 text-xs" style={{ color: "rgba(246,239,228,0.45)" }}>
              &copy; {new Date().getFullYear()} Wet Kitty Coastal.
              <br />
              All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
