import React from 'react';
import './footer.css';
import { FaFacebook, FaTiktok, FaInstagram, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="footer-wrapper">
            {/* Top Section: CTA Banner */}
            <div className="footer-cta">
                <div className="cta-content">
                    <div className="cta-left">
                        <h2 className="cta-main-title">
                            Book <span className="script-text">Polomolok's</span>
                        </h2>
                        <p className="cta-tagline">Finest Nails Today!</p>
                    </div>
                    <div className="cta-right">
                        <p>Unsure which service to book? Reach out to us—we're happy to help you choose and reserve your spot.</p>
                        <button className="cta-button">Book an appointment</button>
                    </div>
                </div>
            </div>

            {/* Middle Section: Links & Info */}
            <div className="footer-main">
                <div className="footer-grid">
                    {/* Column 1: Brand */}
                    <div className="footer-column brand-info">
                        <div className="footer-brand-header">
                            <h2 className="footer-brand-name">GET NAILED</h2>
                            <p className="footer-brand-sub">by Trixie</p>
                        </div>
                        <button className="about-btn">About us</button>
                    </div>

                    {/* Column 2: Navigation */}
                    <div className="footer-column nav-col">
                        <ul className="footer-links">
                            <li><a href="#home">Home</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#schedule">Schedule</a></li>
                        </ul>
                    </div>


                    {/* Column 3: Contact */}
                    <div className="footer-column contact-info">
                        <div className="contact-row">
                            <span className="contact-icon"><FaPhoneAlt /></span>
                            <span className="contact-text">+ 63 908 789 3392</span>
                        </div>
                        <div className="contact-row">
                            <span className="contact-icon"><FaMapMarkerAlt /></span>
                            <span className="contact-text">
                                SK University, Barangay Magsaysay, Polomolok, South Cotabato
                            </span>
                        </div>
                    </div>

                    {/* Column 4: Socials */}
                    <div className="footer-column social-links">
                        <h3 className='follow-title'>Follow us</h3>
                        <div className="icon-group">
                            <a href="#" target="_blank"><FaFacebook /></a>
                            <a href="#" target="_blank"><FaTiktok /></a>
                            <a href="#" target="_blank"><FaInstagram /></a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Copyright */}
            <div className="footer-bottom">
                <p>Copyright © 2026 Get Nailed By Trixie</p>
            </div>
        </footer>
    );
};

export default Footer;