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
      ? "Dock lights, a cold drink, and the kind of night he notices before he says anything."
      : "Boats, rods, and a Gulf night that starts on the water and ends at the bar.";
  }
  if (/sky high/.test(t)) {
    return hers
      ? "Girls' night, skyline lights, and a look that does the talking."
      : "Night out, skyline lights, and a shirt that gets noticed.";
  }
  if (/race club|street tee/.test(t)) {
    return hers
      ? "Date night, chrome, and a weekend that does not stay in one lane."
      : "Cars, bikes, and a Saturday that starts loud and stays out late.";
  }
  if (/down low/.test(t)) {
    return hers
      ? "Low and easy. Beach road, windows down, nowhere you have to be."
      : "Trucks, low light, and a Gulf Coast weekend that runs long.";
  }
  if (/wave bike|\bbike\b/.test(t)) {
    return hers
      ? "Salt air, two wheels, and a sunset ride that turns into the whole night."
      : "Bikes, salt air, and the long way home along the water.";
  }
  if (/highway/.test(t)) {
    return hers
      ? "Highway sun, a beach day that runs late, and a reason to look back."
      : "Open highway, the Gulf on one side, and no clock on the weekend.";
  }
  if (/salty/.test(t)) {
    return hers
      ? "Beach day into girls' night. Sun on your shoulders, then the lights come up."
      : "Salt on your skin, friends on the boat, and a weekend that refuses to end.";
  }
  if (/coastal lifestyle|lifestyle/.test(t)) {
    return hers
      ? "Panama City Beach energy. Water, friends, and a night you actually dressed for."
      : "Panama City Beach weekends: water, friends, and nowhere to be in the morning.";
  }
  if (/hoodie|pullover|\bzip\b/.test(t)) {
    return "Sun goes down, bonfire comes up, and the ride home is finally cool enough.";
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
      ? "The mark, worn because you want to. Beach, boats, and a night out."
      : "The Wet Kitty mark for days on the water and nights that run long.";
  }
  return hers
    ? "Beach days, boats, and a night you got ready for."
    : "Gulf Coast weekends: boats, bikes, friends, and a night that runs long.";
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
