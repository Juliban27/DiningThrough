import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function ProductRating({ productId }) {
    const [average, setAverage] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAverage() {
            try {
                const res = await axios.get(`${API}/products/${productId}/ratings/average`);
                setAverage(res.data.averageScore);
                setTotal(res.data.totalRatings);
            } catch (error) {
                console.error('Error al obtener promedio:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAverage();
    }, [productId]);

    if (loading) return <p>Cargando calificaciones...</p>;

    return (
        <div className="flex items-center gap-2">
            <span className="font-semibold">{average.toFixed(1)} / 5</span>
            <StarsRating rating={average} />
            <span className="text-sm text-gray-600">({total} calificaciones)</span>
        </div>
    );
}

/**
 * Componente auxiliar para mostrar estrellas llenas/medias/vacías según rating decimal
 */
function StarsRating({ rating }) {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push(<Star key={i} filled />);
        } else if (rating >= i - 0.5) {
            stars.push(<Star key={i} half />);
        } else {
            stars.push(<Star key={i} />);
        }
    }
    return <div className="flex">{stars}</div>;
}

function Star({ filled, half }) {
    if (filled) {
        return (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.955c.3.922-.755 1.688-1.54 1.118l-3.37-2.447a1 1 0 00-1.176 0l-3.37 2.447c-.785.57-1.838-.196-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.028 9.382c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.285-3.955z" />
            </svg>
        );
    } else if (half) {
        return (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <defs>
                    <linearGradient id="halfGrad">
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="transparent" stopOpacity="1" />
                    </linearGradient>
                </defs>
                <path fill="url(#halfGrad)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.955c.3.922-.755 1.688-1.54 1.118l-3.37-2.447a1 1 0 00-1.176 0l-3.37 2.447c-.785.57-1.838-.196-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.028 9.382c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.285-3.955z" />
            </svg>
        );
    }
    return (
        <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.955c.3.922-.755 1.688-1.54 1.118l-3.37-2.447a1 1 0 00-1.176 0l-3.37 2.447c-.785.57-1.838-.196-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.028 9.382c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.285-3.955z" />
        </svg>
    );
}
