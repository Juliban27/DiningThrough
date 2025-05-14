import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRestaurantInfo } from '../services/restaurantService';

const stateMap = {
  pending:   { label: 'Pendiente', color: 'text-orange-500' },
  accepted:  { label: 'Aceptado',  color: 'text-yellow-500' },
  ready:     { label: 'Listo',     color: 'text-green-500' },
  rejected:  { label: 'Rechazado', color: 'text-red-500' },
  claimed:   { label: 'Reclamado', color: 'text-gray-500' },
};

export default function OrderCard({ orderId, date, state, punto_venta }) {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState({ name: '', image: null });

  const formattedDate = new Intl.DateTimeFormat('es-CO', {
    day: '2-digit', month: '2-digit', year: '2-digit'
  }).format(new Date(date));

  useEffect(() => {
    if (!punto_venta) return;
    getRestaurantInfo(punto_venta)
      .then(info => setRestaurant(info))
      .catch(err => console.error(err));
  }, [punto_venta]);

  const { label, color } = stateMap[state] || { label: state, color: 'text-gray-700' };

  return (
    <div
      onClick={() => navigate(`/orders/${orderId}`)}
      className="relative h-32 rounded-2xl overflow-hidden shadow-md cursor-pointer select-none"
    >
      {restaurant.image ? (
        <img
          src={restaurant.image}
          alt={restaurant.name || 'Restaurante'}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-300 opacity-40 flex items-center justify-center">
          <span className="text-sm text-gray-700">Sin imagen</span>
        </div>
      )}

      <div className="relative z-10 p-4 flex flex-col justify-between h-full">
        <p className="text-sm text-[#001C63] font-medium">
          Pedido del {formattedDate}
        </p>
        <p className="text-sm font-medium">
          Restaurante: <span className="text-[#001C63]">{restaurant.name || '-'}</span>
        </p>
        <p className={`text-sm font-semibold ${color}`}>Estado: {label}</p>
      </div>
    </div>
  );
}

