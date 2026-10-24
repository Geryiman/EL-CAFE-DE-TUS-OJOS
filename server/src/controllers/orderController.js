const db = require('../database/db');

const VALID_STATUSES = ['pendiente', 'en_preparacion', 'entregado', 'cancelado'];
const VALID_PAYMENTS = ['efectivo', 'spei'];

function createOrder(req, res) {
  const { items, paymentMethod, customerName, notes } = req.body || {};

  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return res.status(400).json({ success: false, data: null, message: 'El pedido no tiene productos' });
  }
  if (!VALID_PAYMENTS.includes(paymentMethod)) {
    return res.status(400).json({ success: false, data: null, message: 'Método de pago inválido' });
  }

  // El precio SIEMPRE se toma del servidor, nunca del cliente.
  const lines = [];
  let total = 0;
  for (const raw of items) {
    const product = db.getMenuItem(Number(raw.id));
    const quantity = Number(raw.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return res.status(400).json({ success: false, data: null, message: 'Producto o cantidad inválidos' });
    }
    if (!product.available) {
      return res.status(409).json({ success: false, data: null, message: `"${product.name}" no está disponible` });
    }
    lines.push({ id: product.id, name: product.name, price: product.price, quantity });
    total += product.price * quantity;
  }

  const order = db.createOrder({
    items: lines,
    total: Math.round(total * 100) / 100,
    paymentMethod,
    customerName: String(customerName || '').slice(0, 60),
    notes: String(notes || '').slice(0, 200),
  });

  return res.status(201).json({ success: true, data: order, message: 'Pedido registrado' });
}

function getOrder(req, res) {
  const id = Number(req.params.id);
  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ success: false, data: null, message: 'ID de pedido inválido' });
  }
  const order = db.getOrder(id);
  if (!order) {
    return res.status(404).json({ success: false, data: null, message: 'Pedido no encontrado' });
  }
  return res.json({ success: true, data: order, message: 'Pedido encontrado' });
}

function listOrders(req, res) {
  res.json({ success: true, data: db.getOrders(), message: 'Pedidos cargados' });
}

function updateOrderStatus(req, res) {
  const id = Number(req.params.id);
  const { status } = req.body || {};
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, data: null, message: 'Estado inválido' });
  }
  const order = db.updateOrderStatus(id, status);
  if (!order) {
    return res.status(404).json({ success: false, data: null, message: 'Pedido no encontrado' });
  }
  return res.json({ success: true, data: order, message: 'Estado actualizado' });
}

module.exports = { createOrder, listOrders, updateOrderStatus, getOrder };
