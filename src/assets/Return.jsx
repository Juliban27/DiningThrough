import React from 'react'

const Return = ({size, className }) => {
    return (
        <svg  xmlns="http://www.w3.org/2000/svg"  
        width={size}  
        height={size}   
        viewBox="0 0 24 24"  
        fill="none"  
        stroke="currentColor"  
        strokeWidth="2"  
        strokeLinecap="round"  
        strokeLinejoin="round"  
        className={className}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 14l-4 -4l4 -4" />
            <path d="M5 10h11a4 4 0 1 1 0 8h-1" />
        </svg>
    )
}

export default Return
