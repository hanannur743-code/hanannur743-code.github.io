document.addEventListener("DOMContentLoaded", () => {
    const cartItems = [];
    const cartList = document.getElementById("cart-items");
    const totalPriceEl = document.getElementById("total-price");

    // Tambah ke keranjang
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const item = button.parentElement;
            const name = item.getAttribute("data-name");
            const price = parseInt(item.getAttribute("data-price"));

            cartItems.push({ name, price });
            renderCart();
        });
    });

    function renderCart() {
        cartList.innerHTML = "";
        let total = 0;
        cartItems.forEach((item, index) => {
            const li = document.createElement("li");
            li.textContent = `${item.name} - Rp ${item.price.toLocaleString()}`;
            
            // Tombol hapus item
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "❌";
            removeBtn.style.marginLeft = "10px";
            removeBtn.addEventListener("click", () => {
                cartItems.splice(index, 1);
                renderCart();
            });

            li.appendChild(removeBtn);
            cartList.appendChild(li);
            total += item.price;
        });
        totalPriceEl.textContent = total.toLocaleString();
    }
});
