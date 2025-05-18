import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RatingModal from './RatingModal';

const API = import.meta.env.VITE_API_URL;

export default function ProductCard({
  product,
  onAddToCart,
  showAddButton = true,
  userId,
}) {
  const [imgError, setImgError] = useState(false);
  const [average, setAverage] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  // Traer promedio de calificaciones cuando cambia el producto
  useEffect(() => {
    if (!product?._id) return;

    async function fetchAverage() {
      try {
        setLoadingRatings(true);
        const res = await axios.get(
          `${API}/products/${product._id}/ratings/average`
        );
        setAverage(res.data.averageScore ?? 0);
        setTotalRatings(res.data.totalRatings ?? 0);
      } catch (err) {
        console.error('Error al cargar calificación promedio', err);
        setAverage(0);
        setTotalRatings(0);
      } finally {
        setLoadingRatings(false);
      }
    }
    fetchAverage();
  }, [product?._id]);

  const imgSrc =
    product.image && !imgError
      ? product.image
      : `${API}/products/${product._id}/imagen`;

  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg bg-white shadow-md border border-gray-100">
      <div className="flex items-center gap-3">
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

          {!loadingRatings && (
            <p className="text-sm text-yellow-600">
              ⭐ {average.toFixed(1)} / 5 ({totalRatings} calificaciones)
            </p>
          )}
        </div>

        {showAddButton && onAddToCart && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="ml-2 p-2 bg-[#001C63] text-white rounded-full hover:bg-blue-800 active:scale-95 transition"
            aria-label="Añadir al carrito"
            type="button"
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

        {/* Botón estrella para abrir modal de calificación */}
        {userId && (
          <RatingModal
            productId={product._id}
            userId={userId}
            onRatingSubmitted={() => {
              axios
                .get(`${API}/products/${product._id}/ratings/average`)
                .then((res) => {
                  setAverage(res.data.averageScore ?? 0);
                  setTotalRatings(res.data.totalRatings ?? 0);
                });
            }}
          />
        )}

      </div>
    </div>
  );
}
