import React, { useState } from 'react';
import Button from './Button';
import DotsVertical from '../assets/DotsVertical';
import ModalBlur from './ModalBlur';
import InventaryProductDetail from './InventaryProductDetail';

/**
 * InventaryCard - Tarjeta de resumen de producto con opciones de edición
 * @param {Object} props
 * @param {Object} props.product - El producto a mostrar
 * @param {Function} props.onSave - Función opcional para sobreescribir el comportamiento al guardar
 * @param {Function} props.onDelete - Función opcional para sobreescribir el comportamiento al eliminar
 * @param {Function} props.renderSummary - Función opcional para renderizar un resumen personalizado
 * @param {Object} props.detailProps - Props adicionales para pasar al componente de detalle
 */
const InventaryCard = ({ 
  product, 
  onSave, 
  onDelete,
  renderSummary,
  detailProps = {},
  className = ""
}) => {
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(product);

  const handleClose = () => {
    setOpen(false);
    if (detailProps.onClose) {
      detailProps.onClose();
    }
  };

  // Manejar guardado de producto con actualización de estado local
  const handleSave = async (updatedProduct) => {
    try {
      if (onSave) {
        await onSave(updatedProduct);
        // Actualizar el estado local después de guardar exitosamente
        setCurrentProduct(updatedProduct);
      }
      return true;
    } catch (error) {
      console.error("Error al guardar desde InventaryCard:", error);
      throw error;
    }
  };

  // Manejar eliminación de producto
  const handleDelete = async (productToDelete) => {
    try {
      if (onDelete) {
        await onDelete(productToDelete);
      }
      return true;
    } catch (error) {
      console.error("Error al eliminar desde InventaryCard:", error);
      throw error;
    }
  };

  return (
    <>
      {/* Tarjeta resumen - personalizable o por defecto */}
      {renderSummary ? (
        renderSummary(currentProduct, () => setOpen(true))
      ) : (
        <div className={`bg-white rounded-xl shadow px-4 py-3 flex justify-between items-center ${className}`}>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-500">
              ID: {currentProduct.product_id || currentProduct._id}
            </span>
            <span className="text-base font-medium text-[#001C63] truncate">
              {currentProduct.name}
            </span>
            <span className="text-sm text-gray-700">${currentProduct.price?.toFixed(2)}</span>
            <span className="text-sm text-gray-700">Stock: {currentProduct.stock}</span>
          </div>

          {/* Botón de opciones (tres puntos) */}
          <Button
            onClick={() => setOpen(true)}
            className="p-2 rounded-full"
            text={<DotsVertical size={20} />}
          />
        </div>
      )}

      {/* Detalle en modal - con props extendidos */}
      {open && (
        <ModalBlur isOpen={open} onClose={handleClose}>
          <InventaryProductDetail 
            product={currentProduct} 
            onClose={handleClose}
            onSave={handleSave}
            onDelete={handleDelete}
            {...detailProps}
          />
        </ModalBlur>
      )}
    </>
  );
};

export default InventaryCard;