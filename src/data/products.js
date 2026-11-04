// Each product carries its own bottle design ("bottle") so every fragrance
// gets a unique, realistic glass render (see components/Bottle.jsx).
export const products = [
  {
    id: 1, slug: "ambre-noir", name: "Ambre Noir", subtitle: "Warmth after dark", family: "Woody", price: 39, no: "01",
    notes: ["Amber", "Black vanilla", "Cedarwood"],
    description: "A slow-burning composition of golden amber, smooth vanilla and dry woods. Made for evenings that linger.",
    longevity: 88, sillage: 76, seasons: ["Autumn", "Winter"], mood: "Intimate · Warm",
    glow: "#b9772e", stage: ["#4a3118", "#1a130c"],
    bottle: { shape: "block", w: 150, h: 210, r: 16, liquid: ["#f3b45a", "#b86a1c", "#6b3510"], cap: ["#f6e2b0", "#c9a45e", "#7a5a2a"], capH: 62, capW: 78, glass: 0.16 },
  },
  {
    id: 2, slug: "blanc", name: "Blanc", subtitle: "The art of simplicity", family: "Fresh", price: 35, no: "02",
    notes: ["Bergamot", "White musk", "Neroli"],
    description: "Clean light, captured in a bottle. Bright citrus and airy musk settle into a soft, effortless signature.",
    longevity: 62, sillage: 58, seasons: ["Spring", "Summer"], mood: "Clean · Luminous",
    glow: "#d8e2e6", stage: ["#3a4146", "#15181a"],
    bottle: { shape: "tall", w: 112, h: 250, r: 10, liquid: ["#f4f1c8", "#dfe6b4", "#a9bda0"], cap: ["#f4f4f2", "#b9bcc0", "#6f7378"], capH: 48, capW: 58, glass: 0.22 },
  },
  {
    id: 3, slug: "nocturne", name: "Nocturne", subtitle: "A beautiful mystery", family: "Oud", price: 45, no: "03",
    notes: ["Saffron", "Oud accord", "Patchouli"],
    description: "Deep, textured and quietly magnetic. Saffron opens the door to smoky woods and a velvet oud accord.",
    longevity: 94, sillage: 84, seasons: ["Autumn", "Winter"], mood: "Smoky · Magnetic",
    glow: "#7a4b8a", stage: ["#2d2238", "#100c14"],
    bottle: { shape: "block", w: 140, h: 220, r: 6, liquid: ["#7b4a2c", "#3b1f12", "#170a06"], cap: ["#34302c", "#14110f", "#050403"], capH: 56, capW: 72, glass: 0.1, collar: "#c9a45e" },
  },
  {
    id: 4, slug: "rose-eclat", name: "Rosé Éclat", subtitle: "A softer statement", family: "Floral", price: 38, no: "04",
    notes: ["Damask rose", "Peony", "Cashmere"],
    description: "A modern floral with a luminous heart. Delicate petals meet a warm, skin-close cashmere finish.",
    longevity: 70, sillage: 66, seasons: ["Spring", "Autumn"], mood: "Soft · Radiant",
    glow: "#d78a96", stage: ["#4a2a31", "#170e10"],
    bottle: { shape: "round", w: 160, h: 200, r: 70, liquid: ["#f9c3c7", "#e8878f", "#b4505c"], cap: ["#f6d9c8", "#d19b86", "#8d5a4a"], capH: 50, capW: 62, glass: 0.2 },
  },
  {
    id: 5, slug: "vert", name: "Vert", subtitle: "Fresh perspective", family: "Fresh", price: 36, no: "05",
    notes: ["Green mandarin", "Basil", "Vetiver"],
    description: "Crisp green notes and aromatic herbs create a refreshing fragrance with an earthy, grounded finish.",
    longevity: 58, sillage: 52, seasons: ["Spring", "Summer"], mood: "Crisp · Grounded",
    glow: "#7fa66a", stage: ["#25361f", "#0d130b"],
    bottle: { shape: "shoulder", w: 138, h: 226, r: 22, liquid: ["#c9e08a", "#7fa84e", "#3a6228"], cap: ["#5b6a52", "#2f382b", "#12170f"], capH: 54, capW: 66, glass: 0.18 },
  },
  {
    id: 6, slug: "oud-royale", name: "Oud Royale", subtitle: "An enduring presence", family: "Oud", price: 49, no: "06",
    notes: ["Oud", "Rosewood", "Tonka"],
    description: "A confident blend of dark woods, polished rosewood and tonka. Rich without being loud.",
    longevity: 98, sillage: 90, seasons: ["Winter", "Evening"], mood: "Regal · Resinous",
    glow: "#a8402e", stage: ["#4b1f18", "#150a08"],
    bottle: { shape: "crystal", w: 156, h: 214, r: 8, liquid: ["#d6823f", "#8a3a1c", "#3d140a"], cap: ["#f2d58b", "#b98a2e", "#6a4a12"], capH: 66, capW: 84, glass: 0.14 },
  },
];

export const ingredients = [
  { name: "Saffron", origin: "Kashmir", note: "Warm, leathery spice", hue: "#c0472a" },
  { name: "Damask Rose", origin: "Taif", note: "Velvet petals at dawn", hue: "#c96b7b" },
  { name: "Aged Oud", origin: "Assam", note: "Smoke, resin, shadow", hue: "#6b3b24" },
  { name: "Vetiver", origin: "Haiti", note: "Cool, earthy roots", hue: "#6f8a4c" },
  { name: "Amber", origin: "Mediterranean", note: "Golden, sun-warmed", hue: "#c58a2f" },
];

export const reviews = [
  { quote: "It doesn't announce itself. It lingers — and people ask, every single time.", who: "Amara K.", for: "Nocturne" },
  { quote: "The first fragrance that has ever felt like it was made for my skin.", who: "Daniel R.", for: "Ambre Noir" },
  { quote: "Beautiful in the bottle, even better on the wrist. Instantly my signature.", who: "Sofia M.", for: "Rosé Éclat" },
];
