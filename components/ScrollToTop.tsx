import React, { useState, useEffect } from 'react';
import MaterialIcon from './MaterialIcon';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled down past 300px
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 w-14 h-14 bg-brand-pink hover:bg-brand-pink-dark text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out z-40 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
                }`}
            aria-label="Scroll to top"
        >
            <MaterialIcon name="keyboard_arrow_up" className="text-3xl" />
        </button>
    );
};

export default ScrollToTop;
