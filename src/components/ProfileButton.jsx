import React, { useState } from 'react';
import ModalBlur from './ModalBlur';
import ProfileCard from '../pages/ProfileCard';
import ProfileLogo from '../assets/ProfileLogo';

export default function ProfileButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                className=""
                onClick={() => setOpen(true)}
            >
                <ProfileLogo className="size-10 text-gray-600 hover:text-blue-500 transform transition-transform duration-200 ease-in-out hover:scale-110" />
            </button>



            <ModalBlur isOpen={open} onClose={() => setOpen(false)}>
                <ProfileCard />
            </ModalBlur>
        </>
    );
}
