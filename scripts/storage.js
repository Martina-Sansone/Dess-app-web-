/**
 * Storage Utility for Online Store
 * Manages products and cart data in localStorage
 */

const STORAGE_KEYS = {
    PRODUCTS: 'store_products',
    CART: 'store_cart'
};

const Storage = {
    // --- Product Methods ---
    getProducts() {
        const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        return data ? JSON.parse(data) : [];
    },

    saveProducts(products) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    },

    addProduct(product) {
        const products = this.getProducts();
        product.id = Date.now().toString(); // Simple unique ID
        products.push(product);
        this.saveProducts(products);
        return product;
    },

    updateProduct(id, updatedProduct) {
        let products = this.getProducts();
        products = products.map(p => p.id === id ? { ...p, ...updatedProduct } : p);
        this.saveProducts(products);
    },

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(p => p.id !== id);
        this.saveProducts(products);
        
        // Also remove from cart if present
        this.removeFromCart(id);
    },

    // --- Cart Methods ---
    getCart() {
        const data = localStorage.getItem(STORAGE_KEYS.CART);
        return data ? JSON.parse(data) : [];
    },

    saveCart(cart) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    },

    addToCart(productId) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ productId, quantity: 1 });
        }
        
        this.saveCart(cart);
    },

    removeFromCart(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.productId !== productId);
        this.saveCart(cart);
    },

    updateCartQuantity(productId, quantity) {
        let cart = this.getCart();
        const item = cart.find(item => item.productId === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                cart = cart.filter(i => i.productId !== productId);
            }
        }
        this.saveCart(cart);
    },

    clearCart() {
        this.saveCart([]);
    }
};

export default Storage;
