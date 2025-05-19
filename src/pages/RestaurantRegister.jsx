import React, { useState } from 'react';
import Button from '../components/Button';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

export default function RestaurantRegister() {
  const [restaurantId, setRestaurantId] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [horaApertura, setHoraApertura] = useState('');
  const [horaCierre, setHoraCierre] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [image, setImage] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        restaurant_id: restaurantId,
        name,
        location,
        hora_apertura: horaApertura,
        hora_cierre: horaCierre,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        image: image || undefined,
      };

      const response = await axios.post(
        `${API}/restaurants`,
        payload
      );

      setSuccess(response.data.message || '¡Restaurante creado correctamente!');
      // Limpiar campos
      setRestaurantId('');
      setName('');
      setLocation('');
      setHoraApertura('');
      setHoraCierre('');
      setLatitude('');
      setLongitude('');
      setImage('');
    } catch (err) {
      setError(
        err.response?.data?.error || 'Error al crear el restaurante.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-cabinet-regular flex flex-col items-center p-4">
      <h2 className="text-3xl mb-6">Agregar Restaurante</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-md space-y-4"
      >
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <input
          type="text"
          placeholder="ID del restaurante"
          value={restaurantId}
          onChange={e => setRestaurantId(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2"
        />

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2"
          required
        />

        <input
          type="text"
          placeholder="Ubicación"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2"
          required
        />

        <input
          type="text"
          placeholder="Hora apertura (HH:MM)"
          value={horaApertura}
          onChange={e => setHoraApertura(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2"
          required
        />

        <input
          type="text"
          placeholder="Hora cierre (HH:MM)"
          value={horaCierre}
          onChange={e => setHoraCierre(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2"
          required
        />

        {/* Nuevos campos */}
        <input
          type="number"
          step="any"
          placeholder="Latitud (ejemplo: 4.7110)"
          value={latitude}
          onChange={e => setLatitude(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2"
        />

        <input
          type="number"
          step="any"
          placeholder="Longitud (ejemplo: -74.0721)"
          value={longitude}
          onChange={e => setLongitude(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2"
        />

        <input
          type="url"
          placeholder="URL imagen"
          value={image}
          onChange={e => setImage(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2"
        />

        <Button
          text={loading ? 'Guardando...' : 'Crear Restaurante'}
          type="submit"
          disabled={loading}
          className="mt-4"
        />
      </form>
    </div>
  );
}

