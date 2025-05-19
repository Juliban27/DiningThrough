import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Magnifier from '../assets/Magnifier';
import ProfileButton from '../components/ProfileButton';
import { RestaurantCard } from '../components/RestaurantCard';
import MapButton from '../components/MapButton';

const API = import.meta.env.VITE_API_URL;

const Index = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  /* ─── carga de restaurantes ─── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/restaurants`);
        const data = await res.json();
        setRestaurants(data);
      } catch (err) {
        console.error('Error al cargar restaurantes', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ─── filtro por texto ─── */
  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-b from-[#E0EDFF] to-[#C7E0FF] min-h-screen flex flex-col">
      {/* Header con background y mayor altura */}
      <motion.div 
        className="h-[30vh] p-4 flex flex-col bg-cover bg-center"
        style={{
          backgroundImage: "url('https://usabana.widen.net/content/dff4da0b-1c1e-47ac-92ba-9b107c15f8b2/web/_Restaurante%20Arcos-07.jpg')"
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full flex justify-end">
          <ProfileButton />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.h1 
            className="text-white text-4xl font-bold tracking-wider drop-shadow-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            Restaurantes
          </motion.h1>

          <motion.div 
            className="mt-6 flex items-center bg-white/60 backdrop-blur-sm p-2 rounded-xl shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Buscar restaurante..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-[240px] h-[40px] pl-10 pr-4 bg-white/90 rounded-lg border-0 outline-none focus:ring-2 focus:ring-[#4285F4]/50 transition-all duration-300"
              />
              <Magnifier className="w-5 h-5 text-gray-500 absolute left-3" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Lista de restaurantes*/}
      <motion.div 
        className="bg-white flex-1 rounded-t-[2rem] -mt-8 overflow-y-auto px-4 pt-6 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.1)] relative"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-32">
            <div className="w-12 h-12 border-4 border-[#4285F4]/30 border-t-[#4285F4] rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium">Cargando restaurantes...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center h-32 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-500 font-medium">
              {search ? 'No hay coincidencias para tu búsqueda.' : 'Aún no hay restaurantes registrados.'}
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 gap-5 pb-20 pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filtered.map((r, index) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <RestaurantCard
                  id={r._id}
                  _id={r._id}
                  restaurant_id={r.restaurant_id}
                  name={r.name}
                  hora_apertura={r.hora_apertura}
                  hora_cierre={r.hora_cierre}
                  image={r.image}
                  latitude={r.latitude}
                  longitude={r.longitude}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
      
      {/* Botón flotante para ver el mapa general */}
      <MapButton />
    </div>
  );
};

export default Index;
