import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Coffee, ExternalLink, LogOut, UtensilsCrossed } from 'lucide-react';
import AdminKanban from '../components/admin/AdminKanban';
import MenuManager from '../components/admin/MenuManager';
import ThemeToggle from '../components/ui/ThemeToggle';
import useOrders from '../hooks/useOrders';
import useFetchMenu from '../hooks/useFetchMenu';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoginPage from './LoginPage';

const TABS = [
  { key: 'orders', label: 'Pedidos', Icon: ClipboardList },
  { key: 'menu', label: 'Menú', Icon: UtensilsCrossed },
];

function Dashboard() {
  const { handleLogout } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState('orders');
  const { orders, isLoading: ordersLoading, error: ordersError, changeStatus } = useOrders();
  const { items, setItems, isLoading: menuLoading, error: menuError } = useFetchMenu();

  const handleLogoutClick = () => {
    handleLogout();
    showToast('Sesión cerrada');
  };

  const pendingCount = orders.filter((o) => o.status === 'pendiente').length;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/55 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-coffee-700 text-white">
              <Coffee size={18} />
            </span>
            <span>El Café de Tus Ojos · Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="btn-ghost !px-3 !py-2" target="_blank">
              <ExternalLink size={14} /> Ver menú
            </Link>
            <ThemeToggle />
            <button onClick={handleLogoutClick} className="btn-ghost !px-3 !py-2">
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="glass mx-auto mb-6 flex w-fit gap-1 !rounded-full p-1">
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === key ? 'bg-coffee-700 text-white shadow' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Icon size={15} /> {label}
              {key === 'orders' && pendingCount > 0 && (
                <span className="rounded-full bg-rose-500 px-1.5 text-[11px] text-white">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {tab === 'orders' ? (
          <AdminKanban orders={orders} isLoading={ordersLoading} error={ordersError} onChangeStatus={changeStatus} />
        ) : (
          <MenuManager items={items} setItems={setItems} isLoading={menuLoading} error={menuError} />
        )}
      </main>
    </div>
  );
}

export default function AdminPage() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}
