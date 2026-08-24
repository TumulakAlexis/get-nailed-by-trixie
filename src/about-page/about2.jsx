import React, { useState } from 'react';
import './about2.css';
import { motion, AnimatePresence } from 'framer-motion';

// Import your milestone images (update paths as needed)
import Pic2023 from '../assets/about/2023.jpg';
import Pic2024 from '../assets/about/2024.jpg';
import Pic2025 from '../assets/about/2025.jpg';

const About2 = () => {
  // Define milestones for 2023, 2024, and 2025
  const milestones = [
    {
      year: "2022",
      title: "The Passion Project",
      img: Pic2023,
      desc: "Where Get Nailed by Trixie first began as a dedicated creative outlet and independent home studio space."
    },
    {
      year: "2024",
      title: "First Dedicated Studio",
      img: Pic2024,
      desc: "Expanding our craft and opening our first official location to welcome our growing community of regular clients."
    },
    {
      year: "2025",
      title: "The Modern Luxury Space",
      img: Pic2025,
      desc: "A fully established, refined studio experience centered on meticulous craftsmanship and high-end self-care."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const textFadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const imageFadeIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="about2-container" id="our-story">
      <div className="about2-content-wrapper">
        
        {/* Left Side: Interactive Large Display & Thumbnail Strip */}
        <motion.div 
          className="about2-image-side"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={textFadeUp}
        >
          <div className="about2-interactive-showcase">
            
            {/* Large Active Image View */}
            <div className="about2-main-image-frame">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeIndex}
                  src={milestones[activeIndex].img} 
                  alt={milestones[activeIndex].title} 
                  className="about2-active-story-img"
                  variants={imageFadeIn}
                  initial="hidden"
                  animate="visible"
                />
              </AnimatePresence>
              <div className="about2-active-badge">
                <span className="badge-year">{milestones[activeIndex].year}</span>
                <span className="badge-title">{milestones[activeIndex].title}</span>
              </div>
            </div>

            {/* Thumbnail Navigation Strip (3 Columns now) */}
            <div className="about2-thumbnail-strip three-items">
              {milestones.map((item, index) => (
                <button
                  key={index}
                  className={`about2-thumb-btn ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View ${item.year} milestone`}
                >
                  <img src={item.img} alt={item.year} />
                  <span className="thumb-year-label">{item.year}</span>
                </button>
              ))}
            </div>

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
          <h2>Our Story (2022 – 2025)</h2>
          <p className="about2-lead">
            Since November 2022, what started as a simple setup has slowly grown through nail sessions, repeat clients, and fully-booked month. With the continuous support of our clients, we have been able to invest in better-quality tools, products, and equipment to provide improved and more professional nail services.
          </p>
          <p>
            Every milestone, big or small, has been part of our journey. From learning and improving our skills to creating new and beautiful nail designs, Get Nailed by Trixie continues to grow while staying true to its goal of giving every client a quality and enjoyable nail experience.
            
            We are grateful to everyone who has supported us since day one. Your trust and support inspire us to keep learning, creating, and growing. 
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default About2;