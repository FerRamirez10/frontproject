let currentUser = null;
let orders = [];

window.onload = function () {
  document.getElementById("login-button").addEventListener("click", function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    authenticateUser(username, password);
  });


  if (currentUser) {
    getOrders();
  }

  async function authenticateUser(username, password) {
    try {
      const response = await fetch("https://projectpnthd.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        localStorage.setItem("authToken", token);
        document.getElementById("login-container").style.display = "none";
        document.getElementById("order-list-container").style.display = "block";
        document.getElementById("filter-container").style.display = "block";
        document.getElementById("logout-button").style.display = "block";
        getOrders();
      } else {
        document.getElementById("error-message").textContent =
          "Usuario o contraseña incorrectos";
      }
    } catch (error) {
      console.error("Error al autenticar:", error);
      document.getElementById("error-message").textContent =
        "Error al autenticar";
    }
  }

  async function getOrders() {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        document.getElementById("error-message").textContent =
          "Usuario no autenticado";
        return;
      }

      const response = await fetch("https://projectpnthd.onrender.com/api/display", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        orders = data.pedidos;
        displayOrders();
      } else {
        console.error("Error al obtener la lista de pedidos:", data);
        document.getElementById("error-message").textContent =
          "Error al obtener la lista de pedidos";
      }
    } catch (error) {
      console.error("Error al obtener la lista de pedidos:", error);
      document.getElementById("error-message").textContent =
        "Error al obtener la lista de pedidos";
    }
  }

  async function changeOrderStatus(orderId, newStatus) {
    try {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        document.getElementById('error-message').textContent = 'Usuario no autenticado';
        return;
      }

      const response = await fetch(`https://projectpnthd.onrender.com/api/pedidos/${orderId}/atender`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          nuevo_estado: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        getOrders();
      } else {
        console.error('Error al cambiar el estado del pedido:', data);
        document.getElementById('error-message').textContent =
          'Error al cambiar el estado del pedido';
      }
    } catch (error) {
      console.error('Error al cambiar el estado del pedido:', error);
      document.getElementById('error-message').textContent =
        'Error al cambiar el estado del pedido';
    }
  }

  

  function displayOrders() {
    const orderList = document.getElementById('orderList');
    orderList.innerHTML = '';
  
    const filteredClient = document.getElementById('client-filter').value.toLowerCase();
    const filteredStatus = document.getElementById('status-filter').value;
  
    const filteredOrders = orders.filter(order => {
      const clientMatches = order.nombre_cliente.toLowerCase().includes(filteredClient);
      const statusMatches = (filteredStatus === 'todos' || order.estado === filteredStatus);
  
      return clientMatches && statusMatches;
    });
  
    filteredOrders.forEach(order => {
      const li = document.createElement('li');
      li.textContent = `Pedido #${order.id} - Cliente: ${order.nombre_cliente} - Estado: ${order.estado}`;
  
      if (order.estado !== 'atendido') {
        const atenderButton = document.createElement('button');
        atenderButton.textContent = 'Atender';
        atenderButton.addEventListener('click', () => changeOrderStatus(order.id, 'atendido'));
        li.appendChild(atenderButton);
      }
  
      orderList.appendChild(li);
    });
  }
  document.getElementById("apply-filter-button").addEventListener("click", displayOrders);
  document.getElementById("logout-button").addEventListener("click", function () {
    // Limpiar el token de autenticación almacenado
    localStorage.removeItem("authToken");
  
    // Redirigir a index.html
    window.location.href = "index.html";
  });
  
};
