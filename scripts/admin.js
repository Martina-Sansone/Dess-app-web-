import Storage from './storage.js';

const productListBody = document.getElementById('product-list-body');
const productForm = document.getElementById('product-form');
const productModal = document.getElementById('product-modal');
const btnAddProduct = document.getElementById('btn-add-product');
const btnCloseModal = document.getElementById('btn-close-modal');
const modalTitle = document.getElementById('modal-title');

// Initialize
renderProducts();

// Event Listeners
btnAddProduct.addEventListener('click', () => {
    openModal('Agregar Producto');
});

btnCloseModal.addEventListener('click', closeModal);

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit();
});

// Functions
function renderProducts() {
    const products = Storage.getProducts();
    productListBody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"></td>
            <td>${product.name}</td>
            <td><span style="background: var(--glass-border); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${product.category}</span></td>
            <td>$${parseFloat(product.price).toFixed(2)}</td>
            <td>
                <button class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; margin-right: 0.5rem;" onclick="window.editProduct('${product.id}')">Editar</button>
                <button class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; background: #ff4757; color: white;" onclick="window.deleteProduct('${product.id}')">Borrar</button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="5" style="text-align: center; color: var(--text-dim);">No hay productos registrados.</td></tr>';
}

function openModal(title, product = null) {
    modalTitle.textContent = title;
    productForm.reset();
    
    if (product) {
        document.getElementById('product-id').value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('price').value = product.price;
        document.getElementById('category').value = product.category;
        document.getElementById('image').value = product.image;
        document.getElementById('description').value = product.description;
    } else {
        document.getElementById('product-id').value = '';
    }
    
    productModal.style.display = 'flex';
}

function closeModal() {
    productModal.style.display = 'none';
}

function handleFormSubmit() {
    const id = document.getElementById('product-id').value;
    const productData = {
        name: document.getElementById('name').value,
        price: document.getElementById('price').value,
        category: document.getElementById('category').value,
        image: document.getElementById('image').value,
        description: document.getElementById('description').value
    };

    // Validation (Basic)
    if (!productData.name || !productData.price || !productData.image) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }

    if (id) {
        Storage.updateProduct(id, productData);
    } else {
        Storage.addProduct(productData);
    }

    closeModal();
    renderProducts();
}

// Global functions for inline onclick handlers (simpler for this case)
window.editProduct = (id) => {
    const products = Storage.getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
        openModal('Editar Producto', product);
    }
};

window.deleteProduct = (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        Storage.deleteProduct(id);
        renderProducts();
    }
};
