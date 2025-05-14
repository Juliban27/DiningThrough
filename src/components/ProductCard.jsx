import React, { useState } from 'react';

const API = import.meta.env.VITE_API_URL;

/**
 * ProductCard – muestra un producto con imagen, datos y botón “añadir”.
 *
 * • Usa primero `product.image`; si no existe o falla, intenta
 *   `${API}/products/<id>/imagen`; si también falla → “Sin imagen”.
 */
export default function ProductCard({
  product,
  onAddToCart,
  showAddButton = true,
}) {
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  /* Ruta de imagen
     1) si el documento trae `image`, úsala
     2) si no, usa backend `/products/:id/imagen`
  */
  const imgSrc =
    product.image && !imgError
      ? product.image
      : `${API}/products/${product._id}/imagen`;

  /* ------------ handlers ------------ */
  const handleAddToCart = e => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  /* ------------ UI ------------ */
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-white shadow-md border border-gray-100">
      {/* Imagen */}
      <div className="shrink-0 h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
        {!imgError ? (
          <img
            src={imgSrc}
            alt={`Foto de ${product.name}`}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-xs text-gray-400">Sin imagen</span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col text-left flex-1">
        <h3 className="text-base font-medium">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2">
            {product.description}
          </p>
        )}
        <span className="mt-1 font-semibold text-[#001C63]">
          ${product.price?.toFixed(2)}
        </span>
      </div>

      {/* Botón añadir */}
      {showAddButton && onAddToCart && (
        <button
          onClick={handleAddToCart}
          className="ml-2 p-2 bg-[#001C63] text-white rounded-full hover:bg-blue-800 active:scale-95 transition"
          aria-label="Añadir al carrito"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
