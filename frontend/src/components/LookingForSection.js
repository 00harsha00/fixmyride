import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LookingForSection.css';

import bike from '../assets/bike.jpg';
import BikeFrontImage from '../assets/BikeFrontImage.jpg';
import carFrontImage from '../assets/carFrontImage.jpg';
import electriccarcharging from '../assets/electriccarcharging.jpg';
import logo from '../assets/logo.png';
import oilchange from '../assets/oilchange.jpg';
import redcar from '../assets/redcar.jpg';
import rollscar from '../assets/rollscar.jpg';
import shop1 from '../assets/shop1.jpg';
import shop2 from '../assets/shop2.jpg';
import shop3 from '../assets/shop3.jpg';

const LookingForSection = () => {
  const categories = [
    {
      title: 'Car',
      image: redcar,
      link: '/car',
    },
    {
      title: 'Bike',
      image: bike,
      link: '/bike',
    },
    {
      title: 'Electrical Gas Stations',
      image: electriccarcharging, // Assuming this is the image for gas stations
      link: '/gas',
    },
  ];

  return (
    <section className="looking-for-section">
      <h2>Looking For</h2>
      <div className="looking-for-grid">
        {categories.map((category, index) => (
          <Link to={category.link} key={index} className="looking-for-card-link">
            <div className="looking-for-card">
              <div className="looking-for-image-wrapper">
                <img
                  src={category.image}
                  alt={category.title}
                  className="looking-for-image"
                />
              </div>
              <h3>{category.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LookingForSection;