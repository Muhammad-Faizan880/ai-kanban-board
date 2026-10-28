import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustStats from '../components/TrustStats';
import Features from '../components/Features';
import AIAssistantSpotlight from '../components/AIAssistantSpotlight';
import HowItWorks from '../components/HowItWorks';
import ProductShowcase from '../components/ProductShowcase';
import Benefits from '../components/Benefits';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const Home = () => {
  useEffect(() => {
    // Smooth scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <TrustStats />
        <Features />
        <AIAssistantSpotlight />
        <HowItWorks />
        <ProductShowcase />
        <Benefits />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;