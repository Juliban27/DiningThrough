import React, { createContext, useContext, useState, useEffect } from 'react';
import { createBill } from '../services/billService';
import { createOrder } from '../services/orderService';
import { updateProductInventory } from '../services/productService';
import { Link, useNavigate } from 'react-router-dom';

// Contexto para gestionar el carrito de compras
const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [currentRestaurantId, setCurrentRestaurantId] = useState(null);

  // Cargar carrito desde localStorage al montar el componente
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      const savedRestaurantId = localStorage.getItem('currentRestaurantId');

      if (savedCart) setItems(JSON.parse(savedCart));
      if (savedRestaurantId) setCurrentRestaurantId(savedRestaurantId);
    } catch (err) {
      console.error('Error cargando carrito desde localStorage:', err);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
      if (currentRestaurantId) {
        localStorage.setItem('currentRestaurantId', currentRestaurantId);
      }
    } catch (err) {
      console.error('Error guardando carrito en localStorage:', err);
    }
  }, [items, currentRestaurantId]);

  // Establecer el restaurante actual y limpiar carrito si cambia de restaurante
  const setRestaurantId = (restaurantId) => {
if (restaurantId !== currentRestaurantId && items.length > 0) {
      const confirmChange = window.confirm(
        'Cambiar de restaurante vaciará tu carrito actual. ¿Deseas continuar?'
      );

      if (confirmChange) {
        setItems([]);
        setCurrentRestaurantId(restaurantId);
      } else {
        // Si cancela, navegar al index
        navigate('/index');
      }
      return;
    }
    setCurrentRestaurantId(restaurantId);
  };


  // Añade producto al carrito o incrementa su cantidad si ya existe
  const addItem = (product) => {
    // Verificar si tenemos un restaurantId establecido
    if (!currentRestaurantId) {
      throw new Error('No se ha seleccionado restaurante');
    }

    // Verificar si el producto tiene stock suficiente
    if (product.stock <= 0) {
      throw new Error(`${product.name} está agotado`);
    }

    setItems(prev => {
      // Verificar si el item ya existe en el carrito
      const existingItemIndex = prev.findIndex(item => item._id === product._id);

      if (existingItemIndex >= 0) {
        // Verificar si añadir uno más excedería el stock
        const newQuantity = prev[existingItemIndex].quantity + 1;
        if (newQuantity > product.stock) {
          alert(`Solo hay ${product.stock} unidades disponibles de ${product.name}`);
          return prev;
        }

        // Actualizar item existente
        const updatedItems = [...prev];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity
        };
        return updatedItems;
      } else {
        // Añadir nuevo item
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // Incrementa la cantidad de un ítem (con verificación de stock)
  const increment = (id) => {
    setItems(prev => {
      const item = prev.find(i => i._id === id);
      if (!item) return prev;

      // Verificar stock antes de incrementar
      if (item.quantity >= item.stock) {
        alert(`No hay más unidades disponibles de ${item.name}`);
        return prev;
      }

      return prev.map(i =>
        i._id === id ? { ...i, quantity: i.quantity + 1 } : i
      );
    });
  };

  // Decrementa la cantidad de un ítem y elimina si llega a 0
  const decrement = (id) => {
    setItems(prev => {
      const item = prev.find(i => i._id === id);
      if (!item) return prev;

      if (item.quantity <= 1) {
        return prev.filter(i => i._id !== id);
      }

      return prev.map(i =>
        i._id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
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
   * checkout - Procesa el pago, crea factura, orden y actualiza inventario
   * @param {string} clientId ID del cliente
   * @param {string} restaurantId ID del restaurante
   */
  const checkout = async (clientId, restaurantId) => {
    if (items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    if (restaurantId !== currentRestaurantId) {
      throw new Error('Error: El restaurante no coincide con el carrito');
    }

    try {
      // Calcular total
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // 1. Crear factura (bill)
      const billPayload = {
        client_id: clientId,
        products: items,
        total: total,
        date: new Date(),
      };
      await createBill(billPayload);

      // 2. Crear orden
      const orderPayload = {
        client_id: clientId,
        punto_venta: restaurantId,
        products: items,
        state: 'pending',
        date: new Date(),
      };
      const order = await createOrder(orderPayload);

      // 3. Actualizar inventario para cada producto
      const inventoryUpdates = items.map(item =>
        updateProductInventory(item._id, item.quantity)
      );

      await Promise.all(inventoryUpdates);

      // 4. Limpiar carrito después de checkout exitoso
      clearCart();

      return order;
    } catch (error) {
      console.error('Error en checkout:', error);
      throw new Error('Error al procesar el pedido: ' + error.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        currentRestaurantId,
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