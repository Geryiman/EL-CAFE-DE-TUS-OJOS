import { useEffect } from 'react';
import { CheckCircle2, MessageCircle, X } from 'lucide-react';
import { formatPrice, PAYMENT_LABELS } from '../../utils/format';

export default function OrderTicket({ order, whatsappUrl, onClose, onOpenOrders }) {
  useEffect(() => {
    const handleKeyDown = (event) => event.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-4">
      <div
        className="absolute inset-0 animate-fade bg-black/50 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="glass-strong relative w-full max-w-sm animate-slide-up p-6 text-center"
        role="dialog"
        aria-label="Pedido confirmado"
      >
        {/* Botón X para cerrar / salir de la confirmación */}
        <button
          onClick={onClose}
          className="btn-ghost absolute right-3.5 top-3.5 !rounded-full !p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          aria-label="Cerrar confirmación"
          title="Cerrar"
        >
          <X size={18} />
        </button>

        <CheckCircle2 size={44} className="mx-auto text-emerald-500" />
        <h2 className="mt-3 text-xl font-bold">{order.isNew !== false ? '¡Pedido listo!' : 'Ticket Digital'}</h2>
        <p className="mt-1 text-2xl font-extrabold tracking-wider text-coffee-700 dark:text-coffee-300">{order.folio}</p>

        <ul className="mt-4 space-y-1.5 border-y border-dashed border-black/15 py-4 text-left text-sm dark:border-white/20">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3">
              <span>
                {item.quantity} × {item.name}
              </span>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between text-base font-bold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        <p className="mt-1 text-left text-xs text-neutral-500">Pago: {PAYMENT_LABELS[order.paymentMethod]}</p>

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5 w-full !bg-emerald-600 !py-3 hover:!bg-emerald-500">
          <MessageCircle size={18} /> {order.isNew !== false ? 'Enviar pedido por WhatsApp' : 'Enviar mensaje a cafetería'}
        </a>
        <p className="mt-1.5 text-[11px] text-neutral-500">
          {order.isNew !== false
            ? 'Envía el detalle del pedido para registrarlo en cocina.'
            : 'Este pedido ya está registrado en cola. Envía un mensaje normal para dudas o seguimiento sin duplicar turno.'}
        </p>

        {onOpenOrders && (
          <button
            onClick={() => {
              onClose?.();
              onOpenOrders?.();
            }}
            className="btn-ghost mt-2 w-full text-xs font-semibold text-coffee-700 dark:text-coffee-300"
          >
            Ver mis pedidos guardados
          </button>
        )}

        <button onClick={onClose} className="btn-ghost mt-2 w-full">
          {order.isNew !== false ? 'Hacer otro pedido' : 'Cerrar ticket'}
        </button>
      </div>
    </div>
  );
}
