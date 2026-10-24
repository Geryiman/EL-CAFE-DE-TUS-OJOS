import { useEffect } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';

export default function CartDrawer({ onCheckout }) {
  const { items, total, isCartOpen, closeCart, changeQuantity, removeFromCart } = useCart();

  useEffect(() => {
    if (!isCartOpen) return undefined;
    const handleKeyDown = (event) => event.key === 'Escape' && closeCart();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 animate-fade bg-black/40 backdrop-blur-sm" onClick={closeCart} />
      <aside
        className="glass-strong absolute bottom-0 right-0 top-0 flex w-full max-w-md animate-slide-left flex-col !rounded-none sm:!rounded-l-3xl"
        role="dialog"
        aria-label="Carrito de compras"
      >
        <div className="flex items-center justify-between border-b border-black/5 p-5 dark:border-white/10">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ShoppingBag size={20} /> Tu pedido
          </h2>
          <button onClick={closeCart} className="btn-ghost !rounded-full !p-2" aria-label="Cerrar carrito">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {items.length === 0 ? (
            <p className="mt-16 text-center text-sm text-neutral-500">Tu carrito está vacío. ¡Agrega algo delicioso! ☕</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="glass flex items-center gap-3 p-3">
                <img src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{item.name}</p>
                  <p className="text-sm text-coffee-700 dark:text-coffee-300">{formatPrice(item.price * item.quantity)}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => changeQuantity(item.id, -1)} className="btn-ghost !rounded-full !p-1.5" aria-label="Quitar uno">
                    <Minus size={14} />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                  <button onClick={() => changeQuantity(item.id, 1)} className="btn-ghost !rounded-full !p-1.5" aria-label="Agregar uno">
                    <Plus size={14} />
                  </button>
                  <button onClick={() => removeFromCart(item.id)} className="ml-1 text-rose-500" aria-label={`Eliminar ${item.name}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t border-black/5 p-5 dark:border-white/10">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button onClick={onCheckout} className="btn-primary w-full !py-3">
              Continuar al pago
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
