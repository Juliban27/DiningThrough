import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Botón flotante para navegar a la vista de mapa
 */
const MapButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-10">
      <Link
        to="/mapsview"
        className="bg-[#001C63] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
          />
        </svg>
      </Link>
    </div>
  );
};

export default MapButton;