import { useState, useEffect } from 'react';
import { getRestaurantById, getProductsByRestaurantCached } from '../services/restaurantService';

/**
 * useRestaurant hook
 * @param {string} id  Restaurante ID (restaurant_id o _id)
 * @returns {{ restaurant: Object, products: Array, categories: Array<string>, loading: boolean, error: string|null }}
 */
export default function useRestaurant(id) {
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);

        // Obtener restaurante (por restaurant_id o _id)
        const rest = await getRestaurantById(id);
        setRestaurant(rest);

        // Obtener productos con caché
        const prods = await getProductsByRestaurantCached(rest);
        setProducts(prods);

        // Extraer categorías únicas
        const cats = [...new Set(
          prods
            .filter(p => p.category)
            .map(p => p.category)
        )];
        setCategories(cats);
      } catch (e) {
        setError(e.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return { restaurant, products, categories, loading, error };
}
