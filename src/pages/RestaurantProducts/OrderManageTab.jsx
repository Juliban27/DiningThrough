import React, { useEffect, useState } from 'react';
import { OrderAdminCard } from '../../components/OrderAdminCard';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const OrderManageTab = ({ restaurantId }) => {
  const [orders, setOrders]     = useState([]);
  const [filtro, setFiltro]     = useState('todo'); // 'todo' | 'pending' | 'accepted' | 'ready'
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // Sólo estos estados importan
  const validStates = ['pending', 'accepted', 'ready'];

  useEffect(() => {
    if (!restaurantId) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API_BASE}/orders`);
        if (!res.ok) throw new Error('Error al obtener órdenes');
        const data = await res.json();

        // Filtramos por restaurante y por status válidos
        const filtered = data.filter(
          o => o.punto_venta === restaurantId &&
               validStates.includes(o.state)
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

      // Actualizamos la lista manteniendo sólo estados válidos
      setOrders(prev =>
        prev
          .map(o => (o._id === orderId ? updatedOrder : o))
          .filter(o => validStates.includes(o.state))
      );
    } catch (err) {
      alert(err.message || 'Error actualizando estado');
    }
  };

  if (loading) return <p>Cargando órdenes…</p>;
  if (error)   return <p className="text-red-500">Error: {error}</p>;

  // Configuración de los botones de filtro
  const filtros = [
    { key: 'todo',     label: 'Todo'       },
    { key: 'pending',  label: 'Pendientes' },
    { key: 'accepted', label: 'Aceptadas'  },
    { key: 'ready',    label: 'Listas'     },
  ];

  // Aplicamos el filtro sobre orders
  const mostrados = filtro === 'todo'
    ? orders
    : orders.filter(o => o.state === filtro);

  return (
    <div className="space-y-4">
      {/* Barra de filtros */}
      <div className="flex gap-2 overflow-x-auto pb-4">
        {filtros.map(f => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-full transition text-sm ${
              filtro === f.key
                ? 'bg-[#001C63] text-white'
                : 'bg-white text-[#001C63] hover:bg-gray-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista filtrada o mensaje si está vacía */}
      {mostrados.length > 0 ? (
        mostrados.map(order => (
          <OrderAdminCard
            key={order._id}
            order={order}
            onUpdateStatus={onUpdateStatus}
          />
        ))
      ) : (
        <p className="text-gray-500">
          No hay órdenes “{filtros.find(f => f.key === filtro).label}”
        </p>
      )}
    </div>
  );
};







