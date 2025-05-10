import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';      // quita si no usas Router

const API = import.meta.env.VITE_API_URL;

export const RestaurantCard = ({ id, name, hora_apertura, hora_cierre }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = React.useState(false);

  // Determina si está abierto ahora
  const isOpenNow = useMemo(() => {
    if (!hora_apertura || !hora_cierre) return false;
    const [oH, oM] = hora_apertura.split(':').map(Number);
    const [cH, cM] = hora_cierre.split(':').map(Number);
    const now = new Date();
    const minutesNow = now.getHours() * 60 + now.getMinutes();
    const minutesOpen = oH * 60 + oM;
    const minutesClose = cH * 60 + cM;
    if (minutesClose > minutesOpen) {
      return minutesNow >= minutesOpen && minutesNow < minutesClose;
    }
    return minutesNow >= minutesOpen || minutesNow < minutesClose;
  }, [hora_apertura, hora_cierre]);

  const imageSrc = `${API}/restaurants/${id}/imagen`;

  return (
    <button
      type="button"
      onClick={() => navigate(`/restaurants/${id}`)}
      className="w-full flex items-center gap-3 p-4 rounded-lg bg-white shadow-md active:scale-[0.97] transition"
    >
      {/* Imagen o fallback */}
      <div className="shrink-0 h-20 w-20 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
        {!imgError ? (
          <img
            src={imageSrc}
            alt={`Foto de ${name}`}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-xs text-gray-500">Sin imagen</span>
        )}
      </div>

      {/* Texto */}
      <div className="flex flex-col text-left">
        <h3 className="text-base font-semibold leading-5">{name}</h3>
        <span className="text-xs text-gray-600 mt-1">
          Abierto de {hora_apertura} a {hora_cierre}
        </span>
        <span
          className={`text-xs font-semibold mt-0.5 ${
            isOpenNow ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {isOpenNow ? 'Abierto ahora' : 'Cerrado ahora'}
        </span>
      </div>
    </button>
  );
};
