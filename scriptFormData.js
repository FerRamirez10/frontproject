document.addEventListener("DOMContentLoaded", function () {
  const carritoProductos = JSON.parse(localStorage.getItem("carritoProductos"));
  if (carritoProductos) {
    const nombreInput = document.getElementById("nombre");
    const telefonoInput = document.getElementById("telefono");
    const emailInput = document.getElementById("email");
    const direccionInput = document.getElementById("direccion");
    const productosTable = document
      .getElementById("productos-table")
      .getElementsByTagName("tbody")[0];
    carritoProductos.forEach((producto) => {
      const row = productosTable.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      cell1.innerHTML = producto.nombre;
      cell2.innerHTML = producto.cantidad;
    });
  }
});

document
  .getElementById("formulario-pedido")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const carritoProductos = JSON.parse(
      localStorage.getItem("carritoProductos")
    );
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;
    const direccion = document.getElementById("direccion").value;
    const formData = {
      nombre,
      email,
      telefono,
      direccion,
    };
    formData.productos = carritoProductos;

    fetch("http://127.0.0.1:8000/api/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        console.log(response); // Agrega esta línea para ver la respuesta completa
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
      });
  });
