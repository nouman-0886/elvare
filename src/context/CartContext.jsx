import { createContext, useContext, useEffect, useState } from "react";
import { products } from "../data/products";
const CartContext = createContext(null);
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      // re-hydrate product data so older saved carts keep working after catalogue changes
      return JSON.parse(localStorage.getItem("elvare-cart") || "[]").map(i => ({ ...i, product: products.find(p => p.id === i.product?.id) })).filter(i => i.product);
    } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(() => localStorage.setItem("elvare-cart", JSON.stringify(items)), [items]);
  const addItem = (product, size = "50ml", quantity = 1) => {
    setItems(current => {
      const key = `${product.id}-${size}`;
      const found = current.find(item => item.key === key);
      return found
        ? current.map(item => item.key === key ? { ...item, quantity: item.quantity + quantity } : item)
        : [...current, { key, product, size, quantity }];
    });
    setCartOpen(true);
  };
  const changeQuantity = (key, amount) => setItems(current =>
    current.map(item => item.key === key ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item)
  );
  const removeItem = key => setItems(current => current.filter(item => item.key !== key));
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return <CartContext.Provider value={{ items, addItem, changeQuantity, removeItem, cartCount, subtotal, cartOpen, setCartOpen }}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);