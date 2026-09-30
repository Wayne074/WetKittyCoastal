import CollectionPage from "@/components/CollectionPage";
import { SHOP_SECTIONS, getShopSection } from "@shared/commerce/sections";

const GRADIENTS: Record<
  string,
  { gradient: string; accent: string; image: string }
> = {
  men: {
    gradient: "linear-gradient(160deg, #120c09 0%, #2a1a12 100%)",
    accent: "var(--sand)",
    image: "/images/lifestyle/mens-club.jpg",
  },
  club: {
    gradient: "linear-gradient(160deg, #1a0a0a 0%, #2a1a15 100%)",
    accent: "var(--sand)",
    image: "/images/lifestyle/club-night.jpg",
  },
  "coastal-ride": {
    gradient: "linear-gradient(160deg, #041a25 0%, #0a3040 100%)",
    accent: "var(--teal)",
    image: "/images/lifestyle/coastal-road.jpg",
  },
  women: {
    gradient: "linear-gradient(160deg, #1a0e20 0%, #2a1a3a 100%)",
    accent: "var(--sand)",
    image: "/images/lifestyle/womens-club.jpg",
  },
  hoodies: {
    gradient: "linear-gradient(160deg, #0a0a12 0%, #1a1a2a 100%)",
    accent: "var(--sand)",
    image: "/images/lifestyle/after-dark.jpg",
  },
  accessories: {
    gradient: "linear-gradient(160deg, #0a1a20 0%, #152a35 100%)",
    accent: "var(--sea)",
    image: "/images/lifestyle/gulf-wave.jpg",
  },
};

export function SectionCollection({ handle }: { handle: string }) {
  const section = getShopSection(handle) ?? SHOP_SECTIONS[0];
  const look = GRADIENTS[section.handle];
  return (
    <CollectionPage
      key={section.handle}
      handle={section.handle}
      title={section.title}
      subtitle={section.subtitle}
      tagline={section.tagline}
      description={section.description}
      gradient={look.gradient}
      accent={look.accent}
      heroImage={look.image}
      seoTitle={`${section.subtitle} — ${section.title} | Wet Kitty`}
      seoDescription={`Shop Wet Kitty ${section.subtitle.toLowerCase()}. ${section.description}`}
    />
  );
}

export function AllApparelCollection() {
  return (
    <CollectionPage
      title="The Whole Coast."
      subtitle="Shop All"
      tagline="Tees, hoodies, hats, and the night between them."
      description="Every Wet Kitty tee, hoodie, women's piece, and accessory in one place. Made to order on the Gulf."
      gradient="linear-gradient(160deg, #060e12 0%, #0d3040 100%)"
      accent="var(--teal)"
      heroImage="/images/lifestyle/shop-all.jpg"
      seoTitle="Shop All | Wet Kitty"
      seoDescription="Shop every Wet Kitty tee, hoodie, women's piece, and accessory — premium coastal biker apparel."
    />
  );
}
