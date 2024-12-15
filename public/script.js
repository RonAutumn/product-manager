document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    const form = document.getElementById('productForm');
    form.addEventListener('submit', handleSubmit);
});

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = products.map(product => `
        <div class="product-card">
            ${product.image ? `<img src="${product.image}" class="product-image" alt="${product.name}">` : ''}
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <p>${product.description || ''}</p>
            <div class="product-actions">
                <button onclick="deleteProduct(${product.id})" class="delete-btn">Delete</button>
            </div>
        </div>
    `).join('');
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('description', document.getElementById('description').value);
    
    const imageFile = document.getElementById('image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            e.target.reset();
            loadProducts();
        }
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadProducts();
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}