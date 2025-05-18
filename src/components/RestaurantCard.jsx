import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

export const RestaurantCard = ({
  id,
  _id,
  restaurant_id,
  name,
  hora_apertura,
  hora_cierre,
  latitude,
  longitude,
  image,
}) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const isOpenNow = useMemo(() => {
    if (!hora_apertura || !hora_cierre) return false;
    const [oH, oM] = hora_apertura.split(':').map(Number);
    const [cH, cM] = hora_cierre.split(':').map(Number);
    const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
    const openMin = oH * 60 + oM;
    const closeMin = cH * 60 + cM;
    return closeMin > openMin
      ? nowMin >= openMin && nowMin < closeMin
      : nowMin >= openMin || nowMin < closeMin;
  }, [hora_apertura, hora_cierre]);

  const fallbackSrc = `${API}/restaurants/${_id}/imagen`;
  const imgSrc = !imgError && image ? image : fallbackSrc;

  const navigationId =_id || id;

  // Sólo navega si está abierto
  const handleClick = () => {
    if (isOpenNow) {
      navigate(`/restaurants/${navigationId}`);
    }
  };

  const handleLocationClick = (e) => {
    e.stopPropagation();
    navigate(`/mapsview/${navigationId}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isOpenNow}
      className={`w-full flex items-center gap-3 p-4 rounded-lg bg-white shadow-md active:scale-[0.97] transition
        ${!isOpenNow ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="shrink-0 h-20 w-20 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
        {!imgError ? (
          <img
            src={imgSrc}
            alt={`Foto de ${name}`}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-xs text-gray-500">Sin imagen</span>
        )}
      </div>

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

      <span
        onClick={handleLocationClick}
        className="text-xs ml-auto text-[#001C63] underline cursor-pointer"
      >
        Ubicación
      </span>
    </button>
  );
};
