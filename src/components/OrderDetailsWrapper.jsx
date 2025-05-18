import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OrderDetails } from './OrderDetails';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const OrderDetailsWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/orders/${id}`);
        if (!res.ok) throw new Error('Error al obtener orden');
        const data = await res.json();
        setOrder(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const onUpdateStatus = async (orderId, newState) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: newState }),
      });
      if (!res.ok) throw new Error('Error al actualizar estado');
      const updatedOrder = await res.json();
      setOrder(updatedOrder);
    } catch (err) {
      alert(err.message || 'Error actualizando estado');
    }
  };

  if (loading) return <p>Cargando detalles...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!order) return <p>Orden no encontrada.</p>;

  return <OrderDetails order={order} onUpdateStatus={onUpdateStatus} />;
};
