const API = import.meta.env.VITE_API_URL;

/**
 * Crea una factura (Bill) en el backend.
 * @param {Object} payload
 * @returns {Promise<Object>} La factura creada
 */
export async function createBill(payload) {
  const res = await fetch(`${API}/bills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al crear la factura');
  return res.json();
}