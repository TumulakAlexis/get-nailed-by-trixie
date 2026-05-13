import React from 'react';
import './section3.css';
import { motion } from 'framer-motion';
// 1. Import Convex hooks and API
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const Section3 = () => {
  // 2. Fetch services from your database
  const services = useQuery(api.services.getServices);

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
        {/* 3. Map through database data instead of static array */}
        {services ? (
          services.map((service) => (
            <motion.div 
              className="service-card" 
              key={service._id} // Using database ID as key
              variants={cardVariants}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                transition: { duration: 0.3 } 
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="service-image">
                <img 
                  src={service.imageUrl || "https://via.placeholder.com/500"} 
                  alt={service.name} 
                />
              </div>
              <div className="service-info">
                <h3>{service.name}</h3>
                <p className="service-desc">{service.description}</p>
                <p className="service-price">
                  Prices start at ₱{service.price.toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          /* 4. UPDATED: Loading Circle State */
          <div className="loading-container">
            <div className="loading-circle"></div>
            <p>Loading our premium services...</p>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default Section3;