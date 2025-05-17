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
export default function CartTab({ onCheckout, restaurantId, isAdmin }) {
  const { user } = useAuth();
  const { items, increment, decrement, removeItem, checkout, currentRestaurantId } = useCart();

  const count = items.length;
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Verificar si el carrito pertenece a este restaurante
  const isCorrectRestaurant = currentRestaurantId === restaurantId;

  const handleCheckout = async () => {
    if (!count) return;
    
    try {
      // Validar que el carrito pertenece al restaurante actual
      if (!isCorrectRestaurant) {
        throw new Error('El carrito pertenece a otro restaurante');
      }
      
      // Llama a checkout del contexto, que crea bill y order con restaurantId
      // y actualiza el inventario
      await checkout(user.id, restaurantId);
      onCheckout(); // Cambia a la pestaña de pedidos
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isCorrectRestaurant && items.length > 0) {
    return (
      <div className="p-4 bg-red-50 rounded-lg text-center my-4">
        <p className="text-red-600 mb-4">
          El carrito contiene productos de otro restaurante.
        </p>
        <Button 
          text="Vaciar carrito y continuar" 
          onClick={() => {
            if (window.confirm('¿Estás seguro de vaciar el carrito?')) {
              // Limpiar carrito y establecer el restaurante actual
              localStorage.removeItem('cart');
              localStorage.setItem('currentRestaurantId', restaurantId);
              window.location.reload();
            }
          }}
          className="bg-red-500 text-white"
        />
      </div>
    );
  }

  if (count === 0) {
    return (
      <p className="text-center text-sm text-gray-500 py-10">
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