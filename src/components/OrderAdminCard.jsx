import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import DotsVertical from '../assets/DotsVertical';

export const OrderAdminCard = ({ order, onUpdateStatus }) => {
  const navigate = useNavigate();
  const { _id, products, state } = order;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stateLabels = {
    pending: 'Pendiente para confirmar',
    accepted: 'Pedido aceptado', // corregido
    ready: 'Listo para reclamar',
  };

  const acceptButtonText = {
    pending: 'Confirmar pedido',
    accepted: 'Marcar como listo', // corregido
    ready: 'Marcar como entregado',
  };

  const handleAccept = () => {
    if (state === 'pending') onUpdateStatus(_id, 'accepted'); // corregido
    else if (state === 'accepted') onUpdateStatus(_id, 'ready');
    else if (state === 'ready') onUpdateStatus(_id, 'claimed');
  };

  const handleReject = () => {
    if (state === 'pending') onUpdateStatus(_id, 'rejected');
  };

  const openDetails = () => {
    navigate(`/orders/${_id}`);
  };

  const productSummary = products
    .map(p => `${p.name} x${p.quantity || 1}`)
    .join(', ');

  return (
    <div className="flex justify-between items-center border p-4 rounded-lg mb-3 bg-white shadow">
      <div>
        <p className="font-semibold text-gray-800">Pedido #{_id}</p>
        <p className="text-sm text-gray-600">{productSummary}</p>
        <p className="mt-1 text-xs font-medium text-blue-600 capitalize">
          Estado: {stateLabels[state] || state}
        </p>
      </div>

      <div className="flex gap-3 items-center">
        {isMobile ? (
          <Button
            onClick={openDetails}
            className="p-2 rounded hover:bg-gray-200"
            text={<DotsVertical size={20} />}
            aria-label="Ver detalles"
          />
        ) : (
          <>
            {state === 'pending' && (
              <>
                <Button
                  onClick={handleAccept}
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                  text={acceptButtonText[state]}
                  aria-label="Confirmar pedido"
                />
                <Button
                  onClick={handleReject}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                  text="Rechazar pedido"
                  aria-label="Rechazar pedido"
                />
              </>
            )}

            {(state === 'accepted' || state === 'ready') && (
              <Button
                onClick={handleAccept}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                text={acceptButtonText[state]}
                aria-label={acceptButtonText[state]}
              />
            )}

            <Button
              onClick={openDetails}
              className="p-2 rounded hover:bg-gray-200"
              text={<DotsVertical size={20} />}
              aria-label="Ver detalles"
            />
          </>
        )}
      </div>
    </div>
  );
};





