import React from 'react';
import './about1.css';
import BrandLogo from '../assets/getnailedlogo.png';
import { motion } from 'framer-motion';

const About1 = () => {
  // Animation Variants
  const textFadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const imageFadeIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } }
  };

  return (
    <section className="about-container" id="about">
      <motion.div 
        className="about-header-text"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        <h2>About Us</h2>
      </motion.div>
      
      <div className="about-content">
        <motion.div 
          className="about-branding"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={imageFadeIn}
        >
          <img src={BrandLogo} alt="Get Nailed Branding" className="about-main-logo" />
        </motion.div>

        <motion.div 
          className="about-description"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={textFadeUp}
        >
          <p>
            Get Nailed by Trixie is a home-based nail studio in Polomolok that offers quality manicure services. We specialize in stylish, elegant, and customized nail designs made to suit every client’s personality and preference. With attention to detail and quality products, we aim to provide a relaxing and comfortable nail experience from the comfort of our home studio
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About1;