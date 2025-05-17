import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import OrderCard from '../../components/OrderCard';

const API = import.meta.env.VITE_API_URL;

/**
 * OrdersTab.jsx
 * Muestra dos secciones de órdenes:
 *  • Pedidos activos (pending, accepted, ready)
 *  • Historial de órdenes (rejected, claimed)
 * Recibe `restaurantId` para filtrar por este restaurante.
 */
export default function OrdersTab({ restaurantId }) {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) {
      setError('Usuario no disponible');
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/orders`);
        const data = await res.json();
        // Filtrar por este usuario y restaurante
        const mine = Array.isArray(data)
          ? data.filter(o => o.client_id === user.id && o.punto_venta === restaurantId)
          : [];
        setOrders(mine);
      } catch (e) {
        setError(e.message || 'Error al cargar órdenes');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authLoading, user, restaurantId]);

  if (authLoading || loading) {
    return <p className="text-center text-sm text-gray-500">Cargando órdenes…</p>;
  }
  if (error) {
    return <p className="text-center text-sm text-red-500">Error: {error}</p>;
  }

  // Separar por estado
  const activos   = orders.filter(o => ['pending', 'accepted', 'ready'].includes(o.state));
  const historico = orders.filter(o => ['rejected', 'claimed'].includes(o.state));

  return (
    <div className="space-y-6 pb-8">
      {/* Pedidos activos */}
      <section>
        <h2 className="text-lg font-semibold text-[#001C63] mb-2">Pedidos activos</h2>
        {activos.length === 0 ? (
          <p className="text-sm text-gray-500">No hay pedidos activos.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {activos.map(o => (
              <OrderCard
                key={o._id}
                orderId={o._id}
                date={o.date}
                state={o.state}
                punto_venta={o.punto_venta}
              />
            ))}
          </div>
        )}
      </section>

      {/* Historial de órdenes */}
      <section>
        <h2 className="text-lg font-semibold text-[#001C63] mb-2">Historial de órdenes</h2>
        {historico.length === 0 ? (
          <p className="text-sm text-gray-500">No hay historial de órdenes.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {historico.map(o => (
              <OrderCard
                key={o._id}
                orderId={o._id}
                date={o.date}
                state={o.state}
                punto_venta={o.punto_venta}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

