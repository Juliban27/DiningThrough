// ────────────────────────────────────────────────────────────────
// BillCard.jsx  – Tarjeta resumen clic‑able (con export default)
// ────────────────────────────────────────────────────────────────
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * BillCard – tarjeta que muestra un resumen de la factura.
 * Al hacer clic navega a `/bills/:id` para ver detalles completos.
 *
 * Props
 *  • billId  – identificador único (bill_id o _id)
 *  • date    – fecha (Date o ISO string)
 *  • total   – número (monto total)
 *  • image   – URL de la imagen de la factura / pedido (opcional)
 */
const BillCard = ({ billId, date, total, image }) => {
  const navigate = useNavigate();

  const formattedDate = new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(date));

  const handleClick = () => navigate(`/bills/${billId}`);

  return (
    <div
      onClick={handleClick}
      className="relative h-32 rounded-2xl overflow-hidden shadow-md cursor-pointer select-none"
    >
      {/* Fondo con opacidad 40 % */}
      {image ? (
        <img
          src={image}
          alt="Imagen de pedido"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-300 opacity-40 flex items-center justify-center">
          <span className="text-sm text-gray-700">Sin imagen</span>
        </div>
      )}

      {/* Overlay */}
      <div className="relative z-10 p-4 flex flex-col justify-between h-full">
        <p className="text-sm text-[#001C63] font-medium">Pedido el {formattedDate}</p>
        <p className="text-lg text-[#001C63] font-bold">Total: ${Number(total).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default BillCard;