// Helpers
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));

// Sticky current year
$("#year").textContent = new Date().getFullYear();

// Slider
(function slider(){
  const slidesEl = $(".slides");
  const slides = $$(".slide", slidesEl);
  const dotsWrap = $(".dots");
  let i = 0, timer;

  function go(n){
    i = (n + slides.length) % slides.length;
    slidesEl.style.transform = `translateX(-${i*100}%)`;
    $$(".dots button", dotsWrap).forEach((d,idx)=>d.classList.toggle("active", idx===i));
    reset();
  }
  function reset(){
    clearInterval(timer);
    timer = setInterval(()=>go(i+1), 4500);
  }

  slides.forEach((_, idx)=>{
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Slide ${idx+1}`);
    dot.addEventListener("click", ()=>go(idx));
    dotsWrap.appendChild(dot);
  });
  $(".prev").addEventListener("click", ()=>go(i-1));
  $(".next").addEventListener("click", ()=>go(i+1));
  go(0);
})();

// Reveal on scroll for pinterest
const revealEls = $$(".reveal");
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("visible");
      io.unobserve(e.target);
    }
  });
},{threshold:.1});
revealEls.forEach(el=>io.observe(el));

// Cart
const CART_KEY = "kyo_sushi_cart";
const listEl = $("#cart-list");
const totalEl = $("#total");

function loadCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY))||[] }catch{ return [] } }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)) }
let cart = loadCart();

function currency(n){ return n.toLocaleString('id-ID') }

function renderCart(){
  if(!listEl || !totalEl) return;
  listEl.innerHTML = "";
  let total = 0;
  cart.forEach((it, idx)=>{
    total += it.price * it.qty;
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <div>
        <strong>${it.name}</strong>
        <div class="muted">Rp ${currency(it.price)} × ${it.qty}</div>
      </div>
      <div class="cart-controls">
        <button class="icon-btn" aria-label="Kurangi">−</button>
        <span class="qty">${it.qty}</span>
        <button class="icon-btn" aria-label="Tambah">+</button>
        <button class="icon-btn" aria-label="Hapus">🗑️</button>
      </div>`;
    const [minusBtn, , plusBtn, delBtn] = $$("button", li);
    minusBtn.onclick = ()=>{ if(it.qty>1){ it.qty--; saveCart(cart); renderCart(); } };
    plusBtn.onclick = ()=>{ it.qty++; saveCart(cart); renderCart(); };
    delBtn.onclick = ()=>{ cart.splice(idx,1); saveCart(cart); renderCart(); };
    listEl.appendChild(li);
  });
  totalEl.textContent = currency(total);
}
renderCart();

// Add to cart buttons
$$(".item .add").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const card = btn.closest(".item");
    const id = card.dataset.id;
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price, 10);
    const found = cart.find(x=>x.id===id);
    if(found) found.qty++;
    else cart.push({id,name,price,qty:1});
    saveCart(cart);
    renderCart();
    btn.textContent = "Ditambahkan ✓";
    setTimeout(()=>btn.textContent="Tambah", 900);
  });
});
