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
              Hi, I’m Trixie! The owner and self-taught nail artist behind Get Nailed by Trixie.
            </p>
            <p>
              I started my nail business when I was in my 2nd year of college. What began as a simple hobby and something I enjoyed doing in my free time slowly grew into a true passion. Over time, I continued learning, practicing, and improving my skills to create beautiful, unique sets.
            </p>
            <p>
              For me, every session is more than just doing nails—it’s a chance to express creativity, showcase my skills, and put a little piece of my heart into every set. I love creating designs that make you feel confident, beautiful, and happy with your nails. Thank you for supporting my small business!
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About3;