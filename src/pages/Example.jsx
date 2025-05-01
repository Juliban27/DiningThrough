import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  // Obtener usuarios desde el backend (GET)
  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los usuarios:', error);
      });
  }, []);

  // Agregar un usuario (POST)
  const handleAddUser = () => {
    const newUser = { name, email, id, role, password};
    axios.post('http://localhost:5000/users', newUser)
      .then(response => {
        setUsers([...users, response.data]);
        setName('');
        setEmail('');
        setId('');
        setRole('');
        setPassword('');
      })
      .catch(error => {
        console.error('Error al agregar el usuario:', error);
      });
  };

  return (
    <div className="App">
      <h1>Usuarios</h1>
      <div>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <input
          type="text"
          placeholder="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <button onClick={handleAddUser} className='bg-amber-950 text-white' >Agregar Usuario</button>
      </div>

      <ul>
        {users.map(user => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
