import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { useAuth } from '../context/AuthContext'; 

/**
 * Componente para mostrar una lista de productos con opciones de filtrado
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.products - Lista de productos a mostrar
 * @param {Function} [props.onAddToCart] - Función opcional para añadir al carrito
 * @param {string} [props.categoryFilter] - Categoría por la que filtrar (opcional)
 */
const ProductsList = ({ products, onAddToCart, categoryFilter }) => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    // Filtramos productos según la búsqueda y la categoría
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="w-full">
            {/* Buscador de productos */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Lista de productos */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No hay productos disponibles
                    {searchTerm && " que coincidan con tu búsqueda"}
                    {categoryFilter && " en esta categoría"}
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onAddToCart={onAddToCart}
                            userId={user?.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


export default ProductsList;