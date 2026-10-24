const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function signAdminToken() {
  return jwt.sign({ role: 'admin', user: env.ADMIN_USER }, env.JWT_SECRET, { expiresIn: '12h' });
}

function login(req, res) {
  const { username, password } = req.body || {};

  if (!env.JWT_SECRET || !env.ADMIN_PASSWORD) {
    return res.status(500).json({ success: false, data: null, message: 'Servidor sin credenciales configuradas' });
  }

  if (!safeEqual(username || '', env.ADMIN_USER) || !safeEqual(password || '', env.ADMIN_PASSWORD)) {
    return res.status(401).json({ success: false, data: null, message: 'Credenciales incorrectas' });
  }

  return res.json({ success: true, data: { token: signAdminToken(), user: env.ADMIN_USER }, message: 'Sesión iniciada' });
}

// Botón "Demo 1-Clic": el servidor emite el JWT directamente, sin exponer la
// contraseña. Solo funciona si DEMO_MODE=true; ponlo en false al entregar el
// sistema a un cliente real.
function demoLogin(req, res) {
  if (!env.DEMO_MODE) {
    return res.status(403).json({ success: false, data: null, message: 'Modo demo desactivado' });
  }
  if (!env.JWT_SECRET) {
    return res.status(500).json({ success: false, data: null, message: 'Servidor sin JWT_SECRET configurado' });
  }
  return res.json({ success: true, data: { token: signAdminToken(), user: env.ADMIN_USER }, message: 'Sesión demo iniciada' });
}

function demoStatus(req, res) {
  res.json({ success: true, data: { demoMode: env.DEMO_MODE }, message: 'OK' });
}

module.exports = { login, demoLogin, demoStatus };
