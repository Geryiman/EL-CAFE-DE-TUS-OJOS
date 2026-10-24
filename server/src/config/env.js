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

const isVercel = Boolean(process.env.VERCEL);
const defaultDbPath = isVercel
  ? path.join('/tmp', 'db.json')
  : path.join(__dirname, '../../data/db.json');

const env = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'Cualquierclaveesbuena',
  ADMIN_USER: process.env.ADMIN_USER || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'german',
  DEMO_MODE: (process.env.DEMO_MODE || 'true').toLowerCase() === 'true',
  BUSINESS_NAME: process.env.BUSINESS_NAME || 'El Café de Tus Ojos',
  BUSINESS_WHATSAPP_PHONE: process.env.BUSINESS_WHATSAPP_PHONE || '2382528801',
  BUSINESS_CLABE: process.env.BUSINESS_CLABE || '722969020208857289',
  BUSINESS_BANK: process.env.BUSINESS_BANK || 'MErcado Libre',
  DB_PATH: process.env.DB_PATH || defaultDbPath,
  RENDER_EXTERNAL_URL: process.env.RENDER_EXTERNAL_URL || process.env.KEEP_ALIVE_URL || '',
  IS_VERCEL: isVercel,
};

module.exports = env;
