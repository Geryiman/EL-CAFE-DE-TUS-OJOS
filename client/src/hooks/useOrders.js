import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

const POLL_INTERVAL_MS = 5000;

// Carga los pedidos y los refresca cada 5 s para que el Kanban se sienta "en vivo".
export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    try {
      setOrders(await api.getOrders());
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    const timer = setInterval(reload, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [reload]);

  // Actualización optimista: la tarjeta se mueve al instante y se revierte si falla.
  const changeStatus = useCallback(async (id, status) => {
    let previous;
    setOrders((current) =>
      current.map((o) => {
        if (o.id === id) previous = o.status;
        return o.id === id ? { ...o, status } : o;
      })
    );
    try {
      await api.updateOrderStatus(id, status);
    } catch (err) {
      setOrders((current) => current.map((o) => (o.id === id ? { ...o, status: previous } : o)));
      throw err;
    }
  }, []);

  return { orders, isLoading, error, reload, changeStatus };
}
