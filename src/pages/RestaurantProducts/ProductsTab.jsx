import React, { useState, useEffect } from 'react';
import ProductsList from '../../components/ProductsList';
import { useCart } from '../../context/CartContext';
import useRestaurant from '../../hooks/useRestaurant';

export default function ProductsTab({ restaurantId }) {
  const { restaurant, products, categories, loading, error } = useRestaurant(restaurantId);
  const { addItem, setRestaurantId } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('');

  // Guardamos el restaurantId en el contexto para luego al hacer checkout
  useEffect(() => {
    if (restaurantId) setRestaurantId(restaurantId);
  }, [restaurantId, setRestaurantId]);

  const handleAddToCart = (product) => {
    try {
      // Verificar stock antes de añadir
      if (product.stock <= 0) {
        alert(`${product.name} está agotado`);
        return;
      }
      
      addItem(product);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center text-sm">Cargando productos…</p>;
  if (error)   return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1 rounded-full ${
              !selectedCategory
                ? 'bg-[#001C63] text-white'
                : 'bg-white text-[#001C63] border'
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full ${
                selectedCategory === cat
                  ? 'bg-[#001C63] text-white'
                  : 'bg-white text-[#001C63] border'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}

      <ProductsList
        products={products}
        onAddToCart={handleAddToCart}
        categoryFilter={selectedCategory}
      />
    </>
  );
}