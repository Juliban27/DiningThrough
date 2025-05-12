import React, { useState } from 'react';

const API = import.meta.env.VITE_API_URL;

/**
 * Componente para mostrar cada producto individual
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.product - Datos del producto a mostrar
 * @param {Function} [props.onAddToCart] - Función opcional para añadir al carrito
 * @param {boolean} [props.showAddButton=true] - Si se muestra el botón de añadir
 */
const ProductCard = ({ product, onAddToCart, showAddButton = true }) => {
    const [imgError, setImgError] = useState(false);

    // Manejador para añadir al carrito
    const handleAddToCart = (e) => {
        e.stopPropagation(); // Evita que el clic se propague
        if (onAddToCart) {
            onAddToCart(product);
        }
    };

    if (!product) return null;

    return (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-white shadow-md border border-gray-100">
            {/* Imagen del producto */}
            <div className="shrink-0 h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                {!imgError ? (
                    <img
                        src={`${API}/products/${product._id}/imagen`}
                        alt={`Foto de ${product.name}`}
                        className="h-full w-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <span className="text-xs text-gray-400">Sin imagen</span>
                )}
            </div>

            {/* Información del producto */}
            <div className="flex flex-col text-left flex-1">
                <h3 className="text-base font-medium">{product.name}</h3>
                {product.description && (
                    <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                )}
                <div className="mt-1 flex items-center justify-between">
                    <span className="font-semibold text-[#001C63]">
                        ${product.price?.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Botón de añadir (opcional) */}
            {showAddButton && onAddToCart && (
                <button
                    onClick={handleAddToCart}
                    className="ml-2 p-2 bg-[#001C63] text-white rounded-full flex items-center justify-center hover:bg-blue-800 active:scale-95 transition-all"
                    aria-label="Añadir al carrito"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default ProductCard;