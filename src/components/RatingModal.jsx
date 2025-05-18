import React, { useState } from 'react';
import ProductRatingForm from './ProductRatingForm';
import ModalBlur from './ModalBlur'; // asumiendo que tienes este modal

export default function RatingButtonModal({ productId, userId }) {
    const [isOpen, setIsOpen] = useState(false);

    // Función para refrescar datos o hacer algo después de enviar
    const handleRatingSubmitted = () => {
        setIsOpen(false);
        // aquí puedes actualizar promedio, mostrar toast, etc
    };

    return (
        <>
            <button
                aria-label="Calificar producto"
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 transition"
            >
                {/* Ícono estrella simple SVG */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="none"
                >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            </button>

            <ModalBlur isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                    <h2 className="text-xl font-semibold mb-4">Calificar Producto</h2>
                    <ProductRatingForm
                        productId={productId}
                        userId={userId}
                        onRatingSubmitted={handleRatingSubmitted}
                    />
                    <button
                        onClick={() => setIsOpen(false)}
                        className="mt-4 text-sm text-gray-500 hover:text-gray-700"
                    >
                        Cancelar
                    </button>
                </div>
            </ModalBlur>
        </>
    );
}
