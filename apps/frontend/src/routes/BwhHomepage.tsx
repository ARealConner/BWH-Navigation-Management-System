import React, { useEffect, useState } from 'react';
import LoginButtonAdmin from "../components/LoginButtonAdmin.tsx";
import LoginButtonPatient from "../components/LoginButtonPatient.tsx";
import { Link } from 'react-router-dom';
import '../index.css'; // Import the CSS file

const BwhHomepage: React.FC = () => {
    const [fadeIn, setFadeIn] = useState<boolean>(false);
    const [isHovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    useEffect(() => {
        // Trigger the fade-in effect after a short delay
        const timeoutId = setTimeout(() => {
            setFadeIn(true);
        }, 500);

        // Clear the timeout to avoid triggering the effect multiple times
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div className="bg-black h-screen flex items-center justify-center relative">
            {/* First half of the image */}
            <img
                className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
                style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
                src="../public/images/LineArt_Hospital.png"
                alt="Background"
            />
            {/* Second half of the image */}
            <img
                className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
                style={{ clipPath: "polygon(100% 0%, 0% 0%, 100% 100%, 100% 100%)" }}
                src="../public/images/BWH_Hospital_Image.png"
                alt="Background"
            />


            <div className="flex flex-col items-center justify-center h-full text-center text-white">
                <h3 className="font-roboto font-extrabold"
                    style={{fontSize: 20,
                    letterSpacing: '30px'}}>
                    WELCOME TO
                </h3>

                <h1
                    className={`text-lime-200 font-extrabold typing-animation italic ${
                        fadeIn ? 'opacity-100' : 'opacity-0'
                    } duration-200 ease-in-out`}
                    style={{fontSize: 80}}
                >
                    BRIGHAM & WOMEN'S HOSPITAL
                </h1>
                <div>
                    <LoginButtonAdmin/>
                </div>
                <div>
                    <LoginButtonPatient/>
                    <div className="LoginButtonGuest">
                        <Link
                            to="/NodeData"
                            style={{
                                textDecoration: 'none',
                                color: isHovered ? '#d9f99d' : 'white',
                                fontSize: '20px',
                                transition: 'color 0.5s ease',
                            }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            CONTINUE AS GUEST
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BwhHomepage;
