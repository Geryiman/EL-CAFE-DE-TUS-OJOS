const jwt = require('jsonwebtoken');
const env = require('../config/env');

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, data: null, message: 'Token requerido' });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (payload.role !== 'admin') throw new Error('Rol inválido');
    req.admin = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, data: null, message: 'Token inválido o expirado' });
  }
}

module.exports = { requireAdmin };
