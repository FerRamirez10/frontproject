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

document.getElementById("formulario-pedido").addEventListener("submit", function (e) {    
    e.preventDefault();
    const carritoProductos = JSON.parse(localStorage.getItem("carritoProductos"));
    const nombre_cliente = document.getElementById("nombre").value;
    const telefono_cliente = document.getElementById("telefono").value;
    const correo_cliente = document.getElementById("email").value;
    const direccion_envio = document.getElementById("direccion").value;
    const formData = {
      nombre_cliente,
      correo_cliente,
      telefono_cliente,
      direccion_envio,
    };
    formData.productos = carritoProductos;
    console.log(formData);
    fetch("http://127.0.0.1:8000/api/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        document.getElementById("mensaje-confirmacion").innerHTML =
          "¡Pedido registrado exitosamente!";
        // Muestra el modal
        document.getElementById("myModal").style.display = "block";

        // Configura un temporizador para cerrar el modal y redirigir después de 2 segundos
        setTimeout(() => {
          document.getElementById("myModal").style.display = "none";
          window.location.href = "index.html";
        }, 2000);
        console.log(data);
      })
      .catch((error) => {
        document.getElementById("mensaje-confirmacion").innerHTML =
          "Hubo un problema al registrar el pedido. Por favor, inténtalo de nuevo.";
        // Muestra el modal
        document.getElementById("myModal").style.display = "block";
        console.error("Error al enviar la solicitud:", error.message);
      });
  });
