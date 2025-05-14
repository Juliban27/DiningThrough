import React, { createContext, useContext, useState } from 'react';
import { createBill } from '../services/billService';
import { createOrder } from '../services/orderService';

// Contexto para gestionar el carrito de compras
const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null); // ← guardamos restaurant_id

  // Añade producto al carrito o incrementa su cantidad si ya existe
  const addItem = (product) => {
    setItems(prev =>
      prev.some(i => i._id === product._id)
        ? prev.map(i =>
            i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev, { ...product, quantity: 1 }]
    );
  };

  // Incrementa la cantidad de un ítem
  const increment = (id) => {
    setItems(prev =>
      prev.map(i =>
        i._id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  // Decrementa la cantidad de un ítem (mínimo 1), y elimina si llega a 0
  const decrement = (id) => {
    setItems(prev =>
      prev
        .map(i =>
          i._id === id
            ? { ...i, quantity: Math.max(1, i.quantity - 1) }
            : i
        )
        .filter(i => i.quantity > 0)
    );
  };

  // Elimina un producto del carrito
  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i._id !== id));
  };

  // Vacía el carrito
  const clearCart = () => {
    setItems([]);
  };

  /**
   * checkout
   * @param {string} clientId ID del cliente
   * @param {string} restaurant_Id ID del restaurante
   */
  const checkout = async (clientId, restId) => {
    if (items.length === 0) return;
    // preparar payload común
    const payload = {
      client_id: clientId,
      products: items,
      total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      date: new Date(),
    };
    // Crear factura
    await createBill(payload);
    //también crear Order
    await createOrder({
      client_id: clientId,
      punto_venta: restId || restaurant_Id,
      products: items,
      state: 'pending',
      date: new Date(),
    });

    // Limpiar carrito
    clearCart();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        setRestaurantId,
        addItem,
        increment,
        decrement,
        removeItem,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook para consumir el carrito
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}

