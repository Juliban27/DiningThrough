import React, { useState } from 'react';
import Return from '../assets/Return';
import Tick from '../assets/Tick';
import Cross from '../assets/Cross';
import Button from './Button';

const API = import.meta.env.VITE_API_URL;

/**
 * InventaryProductDetail – modal para editar / eliminar un producto
 *  · 25 % superior (#E0EDFF, rounded‑b‑2rem) – imagen
 *  · 75 % inferior (blanco) – formulario y botones
 */
export default function InventaryProductDetail({ product, onClose }) {
  const [form, setForm] = useState({ ...product });
  const [loading, setLoading] = useState(false);

  /* ----------------------------- handlers ----------------------------- */
  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    try {
      setLoading(true);
      await fetch(`${API}/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const ok = confirm('¿Seguro quieres eliminar este producto del inventario?');
    if (!ok) return;

    try {
      setLoading(true);
      await fetch(`${API}/products/${product._id}`, { method: 'DELETE' });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------- render ------------------------------- */
  return (
    <div className="h-[90vh] max-h-[660px] w-full sm:max-w-md flex flex-col relative">
      {/* Única flecha regresar */}
      <button
        onClick={onClose}
        className="absolute top-3 left-3 z-20 p-1 rounded-full hover:bg-blue-100"
      >
        <Return size={24} className="text-[#001C63]" />
      </button>

      {/* 25 % – imagen */}
      <div className="h-1/4 bg-[#E0EDFF] flex items-center justify-center rounded-b-[2rem]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-28 w-28 object-cover rounded-lg"
          />
        ) : (
          <div className="h-28 w-28 bg-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-600">
            Sin imagen
          </div>
        )}
      </div>

      {/* 75 % – formulario y botones */}
      <div className="flex-1 bg-white overflow-y-auto p-6">
        {/* Campos */}
        <div className="space-y-3">
          {[
            { label: 'Nombre', name: 'name', type: 'text' },
            { label: 'Descripción', name: 'description', type: 'textarea' },
            {
              label: 'Alérgenos (coma‑separados)',
              name: 'alergies',
              type: 'text',
              transform: v => v.split(',').map(a => a.trim()),
              display: v => (Array.isArray(v) ? v.join(', ') : v),
            },
            { label: 'Stock', name: 'stock', type: 'number' },
            { label: 'Precio', name: 'price', type: 'number', step: '0.01' },
            { label: 'ID', name: 'product_id', type: 'text', disabled: true },
          ].map(field => (
            <label key={field.name} className="block text-sm text-[#001C63]">
              {field.label}
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={form[field.name] || ''}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 rounded border"
                />
              ) : (
                <input
                  name={field.name}
                  type={field.type}
                  step={field.step}
                  disabled={field.disabled}
                  value={
                    field.display
                      ? field.display(form[field.name])
                      : form[field.name] || ''
                  }
                  onChange={e =>
                    handleChange({
                      ...e,
                      target: {
                        ...e.target,
                        value: field.transform
                          ? field.transform(e.target.value)
                          : e.target.value,
                      },
                    })
                  }
                  className="w-full mt-1 p-2 rounded border"
                />
              )}
            </label>
          ))}
        </div>

        {/* Botones acción al final */}
        <div className="flex flex-col gap-2 items-end mt-6">
          <Button
            disabled={loading}
            onClick={handleSave}
            className="p-2 rounded-full"
            text={<Tick size={24} />}
          />
          <Button
            disabled={loading}
            onClick={handleDelete}
            className="p-2 rounded-full"
            text={<Cross size={24} />}
          />
        </div>
      </div>
    </div>
  );
}


