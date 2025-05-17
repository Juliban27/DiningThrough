// src/components/OrderAdminCard.jsx
import React from 'react'
import Tick from '../assets/Tick'
import Cross from '../assets/Cross'

const API_URL = import.meta.env.VITE_API_URL

export const OrderAdminCard = ({ order, onStatusChanged }) => {
  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await fetch(`${API_URL}/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: newStatus }),
      })
      if (!response.ok) throw new Error('Error al actualizar estado')
      const updated = await response.json()
      onStatusChanged?.(updated)
    } catch (error) {
      console.error(error)
      alert('Error actualizando estado del pedido.')
    }
  }

  const isAccepted = order.state === 'accepted'

  return (
    <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center mb-4">
      <div className="flex-1 pr-4">
        <p className="font-medium text-gray-800">Pedido #{order._id}</p>
        <p className="text-sm text-gray-600">
          {order.client_id} - {order.date && new Date(order.date).toLocaleString()}
        </p>
      </div>
      <div className="flex gap-2">
        {isAccepted ? (
          <button
            onClick={() => handleUpdateStatus('ready')}
            className="p-2 rounded-full hover:bg-blue-100"
            aria-label="Marcar listo"
          >
            <Tick size={20} className="text-blue-500" />
          </button>
        ) : (
          <>
            <button
              onClick={() => handleUpdateStatus('accepted')}
              className="p-2 rounded-full hover:bg-green-100"
              aria-label="Aceptar"
            >
              <Tick size={20} className="text-green-500" />
            </button>
            <button
              onClick={() => handleUpdateStatus('rejected')}
              className="p-2 rounded-full hover:bg-red-100"
              aria-label="Rechazar"
            >
              <Cross size={20} className="text-red-500" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
