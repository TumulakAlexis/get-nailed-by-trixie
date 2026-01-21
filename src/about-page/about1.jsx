import React from 'react';
import './about1.css';
import BrandLogo from '../assets/getnailedlogo.png';

const About1 = () => {
  return (
    <section className="about-container" id="about">
      <div className="about-header-text">
        <h2>About Us</h2>
      </div>
      
      <div className="about-content">
        <div className="about-branding">
          <img src={BrandLogo} alt="Get Nailed Branding" className="about-main-logo" />
        </div>

        <div className="about-description">
          <p>
            Get Nailed by Trixie is a luxury nail studio dedicated to 
            delivering expertly crafted nail art and premium nail 
            care. We specialize in elegant, modern, and customized 
            designs, combining high-quality products with 
            meticulous attention to detail.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About1;