import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tick from '../assets/Tick';	
import Cross from '../assets/Cross';
import Return from '../assets/Return';
import Button from './Button';

export const OrderDetails = ({ order, onUpdateStatus }) => {
  const navigate = useNavigate();

  const { _id, client_id, client_name, products, state, punto_venta } = order;
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (!client_id) {
      console.log('No hay client_id en la orden');
      setUserName('Desconocido');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${client_id}`);
        if (!res.ok) throw new Error('Error al obtener usuario');
        const user = await res.json();
        setUserName(user.name || 'Sin nombre');
      } catch (error) {
        console.error('Fetch error:', error);
        setUserName('Desconocido');
      }
    };

    fetchUser();
  }, [client_id]);

  const handleAccept = () => {
    if (state === 'pending') onUpdateStatus(_id, 'acepted');
    else if (state === 'acepted') onUpdateStatus(_id, 'ready');
    else if (state === 'ready') onUpdateStatus(_id, 'claimed');
  };

  const handleReject = () => {
    if (state === 'pending') onUpdateStatus(_id, 'rejected');
  };

  const productList = products.map((p, idx) => (
    <li key={idx} className="mb-1">
      {p.name} x{p.quantity || 1}
    </li>
  ));

  // Volver atrás sin duplicar, o ir al restaurante si no hay historial
  const goBackToManage = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(`/restaurants/${punto_venta}`, { replace: true });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <button
        onClick={goBackToManage}
        className="mb-4 flex items-center gap-2 text-blue-600 hover:underline"
      >
        <Return size={24} />
        Volver a Gestionar
      </button>

      <h2 className="text-2xl font-semibold mb-4">Detalles del Pedido #{_id}</h2>

      <p><strong>Cliente:</strong> {userName || client_name || 'Desconocido'}</p>
      <p className="mb-4"><strong>Estado:</strong> <span className="capitalize">{state}</span></p>

      <h3 className="font-semibold mb-2">Productos:</h3>
      <ul className="list-disc list-inside mb-6">{productList}</ul>

      <div className="flex gap-3">
        {state === 'pending' && (
          <>
            <Button
              onClick={handleAccept}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              text="Aceptar"
            />
            <Button
              onClick={handleReject}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              text="Rechazar"
            />
          </>
        )}

        {(state === 'acepted' || state === 'ready') && (
          <Button
            onClick={handleAccept}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            text={state === 'acepted' ? 'Marcar como listo' : 'Marcar como entregado'}
          />
        )}
      </div>
    </div>
  );
};






