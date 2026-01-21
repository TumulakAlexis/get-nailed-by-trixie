import React from 'react';
import Header from './components/header.jsx';
import Section1 from './landing-page/section1.jsx';
import Section2 from './landing-page/section2.jsx';
import Section3 from './landing-page/section3.jsx';
import Footer from './components/footer.jsx';

const Landing = () => {
  return (
    <div style={{ }}>
      <Header />
      <main>
        <Section1 />
        <Section2 />
        <Section3 />
      </main>
    </div>
  );
};

export default Landing;