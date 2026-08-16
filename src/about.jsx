import React from 'react';
import About1 from './about-page/about1';
import About2 from './about-page/about2';
import About3 from './about-page/about3';
import About4 from './about-page/about4';

const About = () => {
  return (
    <div className="about-page-wrapper">
      <About1 />
      <About2 />
      <About3 />\
      <About4 />
      {/* You can add future about sections here like <About3 /> */}
    </div>
  );
};

export default About;