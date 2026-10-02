document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Product Data & Catalog State ---
    const products = [
        { id: 1, name: "Smart Fitness Watch", category: "tech", price: 129.99 },
        { id: 2, name: "Noise Cancelling Earbuds", category: "tech", price: 89.99 },
        { id: 3, name: "Ergonomic Mechanical Keyboard", category: "tech", price: 119.50 },
        { id: 4, name: "Performance Hoodie", category: "apparel", price: 49.99 },
        { id: 5, name: "Breathable Running Shoes", category: "apparel", price: 79.95 }
    ];

    let cart = JSON.parse(localStorage.getItem("apexCapstoneCart")) || [];

    const productGrid = document.getElementById("productGrid");
    const categoryFilter = document.getElementById("categoryFilter");
    const searchInput = document.getElementById("searchInput");
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const clearCartBtn = document.getElementById("clearCartBtn");

    // --- 2. Render Products dynamically ---
    function renderProducts() {
        const category = categoryFilter.value;
        const query = searchInput.value.toLowerCase().trim();

        const filtered = products.filter(item => {
            const matchesCategory = (category === "all" || item.category === category);
            const matchesSearch = item.name.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });

        productGrid.innerHTML = "";

        if (filtered.length === 0) {
            productGrid.innerHTML = "<p>No matching products found.</p>";
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <div>
                    <h3>${item.name}</h3>
                    <p>Category: ${item.category}</p>
                    <p class="price">$${item.price.toFixed(2)}</p>
                </div>
                <button class="action-btn" onclick="addToCart(${item.id})">Add to Cart</button>
            `;
            productGrid.appendChild(card);
        });
    }

    // --- 3. Cart Operations with LocalStorage Persistence ---
    window.addToCart = function(id) {
        const item = products.find(p => p.id === id);
        if (item) {
            cart.push(item);
            saveAndRenderCart();
        }
    };

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        saveAndRenderCart();
    };

    clearCartBtn.addEventListener("click", () => {
        cart = [];
        saveAndRenderCart();
    });

    function saveAndRenderCart() {
        localStorage.setItem("apexCapstoneCart", JSON.stringify(cart));
        cartCount.textContent = cart.length;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p id='emptyCartMsg'>Your cart is currently empty.</p>";
            cartTotal.textContent = "0.00";
            return;
        }

        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price;
            const cartRow = document.createElement("div");
            cartRow.className = "cart-item";
            cartRow.innerHTML = `
                <span><strong>${item.name}</strong> - $${item.price.toFixed(2)}</span>
                <button class="action-btn danger" onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItemsContainer.appendChild(cartRow);
        });

        cartTotal.textContent = total.toFixed(2);
    }

    // Event listeners for catalog filtering
    categoryFilter.addEventListener("change", renderProducts);
    searchInput.addEventListener("input", renderProducts);

    // Initial load
    renderProducts();
    saveAndRenderCart();

    // --- 4. Optimized Client-Side Form Validation ---
    const form = document.getElementById("capstoneForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let valid = true;
        document.getElementById("nameError").textContent = "";
        document.getElementById("emailError").textContent = "";
        document.getElementById("messageError").textContent = "";
        document.getElementById("formStatus").textContent = "";

        if (!nameInput.value.trim()) {
            document.getElementById("nameError").textContent = "Name is required.";
            valid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            document.getElementById("emailError").textContent = "Email is required.";
            valid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            document.getElementById("emailError").textContent = "Valid email address required.";
            valid = false;
        }

        if (!messageInput.value.trim()) {
            document.getElementById("messageError").textContent = "Message field cannot be empty.";
            valid = false;
        }

        if (valid) {
            document.getElementById("formStatus").textContent = "Thank you! Your submission has been processed.";
            form.reset();
        }
    });
});