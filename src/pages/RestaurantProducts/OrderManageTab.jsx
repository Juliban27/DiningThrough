// src/pages/RestaurantProducts/OrderManageTab.jsx
import React, { useEffect, useState } from 'react';
import { OrderAdminCard } from '../../components/OrderAdminCard'; // Ajusta según tu estructura

const API_URL = import.meta.env.VITE_API_URL;

export const OrderManageTab = ({ restaurantId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(`${API_URL}/orders`);
        const data = await res.json();
        const filtered = data.filter(
          o =>
            o.restaurant_id === restaurantId &&
            !['rejected', 'claimed'].includes(o.state)
        );
        setOrders(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [restaurantId]);

  const handleStatusChange = updated => {
    setOrders(curr => curr.filter(o => o._id !== updated._id));
  };

  if (loading) return <p className="text-center p-4">Cargando órdenes…</p>;
  if (!orders.length) return <p className="text-center p-4">No hay órdenes para gestionar.</p>;

  return (
    <div className="space-y-4 p-4">
      {orders.map(order => (
        <OrderAdminCard
          key={order._id}
          order={order}
          onStatusChanged={handleStatusChange}
        />
      ))}
    </div>
  );
};

