import { useEffect, useState } from 'react';
import { Banknote, Check, Copy, Landmark, Loader2, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { formatPrice } from '../../utils/format';

const METHODS = [
  { key: 'efectivo', label: 'Efectivo / Caja', hint: 'Paga al recoger tu pedido', Icon: Banknote },
  { key: 'spei', label: 'Transferencia SPEI', hint: 'Transfiere y envía tu comprobante', Icon: Landmark },
];

export default function PaymentModal({ business, onClose, onOrderCreated }) {
  const { items, total, clearCart } = useCart();
  const { showToast } = useToast();
  const [method, setMethod] = useState('efectivo');
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => event.key === 'Escape' && !isSubmitting && onClose();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isSubmitting]);

  const handleCopyClabe = async () => {
    try {
      await navigator.clipboard.writeText(business.clabe);
      setHasCopied(true);
      showToast('CLABE copiada al portapapeles');
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      showToast('No se pudo copiar. Selecciona la CLABE manualmente.', 'error');
    }
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    try {
      const order = await api.createOrder({
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        paymentMethod: method,
        customerName: customerName.trim(),
      });
      clearCart();
      showToast(`Pedido ${order.folio} registrado`);
      onOrderCreated(order);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-end sm:place-items-center">
      <div className="absolute inset-0 animate-fade bg-black/50 backdrop-blur-sm" onClick={() => !isSubmitting && onClose()} />
      <div
        className="glass-strong relative w-full max-w-md animate-slide-up !rounded-b-none p-6 sm:!rounded-b-2xl"
        role="dialog"
        aria-label="Método de pago"
      >
        <button onClick={onClose} disabled={isSubmitting} className="btn-ghost absolute right-4 top-4 !rounded-full !p-2" aria-label="Cerrar">
          <X size={16} />
        </button>
        <h2 className="text-xl font-bold">¿Cómo vas a pagar?</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Sin registros ni cuentas. Solo elige y confirma.</p>

        <div className="mt-5 grid gap-3">
          {METHODS.map(({ key, label, hint, Icon }) => {
            const isActive = method === key;
            return (
              <button
                key={key}
                onClick={() => setMethod(key)}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  isActive
                    ? 'border-coffee-500 bg-coffee-500/10 ring-2 ring-coffee-400/30'
                    : 'border-black/10 bg-white/40 hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
                }`}
                aria-pressed={isActive}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-coffee-700 text-white">
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="block text-xs text-neutral-500">{hint}</span>
                </span>
              </button>
            );
          })}
        </div>

        {method === 'spei' && (
          <div className="glass mt-4 animate-fade p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-500">{business.bank}</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <code className="select-all text-base font-bold tracking-wider">{business.clabe}</code>
              <button onClick={handleCopyClabe} className="btn-ghost !px-3 !py-2" aria-label="Copiar CLABE">
                {hasCopied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                {hasCopied ? 'Copiada' : 'Copiar'}
              </button>
            </div>
            <p className="mt-2 text-xs text-neutral-500">Beneficiario: {business.name}</p>
          </div>
        )}

        <label className="mt-4 block text-sm font-medium">
          Tu nombre <span className="font-normal text-neutral-500">(opcional)</span>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            maxLength={60}
            placeholder="¿A nombre de quién?"
            className="input mt-1.5"
          />
        </label>

        <button onClick={handleConfirmOrder} disabled={isSubmitting || items.length === 0} className="btn-primary mt-5 w-full !py-3">
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
          Confirmar pedido · {formatPrice(total)}
        </button>
      </div>
    </div>
  );
}
