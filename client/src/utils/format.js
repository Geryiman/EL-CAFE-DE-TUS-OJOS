const currency = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatPrice = (value) => currency.format(Number(value) || 0);

export const formatTime = (isoString) =>
  new Date(isoString).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

export const PAYMENT_LABELS = {
  efectivo: 'Efectivo / Caja',
  spei: 'Transferencia SPEI',
};

export const STATUS_COLUMNS = [
  { key: 'pendiente', label: 'Pendiente', dot: 'bg-amber-400' },
  { key: 'en_preparacion', label: 'En preparación', dot: 'bg-sky-400' },
  { key: 'entregado', label: 'Entregado', dot: 'bg-emerald-400' },
  { key: 'cancelado', label: 'Cancelado', dot: 'bg-rose-400' },
];

// Mensaje estructurado para WhatsApp. El texto se codifica con encodeURIComponent
// para que ningún carácter del pedido pueda romper el enlace.
export function buildWhatsAppUrl({ phone, order, businessName }) {
  const lines = order.items.map((i) => `• ${i.quantity} x ${i.name} — ${formatPrice(i.price * i.quantity)}`);
  const text = [
    `☕ *${businessName}*`,
    `Pedido ${order.folio}`,
    order.customerName ? `Cliente: ${order.customerName}` : null,
    '',
    ...lines,
    '',
    `*Total: ${formatPrice(order.total)}*`,
    `Pago: ${PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}`,
    order.paymentMethod === 'spei' ? 'Te enviaré el comprobante por este medio.' : null,
  ]
    .filter((line) => line !== null)
    .join('\n');

  const cleanPhone = String(phone).replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppInquiryUrl({ phone, order, businessName }) {
  const statusLabel =
    STATUS_COLUMNS.find((s) => s.key === order.status)?.label ||
    (order.status === 'en_preparacion' ? 'En preparación' : order.status || 'Registrado');

  const text = [
    `☕ *${businessName}*`,
    `Hola, tengo una consulta sobre mi pedido *${order.folio}* (Estatus: ${statusLabel}).`,
    order.customerName ? `Cliente: ${order.customerName}` : null,
    `Total: ${formatPrice(order.total)}`,
  ]
    .filter(Boolean)
    .join('\n');

  const cleanPhone = String(phone).replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
