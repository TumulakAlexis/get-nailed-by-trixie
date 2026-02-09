import React from 'react';
import './section3.css';
import { motion } from 'framer-motion';

const Section3 = () => {
  const services = [
    {
      title: "Soft gel Extension (With plain Gel Polish)",
      description: "Soft Gel Extensions with a flawless plain gel polish finish for long-lasting, elegant nails.",
      price: "799",
      img: "https://images.unsplash.com/photo-1604654894610-df490982580e?q=80&w=500"
    },
    {
      title: "Gel Polish",
      description: "Classic gel polish with a durable, high-shine finish available in a wide variety of seasonal colors.",
      price: "399",
      img: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=500"
    },
    {
      title: "Soft gel Extension (With Gel Polish)",
      description: "Our signature service combining extensions with premium gel polish for a durable high-shine finish.",
      price: "899",
      img: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <section className="section3-container" id="services">
      <motion.h2 
        className="services-title"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        Services
      </motion.h2>
      
      <motion.div 
        className="services-list"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        {services.map((service, index) => (
          <motion.div 
            className="service-card" 
            key={index}
            variants={cardVariants}
            // Added Hover and Tap interactions
            whileHover={{ 
              y: -10, 
              scale: 1.02,
              transition: { duration: 0.3 } 
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="service-image">
              <img src={service.img} alt={service.title} />
            </div>
            <div className="service-info">
              <h3>{service.title}</h3>
              <p className="service-desc">{service.description}</p>
              <p className="service-price">Prices starts at php {service.price}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Section3;