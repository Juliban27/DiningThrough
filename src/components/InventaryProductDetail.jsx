import React, { useState, useEffect } from 'react';
import Return from '../assets/Return';
import Tick from '../assets/Tick';
import Cross from '../assets/Cross';
import Button from './Button';

const API = import.meta.env.VITE_API_URL;

/**
 * InventaryProductDetail – modal para editar / eliminar un producto
 * @param {Object} props
 * @param {Object} props.product - Producto a editar
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onSave - Función opcional para sobreescribir el comportamiento de guardar
 * @param {Function} props.onDelete - Función opcional para sobreescribir el comportamiento de eliminar
 * @param {Array} props.fields - Array opcional para personalizar los campos a mostrar
 * @param {React.ReactNode} props.renderFooter - Función opcional para renderizar un footer personalizado
 * @param {React.ReactNode} props.renderHeader - Función opcional para renderizar un header personalizado
 * @param {Function} props.beforeSave - Hook que se ejecuta antes de guardar, puede modificar los datos
 * @param {Object} props.formOptions - Opciones adicionales para el formulario
 */
export default function InventaryProductDetail({
  product,
  onClose,
  onSave,
  onDelete,
  fields,
  renderFooter,
  renderHeader,
  beforeSave,
  formOptions = {},
  className = ""
}) {
  const [form, setForm] = useState({ ...product });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Reset form when product changes
  useEffect(() => {
    setForm({ ...product });
  }, [product]);

  /* ----------------------------- handlers ----------------------------- */
  const handleChange = e => {
    const { name, value, type } = e.target;
    let processedValue = value;
    
    // Auto-convert number inputs
    if (type === 'number') {
      processedValue = value === '' ? '' : Number(value);
    }
    
    // Actualizar el formulario
    setForm(prev => ({ ...prev, [name]: processedValue }));
    
    // Clear error for this field when changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Default validation for required fields
    if (formOptions.validateRequired !== false) {
      if (!form.name?.trim()) newErrors.name = 'El nombre es obligatorio';
      if (!form.price && form.price !== 0) newErrors.price = 'El precio es obligatorio';
    }
    
    // Custom validation
    if (formOptions.validate) {
      const customErrors = formOptions.validate(form);
      Object.assign(newErrors, customErrors);
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    
    try {
      setLoading(true);
      setSaveSuccess(false);
      
      // Process data before saving if needed
      let dataToSave = { ...form };
      if (beforeSave) {
        dataToSave = beforeSave(dataToSave);
      }
      
      // Use custom onSave if provided, otherwise default behavior
      if (onSave) {
        await onSave(dataToSave);
      } else {
        const response = await fetch(`${API}/products/${product._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
      }
      
      // Indicar éxito y cerrar tras un breve delay
      setSaveSuccess(true);
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors({ submit: `Error al guardar el producto: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmMessage = formOptions.confirmDelete || 
      '¿Seguro quieres eliminar este producto del inventario?';
    
    const ok = confirm(confirmMessage);
    if (!ok) return;

    try {
      setLoading(true);
      
      // Use custom onDelete if provided, otherwise default behavior
      if (onDelete) {
        await onDelete(product);
      } else {
        const response = await fetch(`${API}/products/${product._id}`, { method: 'DELETE' });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
      }
      
      onClose();
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrors({ submit: `Error al eliminar el producto: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------- default fields ----------------------- */
  const defaultFields = [
    { label: 'Nombre', name: 'name', type: 'text', required: true },
    { label: 'Descripción', name: 'description', type: 'textarea' },
    {
      label: 'Alérgenos (coma‑separados)',
      name: 'alergies',
      type: 'text',
      transform: v => v.split(',').map(a => a.trim()),
      display: v => (Array.isArray(v) ? v.join(', ') : v),
    },
    { label: 'Stock', name: 'stock', type: 'number' },
    { label: 'Precio', name: 'price', type: 'number', step: '0.01', required: true },
    { label: 'ID', name: 'product_id', type: 'text', disabled: true },
  ];

  // Use custom fields if provided, otherwise use default
  const fieldsToRender = fields || defaultFields;

  /* ----------------------------- render ------------------------------- */
  return (
    <div className={`h-[90vh] max-h-[660px] w-full sm:max-w-md flex flex-col relative ${className}`}>
      {/* Única flecha regresar */}
      <button
        onClick={onClose}
        className="absolute top-3 left-3 z-20 p-1 rounded-full hover:bg-blue-100"
      >
        <Return size={24} className="text-[#001C63]" />
      </button>

      {/* 25 % – header / imagen */}
      {renderHeader ? (
        renderHeader(product, form, setForm)
      ) : (
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
      )}

      {/* 75 % – formulario y botones */}
      <div className="flex-1 bg-white overflow-y-auto p-6">
        {/* Mensaje de éxito */}
        {saveSuccess && (
          <div className="mb-4 p-2 bg-green-100 border border-green-300 text-green-700 rounded">
            ¡Producto guardado correctamente!
          </div>
        )}
        
        {/* Mensaje de error general */}
        {errors.submit && (
          <div className="mb-4 p-2 bg-red-100 border border-red-300 text-red-700 rounded">
            {errors.submit}
          </div>
        )}
        
        {/* Campos */}
        <div className="space-y-3">
          {fieldsToRender.map(field => (
            <label key={field.name} className="block text-sm text-[#001C63]">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
              
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={form[field.name] || ''}
                  onChange={handleChange}
                  disabled={field.disabled}
                  className={`w-full mt-1 p-2 rounded border ${
                    errors[field.name] ? 'border-red-500' : ''
                  }`}
                />
              ) : field.type === 'select' ? (
                <select
                  name={field.name}
                  value={form[field.name] || ''}
                  onChange={handleChange}
                  disabled={field.disabled}
                  className={`w-full mt-1 p-2 rounded border ${
                    errors[field.name] ? 'border-red-500' : ''
                  }`}
                >
                  {field.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <div className="mt-1">
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={!!form[field.name]}
                    onChange={e => 
                      setForm(prev => ({ ...prev, [field.name]: e.target.checked }))
                    }
                    disabled={field.disabled}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">{field.checkboxLabel}</span>
                </div>
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
                  onChange={e => {
                    if (field.transform) {
                      handleChange({
                        ...e,
                        target: {
                          ...e.target,
                          value: field.transform(e.target.value)
                        },
                      });
                    } else {
                      handleChange(e);
                    }
                  }}
                  className={`w-full mt-1 p-2 rounded border ${
                    errors[field.name] ? 'border-red-500' : ''
                  }`}
                />
              )}
              
              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
              )}
            </label>
          ))}
        </div>

        {/* Botones acción al final - custom o default */}
        {renderFooter ? (
          renderFooter({ handleSave, handleDelete, loading, form })
        ) : (
          <div className="flex flex-col gap-2 items-end mt-6">
            <Button
              disabled={loading}
              onClick={handleSave}
              className={`p-2 rounded-full ${saveSuccess ? 'bg-green-500' : ''}`}
              text={<Tick size={24} />}
            />
            <Button
              disabled={loading}
              onClick={handleDelete}
              className="p-2 rounded-full"
              text={<Cross size={24} />}
            />
          </div>
        )}
      </div>
    </div>
  );
}