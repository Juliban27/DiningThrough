import React from 'react';
import Button from './Button';
import Cross from '../assets/Cross';

/**
 * CartCard.jsx
 * Representa la "caja" de cada producto en el carrito.
 */
export default React.memo(function CartCard({ item, onIncrement, onDecrement, onRemove }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
      {/* Imagen o placeholder */}
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="h-12 w-12 object-cover rounded"
        />
      ) : (
        <div className="h-12 w-12 bg-gray-300 rounded flex items-center justify-center text-[10px] text-gray-600">
          Img
        </div>
      )}

      {/* Información básica */}
      <div className="flex-1">
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-gray-600">
          ${item.price.toFixed(2)} × {item.quantity}
        </p>
      </div>

      {/* Controles de cantidad */}
      <div className="flex items-center gap-1">
        <Button
          text="−"
          onClick={() => onDecrement(item._id)}
          className="px-3"
        />
        <span className="w-6 text-center">{item.quantity}</span>
        <Button
          text="+"
          onClick={() => onIncrement(item._id)}
          className="px-3"
        />
      </div>

      {/* Botón de eliminar */}
      <Button
        onClick={() => onRemove(item._id)}
        className="p-2 rounded-full ml-2"
        text={<Cross size={20} />}
      />
    </div>
  );
});