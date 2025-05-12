import React, { useMemo } from 'react';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';

// Ajusta el contenedor del mapa
const containerStyle = { width: '100%', height: '100%' };

export default function Map({ lat, lng }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, 
    libraries: ['places']
  });

  const center = useMemo(() => ({ lat: +lat, lng: +lng }), [lat, lng]);

  if (loadError) return <div>Error cargando Google Maps</div>;
  if (!isLoaded) return <div>Cargando mapa…</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
    >
      <Marker position={center} />
    </GoogleMap>
  );
}
