import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Loader2, Receipt, Sparkles } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ui/ProductCard';
import CartDrawer from '../components/checkout/CartDrawer';
import PaymentModal from '../components/checkout/PaymentModal';
import OrderTicket from '../components/checkout/OrderTicket';
import OrdersHistory from '../components/checkout/OrdersHistory';
import useFetchMenu from '../hooks/useFetchMenu';
import useCustomerOrders from '../hooks/useCustomerOrders';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { buildWhatsAppUrl, buildWhatsAppInquiryUrl } from '../utils/format';

const ALL = 'Todos';
const FALLBACK_BUSINESS = { name: 'El Café de Tus Ojos', whatsapp: '', clabe: '', bank: '' };

export default function ClientPage() {
  const { items, business, isLoading, error, reload } = useFetchMenu();
  const { orders, activeCount, saveOrder, refreshOrders, clearOrders, isRefreshing } = useCustomerOrders();
  const { addToCart, closeCart } = useCart();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'orders'
  const [category, setCategory] = useState(ALL);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const info = business || FALLBACK_BUSINESS;

  const categories = useMemo(() => [ALL, ...new Set(items.map((p) => p.category))], [items]);
  const visibleItems = useMemo(
    () => (category === ALL ? items : items.filter((p) => p.category === category)),
    [items, category]
  );

  const handleAddProduct = useCallback(
    (product) => {
      addToCart(product);
      showToast(`${product.name} agregado al carrito`);
    },
    [addToCart, showToast]
  );

  const handleCheckout = () => {
    closeCart();
    setIsPaymentOpen(true);
  };

  const handleOrderCreated = (order) => {
    setIsPaymentOpen(false);
    saveOrder(order);
    const newOrderPayload = { ...order, isNew: true };
    setCreatedOrder(newOrderPayload);
    const url = buildWhatsAppUrl({ phone: info.whatsapp, order: newOrderPayload, businessName: info.name });
    // Se intenta abrir WhatsApp de inmediato con el pedido; el ticket conserva el botón por si el navegador bloquea la ventana.
    window.open(url, '_blank', 'noopener');
  };

  const whatsappUrl = createdOrder
    ? createdOrder.isNew !== false
      ? buildWhatsAppUrl({ phone: info.whatsapp, order: createdOrder, businessName: info.name })
      : buildWhatsAppInquiryUrl({ phone: info.whatsapp, order: createdOrder, businessName: info.name })
    : '#';

  return (
    <div className="min-h-screen">
      <Navbar
        businessName={info.name}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeOrdersCount={activeCount}
      />

      <main className="mx-auto max-w-6xl px-4 pb-12">
        <section className="py-10 text-center sm:py-16">
          <span className="glass inline-flex items-center gap-1.5 !rounded-full px-3.5 py-1.5 text-xs font-semibold">
            <Sparkles size={13} className="text-coffee-500" /> Pide sin registros · llega directo a WhatsApp
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            {info.name}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-neutral-600 sm:text-lg dark:text-neutral-400">
            Café de especialidad, frappés y postres hechos al momento. Arma tu pedido en segundos.
          </p>

          {/* Selector de pestañas principal: Menú vs Mis Pedidos */}
          <div className="glass mx-auto mt-7 flex w-fit gap-1 !rounded-full p-1.5 shadow-sm">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                activeTab === 'menu'
                  ? 'bg-coffee-700 text-white shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              <Coffee size={16} /> Menú y Catálogo
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                activeTab === 'orders'
                  ? 'bg-coffee-700 text-white shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              <Receipt size={16} /> Mis Pedidos
              {activeCount > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold transition ${
                    activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-coffee-700 text-white'
                  }`}
                >
                  {activeCount}
                </span>
              )}
              {activeCount > 0 && (
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" title="Pedidos en proceso" />
              )}
            </button>
          </div>
        </section>

        {/* Notificación si hay pedidos en curso mientras navega el menú */}
        {activeTab === 'menu' && activeCount > 0 && (
          <div
            onClick={() => setActiveTab('orders')}
            className="glass mb-8 flex cursor-pointer items-center justify-between gap-3 p-3.5 border-coffee-500/30 bg-coffee-500/10 transition hover:bg-coffee-500/15"
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coffee-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-coffee-600" />
              </span>
              <span className="text-sm font-medium">
                Tienes <strong className="text-coffee-700 dark:text-coffee-300">{activeCount} pedido(s) en curso</strong>. Sigue su preparación en tiempo real.
              </span>
            </div>
            <span className="text-xs font-bold text-coffee-700 dark:text-coffee-300 underline">
              Ver estado &rarr;
            </span>
          </div>
        )}

        {/* PESTAÑA 1: Menú y Catálogo */}
        {activeTab === 'menu' && (
          <section id="menu" className="scroll-mt-24">
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
              {categories.map((cat) => {
                const isActive = cat === category;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    aria-pressed={isActive}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'border-coffee-700 bg-coffee-700 text-white shadow-md'
                        : 'border-black/10 bg-white/50 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {isLoading && (
              <div className="grid place-items-center py-20 text-neutral-500">
                <Loader2 className="animate-spin" />
              </div>
            )}

            {error && !isLoading && (
              <div className="glass mx-auto mt-6 max-w-md p-6 text-center">
                <p className="text-sm">{error}</p>
                <button onClick={reload} className="btn-primary mt-3">
                  Reintentar
                </button>
              </div>
            )}

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={handleAddProduct} />
              ))}
            </div>
          </section>
        )}

        {/* PESTAÑA 2: Mis Pedidos Realizados */}
        {activeTab === 'orders' && (
          <section className="scroll-mt-24">
            <OrdersHistory
              orders={orders}
              business={info}
              onRefresh={refreshOrders}
              isRefreshing={isRefreshing}
              onClearHistory={clearOrders}
              onSelectOrderTicket={(order) => setCreatedOrder({ ...order, isNew: false })}
              onExploreMenu={() => setActiveTab('menu')}
            />
          </section>
        )}
      </main>

      <Footer businessName={info.name} whatsapp={info.whatsapp} />

      <Link to="/admin" className="fixed bottom-3 left-3 z-30 text-[11px] font-medium opacity-40 transition hover:opacity-100">
        Panel admin
      </Link>

      <CartDrawer onCheckout={handleCheckout} />
      {isPaymentOpen && (
        <PaymentModal business={info} onClose={() => setIsPaymentOpen(false)} onOrderCreated={handleOrderCreated} />
      )}
      {createdOrder && (
        <OrderTicket
          order={createdOrder}
          whatsappUrl={whatsappUrl}
          onClose={() => setCreatedOrder(null)}
          onOpenOrders={() => {
            setCreatedOrder(null);
            setActiveTab('orders');
          }}
        />
      )}
    </div>
  );
}
