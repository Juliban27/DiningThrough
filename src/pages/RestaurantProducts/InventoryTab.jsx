import React from 'react';
import { useParams } from 'react-router-dom';
import useRestaurant from '../../hooks/useRestaurant';
import InventaryCard from '../../components/InventaryCard';

/**
 * InventoryTab.jsx
 * Muestra los productos en inventario para administradores.
 */
export default function InventoryTab() {
  const { id } = useParams();
  const { products, loading, error } = useRestaurant(id);

  if (loading) {
    return (
      <p className="text-center text-sm text-gray-500">Cargando inventario…</p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-sm text-red-500">Error: {error}</p>
    );
  }

  if (!products || products.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500">
        No hay productos en inventario.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 pb-8">
      {products.map(product => (
        <InventaryCard key={product._id} product={product} />
      ))}
    </div>
  );
}