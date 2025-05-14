import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from '../../components/Button';
import CartCard from '../../components/CartCard';

/**
 * CartTab.jsx
 * Muestra los items en el carrito y la barra de pago fija.
 * Recibe `onCheckout` para cambiar a la pestaña Pedidos y `restaurantId`.
 */
export default function CartTab({ onCheckout, restaurantId }) {
  const { user } = useAuth();
  const { items, increment, decrement, removeItem, checkout } = useCart();

  const count = items.length;
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (!count) return;
    try {
      // Llama a checkout del contexto, que crea bill y order con restaurantId
      await checkout(user.id, restaurantId);
      onCheckout();
    } catch (err) {
      alert(err.message);
    }
  };

  if (count === 0) {
    return (
      <p className="text-center text-sm text-gray-500">
        El carrito está vacío.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-4 pb-40">
        {items.map(item => (
          <CartCard
            key={item._id}
            item={item}
            onIncrement={increment}
            onDecrement={decrement}
            onRemove={removeItem}
          />
        ))}
      </div>

      {/* Barra de pago fija */}
      <div className="fixed bottom-0 left-0 right-0 h-[15vh] bg-[#001C63] text-white p-4 flex justify-between items-center">
        <div>
          <span className="font-medium">{count} producto{count !== 1 ? 's' : ''}</span>
          <p className="font-bold">${total.toFixed(2)}</p>
        </div>
        <Button
          text="Pagar"
          onClick={handleCheckout}
          className="bg-white text-[#001C63] px-6 py-2 rounded-lg font-medium"
        />
      </div>
    </>
  );
}