import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function ProductRatingForm({ productId, userId, onRatingSubmitted }) {
    const [score, setScore] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (score < 1 || score > 5) {
            setError('La calificación debe ser entre 1 y 5');
            return;
        }
        if (!userId) {
            setError('Necesitas estar autenticado para calificar');
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${API}/products/${productId}/ratings`, {
                user_id: userId,
                score,
                comment,
            });
            setSuccess('Calificación enviada correctamente');
            setScore(0);
            setComment('');
            if (onRatingSubmitted) onRatingSubmitted();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al enviar la calificación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <label className="font-semibold">Calificación (1 a 5 estrellas)</label>
            <select
                value={score}
                onChange={e => setScore(parseInt(e.target.value))}
                className="border rounded p-2"
            >
                <option value={0}>Selecciona</option>
                {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} estrella{n > 1 ? 's' : ''}</option>
                ))}
            </select>

            <label className="font-semibold">Comentario (opcional)</label>
            <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
                className="border rounded p-2"
                placeholder="Escribe tu comentario aquí"
            />

            <button
                type="submit"
                disabled={loading}
                className="bg-[#001C63] text-white rounded py-2 mt-2 hover:bg-blue-800 transition"
            >
                {loading ? 'Enviando...' : 'Enviar calificación'}
            </button>
        </form>
    );
}
