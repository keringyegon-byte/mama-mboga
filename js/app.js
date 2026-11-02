const $ = (id) => document.getElementById(id);
const grid = $("product-grid"), toast = $("toast"), drawer = $("drawer"), overlay = $("overlay");
const cartItems = $("cart-items"), checkoutBtn = $("checkout-btn"), cartBar = $("cart-bar");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

// ---------- Products ----------
function productCard(p) {
  const visual = p.image
    ? `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.replaceWith('${p.emoji}')">`
    : `<span role="img" aria-label="${p.name}">${p.emoji}</span>`;
  const badge = p.soldOut ? `<span class="badge out">Sold out</span>` : p.fresh ? `<span class="badge">Fresh today</span>` : "";
  return `
    <article class="card${p.soldOut ? " sold-out" : ""}">
      <div class="card-img" style="--tint:${p.tint || "#e9f3ec"}">${visual}${badge}</div>
      <div class="card-body">
        <span class="card-cat">${p.category}</span>
        <h3>${p.name}</h3>
        <span class="card-unit">${p.unit}</span>
        <span class="card-price">KSh ${p.price}</span>
        <button class="add-btn" data-id="${p.id}" ${p.soldOut ? "disabled" : ""}>${p.soldOut ? "Sold out" : "Add to cart"}</button>
      </div>
    </article>`;
}

function renderProducts(list) {
  grid.innerHTML = list.length
    ? list.map(productCard).join("")
    : `<p class="no-results">Nothing matches that. Try another word or category.</p>`;
}

const searchInput = $("search"), chipsBox = $("chips"), sortSelect = $("sort");
const categories = ["All", ...new Set(products.map(p => p.category))];
let activeCategory = "All";

function renderChips() {
  chipsBox.innerHTML = categories.map(cat =>
    `<button class="chip${cat === activeCategory ? " active" : ""}" data-cat="${cat}" aria-pressed="${cat === activeCategory}">${cat}</button>`
  ).join("");
}

function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  const list = products.filter(p =>
    (activeCategory === "All" || p.category === activeCategory) && p.name.toLowerCase().includes(q));
  if (sortSelect.value === "low") list.sort((a, b) => a.price - b.price);
  if (sortSelect.value === "high") list.sort((a, b) => b.price - a.price);
  renderProducts(list);
}

// ---------- Bundles ----------
function renderBundles() {
  $("bundle-grid").innerHTML = bundles.map(b => {
    const parts = b.items.map(i => `${i.qty} x ${products.find(p => p.id === i.id).name}`).join(", ");
    const pic = (p) => p.image
      ? `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.replaceWith('${p.emoji}')">`
      : p.emoji;
    // A dedicated pack photo wins; otherwise show a collage of the pack's own product photos
    const visual = b.image
      ? `<img class="bundle-photo" src="${b.image}" alt="${b.name}" loading="lazy">`
      : b.items.slice(0, 4).map(i => pic(products.find(p => p.id === i.id))).join("");
    return `
      <article class="card bundle">
        <div class="card-img bundle-pics">${visual}</div>
        <div class="card-body">
          <h3>${b.name}</h3>
          <span class="card-unit">${parts}</span>
          <span class="card-price">KSh ${bundlePrice(b)}</span>
          <button class="add-btn" data-bundle="${b.id}">Add whole pack</button>
        </div>
      </article>`;
  }).join("");
}

// ---------- Cart drawer ----------
function openCart() {
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  $("close-cart").focus();
}
function closeCart() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
}

function renderCart() {
  const lines = cartLines(), count = cartItemCount();
  cartItems.innerHTML = lines.length
    ? lines.map(l => `
        <div class="line">
          <div>
            <div class="line-name">${l.name}</div>
            <div class="line-unit">${l.unit} &middot; KSh ${l.price} each</div>
          </div>
          <div class="line-price">KSh ${l.price * l.qty}</div>
          <div class="qty">
            <button data-action="dec" data-id="${l.id}" aria-label="Fewer ${l.name}">&minus;</button>
            <span>${l.qty}</span>
            <button data-action="inc" data-id="${l.id}" aria-label="More ${l.name}">+</button>
          </div>
          <button class="remove" data-action="remove" data-id="${l.id}">Remove</button>
        </div>`).join("")
    : `<p class="empty">Your basket is empty. Add something fresh from the list.</p>`;

  $("cart-subtotal").textContent = `KSh ${cartTotal()}`;
  $("cart-fee").textContent = deliveryFee() ? `KSh ${deliveryFee()}` : "Free";
  $("cart-total").textContent = `KSh ${grandTotal()}`;
  $("cart-count").textContent = count;
  checkoutBtn.disabled = lines.length === 0;

  cartBar.hidden = count === 0;
  cartBar.textContent = `View basket · ${count} item${count === 1 ? "" : "s"} · KSh ${cartTotal()}`;
}

// ---------- Events ----------
grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (!btn || btn.disabled) return;
  const product = products.find(p => p.id === Number(btn.dataset.id));
  addToCart(product.id);
  renderCart();
  showToast(`${product.name} added to cart`);
});

$("bundle-grid").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-bundle]");
  if (!btn) return;
  const bundle = bundles.find(b => b.id === btn.dataset.bundle);
  addBundle(bundle);
  renderCart();
  showToast(`${bundle.name} added to cart`);
});

cartItems.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.dataset.action === "inc") changeQty(id, 1);
  if (btn.dataset.action === "dec") changeQty(id, -1);
  if (btn.dataset.action === "remove") removeFromCart(id);
  renderCart();
});

chipsBox.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  activeCategory = chip.dataset.cat;
  renderChips();
  applyFilters();
});
searchInput.addEventListener("input", applyFilters);
sortSelect.addEventListener("change", applyFilters);

const areaSelect = $("area");
areaSelect.innerHTML = DELIVERY_AREAS.map((a, i) => `<option value="${i}">${a.name}${a.fee ? ` (KSh ${a.fee})` : " (free)"}</option>`).join("");
areaSelect.addEventListener("change", () => { areaIndex = Number(areaSelect.value); renderCart(); });

checkoutBtn.addEventListener("click", () => {
  window.open(buildWhatsAppLink($("cust-name").value.trim(), $("cust-location").value.trim()), "_blank", "noopener");
});

$("cart-btn").addEventListener("click", openCart);
cartBar.addEventListener("click", openCart);
$("close-cart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });
$("wa-float").href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Mama Mboga!")}`;

// Fade sections in as they scroll into view
const revealer = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); revealer.unobserve(en.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => revealer.observe(el));

// Light / dark theme (the first choice follows the phone's setting; after that it remembers the toggle)
const themeBtn = $("theme-btn");
function setTheme(t, save) {
  document.documentElement.dataset.theme = t;
  themeBtn.textContent = t === "dark" ? "☀️" : "🌙";
  themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
  if (save) { try { localStorage.setItem("mmTheme", t); } catch {} }
}
themeBtn.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true));
setTheme(document.documentElement.dataset.theme || "light", false);

renderChips();
renderBundles();
applyFilters();
renderCart();
