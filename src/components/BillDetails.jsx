// -------------------------------------------------------------------
// BillDetails.jsx – Vista ampliada de la factura
// -------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Return from "../assets/Return";
import Button from "../components/Button"; // reutilizamos tu botón estilizado

const API = import.meta.env.VITE_API_URL;

export default function BillDetails() {
  const { id } = useParams();          // id de la factura
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/bills/${id}`);
        if (!res.ok) throw new Error("No se encontró la factura");
        const data = await res.json();
        setBill(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#E0EDFF] min-h-screen flex items-center justify-center">
        <p className="text-[#001C63]">Cargando factura…</p>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="bg-[#E0EDFF] min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center space-y-4">
          <p className="text-red-500">{error || "Factura no encontrada"}</p>
          <Button text="Volver" onClick={() => navigate(-1)} />
        </div>
      </div>
    );
  }

  /* ───── Formateos útiles ───── */
  const fecha = new Date(bill.date);
  const fechaTexto = fecha.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const horaTexto = fecha.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const total = bill.total ?? bill.products?.reduce((acc, p) => acc + p.price * (p.quantity || 1), 0);

  return (
    <div className="bg-[#E0EDFF] min-h-screen flex flex-col">
      {/* Header con flecha de regreso */}
      <div className="p-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 mr-2 rounded-full hover:bg-blue-100"
          aria-label="Volver"
        >
          <Return size={24} className="text-[#001C63]" />
        </button>
        <h1 className="text-[#001C63] text-xl font-medium flex-1 text-center pr-6">Detalle de la factura</h1>
      </div>

      {/* Contenido */}
      <div className="flex-1 bg-white rounded-t-[2rem] p-6 space-y-6">
        {/* Info general */}
        <div className="space-y-1">
          <p className="text-[#001C63] font-medium">Fecha: <span className="font-normal">{fechaTexto}</span></p>
          <p className="text-[#001C63] font-medium">Hora: <span className="font-normal">{horaTexto}</span></p>
        </div>

        {/* Productos */}
        <div>
          <h2 className="text-lg font-semibold text-[#001C63] mb-2">Productos</h2>
          {bill.products?.length ? (
            <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {bill.products.map((p, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span>{p.name}{p.quantity ? ` ×${p.quantity}` : ""}</span>
                  <span>${(p.price * (p.quantity || 1)).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">— Sin productos —</p>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-lg font-bold text-[#001C63]">Total</span>
          <span className="text-lg font-bold text-[#001C63]">${Number(total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
