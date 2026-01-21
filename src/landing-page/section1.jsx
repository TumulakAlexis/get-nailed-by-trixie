import './section1.css';
import Landing from '../assets/landing/landing.png'
import { HashLink } from 'react-router-hash-link/dist/react-router-hash-link.cjs.production';

export default function Section1() {
    return (
        <section className="hero-container">
            <div className="hero-image-side">
                <img
                    src= {Landing}
                    alt="Luxury Nail Art"
                    className="hero-img"
                />
            </div>

            <div className="hero-content-side">
                <div className="text-wrapper">
                    <p className="hero-subtitle">Your nail journey</p>
                    <h2 className="text-starts">Starts</h2>

                    <div className="brand-highlight">
                        <div className="with-polomolok-row">
                            <span className="text-with">with</span>
                            <h2 className="text-polomolok">Polomolok's</h2>
                        </div>
                        <span className="text-finest">Finest Nails!</span>
                    </div>

                    <p className="hero-quote">
                        “Where Luxury Meets <br /> Perfectly Crafted Nails.”
                    </p>
                    <HashLink smooth to="/#services">
                            <button className="btn-services">Services</button>
                        </HashLink>
                </div>
            </div>
        </section>
    );
}