import React, { useEffect, useState } from 'react';
import { RestaurantCard } from '../components/RestaurantCard';   // ajusta la ruta si difiere

// 👇 usa variable de entorno o fallback al puerto local de tu backend
const API = import.meta.env.VITE_API_URL || ('http://localhost:5000');

const Index = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  /* ─── Traer lista al montar ─── */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API}/restaurants`);
        const data = await res.json();             // [{ _id, name, hora_apertura, ... }]
        setRestaurants(data);
      } catch (err) {
        console.error('Error al cargar restaurantes', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ─── Filtrado simple por nombre ─── */
  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#E0EDFF] min-h-screen flex flex-col">
      {/* ─── ENCABEZADO ─── */}
      <div className="h-[25vh] flex flex-col items-center justify-center">
        <h1 className="text-[#001C63] text-3xl font-medium tracking-wider">
          RESTAURANTES
        </h1>

        {/* BUSCADOR */}
        <div className="mt-4 flex items-center">
          <input
            type="text"
            placeholder="Ingresa el nombre del restaurante"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 w-[212px] h-[35px] bg-[#D9D9D9] opacity-40 rounded-[8px] border-2 outline-none"
          />
          <button className="ml-2">
            <img src="/src/assets/lupaBuscar.webp" alt="Buscar" className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* ─── CONTENEDOR DE CARTAS ─── */}
      <div className="bg-white h-[75vh] w-full rounded-t-[2rem] overflow-y-auto px-4 pt-6">
        {loading ? (
          <p className="text-center text-sm text-gray-500">Cargando restaurantes…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            {search ? 'No hay coincidencias.' : 'Aún no hay restaurantes registrados.'}
          </p>
        ) : (
          <div className="flex flex-col gap-4 pb-8">
            {filtered.map(r => (
              <RestaurantCard
                key={r._id}
                id={r._id}
                name={r.name}
                hora_apertura={r.hora_apertura}
                hora_cierre={r.hora_cierre}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;



