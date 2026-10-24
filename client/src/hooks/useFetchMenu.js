import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

export default function useFetchMenu() {
  const [items, setItems] = useState([]);
  const [business, setBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    try {
      const data = await api.getMenu();
      setItems(data.items);
      setBusiness(data.business);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, setItems, business, isLoading, error, reload };
}
