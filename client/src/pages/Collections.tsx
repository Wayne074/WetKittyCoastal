import CollectionPage from "@/components/CollectionPage";
import { SHOP_SECTIONS, getShopSection } from "@shared/commerce/sections";

const GRADIENTS: Record<string, { gradient: string; accent: string }> = {
  club: {
    gradient:
      "linear-gradient(160deg, #1a0a0a 0%, #2a1a15 40%, #3a2a20 70%, #2a1a15 100%)",
    accent: "var(--sand)",
  },
  "coastal-ride": {
    gradient:
      "linear-gradient(160deg, #041a25 0%, #0a3040 40%, #0d4050 70%, #0a3040 100%)",
    accent: "var(--teal)",
  },
  women: {
    gradient:
      "linear-gradient(160deg, #1a0e20 0%, #2a1a3a 40%, #3a2a4a 70%, #2a1a3a 100%)",
    accent: "var(--sand)",
  },
  hoodies: {
    gradient:
      "linear-gradient(160deg, #0a0a12 0%, #1a1a2a 40%, #2a2a3a 70%, #1a1a2a 100%)",
    accent: "var(--sand)",
  },
  accessories: {
    gradient:
      "linear-gradient(160deg, #0a1a20 0%, #152a35 40%, #1a3a45 70%, #152a35 100%)",
    accent: "var(--sea)",
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
      seoTitle={`${section.subtitle} — ${section.title} | Wet Kitty`}
      seoDescription={`Shop Wet Kitty ${section.subtitle.toLowerCase()}. ${section.description}`}
    />
  );
}

export function AllApparelCollection() {
  return (
    <CollectionPage
      title="Shop All"
      subtitle="The Full Wet Kitty Lineup"
      tagline="Beach days, bike nights, and everything between."
      description="Every Wet Kitty tee, hoodie, women's piece, and accessory in one place — made to order by Printful."
      gradient="linear-gradient(160deg, #060e12 0%, #0d3040 44%, #17605f 100%)"
      accent="var(--teal)"
      seoTitle="Shop All | Wet Kitty"
      seoDescription="Shop every Wet Kitty tee, hoodie, women's piece, and accessory — premium coastal biker apparel."
    />
  );
}
