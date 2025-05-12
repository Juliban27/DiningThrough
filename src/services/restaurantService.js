// services/restaurantService.js
const API = import.meta.env.VITE_API_URL;

/**
 * Obtiene el restaurante por su restaurant_id o _id
 * @param {string} id - ID del restaurante (puede ser restaurant_id o _id)
 * @returns {Promise<Object>} - Datos del restaurante
 */
export const getRestaurantById = async (id) => {
    try {
        // Primero intentamos obtener todos los restaurantes
        const response = await fetch(`${API}/restaurants`);

        if (!response.ok) {
            throw new Error('Error al obtener restaurantes');
        }

        const restaurants = await response.json();

        // Buscamos el restaurante que coincida con el ID (ya sea _id o restaurant_id)
        const restaurant = restaurants.find(r =>
            (r.restaurant_id && r.restaurant_id === id) || r._id === id
        );

        if (!restaurant) {
            throw new Error(`No se encontró el restaurante con ID: ${id}`);
        }

        return restaurant;
    } catch (error) {
        console.error('Error en getRestaurantById:', error);
        throw error;
    }
};

/**
 * Obtiene productos filtrados por restaurante
 * @param {Object} restaurant - El objeto del restaurante (con _id y restaurant_id)
 * @returns {Promise<Array>} - Lista de productos filtrados
 */
export const getProductsByRestaurant = async (restaurant) => {
    try {
        const response = await fetch(`${API}/products`);

        if (!response.ok) {
            throw new Error('Error al obtener productos');
        }

        const products = await response.json();

        // IDs que podemos usar para filtrar (tanto _id como restaurant_id)
        const restaurantIds = [restaurant._id];
        if (restaurant.restaurant_id) {
            restaurantIds.push(restaurant.restaurant_id);
        }

        // Filtramos productos que coincidan con cualquiera de los IDs del restaurante
        return products.filter(product => {
            if (!product.restaurant_id) return false;

            if (Array.isArray(product.restaurant_id)) {
                // Si restaurant_id es un array, comprobamos si incluye alguno de nuestros IDs
                return restaurantIds.some(id => product.restaurant_id.includes(id));
            } else {
                // Si restaurant_id es string, comparamos directamente
                return restaurantIds.includes(product.restaurant_id);
            }
        });
    } catch (error) {
        console.error('Error en getProductsByRestaurant:', error);
        throw error;
    }
};