import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Landing from './landing';
import About from './about';
import Schedule from './schedule-page/schedule';
import PromoModal from './components/promomodal'; // 1. Import your promo modal (adjust path if needed)

const LandingPage = () => (
  <>
    <Landing />
  </>
);

function App() {
  return (
    <Router>
      <div className="App">
        {/* 2. Place it here globally so it fires on site load */}
        <PromoModal />

        <Header />
        
        <main>
          <Routes>
            {/* The main landing page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* The multi-section About page */}
            <Route path="/about" element={<About />} />
            
            {/* Booking page */}
            <Route path="/book" element={<Schedule />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;