import React, { useState } from 'react';
import Button from './Button';
import DotsVertical from '../assets/DotsVertical';
import ModalBlur from './ModalBlur';
import InventaryProductDetail from './InventaryProductDetail';
const InventaryCard = ({ product }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Tarjeta resumen */}
      <div className="bg-white rounded-xl shadow px-4 py-3 flex justify-between items-center">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-500">
            ID: {product.product_id || product._id}
          </span>
          <span className="text-base font-medium text-[#001C63] truncate">
            {product.name}
          </span>
          <span className="text-sm text-gray-700">${product.price?.toFixed(2)}</span>
          <span className="text-sm text-gray-700">Stock: {product.stock}</span>
        </div>

        {/* Botón de opciones (tres puntos) */}
        <Button
          onClick={() => setOpen(true)}
          className="p-2 rounded-full"
          text={<DotsVertical size={20} />}
        />
      </div>

      {/* Detalle en modal */}
      {open && (
        <ModalBlur isOpen={open} onClose={() => setOpen(false)}>
          <InventaryProductDetail product={product} onClose={() => setOpen(false)} />
        </ModalBlur>
      )}
    </>
  );
};

export default InventaryCard;