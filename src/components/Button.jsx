import React from 'react'

const Button = ({text,onClick,className,disabled}) => {
    return (
        <button onClick={onClick} className={`text-gray-900 hover:text-white border border-[#001C63] hover:bg-[#001C63] focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-2xl text-sm px-5 py-2.5 text-center me-2 mb-2dark:focus:ring-gray-800 ${className}`} disabled={disabled}>
                {text}
        </button>
    )
}

export default Button
