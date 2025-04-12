import React, { useState, useEffect } from 'react';
import '../styles/HeroCarousel.css';
import bike from '../assets/bike.jpg';
import BikeFrontImage from '../assets/BikeFrontImage.jpg';
import carFrontImage from '../assets/carFrontImage.jpg';
import electriccarcharging from '../assets/electriccarcharging.jpg';
import logo from '../assets/logo.png';
import oilchange from '../assets/oilchange.jpg';
import redcar from '../assets/redcar.jpg';
import electricFrontImage from '../assets/electricFrontImage.jpg';
import shop1 from '../assets/shop1.jpg';
import shop2 from '../assets/shop2.jpg';
import shop3 from '../assets/shop3.jpg';


const HeroCarousel = () => {
  const slides = [
    {
      image: carFrontImage,
      caption: 'Expert Car Repair Services',
    },
    {
      image: BikeFrontImage,
      caption: 'Top-Notch Bike Maintenance',
    },
    {
      image: electricFrontImage,
      caption: 'Find Nearby Gas Stations',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  useEffect(() => {
    if (!isAutoScroll) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoScroll, slides.length]);

  const goToPrevious = () => {
    setIsAutoScroll(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setIsAutoScroll(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsAutoScroll(true);
      }}
    >
      <div className="hero-slide">
        <img
          src={slides[currentIndex].image}
          alt={`Slide ${currentIndex + 1}`}
          className="hero-image"
        />
        <div className="hero-caption">
          <h2>{slides[currentIndex].caption}</h2>
        </div>
      </div>
      {isHovered && (
        <>
          <button className="arrow left-arrow" onClick={goToPrevious}>
            ❮
          </button>
          <button className="arrow right-arrow" onClick={goToNext}>
            ❯
          </button>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;