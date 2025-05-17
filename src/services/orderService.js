const BASE = import.meta.env.VITE_API_URL;
export async function createOrder(payload) {
  const res = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al crear el pedido');
  return res.json();
}