import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useRestaurant from '../../hooks/useRestaurant';
import InventaryCard from '../../components/InventaryCard';
import { useNavigate } from 'react-router-dom';

export default function InventoryTab() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    restaurant,
    products,
    categories,
    loading,
    error,
    mutate,
    getProductsByRestaurantCached,
  } = useRestaurant(id);

  // Estado local para búsqueda y filtros
  const [localProducts, setLocalProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategory, setFilteredCategory] = useState('');

  // Inicializar o actualizar productos locales cuando cambien los productos del servidor
  useEffect(() => {
    if (products) {
      setLocalProducts(products);
    }
  }, [products]);

  // Guardar cambios en un producto
  const handleSaveProduct = async (updatedProduct) => {
    try {
      const API = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${API}/products/${updatedProduct._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        }
      );
      
      if (!response.ok) throw new Error('Error al guardar el producto');
      
      // Actualización optimista de la UI
      setLocalProducts(currentProducts => 
        currentProducts.map(p => 
          p._id === updatedProduct._id ? updatedProduct : p
        )
      );
      
      // Refrescar datos desde el servidor
      if (mutate && typeof mutate === 'function') {
        await mutate();
      }
      
      console.log('¡Producto actualizado correctamente!');
      return true;
    } catch (err) {
      console.error('Error al guardar:', err);
      throw err;
    }
  };

  // Eliminar un producto
  const handleDeleteProduct = async (productToDelete) => {
    try {
      const API = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${API}/products/${productToDelete._id}`,
        { method: 'DELETE' }
      );
      
      if (!response.ok) throw new Error('Error al eliminar el producto');
      
      // Actualización optimista
      setLocalProducts((current) =>
        current.filter((p) => p._id !== productToDelete._id)
      );
      
      // Refrescar datos desde el servidor
      if (mutate && typeof mutate === 'function') {
        await mutate();
      } else if (restaurant && getProductsByRestaurantCached) {
        // Plan B: recargar productos manualmente si mutate no está disponible
        const fresh = await getProductsByRestaurantCached(restaurant._id, true);
        if (fresh) setLocalProducts(fresh);
      }
      
      console.log('¡Producto eliminado correctamente!');
      return true;
    } catch (err) {
      console.error('Error al eliminar:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <p className="text-center text-sm text-gray-500">
        Cargando inventario…
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-sm text-red-500">
        Error: {error}
      </p>
    );
  }

  if (!localProducts || localProducts.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500">
        No hay productos en inventario.
      </p>
    );
  }

  // Filtrar productos
  const filteredProducts = localProducts.filter((product) => {
    const matchesCategory =
      !filteredCategory || product.category === filteredCategory;
    const matchesSearch =
      !searchTerm ||
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-8">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        <select
          value={filteredCategory}
          onChange={(e) => setFilteredCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todas las categorías</option>
          {categories?.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de productos */}
      <div className="flex flex-col gap-3">
        {filteredProducts.map((product) => (
          <InventaryCard
            key={product._id}
            product={product}
            onSave={handleSaveProduct}
            onDelete={handleDeleteProduct}
            detailProps={{
              fields: [
                { label: 'Nombre', name: 'name', type: 'text', required: true },
                { label: 'Descripción', name: 'description', type: 'textarea' },
                {
                  label: 'Categoría',
                  name: 'category',
                  type: 'select',
                  options: categories
                    ?.filter(Boolean)
                    .map((c) => ({ value: c, label: c })) || [],
                },
                { label: 'Stock', name: 'stock', type: 'number' },
                { label: 'Precio', name: 'price', type: 'number', step: '0.01', required: true },
                { label: 'Destacado', name: 'featured', type: 'checkbox', checkboxLabel: 'Marcar como producto destacado' },
                { label: 'ID', name: 'product_id', type: 'text', disabled: true },
              ],
              formOptions: {
                confirmDelete: '¿Estás seguro? Esta acción no se puede deshacer.',
                validate: (form) => {
                  const errors = {};
                  if (form.price < 0) errors.price = 'El precio no puede ser negativo';
                  if (form.stock < 0) errors.stock = 'El stock no puede ser negativo';
                  return errors;
                },
              },
            }}
          />
        ))}
      </div>
      <button
        onClick={() => navigate('/productform')}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg
                   flex items-center justify-center text-xl font-semibold transition-transform
                   active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Agregar producto"
        title="Agregar producto"
      >
        +
      </button>
    </div>
  );
}