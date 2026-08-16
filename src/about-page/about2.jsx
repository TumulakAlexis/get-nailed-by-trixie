import React from 'react';
import './about2.css';
import StoryImage from '../assets/about/howitstarted.jpg'; // Replace with your studio/founder story image if available
import { motion } from 'framer-motion';

const About2 = () => {
  const textFadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const imageFadeIn = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } }
  };

  return (
    <section className="about2-container" id="our-story">
      <div className="about2-content-wrapper">
        
        {/* Left Side: Visual / Image */}
        <motion.div 
          className="about2-image-side"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={imageFadeIn}
        >
          <div className="about2-image-frame">
            <img src={StoryImage} alt="Get Nailed Story" className="about2-story-img" />
          </div>
        </motion.div>

        {/* Right Side: Story Text */}
        <motion.div 
          className="about2-text-side"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={textFadeUp}
        >
          <span className="about2-subtitle">How It All Started</span>
          <h2>Our Story</h2>
          <p className="about2-lead">
            Get Nailed by Trixie was born out of a genuine passion for self-expression, artistry, and the therapeutic experience of premium nail care.
          </p>
          <p>
            What started as a creative outlet grew into a dedicated luxury studio. We wanted to create a space where meticulous craftsmanship meets modern elegance—transforming routine nail appointments into a luxurious ritual of self-care and confidence. Every set we design reflects our commitment to quality, individuality, and detail.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default About2;