import Storage from './storage.js';

const productGrid = document.getElementById('product-grid');
const cartModal = document.getElementById('cart-modal');
const btnViewCart = document.getElementById('btn-view-cart');
const btnCloseCart = document.getElementById('btn-close-cart');
const cartCount = document.getElementById('cart-count');
const cartItemsList = document.getElementById('cart-items-list');
const cartTotal = document.getElementById('cart-total');
const btnCheckout = document.getElementById('btn-checkout');

// Initialize
renderProducts();
updateCartUI();

// Event Listeners
btnViewCart.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
});

btnCloseCart.addEventListener('click', closeCart);

btnCheckout.addEventListener('click', () => {
    if (Storage.getCart().length === 0) {
        alert('El carrito está vacío.');
        return;
    }
    alert('¡Gracias por tu compra! (Simulación de checkout)');
    Storage.clearCart();
    updateCartUI();
    closeCart();
});

// Functions
function renderProducts() {
    const products = Storage.getProducts();
    if (products.length === 0) {
        productGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-dim);">No hay productos disponibles por ahora.</div>';
        return;
    }

    productGrid.innerHTML = products.map(product => `
        <article class="card animate">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <h3 style="font-size: 1.2rem;">${product.name}</h3>
                <span style="color: var(--primary-light); font-weight: 700;">$${parseFloat(product.price).toFixed(2)}</span>
            </div>
            <p style="color: var(--text-dim); font-size: 0.9rem; margin-bottom: 1.5rem; height: 3rem; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                ${product.description || 'Sin descripción disponible.'}
            </p>
            <button class="btn btn-primary" style="width: 100%;" onclick="window.addToCart('${product.id}')">Agregar al Carrito</button>
        </article>
    `).join('');
}

function openCart() {
    renderCartItems();
    cartModal.style.display = 'flex';
}

function closeCart() {
    cartModal.style.display = 'none';
}

function updateCartUI() {
    const cart = Storage.getCart();
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = count;
}

function renderCartItems() {
    const cart = Storage.getCart();
    const products = Storage.getProducts();
    let total = 0;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p style="text-align: center; color: var(--text-dim); padding: 2rem 0;">Tu carrito está vacío.</p>';
        cartTotal.textContent = '$0.00';
        return;
    }

    cartItemsList.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return '';
        
        const subtotal = product.price * item.quantity;
        total += subtotal;

        return `
            <div class="cart-item">
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <img src="${product.image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                    <div>
                        <h4 style="font-size: 0.9rem;">${product.name}</h4>
                        <p style="color: var(--text-dim); font-size: 0.8rem;">$${parseFloat(product.price).toFixed(2)} x ${item.quantity}</p>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button class="btn btn-secondary" style="padding: 2px 8px;" onclick="window.updateQty('${product.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn btn-secondary" style="padding: 2px 8px;" onclick="window.updateQty('${product.id}', ${item.quantity + 1})">+</button>
                </div>
            </div>
        `;
    }).join('');

    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Global functions for inline handlers
window.addToCart = (id) => {
    Storage.addToCart(id);
    updateCartUI();
    alert('Producto agregado al carrito');
};

window.updateQty = (id, newQty) => {
    Storage.updateCartQuantity(id, newQty);
    updateCartUI();
    renderCartItems();
};
