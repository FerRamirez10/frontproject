document.addEventListener("DOMContentLoaded", function () {
  const carritoContainer = document.getElementById("carrito-container");
  const listaCarrito = document.createElement("ul");
  listaCarrito.id = "lista-carrito";
  const totalCarrito = document.createElement("p");
  totalCarrito.innerHTML = "Total: $<span id='total'>0</span>";
  const comprarBtn = document.createElement("button");
  comprarBtn.id = "comprar";
  comprarBtn.className = "boton-comprar";
  comprarBtn.textContent = "Comprar";

  const vaciarCarritoBtn = document.createElement("button");
  vaciarCarritoBtn.id = "vaciar-carrito";
  vaciarCarritoBtn.className = "boton-vaciar";
  vaciarCarritoBtn.textContent = "Vaciar Carrito";

  carritoContainer.appendChild(listaCarrito);
  carritoContainer.appendChild(totalCarrito);
  carritoContainer.appendChild(comprarBtn);
  carritoContainer.appendChild(vaciarCarritoBtn);
  const contenidoDiv = document.getElementById("contenido");

  function mostrarContenidoInicio() {
    contenidoDiv.innerHTML = `
            <div class="contenido-item">
                <img src="logo.png" alt="Imagen 1">
            </div>
        `;
  }
  mostrarContenidoInicio();

  function generarMenu(platos) {
    const menuDiv = document.getElementById("contenido");
    menuDiv.innerHTML = "<h1>Menú</h1>";

    const categorias = {};

    platos.forEach((plato) => {
      if (!categorias[plato.categoria]) {
        categorias[plato.categoria] = [];
      }
      categorias[plato.categoria].push(plato);
    });

    for (const categoria in categorias) {
      const categoriaDiv = document.createElement("div");
      categoriaDiv.className = "categoria";
      categoriaDiv.innerHTML = `<h2>${categoria}</h2>`;

      const productosDiv = document.createElement("div");
      productosDiv.className = "productos";
      categorias[categoria].forEach((plato) => {
        const productoDiv = document.createElement("div");
        productoDiv.className = "producto";
        productoDiv.innerHTML = `
              <img src="${plato.imagen}" alt="${plato.nombre}" class="producto-img">
              <h3>${plato.nombre}</h3>
              <p>Precio: $${plato.precio}</p>
              <button class="agregar-al-carrito" data-nombre="${plato.nombre}" data-precio="${plato.precio}">Agregar al Carrito</button>
            `;
        productosDiv.appendChild(productoDiv);
      });
      categoriaDiv.appendChild(productosDiv);
      menuDiv.appendChild(categoriaDiv);
    }

    menuDiv.appendChild(carritoContainer);
  }

  const inicioLink = document.getElementById("inicio");
  const infoLink = document.getElementById("info");
  const menuLink = document.getElementById("menu");
  const contactoLink = document.getElementById("contacto");

  inicioLink.addEventListener("click", function (event) {
    event.preventDefault();
    mostrarContenidoInicio();
  });

  infoLink.addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("contenido").innerHTML = `
            <div class="contenido-item">
                <img src="restaurante.png" alt="Imagen de bienvenida">
                <h1>¡Bienvenidos a BurgerEpicure, el paraíso de las hamburguesas gourmet!</h1>
                <p>En <b>BurgerEpicure</b>, estamos comprometidos con ofrecer una experiencia culinaria única que hará que tus papilas gustativas se vuelvan locas de emoción.

                Nuestra propuesta gastronómica se basa en la pasión por la comida de calidad. Cada hamburguesa en nuestro menú es una obra de arte culinaria cuidadosamente elaborada con ingredientes frescos y de primera calidad. Nuestro equipo de chefs expertos trabaja incansablemente para crear combinaciones de sabores que te harán volver por más.
                
                En <b>BurgerEpicure</b>, puedes esperar una amplia variedad de hamburguesas, desde las clásicas y reconfortantes hasta las creaciones más extravagantes. ¿Te atreves a probar nuestra "Burger Épica del Día," una hamburguesa que cambia constantemente y está llena de sorpresas deliciosas?
                
                Además, entendemos que cada comensal es único, por lo que ofrecemos opciones vegetarianas y veganas que satisfarán incluso a los paladares más exigentes.
                
                Nuestra filosofía se basa en la calidad, la creatividad y el servicio excepcional. Te invitamos a que nos visites en <b>BurgerEpicure</b>, donde la pasión por las hamburguesas se une con la excelencia culinaria. ¡Prepárate para una experiencia gastronómica que te hará amar las hamburguesas como nunca antes! ¡Te esperamos en <b>BurgerEpicure</b>, donde cada bocado es una obra maestra!</p>
            </div>
        `;
  });
  let menuCargado = false;

  menuLink.addEventListener("click", async () => {
    console.log(".");
    if (!menuCargado) {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/platos");
        if (!response.ok) {
          throw new Error("No se pudo obtener la lista de platos.");
        }
        const platos = await response.json();
        generarMenu(platos);
      } catch (error) {
        console.error(error);
      }
    }
  });

  contactoLink.addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("contenido").innerHTML = `
            <div class="contenido-item">
                <img src="contacto.png" alt="Imagen de contacto">
                <h1>Contacto</h1>
                <p>Puedes encontrarnos en la siguiente dirección:</p>
                <p>123 Calle de las Hamburguesas, Ciudad</p>
                <p>Teléfono: (123) 456-7890</p>
            </div>
        `;
  });

  const carrito = document.getElementById("carrito");

  const carritoProductos = [];

  function agregarProductoAlCarrito(nombre, precio) {
    const producto = { nombre, precio };
    carritoProductos.push(producto);
    mostrarCarrito();
  }

  function mostrarCarrito() {
    listaCarrito.innerHTML = "";

    carritoProductos.forEach((producto) => {
      const li = document.createElement("li");
      li.innerHTML = `${producto.nombre} - $${producto.precio}`;
      listaCarrito.appendChild(li);
    });

    const total = carritoProductos.reduce(
      (acumulador, producto) => acumulador + producto.precio,
      0
    );
    totalCarrito.textContent = total.toFixed(2);
  }

  function vaciarCarrito() {
    carritoProductos.length = 0;
    mostrarCarrito();
  }

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("agregar-al-carrito")) {
      const nombre = event.target.getAttribute("data-nombre");
      const precio = parseFloat(event.target.getAttribute("data-precio"));
      agregarProductoAlCarrito(nombre, precio);
    }
  });

  vaciarCarritoBtn.addEventListener("click", vaciarCarrito);

  function realizarCompra() {
    const productosEnCarrito = carritoProductos.map((producto) => {
      return { nombre: producto.nombre, cantidad: 1 };
    });
    const dialog = document.getElementById("popup");
    const mensajeExito = document.getElementById("popup-message");

    dialog.style.display = "block";
    mensajeExito.textContent = "Domicilio creado exitosamente.";
    console.log(carritoProductos);
    localStorage.setItem(
      "carritoProductos",
      JSON.stringify(productosEnCarrito)
    );

    // Redirige a la página del formulario
    window.location.href = "formData.html";
    setTimeout(() => {
      dialog.style.display = "none";

      vaciarCarrito();
    }, 3000);
  }

  comprarBtn.addEventListener("click", realizarCompra);
});

//const arrayZone = document.getElementById('arrayZone');
//arrayZone.textContent = carritoProductos.join('br');
