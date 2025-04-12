import React, { useRef } from 'react';
import '../styles/ServicesSection.css';
import bike from '../assets/bike.jpg';
import BikeFrontImage from '../assets/BikeFrontImage.jpg';
import carFrontImage from '../assets/carFrontImage.jpg';
import electriccarcharging from '../assets/electriccarcharging.jpg';
import logo from '../assets/logo.png';
import oilchange from '../assets/oilchange.jpg';
import findStations from '../assets/findStations.jpg';
import batteryReplacement from '../assets/batteryReplacement.jpg';
import engineDiagnosis from '../assets/engineDiagnosis.jpg';
import brakeAlignment from '../assets/brakeAlignment.jpg';
import wheelRotationnAlignment from '../assets/wheelRotationnAlignment.jpg';

const ServicesSection = () => {
  const services = [
    {
      title: 'Oil & Lubricant Change',
      image: oilchange, // Replace with the actual image path
    },
    {
      title: 'Tire Rotation & Alignment',
      image: wheelRotationnAlignment, // Replace with the actual image path
    },
    {
      title: 'Brake Inspection',
      image: brakeAlignment, // Replace with the actual image path
    },
    {
      title: 'Engine Diagnostics',
      image: engineDiagnosis, // Replace with the actual image path
    },
    {
      title: 'Battery Replacement',
      image: batteryReplacement, // Replace with the actual image path
    },
    {
      title: 'findStations',
      image: findStations, // Replace with the actual image path
    },
  ];

  const gridRef = useRef(null);

  const scrollLeft = () => {
    if (gridRef.current) {
      gridRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (gridRef.current) {
      gridRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="services-section">
      <h2>Explore Our Services</h2>
      <div className="services-grid" ref={gridRef}>
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="service-image-wrapper">
              <img
                src={service.image}
                alt={service.title}
                className="service-image"
              />
              <div className="image-overlay"></div>
            </div>
            <div className="service-content">
              <h3>{service.title}</h3>
            </div>
          </div>
        ))}
      </div>
      <button className="service-arrow service-arrow-left" onClick={scrollLeft}>
        ❮
      </button>
      <button className="service-arrow service-arrow-right" onClick={scrollRight}>
        ❯
      </button>
    </section>
  );
};

export default ServicesSection;