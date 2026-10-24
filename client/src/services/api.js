const TOKEN_KEY = 'cafe_admin_token';

export const tokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* almacenamiento no disponible */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* almacenamiento no disponible */
    }
  },
};

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = tokenStore.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Sin conexión con el servidor');
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    /* respuesta sin JSON */
  }

  // Interceptor: token vencido o inválido -> cerrar sesión
  if (response.status === 401 && auth) {
    tokenStore.clear();
    window.dispatchEvent(new Event('cafe:unauthorized'));
  }

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || 'Ocurrió un error inesperado');
  }
  return payload.data;
}

export const api = {
  getMenu: () => request('/menu'),
  createOrder: (order) => request('/orders', { method: 'POST', body: order }),
  getOrder: (id) => request(`/orders/${id}`),
  login: (username, password) => request('/admin/login', { method: 'POST', body: { username, password } }),
  demoLogin: () => request('/admin/demo-login', { method: 'POST' }),
  getDemoStatus: () => request('/admin/demo-status'),
  getOrders: () => request('/orders', { auth: true }),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PATCH', body: { status }, auth: true }),
  updateMenuItem: (id, changes) => request(`/menu/${id}`, { method: 'PUT', body: changes, auth: true }),
};
