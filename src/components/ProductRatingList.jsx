import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function ProductRatingsList({ productId }) {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRatings() {
            try {
                const res = await axios.get(`${API}/products/${productId}/ratings`);
                setRatings(res.data);
            } catch (error) {
                console.error('Error al obtener calificaciones:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchRatings();
    }, [productId]);

    if (loading) return <p>Cargando calificaciones...</p>;

    if (ratings.length === 0) return <p>No hay calificaciones para este producto.</p>;

    return (
        <div className="space-y-4 max-w-md">
            {ratings.map(r => (
                <div key={r._id} className="border rounded p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{r.user_id}</span>
                        <StarsRating rating={r.score} />
                    </div>
                    {r.comment && <p className="text-gray-700">{r.comment}</p>}
                    <small className="text-gray-500">{new Date(r.date).toLocaleDateString()}</small>
                </div>
            ))}
        </div>
    );
}

// Reusa el mismo StarsRating que en ProductRating para mostrar estrellas
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
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.955c.3.922-.755 1.688-1.54 1.118l-3.37-2.447a1 1 0 00-1.176 0l-3.37 2.447c-.785.57-1.838-.196-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.028 9.382c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.285-3.955z" />
            </svg>
        );
    } else if (half) {
        return (
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
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
        <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.955c.3.922-.755 1.688-1.54 1.118l-3.37-2.447a1 1 0 00-1.176 0l-3.37 2.447c-.785.57-1.838-.196-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.028 9.382c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.285-3.955z" />
        </svg>
    );
}
