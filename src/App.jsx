import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Landing from './landing';
import About1 from './about-page/about1';

// A "Landing" component to group your home sections
const LandingPage = () => (
  <>
    <Landing />
  </>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        
        <main>
          <Routes>
            {/* The main landing page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* The separate About page */}
            <Route path="/about" element={<About1 />} />
            
            {/* You can add more routes here, like /services or /booking */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;