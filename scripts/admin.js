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
                <button class="btn btn-secondary btn-edit" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; margin-right: 0.5rem;" data-id="${product.id}">Editar</button>
                <button class="btn btn-secondary btn-delete" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; background: #ff4757; color: white;" data-id="${product.id}">Borrar</button>
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
        name: document.getElementById('name').value.trim(),
        price: parseFloat(document.getElementById('price').value),
        category: document.getElementById('category').value,
        image: document.getElementById('image').value.trim(),
        description: document.getElementById('description').value.trim()
    };

    const errors = validateProduct(productData);
    if (errors.length > 0) {
        alert("Errores de validación:\n- " + errors.join("\n- "));
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

function validateProduct(data) {
    const errors = [];
    if (data.name.length < 3) errors.push("El nombre debe tener al menos 3 caracteres.");
    if (isNaN(data.price) || data.price <= 0) errors.push("El precio debe ser un número positivo.");
    if (!data.image.startsWith('http') && !data.image.startsWith('images/')) {
        errors.push("URL de imagen no válida (debe empezar con http o ser una ruta local)");
    }
    return errors;
}

// Event Delegation for Table Actions
productListBody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btn-edit');
    const deleteBtn = e.target.closest('.btn-delete');

    if (editBtn) {
        const id = editBtn.dataset.id;
        const products = Storage.getProducts();
        const product = products.find(p => p.id === id);
        if (product) openModal('Editar Producto', product);
    }

    if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            Storage.deleteProduct(id);
            renderProducts();
        }
    }
});
