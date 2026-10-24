import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Menu, Receipt, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import MobileMenu from './MobileMenu';
import { useCart } from '../../context/CartContext';

export const NAV_LINKS = [
  { label: 'Menú', href: '#menu' },
  { label: 'Contacto', href: '#contacto' },
];

export default function Navbar({ businessName, activeTab = 'menu', onSelectTab, activeOrdersCount = 0 }) {
  const { count, openCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/55 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          onClick={() => onSelectTab?.('menu')}
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-coffee-700 text-white shadow-md">
            <Coffee size={18} />
          </span>
          <span className="hidden sm:inline">{businessName}</span>
          <span className="sm:hidden">Café de Tus Ojos</span>
        </Link>

        {/* Enlaces escritorio */}
        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          <button
            onClick={() => onSelectTab?.('menu')}
            className={`transition ${
              activeTab === 'menu' ? 'text-coffee-700 dark:text-coffee-300 font-bold' : 'opacity-70 hover:opacity-100'
            }`}
          >
            Menú
          </button>

          <button
            onClick={() => onSelectTab?.('orders')}
            className={`flex items-center gap-1.5 transition ${
              activeTab === 'orders' ? 'text-coffee-700 dark:text-coffee-300 font-bold' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Receipt size={16} /> Mis Pedidos
            {activeOrdersCount > 0 && (
              <span className="rounded-full bg-coffee-700 px-1.5 py-0.2 text-[11px] font-bold text-white">
                {activeOrdersCount}
              </span>
            )}
          </button>

          <a href="#contacto" className="opacity-70 transition hover:opacity-100">
            Contacto
          </a>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          {/* Botón Admin para probar el funcionamiento completo */}
          <Link
            to="/admin"
            className="btn-ghost !rounded-full !px-3 !py-1.5 text-xs font-bold border-coffee-600/40 text-coffee-800 hover:bg-coffee-600/10 dark:text-coffee-300 dark:border-white/20 flex items-center gap-1.5 shadow-sm"
            title="Panel de Administración (Barra y Menú)"
          >
            <ShieldCheck size={15} className="text-coffee-600 dark:text-coffee-400" />
            <span>Admin</span>
          </Link>

          <ThemeToggle />

          {/* Botón rápido Mis Pedidos */}
          <button
            onClick={() => onSelectTab?.(activeTab === 'orders' ? 'menu' : 'orders')}
            className={`btn-ghost relative !rounded-full !p-2.5 transition ${
              activeTab === 'orders' ? '!border-coffee-600 bg-coffee-600/10 text-coffee-700 dark:text-coffee-300' : ''
            }`}
            aria-label="Ver mis pedidos"
            title="Mis Pedidos"
          >
            <Receipt size={18} />
            {activeOrdersCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-coffee-700 px-1 text-[11px] font-bold text-white shadow-sm">
                {activeOrdersCount}
              </span>
            )}
          </button>

          {/* Botón Carrito */}
          <button onClick={openCart} className="btn-primary relative !rounded-full !p-2.5" aria-label="Abrir carrito">
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-bold">
                {count}
              </span>
            )}
          </button>

          {/* Menú móvil */}
          <button
            onClick={() => setIsMenuOpen((open) => !open)}
            className="btn-ghost !rounded-full !p-2.5 md:hidden"
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <MobileMenu
          links={NAV_LINKS}
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          activeOrdersCount={activeOrdersCount}
          onNavigate={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}
