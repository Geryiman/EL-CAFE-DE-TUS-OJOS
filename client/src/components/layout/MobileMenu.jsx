import { Link } from 'react-router-dom';
import { Receipt, ShieldCheck } from 'lucide-react';

export default function MobileMenu({ links, activeTab, onSelectTab, activeOrdersCount = 0, onNavigate }) {
  return (
    <div className="animate-fade border-t border-black/5 px-4 pb-4 pt-2 md:hidden dark:border-white/10">
      <ul className="glass flex flex-col divide-y divide-black/5 overflow-hidden dark:divide-white/10">
        <li>
          <button
            onClick={() => {
              onSelectTab?.('menu');
              onNavigate?.();
            }}
            className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium ${
              activeTab === 'menu' ? 'text-coffee-700 dark:text-coffee-300 font-bold' : ''
            }`}
          >
            <span>Menú y Catálogo</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              onSelectTab?.('orders');
              onNavigate?.();
            }}
            className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium ${
              activeTab === 'orders' ? 'text-coffee-700 dark:text-coffee-300 font-bold' : ''
            }`}
          >
            <span className="flex items-center gap-2">
              <Receipt size={16} /> Mis Pedidos
            </span>
            {activeOrdersCount > 0 && (
              <span className="rounded-full bg-coffee-700 px-2 py-0.5 text-xs font-bold text-white">
                {activeOrdersCount}
              </span>
            )}
          </button>
        </li>
        {links
          .filter((link) => link.href !== '#menu')
          .map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={onNavigate} className="block px-4 py-3 text-sm font-medium">
                {link.label}
              </a>
            </li>
          ))}
        <li className="bg-coffee-500/5">
          <Link
            to="/admin"
            onClick={onNavigate}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-coffee-700 dark:text-coffee-300 hover:bg-coffee-500/10 transition"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} /> Panel de Administración
            </span>
            <span className="rounded bg-coffee-700/10 px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider text-coffee-700 dark:bg-white/10 dark:text-coffee-300">
              Demo
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
