import React, { useState, useEffect, useRef } from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // 1. If we are at the very top, always show it
            if (currentScrollY <= 50) {
                setIsVisible(true);
                return;
            }

            // 2. If scrolling DOWN, hide it
            if (currentScrollY > lastScrollY.current) {
                setIsVisible(false);
                setIsMenuOpen(false); // Close mobile menu if it was open
            }
            // 3. If scrolling UP, show it
            else {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`main-header ${isVisible ? 'header-visible' : 'header-hidden'}`}>
            <div className="logo-container">
                <h1 className="brand-name">GET NAILED</h1>
                <span className="brand-subtext">by Trixie</span>
            </div>

            <div className={`mobile-menu-btn ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <div className="mobile-menu-icon"></div>
            </div>

            <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <Link
                    to="/"
                    onClick={() => {
                        setIsMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    Home
                </Link>

                {/* Link to the Services section (requires hash-link for smooth scrolling across pages) */}
                <HashLink smooth to="/#services">Services</HashLink>

                {/* Link to your new About page path */}
                <Link to="/about" onClick={() => {
                    setIsMenuOpen(false)
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}>About</Link>

                {/* Link to your Booking page */}
                <Link
                    to="/book"
                    className="book-now-link"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Book Now
                </Link>
            </nav>
        </header>
    );
};

export default Header;