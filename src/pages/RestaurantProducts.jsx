// src/pages/RestaurantProducts.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${import.meta.env.VITE_API_URL}/restaurants/${id}/imagen`)
      .then(res => res.json())
      .then(data => setImage(data.image))
      .catch(() => setImage(null));
  }, [id]);

  if (loading) return (
    <div className="bg-gradient-to-b from-[#E0EDFF] to-[#C7E0FF] min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 border-4 border-[#001C63]/20 border-t-[#001C63] rounded-full animate-spin"></div>
        <p className="text-[#001C63] mt-4 font-medium">Cargando restaurante...</p>
      </motion.div>
    </div>
  );

  if (error || !restaurant) return (
    <div className="bg-gradient-to-b from-[#E0EDFF] to-[#C7E0FF] min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg text-center space-y-6 max-w-md w-full"
      >
        <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-red-500 font-medium text-lg">{error || 'Restaurante no encontrado'}</p>
        <Button
          text="Volver"
          onClick={() => navigate(-1)}
          className="bg-[#001C63] text-white hover:bg-[#0026A9] transition-colors"
        />
      </motion.div>
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
    <div className="bg-gradient-to-b from-[#E0EDFF] to-[#C7E0FF] min-h-screen flex flex-col">
      {/* Header */}
      <motion.div
        className="p-5 relative overflow-hidden rounded-b-3xl flex items-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundImage: image ? `url(${image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none rounded-b-3xl"></div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="relative z-10 p-2 rounded-full bg-white/80 shadow-sm hover:bg-blue-100 transition-colors"
          aria-label="Volver"
        >
          <Return size={24} className="text-[#001C63]" />
        </motion.button>

        <h1 className="relative z-10 flex-1 text-center text-white text-2xl font-bold pr-6 drop-shadow-lg">
          {restaurant.name}
        </h1>

        <ProfileButton className="relative z-10 text-black" />
      </motion.div>

      {/* Tabs */}
      <div className="overflow-x-auto pb-3">
        <div className="flex gap-2 justify-start px-4">
          <Button
            text="Productos"
            onClick={() => setTab('productos')}
            className={`whitespace-nowrap transition-all duration-300 font-medium ${
              tab === 'productos'
                ? 'bg-[#001C63] text-white shadow-md'
                : 'bg-white text-[#001C63] hover:bg-white/80'
            }`}
          />

          <Button
            text={`Carrito (${items.length})`}
            onClick={() => setTab('carrito')}
            className={`whitespace-nowrap transition-all duration-300 font-medium ${
              tab === 'carrito'
                ? 'bg-[#001C63] text-white shadow-md'
                : 'bg-white text-[#001C63] hover:bg-white/80'
            }`}
          />

          <Button
            text="Pedidos"
            onClick={() => setTab('pedidos')}
            className={`whitespace-nowrap transition-all duration-300 font-medium ${
              tab === 'pedidos'
                ? 'bg-[#001C63] text-white shadow-md'
                : 'bg-white text-[#001C63] hover:bg-white/80'
            }`}
          />

          {isAdmin && (
            <>
              <Button
                text="Inventario"
                onClick={() => setTab('inventario')}
                className={`whitespace-nowrap transition-all duration-300 font-medium ${
                  tab === 'inventario'
                    ? 'bg-[#001C63] text-white shadow-md'
                    : 'bg-white text-[#001C63] hover:bg-white/80'
                }`}
              />

              <Button
                text="Gestionar"
                onClick={() => setTab('manage')}
                className={`whitespace-nowrap transition-all duration-300 font-medium ${
                  tab === 'manage'
                    ? 'bg-[#001C63] text-white shadow-md'
                    : 'bg-white text-[#001C63] hover:bg-white/80'
                }`}
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


