const fs = require('fs');
const path = require('path');

// Carga mínima de .env (raíz del monorepo o carpeta server) sin dependencias extra
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(path.join(__dirname, '../../../.env'));
loadEnvFile(path.join(__dirname, '../../.env'));

const env = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || '',
  ADMIN_USER: process.env.ADMIN_USER || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
  DEMO_MODE: (process.env.DEMO_MODE || 'true').toLowerCase() === 'true',
  BUSINESS_NAME: process.env.BUSINESS_NAME || 'El Café de Tus Ojos',
  BUSINESS_WHATSAPP_PHONE: process.env.BUSINESS_WHATSAPP_PHONE || '5212221234567',
  BUSINESS_CLABE: process.env.BUSINESS_CLABE || '012345678901234567',
  BUSINESS_BANK: process.env.BUSINESS_BANK || 'BBVA México',
  DB_PATH: process.env.DB_PATH || path.join(__dirname, '../../data/db.json'),
};

if (!env.JWT_SECRET || !env.ADMIN_PASSWORD) {
  console.warn(
    '[env] Falta JWT_SECRET o ADMIN_PASSWORD. Copia .env.example a .env y define ambos valores.'
  );
}

module.exports = env;
