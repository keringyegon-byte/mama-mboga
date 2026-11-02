// ===== Settings: seller's WhatsApp number (country code, no + or spaces) =====
const WHATSAPP_NUMBER = "254700000000";
// ===== Delivery areas and fees in KSh (edit to match real routes) =====
const DELIVERY_AREAS = [
  { name: "Collect from the kiosk", fee: 0 },
  { name: "Ruiru town", fee: 50 },
  { name: "Nearby estates", fee: 100 },
];
const CART_KEY = "mamaMbogaCart";

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
}

let cart = loadCart();
let areaIndex = 0;

function addToCart(productId, qty = 1) {
  const item = cart.find(i => i.id === productId);
  if (item) item.qty += qty;
  else cart.push({ id: productId, qty });
  saveCart();
}
function addBundle(bundle) {
  bundle.items.forEach(i => addToCart(i.id, i.qty));
}
function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else saveCart();
}
function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
}

function cartLines() {
  return cart
    .map(i => ({ ...products.find(p => p.id === i.id), qty: i.qty }))
    .filter(l => l.name);
}
function cartItemCount() { return cartLines().reduce((s, l) => s + l.qty, 0); }
function cartTotal() { return cartLines().reduce((s, l) => s + l.price * l.qty, 0); }
function deliveryFee() { return cartLines().length ? DELIVERY_AREAS[areaIndex].fee : 0; }
function grandTotal() { return cartTotal() + deliveryFee(); }
function bundlePrice(b) {
  return b.items.reduce((s, i) => s + products.find(p => p.id === i.id).price * i.qty, 0);
}

function buildWhatsAppLink(name, location) {
  const area = DELIVERY_AREAS[areaIndex];
  const parts = [
    "Hello Mama Mboga! I'd like to order:",
    "",
    ...cartLines().map(l => `• ${l.qty} x ${l.name} (${l.unit}) = KSh ${l.price * l.qty}`),
    "",
    `Subtotal: KSh ${cartTotal()}`,
    `Delivery (${area.name}): KSh ${deliveryFee()}`,
    `Total: KSh ${grandTotal()}`,
  ];
  if (name) parts.push(`Name: ${name}`);
  if (location) parts.push(`Delivery location: ${location}`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(parts.join("\n"))}`;
}
