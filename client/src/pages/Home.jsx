import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import AboutSection from '../components/AboutSection';
import FeaturedTemples from '../components/FeaturedTemples';
import MapSection from '../components/MapSection';
import HowHelps from '../components/HowHelps';
import QuoteBanner from '../components/QuoteBanner';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <FeaturedTemples />
      <MapSection />
      <HowHelps />
      <QuoteBanner />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Home;
