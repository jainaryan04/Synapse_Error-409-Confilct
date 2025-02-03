import React from 'react';
import { motion } from 'framer-motion';
import ImageFilledText from './ImageFilledText';
import '../../src/index.css';

const characters = Array.from("BATTLEFIELD MONITORING");
const bebasNeue = { className: 'font-bebas' };

const Landing = () => {
  const imageCount = 5;
  const images = Array.from({ length: imageCount });

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Background Image Container */}
      <div className="absolute top-0 left-0 w-full h-full">
        <img
          src="/landing-bg.gif"
          alt="Background"
          className="h-full w-full object-cover opacity-80"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Section - 15vh */}
        <div className="h-[15vh] relative">
          {/* <div className="w-full flex justify-between">
            {images.map((_, index) => (
              <img
                key={index}
                src="/text-bg.jpg"
                alt="Banner"
                className="w-[20vw] h-[20vh] object-cover opacity-95"
              />
            ))}
          </div> */}

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex whitespace-nowrap">
              {characters.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 20,
                    delay: index * 0.2,
                  }}
                  className="text-[7vh] lg:text-[10vh] origin-center font-anton"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.4,
                      transition: { type: 'spring', stiffness: 300, damping: 20 },
                    }}
                    className="whitespace-nowrap"
                  >
                    <ImageFilledText
                      text={char === ' ' ? '\u00A0' : char}
                    />
                  </motion.div>
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - 85vh */}
        <div className="h-[85vh] relative">
          <div className="absolute inset-0 z-0">
            <img
              src="/landing-bg.gif"
              alt="Banner"
              className="h-full w-full object-cover opacity-95"
            />
          </div>
          <img
            src="soldier-bg.gif"
            className="absolute bottom-0 left-0 object-cover m-0 p-0 z-10"
            alt="Soldier 1"
          />
          <img
            src="soldier-bg.gif"
            className="absolute bottom-0 right-0 object-cover m-0 p-0 scale-x-[-1] z-10"
            alt="Soldier 2"
          />
          {/* Uncomment to add drone image */}
          {/* <img
            src="drone.gif"
            className="absolute object-cover p-0 animate-moveAndFlip z-20"
            alt="Drone"
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Landing;
