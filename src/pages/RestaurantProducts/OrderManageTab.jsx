import React, { useEffect, useState } from 'react';
import { OrderAdminCard } from '../../components/OrderAdminCard';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const OrderManageTab = ({ restaurantId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cambié 'acepted' por 'accepted'
  const validStates = ['pending', 'accepted', 'ready'];

  useEffect(() => {
    if (!restaurantId) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/orders`);
        if (!res.ok) throw new Error('Error al obtener órdenes');
        const data = await res.json();

        // Filtra por restaurante y estados válidos
        const filtered = data.filter(
          order =>
            order.punto_venta === restaurantId && validStates.includes(order.state)
        );
        setOrders(filtered);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [restaurantId]);

  const onUpdateStatus = async (orderId, newState) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: newState }),
      });
      if (!res.ok) throw new Error('Error al actualizar estado');
      const updatedOrder = await res.json();

      setOrders(prev =>
        prev
          .map(o => (o._id === orderId ? updatedOrder : o))
          .filter(o => validStates.includes(o.state))
      );
    } catch (err) {
      alert(err.message || 'Error actualizando estado');
    }
  };

  if (loading) return <p>Cargando órdenes...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (orders.length === 0) return <p>No hay órdenes pendientes o en proceso.</p>;

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <OrderAdminCard
          key={order._id}
          order={order}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
};



