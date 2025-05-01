import React, {useState} from 'react'
import axios from 'axios';
import Button from '../components/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            // Manejar la respuesta del backend aquí (ej. redirigir al usuario)
        } catch (err) {
            if (err.response) {
                // El servidor respondió con un código de estado fuera del rango 2xx
                setError(err.response.data.error || 'Error al iniciar sesión');
            } else if (err.request) {
                // La solicitud fue hecha pero no se recibió respuesta
                setError('No se recibió respuesta del servidor');
            } else {
                // Algo pasó al configurar la solicitud
                setError('Error al iniciar sesión: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className=' font-abinet-regular'>
            <div className='bg-[#E0EDFF]  h-[50vw] rounded-b-4xl absolute inset-0'></div>
            <div className='text-black relative z-10'>
                <form onSubmit={handleLogin} className='flex flex-col items-center justify-center h-screen'>
                    <div>
                        <label>Email</label>
                        <input type="email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)} required
                            className='border-2 border-gray-300 rounded-md p-2 mb-4'
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)} required
                        />
                    </div>
                    {error && <p className='text-red-500'>{error}</p>}
                    <Button
                        text={"Presionar"}
                        onClick={handleLogin}
                        className={" "}
                        disabled={loading}
                    />
                </form>
            </div>
        </div>
    )
}

export default Login
