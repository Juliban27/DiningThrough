import React from 'react'
import Magnifier from '../assets/Magnifier'
import ProfileButton from '../components/ProfileButton'

const Index = () => {
    return (
        <div className="bg-[#E0EDFF] h-screen flex flex-col">
            {/* Header */}
            <div className="bg-[#E0EDFF] h-[25vh] p-4 flex flex-col">
                {/* Row superior: perfil a la derecha */}
                <div className="w-full flex justify-end">
                    <ProfileButton />
                </div>
                {/* Centro: título + buscador */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    <h1 className="text-[#001C63] text-3xl font-medium tracking-wider">
                        Restaurantes
                    </h1>
                    <div className="mt-4 flex items-center">
                        <input
                            type="text"
                            placeholder="Ingresa el nombre del restaurante"
                            className="px-3 w-[212px] h-[35px] bg-[#D9D9D9] opacity-40 rounded-[8px] border-2"
                        />
                        <button className="ml-2">
                            <Magnifier className="size-8" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Contenido */}
            <div className="bg-white h-[75vh] w-full rounded-t-4xl">
                {/* ... */}
            </div>
        </div>
    )
}

export default Index
