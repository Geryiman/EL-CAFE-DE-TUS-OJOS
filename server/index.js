const env = require('./src/config/env');
const app = require('./src/app');

// Si no estamos en el entorno Serverless de Vercel, escuchar en el puerto
if (!process.env.VERCEL) {
  app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`☕ ${env.BUSINESS_NAME} escuchando en el puerto ${env.PORT}`);

    // Mecanismo Keep-Alive anti-suspensión para Render (ping cada 12 minutos)
    const targetUrl = env.RENDER_EXTERNAL_URL;
    if (targetUrl) {
      console.log(`[keep-alive] Activado para ${targetUrl} (ping cada 12 min para evitar suspensión)`);
      setInterval(async () => {
        try {
          const pingTarget = `${targetUrl.replace(/\/$/, '')}/api/health`;
          const res = await fetch(pingTarget);
          if (res.ok) {
            console.log(`[keep-alive] Ping exitoso a ${pingTarget} (${new Date().toLocaleTimeString('es-MX')})`);
          }
        } catch (err) {
          console.warn('[keep-alive] Error en auto-ping:', err.message);
        }
      }, 12 * 60 * 1000);
    }
  });
}

// Exportar app para el runtime Serverless de Vercel
module.exports = app;
