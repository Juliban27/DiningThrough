import React from 'react'
const Index = () => {
    return (
        <div className="bg-[#E0EDFF] h-screen flex flex-col">
            <div className="bg-[#E0EDFF] h-[25vh] flex flex-col items-center justify-center">
                <h1 className="text-[#001C63] text-3xl font-medium tracking-wider">RESTAURANTES</h1>
                <div className="mt-4 flex items-center">
                    <input
                        type="text"
                        placeholder="Ingresa el nombre del restaurante"
                        className="pp-3 w-[212px] h-[35px] bg-[#D9D9D9] opacity-40 rounded-[8px] border-2 "
                    />
                    <button className="ml-2">
                        <img
                            src="/src/assets/lupaBuscar.webp"
                            alt="Buscar"
                            className="w-8 h-8"
                        />
                    </button>
                </div>
            </div>
            <div className="bg-white h-[75vh] w-full rounded-t-4xl">
                {}
            </div>
        </div>

        
    )
}

export default Index



