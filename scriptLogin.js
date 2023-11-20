let currentUser = null;
let orders = [];

window.onload = function () {
  document.getElementById("login-button").addEventListener("click", function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    authenticateUser(username, password);
  });


  const orderStatusFilter = document.getElementById('orderStatusFilter');
  const customerNameFilter = document.getElementById('customerNameFilter');
  const applyFilterButton = document.getElementById('applyFilterButton');
  const clearFilterButton = document.getElementById('clearFilterButton');

  applyFilterButton.addEventListener('click', filterOrders);
  clearFilterButton.addEventListener('click', clearFilters);

  const filterContainer = document.getElementById('filter-container');
  filterContainer.style.display = 'block';


  if (currentUser) {
    getOrders();
  }





async function authenticateUser(username, password) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/login", {
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
      // Manejar el caso donde el token no está presente
      document.getElementById("error-message").textContent =
        "Usuario no autenticado";
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/api/display", {
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

async function filterOrders() {
  const statusFilter = document.getElementById('orderStatus').value;
  const customerFilter = document.getElementById('customerName').value.toLowerCase();

  const filteredOrders = orders.filter(order =>
    order.estado === statusFilter && order.nombre_cliente.toLowerCase().includes(customerFilter)
  );

  const orderList = document.getElementById('orderList');
  orderList.innerHTML = '';

  filteredOrders.forEach(order => {
    const li = document.createElement('li');
    li.textContent = `Pedido #${order.id} - Cliente: ${order.nombre_cliente} - Estado: ${order.estado}`;
    orderList.appendChild(li);
  });
}

async function changeOrderStatus(orderId, newStatus) {
  try {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      // Manejar el caso donde el token no está presente
      document.getElementById('error-message').textContent = 'Usuario no autenticado';
      return;
    }

    const response = await fetch(`http://127.0.0.1:8000/api/pedidos/${orderId}/atender`, {
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
      // Actualizar la lista de pedidos después de cambiar el estado
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

function clearFilters() {
  orderStatusFilter.value = '';
  customerNameFilter.value = '';
  filterOrders();
}

function displayOrders() {
  const orderList = document.getElementById('orderList');
  orderList.innerHTML = '';

  orders.forEach(order => {
    const li = document.createElement('li');
    li.textContent = `Pedido #${order.id} - Cliente: ${order.nombre_cliente} - Estado: ${order.estado}`;

    // Agrega botón para cambiar el estado a atendido solo si no está atendido
    if (order.estado !== 'atendido') {
      const atenderButton = document.createElement('button');
      atenderButton.textContent = 'Atender';
      atenderButton.addEventListener('click', () => changeOrderStatus(order.id, 'atendido'));
      li.appendChild(atenderButton);
    }

    orderList.appendChild(li);
  });
}




};

