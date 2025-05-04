import React, { useState } from 'react';
import Button from '../components/Button';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('cliente'); // 'cliente' por defecto
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                name: name.trim().toLowerCase(),
                email: email.trim().toLowerCase(),
                password,
                role,
            };
            const response = await axios.post('http://localhost:5000/register', payload);

            setSuccess(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al registrar el usuario');
            setSuccess('');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="font-cabinet-regular">
            <div className="bg-[#E0EDFF] h-[50vw] rounded-b-4xl absolute inset-0 flex items-center justify-center">
                <div>
                    <h3 className="text-xl">Unisabana</h3>
                    <h1 className="text-5xl text-[#001C63]">Dining Through</h1>
                    <h4>Registro</h4>
                </div>
            </div>

            <div className="text-black relative z-10 flex flex-col items-center h-screen justify-center pt-30">
                <form onSubmit={handleSubmit} className="flex flex-col justify-center">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="border-2 border-gray-300 rounded-md p-2 mb-4"
                        placeholder="Nombre"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-2 border-gray-300 rounded-md p-2 mb-4"
                        placeholder="Correo electrónico"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-2 border-gray-300 rounded-md p-2 mb-4"
                        placeholder="Contraseña"
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="border-2 border-gray-300 rounded-md p-2 mb-4"
                    >
                        <option value="cliente">Cliente</option>
                    </select>
                    <Link to="/login" className='font-light text-xs -mt-4'>Ya tienes una cuenta?</Link>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <Button
                        text={"Registrarse"}
                        onClick={handleSubmit}
                        className={"mt-5"}
                        disabled={loading}
                    />
                </form>

                {loading && (
                    <div role="status" className="flex items-center justify-center mt-4">
                        <svg
                            aria-hidden="true"
                            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591..."
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038..."
                                fill="currentFill"
                            />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Register;
