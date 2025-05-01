import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('cliente'); // 'cliente' por defecto
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Hacer la solicitud al backend para registrar el usuario
            const response = await axios.post('http://localhost:5000/register', { email, password, name, role });

            // Si la creación fue exitosa, mostrar un mensaje
            setSuccess(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al registrar el usuario');
            setSuccess('');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Nombre</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Rol</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="cliente">Cliente</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
};

export default Register;
