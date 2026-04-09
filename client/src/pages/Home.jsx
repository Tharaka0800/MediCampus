import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import WowSection from '../components/WowSection';
import HowItWorks from '../components/HowItWorks';
import Roles from '../components/Roles';
import EmergencyEvents from '../components/EmergencyEvents';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 dark:bg-gray-900 text-white">
      <main className="pt-28"> {/* add extra top padding for fixed navbar */}
        <Hero />
        <Features />
        <WowSection />
        <HowItWorks />
        <Roles />
        <EmergencyEvents />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;