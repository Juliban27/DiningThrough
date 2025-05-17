/**
 * productService.js
 * Servicio para manejar productos, incluida la actualización de inventario
 */

const BASE = import.meta.env.VITE_API_URL;

/**
 * Actualiza el inventario de un producto después de una compra
 * @param {string} productId - ID del producto
 * @param {number} quantity - Cantidad a restar del inventario
 * @returns {Promise} - Resultado de la operación
 */
export async function updateProductInventory(productId, quantity) {
    try {
        const response = await fetch(`${BASE}/products/${productId}`);
        if (!response.ok) {
            throw new Error('Error al obtener información del producto');
        }

        const product = await response.json();
        const newStock = Math.max(0, product.stock - quantity);

        // Actualizamos el stock del producto
        const updateResponse = await fetch(`${BASE}/products/${productId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: newStock })
        });

        if (!updateResponse.ok) {
            throw new Error('Error al actualizar el inventario');
        }

        return await updateResponse.json();
    } catch (error) {
        console.error('Error actualizando inventario:', error);
        throw error;
    }
}

/**
 * Obtiene un producto por su ID
 * @param {string} productId - ID del producto
 * @returns {Promise<Object>} - Producto
 */
export async function getProductById(productId) {
    try {
        const response = await fetch(`${BASE}/products/${productId}`);
        if (!response.ok) {
            throw new Error('Error al obtener el producto');
        }

        return await response.json();
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        throw error;
    }
}