import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
const API = import.meta.env.VITE_API_URL;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                email: email.trim().toLowerCase(),
                password
            };

            const response = await axios.post(`${API}/login`, payload);
            const { token, user } = response.data;
            console.log('Login successful:', { token, user });
            login({ token, user });

            navigate('/index');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.error || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

        useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                handleLogin(e);
            }
        };

        // Agregar el event listener cuando el componente se monta
        document.addEventListener('keydown', handleKeyDown);

        // Limpiar el event listener cuando el componente se desmonta
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [email, password]); 

    return (
        <div className="font-cabinet-regular relative min-h-screen bg-white">
            {/* Hero banner */}
            <div className="bg-[#E0EDFF] h-[50vw] md:h-64 lg:h-72 rounded-b-4xl absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4 md:px-0">
                    <h3 className="text-lg md:text-xl">Unisabana</h3>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#001C63]">Dining Through</h1>
                    <h4 className="mt-2 md:mt-4">Log-In!</h4>
                </div>
            </div>

            {/* Form container */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-48 md:pt-32">
                <form onSubmit={handleLogin} className="w-full max-w-sm sm:max-w-md lg:max-w-lg px-6 sm:px-8 md:px-0 flex flex-col space-y-4">
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                        className="border-2 border-gray-300 rounded-md p-2 md:p-3 text-sm md:text-base"
                        placeholder="Correo electrónico"
                    />
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                        className="border-2 border-gray-300 rounded-md p-2 md:p-3 text-sm md:text-base"
                        placeholder="Contraseña"
                    />
                    <Link to="/signup" className="self-start text-xs md:text-sm text-gray-600 hover:underline">¿No tienes una cuenta?</Link>
                    {error && <p className="text-red-500 text-sm md:text-base">{error}</p>}

                    {loading && (
                        <div role="status" className="flex items-center justify-center mt-2">
                            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9926 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9926 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    )}

                    <Button
                        text="Acceder"
                        onClick={handleLogin}
                        className="mt-4 w-full py-2 md:py-3 text-sm md:text-base"
                        disabled={loading}
                    />
                </form>
            </div>
        </div>
    );
};

export default Login;
