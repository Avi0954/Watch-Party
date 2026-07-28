import React from 'react';
import Logo from './Logo';
import HeroTitle from './HeroTitle';
import Description from './Description';
import Stats from './Stats';
import Features from './Features';

const Hero = () => {
  return (
    <div className="relative w-full max-w-[450px] lg:max-w-[480px] flex flex-col justify-between items-center lg:items-start gap-4 lg:gap-2 text-white py-1 select-none mx-auto lg:mr-auto transition-all duration-300 lg:-translate-y-6">
      <Logo />
      <HeroTitle />
      <Description />
      <Stats />
      <Features />
    </div>
  );
};

export default Hero;
