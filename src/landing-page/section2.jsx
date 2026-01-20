import React, { useState, useEffect, useRef } from 'react';
import './section2.css';
import Logo from '../assets/getnailedlogo.png';

const Section2 = () => {
  const scrollRef = useRef(null);
  const images = [
    "https://images.unsplash.com/photo-1604654894610-df490982580e?q=80&w=1000",
    "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1000",
    "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=1000",
    "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=1000",
    "https://images.unsplash.com/photo-1600057405106-a64939b4b008?q=80&w=1000"
  ];

  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, offsetWidth, scrollWidth } = scrollRef.current;
        
        // If we are at the end, jump back to start, otherwise scroll right by one item width
        if (scrollLeft + offsetWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: offsetWidth / 3, behavior: 'smooth' });
        }
      }
    }, 3000); // Scrolls every 3 seconds

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <section className="section2-container">
      <div className="section2-header">
        <div className="s2-branding">
          <img src={Logo} alt="Get Nailed Logo" className="s2-logo" />
        </div>
        
        <div className="s2-description">
          <p>
            Get Nailed by Trixie is a luxury nail studio dedicated to delivering 
            expertly crafted nail art and premium nail care. We specialize in 
            elegant, modern, and customized designs, combining high-quality 
            products with meticulous attention to detail.
          </p>
        </div>
      </div>

      <div className="carousel-wrapper">
        <div className="carousel-track" ref={scrollRef}>
          {images.map((url, index) => (
            <div className="carousel-item" key={index}>
              <img src={url} alt={`Nail Art ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section2;