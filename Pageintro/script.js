let carrito = [];
let total = 0;

// Función para agregar productos al carrito (sin cambios aquí)
function agregarAlCarrito(nombreProducto, precioProducto) {
    const itemExistente = carrito.find(item => item.nombre === nombreProducto);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ nombre: nombreProducto, precio: precioProducto, cantidad: 1 });
    }
    actualizarCarrito();
    alert(`${nombreProducto} ha sido añadido al carrito.`);
}

// Función para actualizar la visualización del carrito (sin cambios aquí)
function actualizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarritoSpan = document.getElementById('total-carrito');
    listaCarrito.innerHTML = '';

    total = 0;
    carrito.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.nombre} x ${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString('es-CO')} COP
                        <button onclick="eliminarDelCarrito(${index})">Eliminar</button>`;
        listaCarrito.appendChild(li);
        total += item.precio * item.cantidad;
    });

    totalCarritoSpan.textContent = `$${total.toLocaleString('es-CO')} COP`;
}

// Función para eliminar un producto del carrito (sin cambios aquí)
function eliminarDelCarrito(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
    } else {
        carrito.splice(index, 1);
    }
    actualizarCarrito();
}

// Función para vaciar el carrito (sin cambios aquí)
function vaciarCarrito() {
    carrito = [];
    total = 0;
    actualizarCarrito();
    alert('El carrito ha sido vaciado.');
}

// Función para simular la compra (sin cambios aquí)
function realizarCompra() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío. ¡Agrega algunos zapatos antes de comprar!');
        return;
    }
    alert(`Compra realizada con éxito. Total a pagar: $${total.toLocaleString('es-CO')} COP. ¡Gracias por tu compra!`);
    vaciarCarrito();
}

// Función para ver los detalles del producto (ligeros cambios para ocultar el carrito)
function verDetalles(nombre, descripcion, imagenSrc) {
    document.getElementById('detalle-nombre').textContent = nombre;
    document.getElementById('detalle-descripcion').textContent = descripcion;
    document.getElementById('detalle-imagen').src = imagenSrc;
    document.getElementById('detalles-producto').classList.remove('oculto');
    document.getElementById('productos').classList.add('oculto'); // Ocultar la galería
    document.getElementById('carrito').classList.add('oculto'); // Ocultar el carrito
}

// Función para cerrar los detalles del producto y volver a la galería
function cerrarDetalles() {
    document.getElementById('detalles-producto').classList.add('oculto');
    document.getElementById('productos').classList.remove('oculto'); // Mostrar la galería
    document.getElementById('carrito').classList.remove('oculto'); // Mostrar el carrito
    filtrarProductos('todos');
}

// NUEVA FUNCIÓN: Filtrar productos por categoría
function filtrarProductos(categoria) {
    const productos = document.querySelectorAll('.producto'); // Selecciona todos los productos
    document.getElementById('productos').classList.remove('oculto'); // Asegurarse de que la galería esté visible
    document.getElementById('detalles-producto').classList.add('oculto'); // Ocultar detalles si están abiertos

    productos.forEach(producto => {
        const categoriasProducto = producto.dataset.categoria; // Obtiene las categorías del producto

        if (categoria === 'todos' || categoriasProducto.includes(categoria)) {
            producto.style.display = 'block'; // Muestra el producto
        } else {
            producto.style.display = 'none'; // Oculta el producto
        }
    });
}

// Opcional: Para mostrar todos los productos al cargar la página inicialmente
document.addEventListener('DOMContentLoaded', () => {
    filtrarProductos('todos');
});