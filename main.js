const SHEET_ID = '1pblbPBLCxMv0LtBbQCuc-KVu-8B2eUZHLbMCflmHrr4';
const SHEET_TITLE = 'Catalogo';
const SHEET_RANGE = 'A1:F39'; // Asegúrate de que la columna de categoría esté incluida en este rango

const FULL_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;

// Función para mostrar productos
function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Limpia la lista de productos

    products.forEach(productRow => {
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
        productQuantity.innerText = `Cantidad: ${Math.floor(productRow.c[3].v)}`; // Redondea y convierte a entero
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

    let total = 0; // Variable para almacenar el total del pedido
    let itemCount = cart.length; // Contar la cantidad de artículos en el carrito

    // Crear la tabla
    const table = document.createElement('table');
    table.classList.add('cart-table');

    // Crear encabezados de la tabla
    const headers = ['Producto', 'Cantidad', 'Valor', ''];
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Agregar filas para cada artículo en el carrito
    cart.forEach(item => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity;
        const valueCell = document.createElement('td');
        valueCell.textContent = item.value.toLocaleString('es-ES'); // Formatear el valor
        const removeButtonCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Eliminar';
        removeButton.classList.add('cart-item-remove');
        removeButton.addEventListener('click', function () {
            removeFromCart(item.id);
        });
        removeButtonCell.appendChild(removeButton);

        row.appendChild(nameCell);
        row.appendChild(quantityCell);
        row.appendChild(valueCell);
        row.appendChild(removeButtonCell);
        table.appendChild(row);

        // Calcular el total del pedido
        total += item.quantity * parseFloat(item.value);
    });

    // Agregar la tabla al contenedor del carrito
    cartItemsDiv.appendChild(table);

    // Mostrar el total del pedido en el modal del carrito
    // Mostrar el total del pedido en el modal del carrito
    const totalDiv = document.createElement('div');
    totalDiv.innerHTML = `<span style="font-size: 18px; font-weight: bold; text-align: center;">Valor Total: ${total.toLocaleString('es-ES')}</span>`; // Formatear el total
    cartItemsDiv.appendChild(totalDiv);


    document.getElementById('cartModal').style.display = 'block';
    document.getElementById('cartItemCount').innerText = itemCount;
}

// Evento click del botón flotante para abrir el modal
document.getElementById('floatCartBtn').addEventListener('click', showCart);

// Evento click para cerrar el modal
document.getElementById('closeCartModal').addEventListener('click', () => {
    document.getElementById('cartModal').style.display = 'none';
});

// Evento click para cerrar el modal
//document.getElementById('closeCartModalBtn').addEventListener('click', () => {
//  document.getElementById('cartModal').style.display = 'none';
//});

// Función para agregar un producto al carrito
function addToCart(productRow, productCard) {
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.min = 1;
    quantityInput.value = 1;

    const addButton = document.createElement('button');
    addButton.innerText = 'Añadir al carrito';
    addButton.classList.add('add-to-cart-btn');
    addButton.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        if (!isNaN(quantity) && quantity > 0) {
            const cart = JSON.parse(localStorage.getItem('shopping-cart')) || [];
            let itemExists = false;

            for (const item of cart) {
                if (item.id === productRow.c[0].v) {
                    item.quantity += quantity;
                    itemExists = true;
                    break;
                }
            }

            if (!itemExists) {
                cart.push({
                    id: productRow.c[0].v,
                    name: productRow.c[2].v,
                    imageUrl: productRow.c[1].v,
                    quantity: quantity,
                    value: parseFloat(productRow.c[4].v) // Agregar el valor del producto al objeto del carrito
                });
            }

            localStorage.setItem('shopping-cart', JSON.stringify(cart));
            alert('Producto añadido al carrito!');
            const currentCount = parseInt(document.getElementById('cartItemCount').innerText);
            document.getElementById('cartItemCount').innerText = currentCount + 1;
        } else {
            alert('Por favor, introduce una cantidad válida.');
        }
    });

    productCard.appendChild(quantityInput);
    productCard.appendChild(addButton);
}

// Función para eliminar un artículo del carrito
function removeFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('shopping-cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('shopping-cart', JSON.stringify(cart));

    showCart(); // Actualiza el carrito después de eliminar
    const currentCount = parseInt(document.getElementById('cartItemCount').innerText);
    document.getElementById('cartItemCount').innerText = currentCount - 1;
}

// Llamada inicial para cargar los productos al cargar la página
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
                const data = JSON.parse(text.substr(47).slice(0, -2)); // Asegúrate de declarar 'data' con 'const'
                displayProducts(data.table.rows);
            });
    });

// Función para abrir WhatsApp con la información del pedido
function openWhatsApp() {
    const customerName = document.getElementById('customerName').value;
    const address = document.getElementById('address').value;

    const cart = JSON.parse(localStorage.getItem('shopping-cart')) || [];
    let total = 0;
    cart.forEach(item => {
        total += item.quantity * parseFloat(item.value); // Asumiendo que cada ítem tiene una propiedad 'value'
    });

    const message = `Nombre: ${customerName}\nDirección: ${address}\n\nDetalles del pedido:\n${getCartDetails()}\n\nTotal: ${total.toFixed(2)}`;

    window.open(`https://api.whatsapp.com/send?phone=3053012883&text=${encodeURIComponent(message)}`);
}

// Función para obtener los detalles del carrito
function getCartDetails() {
    let cartDetails = '';
    const cart = JSON.parse(localStorage.getItem('shopping-cart')) || [];
    cart.forEach(item => {
        cartDetails += `Producto: ${item.name}, Cantidad: ${item.quantity}\n`;
    });
    return cartDetails;
}
