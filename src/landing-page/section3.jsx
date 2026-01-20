import React from 'react';
import './section3.css';

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

  return (
    <section className="section3-container" id="services">
      <h2 className="services-title">Services</h2>
      
      <div className="services-list">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="service-image">
              <img src={service.img} alt={service.title} />
            </div>
            <div className="service-info">
              <h3>{service.title}</h3>
              <p className="service-desc">{service.description}</p>
              <p className="service-price">Prices starts at php {service.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Section3;