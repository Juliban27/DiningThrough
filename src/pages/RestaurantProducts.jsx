import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductsList from '../components/ProductsList';
import { getRestaurantById, getProductsByRestaurant } from '../services/restaurantService';

const RestaurantProducts = () => {
    const { id } = useParams(); // Obtiene el ID (restaurant_id) de la URL
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    // Cargar datos del restaurante y sus productos
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 1. Obtener información del restaurante por restaurant_id o _id
                const restaurantData = await getRestaurantById(id);
                setRestaurant(restaurantData);

                // 2. Obtener productos filtrados por el restaurante
                const restaurantProducts = await getProductsByRestaurant(restaurantData);
                setProducts(restaurantProducts);

                // 3. Extraer categorías únicas de los productos
                const uniqueCategories = [...new Set(restaurantProducts
                    .filter(product => product.category)
                    .map(product => product.category))];

                setCategories(uniqueCategories);

            } catch (err) {
                console.error('Error al cargar datos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    // Función para agregar producto al carrito
    const handleAddToCart = (product) => {
        setCartItems(prevItems => {
            // Verificar si el producto ya está en el carrito
            const existingItem = prevItems.find(item => item._id === product._id);

            if (existingItem) {
                // Incrementar cantidad si ya existe
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Añadir nuevo producto con cantidad 1
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    // Mostrar pantalla de carga
    if (loading) {
        return (
            <div className="bg-[#E0EDFF] min-h-screen flex justify-center items-center">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <p className="text-[#001C63]">Cargando información...</p>
                </div>
            </div>
        );
    }

    // Mostrar pantalla de error
    if (error || !restaurant) {
        return (
            <div className="bg-[#E0EDFF] min-h-screen p-4 flex flex-col items-center justify-center">
                <div className="p-6 bg-white rounded-lg shadow-md text-center">
                    <p className="text-red-500 mb-4">Error: {error || 'No se encontró el restaurante'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-[#001C63] text-white rounded-lg"
                    >
                        Volver a restaurantes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#E0EDFF] min-h-screen flex flex-col">
            {/* Header con información del restaurante */}
            <div className="p-4">
                <div className="flex items-center mb-4">
                    <button
                        onClick={() => navigate('/')}
                        className="mr-2 p-2 rounded-full hover:bg-blue-100"
                        aria-label="Volver"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#001C63]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-[#001C63] text-2xl font-medium tracking-wide flex-1 text-center pr-8">
                        {restaurant.name}
                    </h1>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Horario:</span> {restaurant.hora_apertura} - {restaurant.hora_cierre}
                    </p>
                    {restaurant.address && (
                        <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Dirección:</span> {restaurant.address}
                        </p>
                    )}
                    {restaurant.restaurant_id && (
                        <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">ID del restaurante:</span> {restaurant.restaurant_id}
                        </p>
                    )}
                </div>
            </div>

            {/* Selector de categorías */}
            {categories.length > 0 && (
                <div className="px-4 mb-2">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <button
                            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${selectedCategory === ''
                                    ? 'bg-[#001C63] text-white'
                                    : 'bg-white text-[#001C63] border border-[#001C63]'
                                }`}
                            onClick={() => setSelectedCategory('')}
                        >
                            Todos
                        </button>
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${selectedCategory === category
                                        ? 'bg-[#001C63] text-white'
                                        : 'bg-white text-[#001C63] border border-[#001C63]'
                                    }`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Contenido: lista de productos */}
            <div className="bg-white flex-1 rounded-t-[2rem] overflow-y-auto px-4 pt-6 pb-20">
                <ProductsList
                    products={products}
                    onAddToCart={handleAddToCart}
                    categoryFilter={selectedCategory}
                />
            </div>

            {/* Mini carrito si hay productos */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="font-medium">{cartItems.reduce((acc, item) => acc + item.quantity, 0)} productos</span>
                            <p className="text-[#001C63] font-bold">
                                ${cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
                            </p>
                        </div>
                        <button
                            className="bg-[#001C63] text-white px-6 py-2 rounded-lg font-medium"
                            onClick={() => {
                                // Aquí irías a la página de checkout o similar
                                alert('Implementar funcionalidad de checkout');
                            }}
                        >
                            Ver carrito
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantProducts;