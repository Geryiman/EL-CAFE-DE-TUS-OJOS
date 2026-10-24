function notFound(req, res) {
  res.status(404).json({ success: false, data: null, message: 'Ruta no encontrada' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('[error]', err);
  res.status(err.status || 500).json({
    success: false,
    data: null,
    message: err.message || 'Error interno del servidor',
  });
}

module.exports = { notFound, errorHandler };
