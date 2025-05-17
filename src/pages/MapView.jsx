import React, { useEffect, useState, useMemo } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  MapControl,
} from "@vis.gl/react-google-maps";
import { useParams, useNavigate, Link } from "react-router-dom";
import Return from "../assets/Return";

// Componente para los controles de zoom personalizados
function ZoomControls() {
  const map = useMap();
  
  const handleZoomIn = () => {
    if (map) {
      map.setZoom((map.getZoom() || 15) + 1);
    }
  };
  
  const handleZoomOut = () => {
    if (map) {
      map.setZoom((map.getZoom() || 15) - 1);
    }
  };
  
  const handleReset = () => {
    if (map) {
      map.setZoom(15);
      map.setCenter(defaultCenter);
    }
  };

  return (
    <div className="absolute bottom-6 right-6 flex flex-col gap-2">
      <button 
        onClick={handleZoomIn}
        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Acercar"
      >
        <div className="font-bold text-lg">+</div>
      </button>
      <button 
        onClick={handleZoomOut}
        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Alejar"
      >
        <div className="font-bold text-lg">−</div>
      </button>
      <button 
        onClick={handleReset}
        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Vista inicial"
      >
        <div className="font-bold text-base">⌂</div>
      </button>
    </div>
  );
}

// Componente personalizado para los marcadores
function RestaurantMarker({ restaurant, isSelected, onClick }) {
  return (
    <AdvancedMarker
      position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
      onClick={onClick}
    >
      <div className={`relative cursor-pointer transition-transform ${isSelected ? 'scale-125' : 'hover:scale-110'}`}>
        <div className="bg-white rounded-full p-1 shadow-lg">
          <div className={`${isSelected ? 'bg-blue-600' : 'bg-red-500'} rounded-full p-2 transform transition-all`}>
            <div className="text-white font-bold">📍</div>
          </div>
        </div>
        {isSelected && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-600" />
        )}
      </div>
    </AdvancedMarker>
  );
}

// Componente para la ventana de información
function RestaurantInfoWindow({ restaurant, onClose, navigate }) {
  return (
    <InfoWindow
      position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
      onCloseClick={onClose}
    >
      <div className="p-3 max-w-xs">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-bold text-gray-800">{restaurant.name}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        
        <div className="mt-2 space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-gray-500 mt-1 flex-shrink-0">📍</span>
            <p className="text-gray-600">{restaurant.location || "Ubicación no disponible"}</p>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="text-gray-500 mt-1 flex-shrink-0">🕒</span>
            <p className="text-gray-600">
              Horario: {restaurant.hora_apertura || "N/A"} – {restaurant.hora_cierre || "N/A"}
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          <Link
            to={`/restaurants/${restaurant.restaurant_id || restaurant._id}`}
            className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
          >
            <span>ℹ️</span>
            Ver detalles
          </Link>
        </div>
      </div>
    </InfoWindow>
  );
}

// Constantes
const API = import.meta.env.VITE_API_URL;
const MAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;
const defaultCenter = { lat: 4.862074, lng: -74.033537 };

export default function MapView() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  // Estilo del mapa personalizado
  const mapOptions = useMemo(() => ({
    mapId: MAP_ID || undefined,
    disableDefaultUI: true,
    clickableIcons: false,
    mapTypeControl: false,
    streetViewControl: false,
    zoomControl: false,
    fullscreenControl: false,
    styles: [
      {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
    ],
  }), []);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true);
        const res = await fetch(`${API}/restaurants`);
        
        if (!res.ok) throw new Error(`Error ${res.status}: No se pudieron cargar los restaurantes`);
        
        const data = await res.json();

        const parsed = data
          .map((r) => ({
            ...r,
            latitude: parseFloat(r.latitude),
            longitude: parseFloat(r.longitude),
          }))
          .filter((r) => !isNaN(r.latitude) && !isNaN(r.longitude));

        setRestaurants(parsed);

        if (restaurantId) {
          const sel = parsed.find(
            (r) => r.restaurant_id === restaurantId || r._id === restaurantId
          );
          if (sel) setSelected(sel);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar los restaurantes");
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, [restaurantId]);

  // Función para centrar el mapa en un restaurante
  const centerOnRestaurant = (restaurant) => {
    if (mapInstance && restaurant) {
      mapInstance.panTo({ lat: restaurant.latitude, lng: restaurant.longitude });
      mapInstance.setZoom(17);
    }
  };

  // Efecto para centrar al seleccionar un restaurante
  useEffect(() => {
    if (selected) {
      centerOnRestaurant(selected);
    }
  }, [selected]);

  // Manejo de estados de carga y error
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando restaurantes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Error</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <p className="text-gray-600">No hay restaurantes disponibles en este momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <button
        onClick={() => navigate('/index')}
        aria-label="Volver al índice"
        className="absolute top-4 left-4 z-20 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors flex items-center justify-center"
      >
        <Return size={24} className="text-blue-600" />
      </button>
      <APIProvider apiKey={MAP_KEY}>
        <Map
          defaultZoom={15}
          defaultCenter={selected ? { lat: selected.latitude, lng: selected.longitude } : defaultCenter}
          options={mapOptions}
          onLoad={(map) => setMapInstance(map)}
          className="w-full h-full"
        >
          {/* Renderizar todos los restaurantes */}
          {restaurants.map((restaurant) => (
            <RestaurantMarker
              key={restaurant._id}
              restaurant={restaurant}
              isSelected={selected && selected._id === restaurant._id}
              onClick={() => setSelected(restaurant)}
            />
          ))}

          {/* Ventana de información para el restaurante seleccionado */}
          {selected && (
            <RestaurantInfoWindow
              restaurant={selected}
              onClose={() => setSelected(null)}
              navigate={navigate}
            />
          )}

          {/* Controles de zoom personalizados */}
          <ZoomControls />
        </Map>
      </APIProvider>
      
      {/* Panel de restaurantes */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg max-h-80 overflow-y-auto w-64 z-10">
        <div className="p-3 bg-blue-600 text-white font-medium rounded-t-lg">
          <h2 className="flex items-center gap-2">
            <span>🍽️</span> 
            Restaurantes Disponibles
          </h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {restaurants.map((restaurant) => (
            <li 
              key={restaurant._id}
              className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${selected && selected._id === restaurant._id ? 'bg-blue-50' : ''}`}
              onClick={() => setSelected(restaurant)}
            >
              <div className="font-medium text-gray-800">{restaurant.name}</div>
              <div className="text-sm text-gray-500 mt-1 truncate">{restaurant.location || "Ubicación no disponible"}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}