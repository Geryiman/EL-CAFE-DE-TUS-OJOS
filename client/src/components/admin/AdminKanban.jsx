import { ArrowLeft, ArrowRight, Ban, Banknote, Landmark } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { formatPrice, formatTime, STATUS_COLUMNS } from '../../utils/format';

// Flujo principal: pendiente -> en_preparacion -> entregado
const FLOW = ['pendiente', 'en_preparacion', 'entregado'];

function OrderCard({ order, onMove }) {
  const flowIndex = FLOW.indexOf(order.status);
  const prev = flowIndex > 0 ? FLOW[flowIndex - 1] : null;
  const next = flowIndex >= 0 && flowIndex < FLOW.length - 1 ? FLOW[flowIndex + 1] : null;
  const PayIcon = order.paymentMethod === 'spei' ? Landmark : Banknote;
  const labelOf = (key) => STATUS_COLUMNS.find((c) => c.key === key).label;

  return (
    <article className="glass animate-slide-up p-3.5 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-bold">{order.folio}</span>
        <span className="text-xs text-neutral-500">{formatTime(order.createdAt)}</span>
      </div>
      {order.customerName && <p className="mt-0.5 text-xs text-neutral-500">{order.customerName}</p>}
      <ul className="mt-2 space-y-0.5 text-neutral-700 dark:text-neutral-300">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.quantity} × {item.name}
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center justify-between border-t border-black/5 pt-2 dark:border-white/10">
        <span className="flex items-center gap-1 text-xs text-neutral-500">
          <PayIcon size={13} /> {order.paymentMethod === 'spei' ? 'SPEI' : 'Efectivo'}
        </span>
        <span className="font-bold">{formatPrice(order.total)}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {prev && (
          <button onClick={() => onMove(order, prev)} className="btn-ghost !px-2.5 !py-1.5 !text-xs" title={`Regresar a ${labelOf(prev)}`}>
            <ArrowLeft size={13} />
          </button>
        )}
        {next && (
          <button onClick={() => onMove(order, next)} className="btn-primary !px-2.5 !py-1.5 !text-xs flex-1">
            {labelOf(next)} <ArrowRight size={13} />
          </button>
        )}
        {order.status !== 'cancelado' && order.status !== 'entregado' && (
          <button onClick={() => onMove(order, 'cancelado')} className="btn-ghost !px-2.5 !py-1.5 !text-xs text-rose-600" title="Cancelar pedido">
            <Ban size={13} />
          </button>
        )}
        {order.status === 'cancelado' && (
          <button onClick={() => onMove(order, 'pendiente')} className="btn-ghost !px-2.5 !py-1.5 !text-xs">
            Reabrir
          </button>
        )}
      </div>
    </article>
  );
}

export default function AdminKanban({ orders, isLoading, error, onChangeStatus }) {
  const { showToast } = useToast();

  const handleMoveOrder = async (order, status) => {
    try {
      await onChangeStatus(order.id, status);
      const column = STATUS_COLUMNS.find((c) => c.key === status);
      showToast(`${order.folio} → ${column.label}`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (isLoading) return <p className="py-16 text-center text-sm text-neutral-500">Cargando pedidos…</p>;
  if (error && orders.length === 0) return <p className="py-16 text-center text-sm text-rose-500">{error}</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {STATUS_COLUMNS.map((column) => {
        const columnOrders = orders.filter((o) => o.status === column.key);
        return (
          <section key={column.key} className="glass flex min-h-[16rem] flex-col p-3">
            <header className="mb-3 flex items-center justify-between px-1">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <span className={`h-2.5 w-2.5 rounded-full ${column.dot}`} />
                {column.label}
              </h3>
              <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-semibold dark:bg-white/10">
                {columnOrders.length}
              </span>
            </header>
            <div className="flex flex-1 flex-col gap-2.5">
              {columnOrders.length === 0 ? (
                <p className="m-auto text-xs text-neutral-400">Sin pedidos</p>
              ) : (
                columnOrders.map((order) => <OrderCard key={order.id} order={order} onMove={handleMoveOrder} />)
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
