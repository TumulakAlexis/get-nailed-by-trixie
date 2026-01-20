import React from 'react';
import './section1.css';

export default function Section1() {
    return (
        <section className="hero-container">
            <div className="hero-image-side">
                <img
                    src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1000&auto=format&fit=crop"
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
                    <button className="btn-services">Services</button>
                </div>
            </div>
        </section>
    );
}