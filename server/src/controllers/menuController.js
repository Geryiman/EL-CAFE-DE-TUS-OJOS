const db = require('../database/db');
const env = require('../config/env');

function getMenu(req, res) {
  res.json({
    success: true,
    data: {
      items: db.getMenu(),
      business: {
        name: env.BUSINESS_NAME,
        whatsapp: env.BUSINESS_WHATSAPP_PHONE,
        clabe: env.BUSINESS_CLABE,
        bank: env.BUSINESS_BANK,
      },
    },
    message: 'Menú cargado',
  });
}

function updateMenuItem(req, res) {
  const id = Number(req.params.id);
  const { price, available } = req.body || {};
  const changes = {};

  if (price !== undefined) {
    const parsed = Number(price);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100000) {
      return res.status(400).json({ success: false, data: null, message: 'Precio inválido' });
    }
    changes.price = Math.round(parsed * 100) / 100;
  }
  if (available !== undefined) {
    if (typeof available !== 'boolean') {
      return res.status(400).json({ success: false, data: null, message: 'Disponibilidad inválida' });
    }
    changes.available = available;
  }
  if (!Object.keys(changes).length) {
    return res.status(400).json({ success: false, data: null, message: 'Sin cambios para aplicar' });
  }

  const updated = db.updateMenuItem(id, changes);
  if (!updated) {
    return res.status(404).json({ success: false, data: null, message: 'Producto no encontrado' });
  }
  return res.json({ success: true, data: updated, message: 'Producto actualizado' });
}

module.exports = { getMenu, updateMenuItem };
