import React, { useState } from 'react';
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
        className="p-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/80 shadow-sm hover:bg-blue-100 transition-colors"
            aria-label="Volver"
          >
            <Return size={24} className="text-[#001C63]" />
          </motion.button>
          
          <h1 className="flex-1 text-center text-[#001C63] text-2xl font-bold pr-6 drop-shadow-sm">
            {restaurant.name}
          </h1>
          
          <ProfileButton />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white p-4 rounded-xl shadow-sm"
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#001C63] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-700">
              <span className="font-medium">Horario:</span> {restaurant.hora_apertura} – {restaurant.hora_cierre}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Pestañas */}
      <div className="px-4">
        <div className="flex gap-2 overflow-x-auto pb-3">
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