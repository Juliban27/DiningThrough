import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductsList from '../components/ProductsList';
import { getRestaurantById, getProductsByRestaurant } from '../services/restaurantService';
import Return from '../assets/Return';
import ProfileButton from '../components/ProfileButton';
import Button from '../components/Button';
import BillCard from '../components/BillCard';
import InventaryCard from '../components/InventaryCard';
import { useAuth } from '../context/AuthContext'; 
import Cross from '../assets/Cross';  // ← NUEVO

const API = import.meta.env.VITE_API_URL;

const RestaurantProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ─────────── usuario & rol admin ─────────── */
  const { user } = useAuth();                         // ← usuario vivo
  const isAdmin = (user?.role || '').toLowerCase() === 'admin';

  /* ─────────── state general ─────────── */
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  /* ─────────── carrito ─────────── */
  const [cartItems, setCartItems] = useState([]);

  /* ─────────── pedidos (bills) ─────────── */
  const [bills, setBills] = useState([]);
  const [loadingBills, setLoadingBills] = useState(false);

  /* pestaña activa: 'productos' | 'carrito' | 'pedidos' | 'inventario' */
  const [tab, setTab] = useState('productos');

  /* ──────────────────────────────────────────────
   *  Cargar datos del restaurante y productos
   * ────────────────────────────────────────────── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const restData = await getRestaurantById(id);
        setRestaurant(restData);

        const prods = await getProductsByRestaurant(restData);
        setProducts(prods);

        const cats = [...new Set(prods.filter(p => p.category).map(p => p.category))];
        setCategories(cats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  /* ─────────── cargar bills cuando se abre la pestaña pedidos ─────────── */
  useEffect(() => {
    if (tab !== 'pedidos') return;

    (async () => {
      try {
        setLoadingBills(true);
        const res = await fetch(`${API}/bills`);
        const data = await res.json();
        const mine = data.filter(b => b.client_id === user.id); // ← user.id sigue igual
        setBills(mine);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingBills(false);
      }
    })();
  }, [tab, user.id]);

  /* ─────────────────────────── helpers ─────────────────────────── */
  const handleAddToCart = product => {
    setCartItems(prev => {
      const found = prev.find(i => i._id === product._id);
      return found
        ? prev.map(i =>
            i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [...prev, { ...product, quantity: 1 }];
    });
  };

  const increment = id =>
    setCartItems(prev =>
      prev.map(i => (i._id === id ? { ...i, quantity: i.quantity + 1 } : i)),
    );

  const decrement = id =>
    setCartItems(prev =>
      prev
        .map(i =>
          i._id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i,
        )
        .filter(i => i.quantity > 0),
    );

  const removeFromCart = id =>
    setCartItems(prev => prev.filter(i => i._id !== id));

  const cartTotal = cartItems.reduce(
    (acc, i) => acc + i.price * i.quantity,
    0,
  );

  const handleCheckout = async () => {
    if (!cartItems.length) return;
    try {
      const payload = {
        client_id: user.id,      // TODO ajusta si tu campo es _id
        products: cartItems,
        total: cartTotal,
        date: new Date(),
      };
      const res = await fetch(`${API}/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Error al crear la factura');
      setCartItems([]);
      setTab('pedidos');
    } catch (err) {
      alert(err.message);
    }
  };

  /* ─────────────────────────── UI ─────────────────────────── */
  if (loading) {
    return (
      <div className="bg-[#E0EDFF] min-h-screen flex items-center justify-center">
        <p className="text-[#001C63]">Cargando…</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="bg-[#E0EDFF] min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center space-y-4">
          <p className="text-red-500">{error || 'Restaurante no encontrado'}</p>
          <Button text="Volver" onClick={() => navigate('/')} />
        </div>
      </div>
    );
  }

  /* ─────────── pestañas (carrusel tipo filtros) ─────────── */
  const TabButton = ({ id, label }) => (
    <Button
      text={label}
      onClick={() => setTab(id)}
      className={`whitespace-nowrap ${
        tab === id ? 'bg-[#001C63] text-white' : 'bg-white text-[#001C63]'
      }`}
    />
  );

  /* ─────────── contenido por pestaña ─────────── */
  const renderContent = () => {
    switch (tab) {
      case 'productos':
        return (
          <>
            {/* toggle categorías */} 
            {categories.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
                <Button
                  text="Todos"
                  onClick={() => setSelectedCategory('')}
                  className={`whitespace-nowrap ${
                    selectedCategory === ''
                      ? 'bg-[#001C63] text-white'
                      : 'bg-white text-[#001C63]'
                  }`}
                />
                {categories.map(cat => (
                  <Button
                    key={cat}
                    text={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-[#001C63] text-white'
                        : 'bg-white text-[#001C63]'
                    }`}
                  />
                ))}
              </div>
            )}
            <ProductsList
              products={products}
              onAddToCart={handleAddToCart}
              categoryFilter={selectedCategory}
            />
          </>
        );

      case 'carrito':
  return cartItems.length === 0 ? (
    <p className="text-center text-sm text-gray-500">
      El carrito está vacío.
    </p>
  ) : (
    <>
      {/* Lista de productos (deja espacio inferior para la barra de pago) */}
      <div className="space-y-4 pb-40">
        {cartItems.map(item => (
          <div
            key={item._id}
            className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"
          >
            {/* Imagen */}
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="h-12 w-12 object-cover rounded"
              />
            ) : (
              <div className="h-12 w-12 bg-gray-300 rounded flex items-center justify-center text-[10px] text-gray-600">
                Img
              </div>
            )}

            {/* Información */}
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">
                ${item.price.toFixed(2)} × {item.quantity}
              </p>
            </div>

            {/* Controles cantidad */}
            <div className="flex items-center gap-1">
              <Button text="−" onClick={() => decrement(item._id)} className="px-3" />
              <span className="w-6 text-center">{item.quantity}</span>
              <Button text="+" onClick={() => increment(item._id)} className="px-3" />
            </div>

            {/* Eliminar */}
            <Button
              onClick={() => removeFromCart(item._id)}
              className="p-2 rounded-full ml-2"
              text={<Cross size={20} />}
            />
          </div>
        ))}
      </div>

      {/* Barra de pago fija abajo (15 % altura) */}
      <div className="fixed bottom-0 left-0 right-0 h-[15vh] bg-[#001C63] text-white p-4 flex justify-between items-center">
        <div>
          <span className="font-medium">{cartItems.length} productos</span>
          <p className="font-bold">${cartTotal.toFixed(2)}</p>
        </div>
        <Button
          text="Pagar"
          onClick={handleCheckout}
          className="bg-white text-[#001C63] px-6 py-2 rounded-lg font-medium"
        />
      </div>
    </>
  );

      case 'pedidos':
        if (loadingBills)
          return <p className="text-center text-sm text-gray-500">Cargando…</p>;

        return bills.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            Aún no tienes pedidos aquí.
          </p>
        ) : (
          <div className="flex flex-col gap-4 pb-8">
            {bills.map(b => (
              <BillCard
                key={b._id}
                billId={b._id}
                date={b.date}
                total={b.total}
                image={b.image}
              />
            ))}
          </div>
        );

      case 'inventario':
        const invProducts = products.filter(p =>
          Array.isArray(p.restaurant_id)
            ? p.restaurant_id.includes(restaurant.restaurant_id)
            : true,
        );
        return invProducts.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            No hay productos en inventario.
          </p>
        ) : (
          <div className="flex flex-col gap-3 pb-8">
            {invProducts.map(p => (
              <InventaryCard key={p._id} product={p} />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  /* ─────────── render total ─────────── */
  return (
    <div className="bg-[#E0EDFF] min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-blue-100"
            aria-label="Volver"
          >
            <Return size={24} className="text-[#001C63]" />
          </button>
          <h1 className="flex-1 text-center text-[#001C63] text-2xl font-medium pr-6">
            {restaurant.name}
          </h1>
          <ProfileButton />
        </div>

        {/* Info breve restaurante */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Horario:</span>{' '}
            {restaurant.hora_apertura} – {restaurant.hora_cierre}
          </p>
        </div>
      </div>

      {/* Carrusel de pestañas */}
      <div className="px-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <TabButton id="productos" label="Productos" />
          <TabButton id="carrito" label={`Carrito (${cartItems.length})`} />
          <TabButton id="pedidos" label="Pedidos" />
          {isAdmin && <TabButton id="inventario" label="Inventario" />}
        </div>
      </div>

      {/* Contenido */}
      <div className="bg-white flex-1 rounded-t-[2rem] overflow-y-auto px-4 pt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default RestaurantProducts;

