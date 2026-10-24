import { useState } from 'react';
import { Check } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/format';

function MenuRow({ product, onUpdated }) {
  const { showToast } = useToast();
  const [priceInput, setPriceInput] = useState(String(product.price));
  const [isSaving, setIsSaving] = useState(false);

  const isPriceDirty = Number(priceInput) !== product.price;

  const handleSavePrice = async () => {
    const price = Number(priceInput);
    if (!Number.isFinite(price) || price < 0) {
      showToast('Escribe un precio válido', 'error');
      return;
    }
    setIsSaving(true);
    try {
      const updated = await api.updateMenuItem(product.id, { price });
      onUpdated(updated);
      showToast(`Precio de ${updated.name}: ${formatPrice(updated.price)}`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAvailability = async () => {
    const next = !product.available;
    onUpdated({ ...product, available: next }); // optimista
    try {
      await api.updateMenuItem(product.id, { available: next });
      showToast(next ? `${product.name} disponible` : `${product.name} pausado`);
    } catch (err) {
      onUpdated(product); // revertir
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="glass flex flex-wrap items-center gap-3 p-3">
      <img src={product.image} alt="" className={`h-14 w-14 rounded-xl object-cover ${product.available ? '' : 'grayscale'}`} />
      <div className="min-w-0 flex-1 basis-40">
        <p className="truncate text-sm font-semibold">{product.name}</p>
        <p className="text-xs text-neutral-500">{product.category}</p>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-sm text-neutral-500">$</span>
        <input
          type="number"
          min="0"
          step="1"
          value={priceInput}
          onChange={(e) => setPriceInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && isPriceDirty && handleSavePrice()}
          className="input !w-24 !py-2"
          aria-label={`Precio de ${product.name}`}
        />
        <button
          onClick={handleSavePrice}
          disabled={!isPriceDirty || isSaving}
          className="btn-primary !p-2.5"
          aria-label="Guardar precio"
        >
          <Check size={15} />
        </button>
      </div>

      <button
        onClick={handleToggleAvailability}
        role="switch"
        aria-checked={product.available}
        aria-label={`${product.available ? 'Pausar' : 'Activar'} ${product.name}`}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${product.available ? 'bg-emerald-500' : 'bg-neutral-400 dark:bg-neutral-600'}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${product.available ? 'left-[1.4rem]' : 'left-0.5'}`}
        />
      </button>
    </div>
  );
}

export default function MenuManager({ items, setItems, isLoading, error }) {
  const handleUpdated = (updated) => setItems((current) => current.map((p) => (p.id === updated.id ? updated : p)));

  if (isLoading) return <p className="py-16 text-center text-sm text-neutral-500">Cargando menú…</p>;
  if (error) return <p className="py-16 text-center text-sm text-rose-500">{error}</p>;

  return (
    <div className="mx-auto grid max-w-3xl gap-3">
      {items.map((product) => (
        <MenuRow key={product.id} product={product} onUpdated={handleUpdated} />
      ))}
    </div>
  );
}
