const env = require('./src/config/env');
const app = require('./src/app');

app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`☕ ${env.BUSINESS_NAME} escuchando en el puerto ${env.PORT}`);
});
