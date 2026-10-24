import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

const STORAGE_KEY = 'cafe_customer_orders_history';

function loadStoredOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    /* Almacenamiento local restringido */
  }
}

export default function useCustomerOrders() {
  const [orders, setOrders] = useState(loadStoredOrders);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const saveOrder = useCallback((order) => {
    if (!order) return;
    setOrders((current) => {
      // Evitar duplicados por id o folio
      const filtered = current.filter((o) => (o.id ? o.id !== order.id : o.folio !== order.folio));
      const next = [order, ...filtered];
      persistOrders(next);
      return next;
    });
  }, []);

  const refreshOrders = useCallback(async () => {
    const current = loadStoredOrders();
    if (current.length === 0) return;

    setIsRefreshing(true);
    let hasChanges = false;

    const updated = await Promise.all(
      current.map(async (order) => {
        // Solo consultar al servidor si el pedido sigue activo
        if (order.status === 'entregado' || order.status === 'cancelado' || !order.id) {
          return order;
        }
        try {
          const fresh = await api.getOrder(order.id);
          if (fresh && fresh.status !== order.status) {
            hasChanges = true;
            return { ...order, ...fresh };
          }
          return order;
        } catch {
          // Si el backend no está disponible o el pedido no existe, conservar el actual
          return order;
        }
      })
    );

    if (hasChanges) {
      persistOrders(updated);
      setOrders(updated);
    }
    setIsRefreshing(false);
  }, []);

  const clearOrders = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setOrders([]);
  }, []);

  // Sondeo periódico cuando hay pedidos pendientes de entrega
  useEffect(() => {
    const hasActive = orders.some((o) => o.status === 'pendiente' || o.status === 'en_preparacion');
    if (!hasActive) return undefined;

    const interval = setInterval(refreshOrders, 7000);
    return () => clearInterval(interval);
  }, [orders, refreshOrders]);

  const activeCount = orders.filter((o) => o.status === 'pendiente' || o.status === 'en_preparacion').length;

  return {
    orders,
    activeCount,
    saveOrder,
    refreshOrders,
    clearOrders,
    isRefreshing,
  };
}
