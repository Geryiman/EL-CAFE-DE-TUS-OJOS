import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product) => {
    setItems((current) => {
      const existing = current.find((i) => i.id === product.id);
      if (existing) {
        return current.map((i) => (i.id === product.id ? { ...i, quantity: Math.min(i.quantity + 1, 20) } : i));
      }
      return [...current, { id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }];
    });
  }, []);

  const changeQuantity = useCallback((id, delta) => {
    setItems((current) =>
      current
        .map((i) => (i.id === id ? { ...i, quantity: Math.min(i.quantity + delta, 20) } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((id) => setItems((current) => current.filter((i) => i.id !== id)), []);
  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const { total, count } = useMemo(
    () => ({
      total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    [items]
  );

  const value = useMemo(
    () => ({ items, total, count, isCartOpen, addToCart, changeQuantity, removeFromCart, clearCart, openCart, closeCart }),
    [items, total, count, isCartOpen, addToCart, changeQuantity, removeFromCart, clearCart, openCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
