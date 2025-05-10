// services/api.js
const API = import.meta.env.VITE_API_URL;

/**
 * Obtiene todos los productos de un restaurante específico
 * @param {string} restaurantId - ID del restaurante
 * @returns {Promise<Array>} - Arreglo de productos
 */
export const getProductsByRestaurantId = async (restaurantId) => {
  try {
    const response = await fetch(`${API}/products`);
    
    if (!response.ok) {
      throw new Error('Error al obtener productos');
    }
    
    const products = await response.json();
    
    // Filtramos solo los productos que tienen el restaurant_id correcto
    // Asumiendo que restaurant_id es un array de IDs en cada producto
    return products.filter(product => 
      product.restaurant_id && 
      (
        // Si restaurant_id es un array, verificamos que incluya el ID del restaurante
        (Array.isArray(product.restaurant_id) && product.restaurant_id.includes(restaurantId)) ||
        // Si restaurant_id es un string, verificamos que sea igual al ID del restaurante
        product.restaurant_id === restaurantId
      )
    );
  } catch (error) {
    console.error('Error en getProductsByRestaurantId:', error);
    throw error;
  }
};

/**
 * Obtiene la información de un restaurante específico
 * @param {string} restaurantId - ID del restaurante
 * @returns {Promise<Object>} - Datos del restaurante
 */
export const getRestaurantById = async (restaurantId) => {
  try {
    const response = await fetch(`${API}/restaurants/${restaurantId}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener información del restaurante');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getRestaurantById:', error);
    throw error;
  }
};