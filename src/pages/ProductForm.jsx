import React, { useState } from 'react';
import Button from '../components/Button';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function ProductForm() {
    const [productId, setProductId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [alergies, setAlergies] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [restaurantIds, setRestaurantIds] = useState('');
    const [calification, setCalification] = useState('');

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
                product_id: productId,
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                alergies: alergies.split(',').map(a => a.trim()),
                image,
                category,
                restaurant_id: restaurantIds.split(',').map(id => id.trim()),
                calification: parseFloat(calification)
            };

            const response = await axios.post(`${API}/products`, payload);
            setSuccess(response.data.message || '¡Producto creado correctamente!');
            // Limpiar campos
            setProductId(''); setName(''); setDescription(''); setPrice('');
            setStock(''); setAlergies(''); setImage(''); setCategory('');
            setRestaurantIds(''); setCalification('');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear el producto.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-cabinet-regular flex flex-col items-center p-4">
            <h2 className="text-3xl mb-6">Agregar Producto</h2>
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-lg space-y-4">
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                <input type="text" placeholder="ID del producto" value={productId}
                    onChange={e => setProductId(e.target.value)}
                    className="border-2 border-gray-300 rounded-md p-2" />

                <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)}
                    className="border-2 border-gray-300 rounded-md p-2" required />

                <textarea placeholder="Descripción" value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="border-2 border-gray-300 rounded-md p-2 h-24 resize-none" required />

                <input type="number" step="0.01" placeholder="Precio" value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="border-2 border-gray-300 rounded-md p-2" required />

                <input type="number" placeholder="Stock" value={stock}
                    onChange={e => setStock(e.target.value)}
                    className="border-2 border-gray-300 rounded-md p-2" required />

                <input type="text" placeholder="Alergias (separadas por coma)" value={alergies}
                    onChange={e => setAlergies(e.target.value)}
                    className="border-2 border-gray-300 rounded-md p-2" />

                <input type="text" placeholder="URL imagen" value={image}
                    onChange={e => setImage(e.target.value)}
                    className="border-2 border-gray-300 rounded-md p-2" />

                <input type="text" placeholder="Categoría" value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="border-2 border-gray-300 rounded-md p-2" />

                <input type="text" placeholder="IDs restaurantes (coma)" value={restaurantIds}
                    onChange={e => setRestaurantIds(e.target.value)}
                    className="border-2 border-gray-300 rounded-md p-2" />


                <Button text={loading ? 'Guardando...' : 'Crear Producto'} type="submit"
                    disabled={loading} className="mt-4" />
            </form>
        </div>
    );
}
