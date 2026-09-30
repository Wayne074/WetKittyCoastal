/**
 * Customer-facing product copy. Lifestyle first, garment facts after.
 * Never names a supplier, a blank brand, or a returns promise.
 */

const SHIPPING =
  "Made to order. $5.99 shipping, free over $100, about 5–12 business days.";

function womensCut(title: string, flagged: boolean) {
  return flagged || /\b(women|babydoll|crop tank|dress)\b/i.test(title);
}

function lifeLine(title: string, hers: boolean) {
  const t = title.toLowerCase();
  if (/yacht|rod club/.test(t)) {
    return hers
      ? "Boats, dock lights, and a night she got ready for because she wanted to."
      : "Boats, fishing, and a Gulf night that starts on the water and ends at the bar.";
  }
  if (/sky high/.test(t)) {
    return hers
      ? "Girls' night and skyline lights. She wore it because she wanted to."
      : "Guys' night under the skyline lights, and a date night if the weekend turns that way.";
  }
  if (/race club|street tee/.test(t)) {
    return hers
      ? "Nightlife, chrome, and a weekend she showed up for because she wanted to."
      : "Cars, bikes, and a Saturday with the guys that starts loud and stays out late.";
  }
  if (/down low/.test(t)) {
    return hers
      ? "Beach road, windows down, nowhere she has to be. She dressed for it."
      : "Trucks, low light, and a guys' weekend that runs long.";
  }
  if (/wave bike|\bbike\b/.test(t)) {
    return hers
      ? "Salt air, a boat day that turned into a night ride, because she felt like it."
      : "Bikes, salt air, and the long way home with the guys.";
  }
  if (/highway/.test(t)) {
    return hers
      ? "Highway sun, a beach day that runs late, and a look she chose."
      : "Open highway, the truck or the bike, the Gulf on one side, no clock on the weekend.";
  }
  if (/salty/.test(t)) {
    return hers
      ? "Beach day into girls' night. Sun on her shoulders, then the lights, because she wanted the whole day."
      : "Salt, the boat, the guys, and a weekend that refuses to end.";
  }
  if (/coastal lifestyle|lifestyle/.test(t)) {
    return hers
      ? "Panama City Beach. Water, boats, nightlife, and a night she chose for herself."
      : "Panama City Beach with the guys. Beach, boats, trucks, and nowhere to be in the morning.";
  }
  if (/hoodie|pullover|\bzip\b/.test(t)) {
    return hers
      ? "The air drops after the beach. She keeps the night going because she wants to."
      : "Bonfire, a cool ride, and the bar if the guys are still out.";
  }
  if (/hat|\bcap\b/.test(t)) {
    return "Shade on the boat, the truck, the bar. The day keeps going.";
  }
  if (/sticker/.test(t)) {
    return "For the cooler, the board, the toolbox. A little Gulf Coast wherever you stick it.";
  }
  if (/koozie/.test(t)) {
    return "Cold drink, hot dock, friends who stay too long. That is the point.";
  }
  if (/towel/.test(t)) {
    return "Sand, salt, and a spot on the beach that is yours until the light goes.";
  }
  if (/flag/.test(t)) {
    return "Hang it at the dock, the garage, the porch. The crew knows whose place it is.";
  }
  if (/dress/.test(t)) {
    return "Beach day to night out, one piece. Water, lights, and a look you wore on purpose.";
  }
  if (/brand mark|paw|wave apparel/.test(t)) {
    return hers
      ? "The mark, worn because she wants to. Beach, boats, and a night out."
      : "The Wet Kitty mark for boats, trucks, and nights with the guys.";
  }
  return hers
    ? "Beach, boats, and the water, then a night out she chose. Confident, and not dressed for anyone else."
    : "Gulf Coast weekends: beach, boats, trucks, bikes, the bar, and a night out with the guys.";
}

function garmentFacts(title: string) {
  const t = title.toLowerCase();
  if (/zip/.test(t) && /hoodie/.test(t))
    return "Heavyweight cotton-blend zip hoodie.";
  if (/hoodie|pullover/.test(t)) return "Heavyweight cotton-blend hoodie.";
  if (/crop tank|tank/.test(t)) return "Soft ribbed crop tank.";
  if (/babydoll|baby tee|raglan/.test(t)) return "Soft ribbed raglan baby tee.";
  if (/hat|\bcap\b/.test(t)) return "Classic cotton dad hat.";
  if (/sticker/.test(t)) return "Kiss-cut vinyl sticker.";
  if (/koozie/.test(t)) return "Foam can koozie.";
  if (/flag/.test(t))
    return "Printed wall and porch flag, with grommets so it hangs easy.";
  if (/towel/.test(t)) return "Plush, full-color beach towel.";
  if (/dress/.test(t))
    return "Soft stretch skater dress with an all-over paw print.";
  if (/women/.test(t)) return "Soft cotton women's tee.";
  if (/tee|t-shirt|shirt/.test(t)) return "Soft cotton tee.";
  return "";
}

function placement(title: string, backPrint: boolean) {
  const t = title.toLowerCase();
  if (/hoodie|pullover/.test(t) || (/zip/.test(t) && /hoodie/.test(t))) {
    return "Large graphic on the back, and the same design on the left chest.";
  }
  if (/\bfront\b/.test(t)) return "One large graphic on the front.";
  if (/\bback\b/.test(t) || backPrint) return "One large graphic on the back.";
  if (/tee|tank|babydoll|raglan|shirt/.test(t))
    return "One large graphic on the front or the back.";
  return "";
}

export function customerDescription(input: {
  title: string;
  backPrint: boolean;
  womensCut?: boolean;
}) {
  const hers = womensCut(input.title, Boolean(input.womensCut));
  return [
    lifeLine(input.title, hers),
    garmentFacts(input.title),
    placement(input.title, input.backPrint),
    SHIPPING,
  ]
    .filter(Boolean)
    .join(" ");
}
