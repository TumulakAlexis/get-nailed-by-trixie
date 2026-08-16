import React from 'react';
import './about3.css';
import NailTechPhoto from '../assets/about/ceo.jpg'; // Replace with Trixie's actual photo when ready
import { motion } from 'framer-motion';

const About3 = () => {
  const contentFadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="about3-container" id="meet-the-tech">
      <motion.div 
        className="about3-content-wrapper"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={contentFadeUp}
      >
        <span className="about3-subtitle">The Artist Behind The Studio</span>
        <h2>Meet Your Nail Tech</h2>

        <div className="about3-card">
          <div className="about3-image-frame">
            <img src={NailTechPhoto} alt="Trixie - Lead Nail Artist" className="about3-tech-img" />
          </div>
          
          <div className="about3-text-content">
            <p className="about3-lead">
              Hi, I’m Trixie! Creator and lead nail artist behind Get Nailed by Trixie.
            </p>
            <p>
              My journey in nail artistry started from a deep appreciation for refined aesthetics and intricate design. Every client who sits at my desk receives personalized attention, careful nail health maintenance, and custom art tailored to their unique style. I take pride in making every session feel like a relaxing, luxurious escape where you leave feeling confident and beautiful.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About3;