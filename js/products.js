// Prices in KSh. Put each photo in images/ with the filename below. Until a photo exists, the emoji shows instead.
const products = [
  { id: 1, fresh: true,  name: "Tomatoes",       category: "Vegetables", price: 20,  unit: "4 pieces",     emoji: "🍅", image: "images/tomato.jpeg", tint: "#fde4e0" },
  { id: 2, fresh: true,  name: "Sukuma Wiki",    category: "Vegetables", price: 10,  unit: "1 bunch",      emoji: "🥬", image: "images/skuma.jpeg", tint: "#e0f0e4" },
  { id: 3,  name: "Onions",         category: "Vegetables", price: 20,  unit: "3 pieces",     emoji: "🧅", image: "images/onion.jpeg", tint: "#f6ecd9" },
  { id: 4,  name: "Carrots",        category: "Vegetables", price: 20,  unit: "1 small heap", emoji: "🥕", image: "images/carrot.jpeg", tint: "#fde9d3" },
  { id: 5,  name: "Cabbage",        category: "Vegetables", price: 50,  unit: "1 head",       emoji: "🥦", image: "images/cabbage.jpeg", tint: "#e0f0e4" },
  { id: 6,  name: "Irish Potatoes", category: "Vegetables", price: 50,  unit: "1 small heap", emoji: "🥔", image: "images/potato.jpeg", tint: "#f4ead8" },
  { id: 7, fresh: true,  name: "Bananas",        category: "Fruits",     price: 30,  unit: "5 pieces",     emoji: "🍌", image: "images/banana.jpeg", tint: "#fbf0c4" },
  { id: 8, fresh: true,  name: "Mangoes",        category: "Fruits",     price: 50,  unit: "3 pieces",     emoji: "🥭", image: "images/mango.jpeg", tint: "#fde8c2" },
  { id: 9,  name: "Avocados",       category: "Fruits",     price: 30,  unit: "2 pieces",     emoji: "🥑", image: "images/avocado.jpeg", tint: "#e3efd2" },
  { id: 10, name: "Oranges",        category: "Fruits",     price: 40,  unit: "4 pieces",     emoji: "🍊", image: "images/orange.jpeg", tint: "#fde4cc" },
  { id: 11, name: "Maize (Mahindi)", category: "Cereals",   price: 120, unit: "1 kg",         emoji: "🌽", image: "images/maize.jpeg", tint: "#faf0c0" },
  { id: 12, name: "Eggs",           category: "Others",     price: 20,  unit: "1 egg",        emoji: "🥚", image: "images/eggs.jpeg", tint: "#f3efe6" },
];

// Set `soldOut: true` on any product above when Mama runs out, and its card switches off.

// Packs: items reference product ids. The price is worked out from the items.
const bundles = [
  { id: "supper", name: "Supper Pack",      items: [{ id: 2, qty: 2 }, { id: 1, qty: 1 }, { id: 3, qty: 1 }] },
  { id: "family", name: "Family Week Pack", items: [{ id: 5, qty: 1 }, { id: 6, qty: 1 }, { id: 4, qty: 1 }, { id: 1, qty: 2 }, { id: 3, qty: 2 }] },
  { id: "fruit",  name: "Fruit Basket",     items: [{ id: 7, qty: 1 }, { id: 8, qty: 1 }, { id: 10, qty: 1 }, { id: 9, qty: 1 }] },
];