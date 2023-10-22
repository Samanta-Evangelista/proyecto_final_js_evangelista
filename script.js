let productos;

fetch("./info.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error al cargar el archivo JSON");
    }
    return response.json();
  })
  .then((data) => {
    productos = data;
    this.cargarPagina(data);
  })
  .catch((error) => {
    console.error("Hubo un error: " + error);
  });

let contenedorProductos = document.getElementById("contenedorProductos");

function cargarPagina(productos) {
  productos.forEach((producto) => {
    let tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";

    tarjeta.innerHTML = `
        <h3>${producto.nombre}</h3>    
        <img src="./imagenes/${producto.rutaImagen}">
        <p><strong>$${producto.precio}</strong></p>
        <button class="btn btn-orange" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        `;
    contenedorProductos.appendChild(tarjeta);
  });
}

let carritoDeCompras = [];
let carritoRecuperado = localStorage.getItem("carrito");

function setearCantidadProductos() {
  let cant = 0;
  carritoDeCompras.forEach(function (producto) {
    cant += producto.cantidad;
  });

  if (cant > 0) {
    document.getElementById("idCantidadProductos").innerHTML = cant;
  } else {
    document.getElementById("idCantidadProductos").innerHTML = "";
  }
}

function agregarAlCarrito(idProducto) {
  const productoEncontrado = buscarProductoPorId(idProducto);

  const productoExistente = carritoDeCompras.find(
    (item) => item.id === productoEncontrado.id
  );

  if (productoExistente) {
    productoExistente.cantidad += 1;
    lanzarTostada(
      `Se agregó otro ${productoEncontrado.nombre} al carrito. Total: ${productoExistente.cantidad}`,
      1500
    );
  } else {
    productoEncontrado.cantidad = 1;
    carritoDeCompras.push(productoEncontrado);
    lanzarTostada(
      `Producto "${productoEncontrado.nombre}" agregado al carrito.`,
      1500
    );
  }

  localStorage.setItem("carrito", JSON.stringify(carritoDeCompras));
  setearCantidadProductos();
}

function buscarProductoPorId(id) {
  const productoEncontrado = productos.find((producto) => producto.id === id);
  return productoEncontrado;
}

let botonCarrito = document.getElementById("carrito");

botonCarrito.addEventListener("click", verCarrito);

function verCarrito() {
  if (carritoDeCompras.length > 0) {
    let mensaje = "";
    let total = 0;
    carritoDeCompras.forEach(function (producto) {
      mensaje +=
        "<ul><li>" +
        producto.cantidad +
        " un. " +
        producto.nombre +
        " = $" +
        producto.cantidad * producto.precio +
        "</li></ul>";
      total += producto.cantidad * producto.precio;
    });

    mensaje += "<br /><strong>" + "Total: $" + total + "</strong>";

    document.getElementById("contenidoModal").innerHTML = mensaje;
    $("#modalCarrito").modal("show");
  } else {
    lanzarTostada(`Agregar productos al carrito`, 1500);
  }
}

function limpiarCarrito() {
  carritoDeCompras = [];
  localStorage.removeItem("carrito");
  setearCantidadProductos();
}

function finalizarCompra() {
  let total = 0;
  carritoDeCompras.forEach(function (producto) {
    total += producto.cantidad * producto.precio;
  });

  carritoDeCompras = [];
  localStorage.removeItem("carrito");
  setearCantidadProductos();

  lanzarTostada(
    "Fin de la compra. Valor: $" + total + ". Gracias por su compra.",
    2000
  );
}

function lanzarTostada(text, duration) {
  Toastify({ text, duration }).showToast();
}
