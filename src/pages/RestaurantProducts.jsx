// src/pages/RestaurantProducts.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Return from '../assets/Return';
import ProfileButton from '../components/ProfileButton';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import useRestaurant from '../hooks/useRestaurant';

// Sub-tabs
import ProductsTab from './RestaurantProducts/ProductsTab';
import CartTab from './RestaurantProducts/CartTab';
import OrdersTab from './RestaurantProducts/OrdersTab';
import InventoryTab from './RestaurantProducts/InventoryTab';
import { OrderManageTab } from './RestaurantProducts/OrderManageTab';

export default function RestaurantProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const { items } = useCart();
  const { restaurant, loading, error } = useRestaurant(id);
  const [tab, setTab] = useState('productos');

  if (loading) return (
    <div className="bg-[#E0EDFF] min-h-screen flex items-center justify-center">
      <p className="text-[#001C63]">Cargando…</p>
    </div>
  );

  if (error || !restaurant) return (
    <div className="bg-[#E0EDFF] min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md text-center space-y-4">
        <p className="text-red-500">{error || 'Restaurante no encontrado'}</p>
        <Button text="Volver" onClick={() => navigate(-1)} />
      </div>
    </div>
  );

  const renderTab = () => {
    switch (tab) {
      case 'productos':
        return <ProductsTab restaurantId={restaurant._id} />;
      case 'carrito':
        return (
          <CartTab
            onCheckout={() => setTab('pedidos')}
            restaurantId={restaurant._id}
            isAdmin={isAdmin}
          />
        );
      case 'pedidos':
        return <OrdersTab restaurantId={restaurant._id} />;
      case 'inventario':
        return isAdmin ? <InventoryTab restaurantId={restaurant._id} /> : null;
      case 'manage':
        return isAdmin ? <OrderManageTab restaurantId={restaurant._id} /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#E0EDFF] min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-blue-100"
            aria-label="Volver"
          >
            <Return size={24} className="text-[#001C63]" />
          </button>
          <h1 className="flex-1 text-center text-[#001C63] text-2xl font-medium pr-6">
            {restaurant.name}
          </h1>
          <ProfileButton />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Horario:</span> {restaurant.hora_apertura} – {restaurant.hora_cierre}
          </p>
        </div>
      </div>

      {/* Pestañas */}
      <div className="px-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            text="Productos"
            onClick={() => setTab('productos')}
            className={`whitespace-nowrap ${tab === 'productos' ? 'bg-[#001C63] text-white' : 'bg-white text-[#001C63]'}`}
          />
          <Button
            text={`Carrito (${items.length})`}
            onClick={() => setTab('carrito')}
            className={`whitespace-nowrap ${tab === 'carrito' ? 'bg-[#001C63] text-white' : 'bg-white text-[#001C63]'}`}
          />
          <Button
            text="Pedidos"
            onClick={() => setTab('pedidos')}
            className={`whitespace-nowrap ${tab === 'pedidos' ? 'bg-[#001C63] text-white' : 'bg-white text-[#001C63]'}`}
          />
          {isAdmin && (
            <>
              <Button
                text="Inventario"
                onClick={() => setTab('inventario')}
                className={`whitespace-nowrap ${tab === 'inventario' ? 'bg-[#001C63] text-white' : 'bg-white text-[#001C63]'}`}
              />
              <Button
                text="Gestionar"
                onClick={() => setTab('manage')}
                className={`whitespace-nowrap ${tab === 'manage' ? 'bg-[#001C63] text-white' : 'bg-white text-[#001C63]'}`}
              />
            </>
          )}
        </div>
      </div>

      {/* Contenido de la pestaña */}
      <div className="bg-white flex-1 rounded-t-[2rem] overflow-y-auto px-4 pt-6">
        {renderTab()}
      </div>
    </div>
  );
}



