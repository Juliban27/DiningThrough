import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReturnIcon from '../assets/Return';

export default function ModalBlur({ isOpen, onClose, children }) {
    // Bloquea scroll del body mientras el modal está abierto
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 bg-white/40 backdrop-blur-xs flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="relative bg-white p-6 rounded-lg max-w-md w-full max-h-full overflow-auto shadow-xl"
                onClick={e => e.stopPropagation()}
            >
                <button
                    className="absolute top-3 right-3 text-2xl leading-none hover:text-gray-600"
                    onClick={onClose}
                    aria-label="Cerrar modal"
                >
                <ReturnIcon className="w-6 h-6" />
                </button>
                {children}
            </div>
        </div>,
        document.getElementById('modal-root')
    );
}
