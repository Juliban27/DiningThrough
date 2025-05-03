import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
const Inventory = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <span>No estás logueado</span>;
  }
  return (
    <div>
      HOPALLLLLLLLLLLLLLL
      <div>
      🔐 Logged in as <strong>{user.email}</strong> ({user.role})
      </div>
    </div>
  )
}

export default Inventory
