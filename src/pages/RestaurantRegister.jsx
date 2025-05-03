// src/components/RestaurantForm.jsx
import React, { useState } from 'react';
import Button from '../components/Button';
import axios from 'axios';

const RestaurantForm = () => {
  const [restaurantId, setRestaurantId] = useState('');
  const [name, setName]           = useState('');
  const [location, setLocation]   = useState('');
  const [image, setImage]         = useState('');
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [loading, setLoading]     = useState(false);

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
        image,
      };

      const response = await axios.post(
        'http://localhost:5000/restaurants',
        payload
      );

      setSuccess('¡Restaurante creado correctamente!');
      setRestaurantId('');
      setName('');
      setLocation('');
      setImage('');
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Error al crear el restaurante. Revisa la consola.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-cabinet-regular flex flex-col items-center">
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
          onChange={(e) => setRestaurantId(e.target.value)}
          required
          className="border-2 border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border-2 border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Ubicación"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="border-2 border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="URL de la imagen"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2"
        />

        <Button
          text={loading ? 'Guardando...' : 'Crear Restaurante'}
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4"
        />
      </form>
    </div>
  );
};

export default RestaurantForm;