import React, { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useParams, useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;
const MAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// Opcional, si no tienes MapID personalizado, puedes quitarlo
const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

export default function MapView() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await fetch(`${API}/restaurants`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
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
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, [restaurantId]);

  const defaultCenter = { lat: 4.862074, lng: -74.033537 };

  if (loading) return <p className="text-center p-4">Cargando restaurantes…</p>;
  if (restaurants.length === 0)
    return <p className="text-center p-4">No hay restaurantes disponibles.</p>;

  return (
    <APIProvider apiKey={MAP_KEY}>
      <div style={{ width: "100%", height: "100vh" }}>
        <Map
          zoom={16}
          center={
            selected
              ? { lat: selected.latitude, lng: selected.longitude }
              : defaultCenter
          }
          mapId={MAP_ID || undefined}
        >
          {restaurants.map(({ _id, latitude, longitude, name, location, hora_apertura, hora_cierre, restaurant_id }) => (
            <AdvancedMarker
              key={_id}
              position={{ lat: latitude, lng: longitude }}
              onClick={() =>
                setSelected({
                  _id,
                  latitude,
                  longitude,
                  name,
                  location,
                  hora_apertura,
                  hora_cierre,
                  restaurant_id,
                })
              }
            />
          ))}

          {selected && (
            <InfoWindow
              position={{ lat: selected.latitude, lng: selected.longitude }}
              onCloseClick={() => setSelected(null)}
            >
              <div style={{ padding: 8 }}>
                <h2 style={{ fontWeight: "bold" }}>{selected.name}</h2>
                <p>{selected.location || "Ubicación no disponible"}</p>
                <p>
                  Horario: {selected.hora_apertura} – {selected.hora_cierre}
                </p>
                <Link
                  to={`/restaurants/${selected.restaurant_id || selected._id}`}
                  style={{
                    display: "inline-block",
                    marginTop: 8,
                    padding: "4px 8px",
                    backgroundColor: "#001C63",
                    color: "white",
                    borderRadius: 4,
                    textDecoration: "none",
                    fontSize: 14,
                  }}
                >
                  Ver detalles
                </Link>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}