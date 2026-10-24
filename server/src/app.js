const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50kb' }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { business: env.BUSINESS_NAME }, message: 'OK' });
});
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', authRoutes);

// Servir el frontend compilado (SPA) desde el mismo proceso
const clientDist = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^\/(?!api).*/, (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.use('/api', notFound);
app.use(errorHandler);

module.exports = app;
