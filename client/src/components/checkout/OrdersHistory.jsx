import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Coffee,
  MessageCircle,
  Receipt,
  RefreshCw,
  RotateCcw,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { formatPrice, formatTime, PAYMENT_LABELS, buildWhatsAppInquiryUrl } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const STATUS_CONFIG = {
  pendiente: {
    label: 'Pendiente en cola',
    step: 1,
    badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    dotClass: 'bg-amber-500',
    hint: 'Tu pedido fue recibido y está en espera de turno en barra.',
    Icon: Clock,
  },
  en_preparacion: {
    label: 'En preparación en barra',
    step: 2,
    badgeClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30 animate-pulse',
    dotClass: 'bg-sky-500',
    hint: '¡El barista está preparando tus bebidas y postres! ☕',
    Icon: Coffee,
  },
  entregado: {
    label: 'Listo / Entregado',
    step: 3,
    badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    dotClass: 'bg-emerald-500',
    hint: 'Tu pedido está listo o ha sido entregado. ¡Que lo disfrutes!',
    Icon: CheckCircle2,
  },
  cancelado: {
    label: 'Cancelado',
    step: 0,
    badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    dotClass: 'bg-rose-500',
    hint: 'Este pedido fue cancelado.',
    Icon: AlertCircle,
  },
};

export default function OrdersHistory({
  orders,
  business,
  onRefresh,
  isRefreshing,
  onClearHistory,
  onSelectOrderTicket,
  onExploreMenu,
}) {
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();
  const [confirmClear, setConfirmClear] = useState(false);

  const handleRepeatOrder = (order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((item) => {
      addToCart(item, item.quantity);
    });
    showToast(`Productos de ${order.folio} añadidos al carrito`);
    openCart();
  };

  const handleClear = () => {
    onClearHistory();
    setConfirmClear(false);
    showToast('Historial de pedidos limpiado');
  };

  if (orders.length === 0) {
    return (
      <div className="glass mx-auto max-w-lg p-8 text-center animate-fade">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-coffee-700/10 text-coffee-700 dark:bg-white/10 dark:text-coffee-300">
          <Receipt size={32} />
        </div>
        <h3 className="mt-4 text-xl font-bold">Aún no tienes pedidos registrados</h3>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          En cuanto hagas un pedido desde el menú, aparecerá aquí con su folio para que puedas consultar su estatus en
          vivo, ver el ticket y contactarnos por WhatsApp.
        </p>
        <button onClick={onExploreMenu} className="btn-primary mt-6 !px-6 !py-3">
          <ShoppingBag size={18} /> Explorar el menú y pedir
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade">
      {/* Barra de cabecera con acciones */}
      <div className="glass flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-coffee-700 text-white shadow-sm">
            <Receipt size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Historial de Pedidos</h2>
            <p className="text-xs text-neutral-500">
              {orders.length} {orders.length === 1 ? 'pedido guardado' : 'pedidos guardados'} en este dispositivo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="btn-ghost !px-3 !py-2 text-xs font-semibold"
            title="Sincronizar estados con el servidor"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-coffee-600' : ''} />
            <span className="hidden sm:inline">Actualizar estados</span>
          </button>

          {confirmClear ? (
            <div className="flex items-center gap-1.5 animate-fade">
              <button onClick={handleClear} className="btn !bg-rose-600 !text-white !px-3 !py-2 text-xs">
                Confirmar
              </button>
              <button onClick={() => setConfirmClear(false)} className="btn-ghost !px-2.5 !py-2 text-xs">
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              className="btn-ghost !p-2 text-neutral-400 hover:text-rose-500"
              title="Borrar historial local"
              aria-label="Borrar historial"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Listado de pedidos */}
      <div className="grid gap-5">
        {orders.map((order) => {
          const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pendiente;
          const StatusIcon = config.Icon;
          const currentStep = config.step;
          const whatsappUrl = buildWhatsAppInquiryUrl({
            phone: business?.whatsapp || '',
            order,
            businessName: business?.name || 'El Café de Tus Ojos',
          });

          return (
            <div
              key={order.folio || order.id}
              className="glass p-5 sm:p-6 transition hover:shadow-lg dark:hover:border-white/20"
            >
              {/* Encabezado del pedido */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/5 pb-4 dark:border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold tracking-wide text-coffee-700 dark:text-coffee-300">
                      {order.folio}
                    </span>
                    {order.customerName && (
                      <span className="text-xs text-neutral-500 font-medium">· {order.customerName}</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {order.createdAt ? formatTime(order.createdAt) : 'Hoy'} · Pago:{' '}
                    {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                  </p>
                </div>

                <div
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.badgeClass}`}
                >
                  <span className={`h-2 w-2 rounded-full ${config.dotClass}`} />
                  <StatusIcon size={14} />
                  <span>{config.label}</span>
                </div>
              </div>

              {/* Barra de progreso de estado visual (3 pasos) */}
              {order.status !== 'cancelado' && (
                <div className="my-4 rounded-xl bg-black/[0.02] p-3.5 dark:bg-white/[0.02]">
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold">
                    <div
                      className={`flex flex-col items-center gap-1 transition ${
                        currentStep >= 1 ? 'text-coffee-700 dark:text-coffee-300' : 'text-neutral-400 opacity-60'
                      }`}
                    >
                      <span
                        className={`h-2.5 w-full rounded-full transition-all ${
                          currentStep >= 1 ? 'bg-coffee-600' : 'bg-black/10 dark:bg-white/10'
                        }`}
                      />
                      <span>1. Recibido</span>
                    </div>

                    <div
                      className={`flex flex-col items-center gap-1 transition ${
                        currentStep >= 2 ? 'text-coffee-700 dark:text-coffee-300' : 'text-neutral-400 opacity-60'
                      }`}
                    >
                      <span
                        className={`h-2.5 w-full rounded-full transition-all ${
                          currentStep >= 2 ? 'bg-sky-500' : 'bg-black/10 dark:bg-white/10'
                        }`}
                      />
                      <span>2. En preparación</span>
                    </div>

                    <div
                      className={`flex flex-col items-center gap-1 transition ${
                        currentStep >= 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400 opacity-60'
                      }`}
                    >
                      <span
                        className={`h-2.5 w-full rounded-full transition-all ${
                          currentStep >= 3 ? 'bg-emerald-500' : 'bg-black/10 dark:bg-white/10'
                        }`}
                      />
                      <span>3. Listo</span>
                    </div>
                  </div>
                  <p className="mt-2.5 text-center text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                    {config.hint}
                  </p>
                </div>
              )}

              {/* Lista de productos */}
              <ul className="divide-y divide-black/5 text-sm dark:divide-white/5">
                {order.items?.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between py-2">
                    <span className="font-medium">
                      <span className="text-coffee-700 dark:text-coffee-300 font-bold mr-1.5">{item.quantity}×</span>{' '}
                      {item.name}
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-400 font-medium">
                      {formatPrice((item.price || 0) * (item.quantity || 1))}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Total y botones de acción */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-4 dark:border-white/10">
                <div className="text-base font-bold">
                  <span className="text-xs font-normal text-neutral-500 block">Total pagado</span>
                  <span className="text-lg">{formatPrice(order.total)}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onSelectOrderTicket?.({ ...order, isNew: false })}
                    className="btn-ghost !px-3 !py-2 text-xs font-semibold"
                    title="Ver ticket digital"
                  >
                    <Receipt size={14} /> Ver ticket
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn !bg-emerald-600 !text-white hover:!bg-emerald-500 !px-3 !py-2 text-xs font-semibold"
                    title="Enviar mensaje de consulta a la barra por WhatsApp (no duplica el pedido en cola)"
                  >
                    <MessageCircle size={14} /> Enviar mensaje
                  </a>

                  <button
                    onClick={() => handleRepeatOrder(order)}
                    className="btn-primary !px-3 !py-2 text-xs"
                    title="Volver a agregar estos productos al carrito"
                  >
                    <RotateCcw size={14} /> Repetir pedido
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
