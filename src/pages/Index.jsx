import React, { useEffect, useState } from 'react';
import Magnifier from '../assets/Magnifier';
import ProfileButton from '../components/ProfileButton';
import { RestaurantCard } from '../components/RestaurantCard';   // ajusta la ruta si difiere

// 👇 Usa variable de entorno o fallback al localhost
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Index = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // ─── Traer lista al montar ───
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API}/restaurants`);
        const data = await res.json();
        setRestaurants(data);
      } catch (err) {
        console.error('Error al cargar restaurantes', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ─── Filtrado simple por nombre ───
  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#E0EDFF] min-h-screen flex flex-col">
      {/* Header */}
      <div className="h-[25vh] p-4 flex flex-col">
        {/* Perfil a la derecha */}
        <div className="w-full flex justify-end">
          <ProfileButton />
        </div>
        {/* Centro: título + buscador */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-[#001C63] text-3xl font-medium tracking-wider">
            Restaurantes
          </h1>
          <div className="mt-4 flex items-center">
            <input
              type="text"
              placeholder="Ingresa el nombre del restaurante"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-3 w-[212px] h-[35px] bg-[#D9D9D9] opacity-40 rounded-[8px] border-2 outline-none"
            />
            <button className="ml-2">
              <Magnifier className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenido: cards de restaurantes */}
      <div className="bg-white flex-1 rounded-t-[2rem] overflow-y-auto px-4 pt-6">
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

