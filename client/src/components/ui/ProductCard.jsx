import { memo } from 'react';
import { Plus } from 'lucide-react';
import { formatPrice } from '../../utils/format';

function ProductCard({ product, onAdd }) {
  const isSoldOut = !product.available;

  return (
    <article className="glass group flex flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${isSoldOut ? 'grayscale' : ''}`}
        />
        {isSoldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            Agotado
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-base font-semibold">{product.name}</h3>
        <p className="flex-1 text-sm text-neutral-600 dark:text-neutral-400">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-coffee-700 dark:text-coffee-300">{formatPrice(product.price)}</span>
          <button
            onClick={() => onAdd(product)}
            disabled={isSoldOut}
            className="btn-primary !rounded-full !px-3.5 !py-2"
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <Plus size={16} /> Agregar
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
