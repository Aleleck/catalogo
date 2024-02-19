const SHEET_ID = '1pblbPBLCxMv0LtBbQCuc-KVu-8B2eUZHLbMCflmHrr4';
const SHEET_TITLE = 'Catalogo';
const SHEET_RANGE = 'A1:F39'; // Asegúrate de que la columna de categoría esté incluida en este rango

const FULL_URL = (`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`);

// Función para mostrar productos
function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Limpia la lista de productos

    products.forEach(function (productRow) {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('product-image-container');

        const imgElement = document.createElement('img');
        imgElement.src = productRow.c[1].v; // URL de imagen
        imgElement.alt = productRow.c[2].v; // Nombre del producto
        imgElement.classList.add('product-image');

        imgContainer.appendChild(imgElement);
        productCard.appendChild(imgContainer);

        const productInfo = document.createElement('div');
        const productName = document.createElement('h3');
        productName.classList.add('product-name');
        productName.innerText = productRow.c[2].v; // Nombre del producto
        productInfo.appendChild(productName);

        const productQuantity = document.createElement('p');
        productQuantity.classList.add('product-quantity');
        productQuantity.innerText = `Cantidad: ${productRow.c[3].v}`; // Cantidad
        productInfo.appendChild(productQuantity);

        const productValue = document.createElement('p');
        productValue.classList.add('product-value');
        productValue.innerText = `Para recoger: ${productRow.c[4].v}`; // Valor
        productInfo.appendChild(productValue);

        addToCart(productRow, productCard);
        productCard.appendChild(productInfo);
        productList.appendChild(productCard);
    });
}

// Función para mostrar el carrito en el modal
function showCart() {
    const cart = JSON.parse(localStorage.getItem('shopping-cart')) || [];
    const cartItemsDiv = document.getElementById('cartItems');
    cartItemsDiv.innerHTML = ''; // Limpiar el contenido anterior

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `Nombre: ${item.name}, Cantidad: ${item.quantity}`;
        
        // Botón de eliminar
        const removeButton = document.createElement('button');
        removeButton.innerText = 'Eliminar';
        removeButton.addEventListener('click', function() {
            // Función para eliminar un artículo del carrito
            removeFromCart(item.id);
        });
        
        itemDiv.appendChild(removeButton);
        cartItemsDiv.appendChild(itemDiv);
    });

    document.getElementById('cartModal').style.display = 'block';
}

// Función para eliminar un artículo del carrito
function removeFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('shopping-cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('shopping-cart', JSON.stringify(cart));
    showCart(); // Actualiza el carrito después de eliminar
}

// Evento click del botón flotante para abrir el modal
document.getElementById('floatCartBtn').addEventListener('click', showCart);

// Evento click para cerrar el modal
document.getElementById('closeCartModal').addEventListener('click', () => {
    document.getElementById('cartModal').style.display = 'none';
});

// Evento click para cerrar el modal
document.getElementById('closeCartModalBtn').addEventListener('click', () => {
    document.getElementById('cartModal').style.display = 'none';
});


// Evento click del botón flotante para abrir el modal
document.getElementById('floatCartBtn').addEventListener('click', showCart);

// Evento click para cerrar el modal
document.getElementById('closeCartModal').addEventListener('click', () => {
    document.getElementById('cartModal').style.display = 'none';
});

// Evento click para cerrar el modal
document.getElementById('closeCartModalBtn').addEventListener('click', () => {
    document.getElementById('cartModal').style.display = 'none';
});


// Función para añadir un producto al carrito
function addToCart(productRow, productCard) {
    let quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.min =   1;
    quantityInput.value =   1;
    quantityInput.classList.add('quantity-input'); // Clase para el estilo

    let decreaseBtn = document.createElement('button');
    decreaseBtn.className = 'quantity-btn';
    decreaseBtn.innerText = '-';
    decreaseBtn.addEventListener('click', function () {
        let currentVal = parseInt(quantityInput.value);
        if (!isNaN(currentVal) && currentVal >   1) {
            quantityInput.value = currentVal -   1;
        }
    });

    let increaseBtn = document.createElement('button');
    increaseBtn.className = 'quantity-btn';
    increaseBtn.innerText = '+';
    increaseBtn.addEventListener('click', function () {
        let currentVal = parseInt(quantityInput.value);
        if (!isNaN(currentVal)) {
            quantityInput.value = currentVal +   1;
        }
    });

    let addButton = document.createElement('button');
    addButton.className = 'add-to-cart-btn';
    addButton.innerText = 'Añadir al carrito';
    // ... (rest of the addToCart function)

    // Crear un contenedor para los botones y el input
    let quantityControls = document.createElement('div');
    quantityControls.classList.add('quantity-controls');
    quantityControls.appendChild(decreaseBtn);
    quantityControls.appendChild(quantityInput);
    quantityControls.appendChild(increaseBtn);

    productCard.appendChild(quantityControls);
    productCard.appendChild(addButton);
}

fetch(`${FULL_URL}&headers=1`)
    .then(response => response.text())
    .then(text => {
        const categoriesData = JSON.parse(text.substr(47).slice(0, -2));
        const categorySelect = document.getElementById('categorySelect');
        const categoriesSet = new Set();

        // Rellena el select con las categorías únicas
        categoriesData.table.rows.forEach((row, index) => {
            if (index !== 0 && row.c[5] && !categoriesSet.has(row.c[5].v)) {
                const option = document.createElement('option');
                option.value = row.c[5].v;
                option.textContent = row.c[5].v;
                categorySelect.appendChild(option);
                categoriesSet.add(row.c[5].v);
            }
        });

        // Muestra todos los productos al principio
        fetch(FULL_URL)
            .then(response => response.text())
            .then(text => {
                data = JSON.parse(text.substr(47).slice(0, -2));
                displayProducts(data.table.rows);
            });

        // Escucha el cambio de categoría
        categorySelect.addEventListener('change', function () {
            const selectedCategory = this.value;
            const filteredProducts = data.table.rows.filter(function (row) {
                return row.c[5].v === selectedCategory || selectedCategory === '';
            });
            displayProducts(filteredProducts);
        });
    });

