import React from 'react';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import AboutSection from '../components/AboutSection';
import FeaturedTemples from '../components/FeaturedTemples';
import MapSection from '../components/MapSection';
import HowHelps from '../components/HowHelps';
import QuoteBanner from '../components/QuoteBanner';
import ContactSection from '../components/ContactSection';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <FeaturedTemples />
      <MapSection />
      <HowHelps />
      <QuoteBanner />
      <ContactSection />
    </div>
  );
};

export default Home;
