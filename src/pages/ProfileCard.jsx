import React from 'react'
import { useAuth } from '../context/AuthContext';
import ProfileLogo from '../assets/ProfileLogo';
import Button from '../components/Button';


const ProfileCard = () => {
  const { user, loading, logout } = useAuth();

  if (loading) return <p>Cargando…</p>;

  return (
    <div className="text-center space-y-4">
      <div className='bg-[#E0EDFF] rounded-b-4xl flex items-center justify-center flex-col'>
        <ProfileLogo className={"size-20"}/>
        <h2 className="text-xl font-semibold capitalize">Hola, {user.name}</h2>
      </div>
      <div className="relative h-64 w-full overflow-hidden">
        <div
          className="bg-cover bg-center bg-[url(/Unisabana.webp)]  absolute inset-0 filter opacity-10"
        />
        <div className="flex flex-col relative z-10 justify-around h-full ">
          <div className='flex flex-col relative z-10 items-start justify-center '>
            <p className="capitalize">Rol: {user.role}</p>
            <p className="">Correo: {user.email}</p>
          </div>
          <div>
            <Button
              text={"Logout"}
              onClick={logout}
              className={"mt-5"}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
