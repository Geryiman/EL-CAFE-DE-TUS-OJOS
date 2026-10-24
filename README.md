# El Café de Tus Ojos — Menú digital + Panel Admin + WhatsApp

Monorepo fullstack: `client/` (React + Vite + Tailwind) y `server/` (Node + Express, base JSON).

## Correr en local

```bash
cp .env.example .env          # define JWT_SECRET y ADMIN_PASSWORD
npm run install:all

# Terminal 1 (API en :3000)
npm run dev:server
# Terminal 2 (frontend en :5173, con proxy a la API)
npm run dev:client
```

- Menú público: http://localhost:5173/
- Panel admin: http://localhost:5173/admin → botón **Ingresar como Demo Admin (1-Clic)**

## Producción / Railway

Railway ejecuta `npm run build` y luego `node server/index.js` (ver `Procfile`). Express sirve `client/dist`.

Variables a definir en Railway: `JWT_SECRET`, `ADMIN_PASSWORD`, `ADMIN_USER`, `DEMO_MODE`,
`BUSINESS_WHATSAPP_PHONE`, `BUSINESS_CLABE`, `BUSINESS_BANK`.

> Nota: el disco de Railway free es efímero. Los pedidos en `server/data/db.json` se pierden en cada redeploy
> (suficiente para demos; para producción real conecta un volumen o una base de datos).

## Seguridad del modo demo

- El botón "Demo 1-Clic" llama a `POST /api/admin/demo-login`, que emite un JWT **sin exponer la contraseña**.
- Solo funciona con `DEMO_MODE=true`. Para un cliente real, pon `DEMO_MODE=false` y el botón desaparece.
- Todas las rutas admin (`GET /api/orders`, `PATCH /api/orders/:id/status`, `PUT /api/menu/:id`) validan el JWT.
- Los precios del pedido siempre se calculan en el servidor.

## API

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/api/menu` | público |
| POST | `/api/orders` | público |
| POST | `/api/admin/login` | público |
| POST | `/api/admin/demo-login` | público (si `DEMO_MODE=true`) |
| GET | `/api/orders` | admin |
| PATCH | `/api/orders/:id/status` | admin |
| PUT | `/api/menu/:id` | admin |
