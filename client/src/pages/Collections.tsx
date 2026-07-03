import CollectionPage from "@/components/CollectionPage";

export function MenCollection() {
  return (
    <CollectionPage
      handle="men"
      title="Sunset Riders"
      subtitle="Men's Collection"
      tagline="For the ones who chase the horizon on two wheels."
      description="Back-print tees, trucker hats, hoodies, patches, and rally gear. Built for saltwater, horsepower, and the people who refuse to grow up."
      gradient="linear-gradient(160deg, #060e12 0%, #0d3040 40%, #1a4a5a 70%, #0d3040 100%)"
      accent="var(--teal)"
      seoTitle="Men's Apparel — Sunset Riders | Wet Kitty"
      seoDescription="Shop the Wet Kitty men's collection. Premium coastal biker tees, hoodies, trucker hats, and rally gear designed for saltwater and horsepower."
    />
  );
}

export function WomenCollection() {
  return (
    <CollectionPage
      handle="women"
      title="Chrome & Coast"
      subtitle="Women's Collection"
      tagline="Flirty, beachy, and still premium."
      description="Front chest prints, back graphics, soft colors, and designs that can sell at beach bars or bike rallies. Made for the women who ride shotgun and steal the show."
      gradient="linear-gradient(160deg, #1a0e20 0%, #2a1a3a 40%, #3a2a4a 70%, #2a1a3a 100%)"
      accent="var(--sand)"
      seoTitle="Women's Apparel — Chrome & Coast | Wet Kitty"
      seoDescription="Shop the Wet Kitty women's collection. Premium beach and biker lifestyle apparel — flirty, bold, and designed for women who steal the show."
    />
  );
}

export function HatsCollection() {
  return (
    <CollectionPage
      handle="hats"
      title="Crown & Chrome"
      subtitle="Hats & Caps"
      tagline="Top it off with something worth wearing."
      description="Trucker hats, dad hats, and embroidered caps. Premium quality with coastal and biker-inspired designs. Each one tells a story."
      gradient="linear-gradient(160deg, #0a1a20 0%, #152a35 40%, #1a3a45 70%, #152a35 100%)"
      accent="var(--sea)"
      seoTitle="Hats & Caps — Crown & Chrome | Wet Kitty"
      seoDescription="Shop Wet Kitty hats and caps. Premium embroidered trucker hats, dad hats, and snapbacks with coastal biker designs."
    />
  );
}

export function HoodiesCollection() {
  return (
    <CollectionPage
      handle="hoodies"
      title="Night Shift"
      subtitle="Hoodies & Sweatshirts"
      tagline="When the sun drops and the fire starts."
      description="Cozy and stylish. Perfect for beach bonfires or late-night rally afterparties. Premium fleece with embroidered and printed designs that get better with every wear."
      gradient="linear-gradient(160deg, #0a0a12 0%, #1a1a2a 40%, #2a2a3a 70%, #1a1a2a 100%)"
      accent="var(--sand)"
      seoTitle="Hoodies & Sweatshirts — Night Shift | Wet Kitty"
      seoDescription="Shop Wet Kitty hoodies and sweatshirts. Premium fleece with embroidered coastal biker designs — perfect for bonfires and rally afterparties."
    />
  );
}

export function BeachCollection() {
  return (
    <CollectionPage
      handle="beach"
      title="High Tide"
      subtitle="Beach Collection"
      tagline="Saltwater-ready. Sun-kissed. Always."
      description="Board shorts, tanks, towels, and everything you need for the perfect beach day. Designed to look good wet, dry, or somewhere in between."
      gradient="linear-gradient(160deg, #041a25 0%, #0a3040 40%, #0d4050 70%, #0a3040 100%)"
      accent="var(--teal)"
      seoTitle="Beach Collection — High Tide | Wet Kitty"
      seoDescription="Shop the Wet Kitty beach collection. Board shorts, tanks, towels, and premium beachwear designed to look good wet, dry, or somewhere in between."
    />
  );
}

export function LimitedDropCollection() {
  return (
    <CollectionPage
      handle="limited-drop"
      title="Last Call"
      subtitle="Limited Drops"
      tagline="Once they're gone, they're gone."
      description="Exclusive, numbered pieces. Small runs. No restocks. These are the designs that become collector's items. First come, first served."
      gradient="linear-gradient(160deg, #1a0a0a 0%, #2a1a15 40%, #3a2a20 70%, #2a1a15 100%)"
      accent="var(--sand)"
      seoTitle="Limited Drops — Last Call | Wet Kitty"
      seoDescription="Shop Wet Kitty limited drops. Exclusive, numbered pieces in small runs — no restocks. Collector's items for the true coastal biker lifestyle."
    />
  );
}
