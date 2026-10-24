const fs = require('fs');
const path = require('path');
const env = require('../config/env');

const seedMenu = [
  { id: 1, name: 'Espresso Doble', description: 'Intenso, aterciopelado y con crema dorada.', price: 45, category: 'Cafés Calientes', image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=80', available: true },
  { id: 2, name: 'Latte de Vainilla', description: 'Espresso con leche vaporizada y vainilla natural.', price: 62, category: 'Cafés Calientes', image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600&q=80', available: true },
  { id: 3, name: 'Capuchino Clásico', description: 'Triple capa de espresso, leche y espuma sedosa.', price: 58, category: 'Cafés Calientes', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80', available: true },
  { id: 4, name: 'Frappé de Caramelo', description: 'Café frío licuado con caramelo y crema batida.', price: 79, category: 'Frappés', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80', available: true },
  { id: 5, name: 'Frappé Moka', description: 'Chocolate y espresso en una mezcla helada.', price: 82, category: 'Frappés', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80', available: true },
  { id: 6, name: 'Frappé Oreo', description: 'Galleta triturada, helado de vainilla y chocolate.', price: 85, category: 'Frappés', image: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?w=600&q=80', available: true },
  { id: 7, name: 'Cheesecake de Frutos Rojos', description: 'Cremoso, con base de galleta y coulis casero.', price: 75, category: 'Postres', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80', available: true },
  { id: 8, name: 'Brownie con Helado', description: 'Brownie tibio con bola de helado de vainilla.', price: 68, category: 'Postres', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80', available: true },
];

let state = { menu: [], orders: [], orderCounter: 1000 };

function persist() {
  try {
    fs.mkdirSync(path.dirname(env.DB_PATH), { recursive: true });
    fs.writeFileSync(env.DB_PATH, JSON.stringify(state, null, 2));
  } catch (err) {
    console.error('[db] No se pudo guardar el respaldo JSON:', err.message);
  }
}

function init() {
  if (fs.existsSync(env.DB_PATH)) {
    try {
      state = JSON.parse(fs.readFileSync(env.DB_PATH, 'utf8'));
      return;
    } catch (err) {
      console.error('[db] Respaldo corrupto, se reinicia con datos semilla.');
    }
  }
  state = { menu: seedMenu, orders: [], orderCounter: 1000 };
  persist();
}

init();

const db = {
  getMenu: () => state.menu,
  getMenuItem: (id) => state.menu.find((item) => item.id === id),
  updateMenuItem: (id, changes) => {
    const item = state.menu.find((p) => p.id === id);
    if (!item) return null;
    Object.assign(item, changes);
    persist();
    return item;
  },
  getOrders: () => [...state.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  getOrder: (id) => state.orders.find((o) => o.id === id),
  createOrder: (data) => {
    state.orderCounter += 1;
    const order = {
      id: state.orderCounter,
      folio: `#CAF-${state.orderCounter}`,
      status: 'pendiente',
      createdAt: new Date().toISOString(),
      ...data,
    };
    state.orders.push(order);
    persist();
    return order;
  },
  updateOrderStatus: (id, status) => {
    const order = state.orders.find((o) => o.id === id);
    if (!order) return null;
    order.status = status;
    persist();
    return order;
  },
};

module.exports = db;
