import React, { useState } from "react";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";
import LiannFront from "../assets/LiannFront.png";
import LiannBack from "../assets/LiannBack.png";
import resume from "../assets/LiannGonzalesResume.pdf";
import BibleVerse from "../api/BibleVerse";   // Corrected path
import CircularText from "../ui/CircularText"; // Corrected path

function Home() {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  return (
    <motion.section
      id="home"
      // UPDATED: Background is now dark:bg-gray-950
      className="pt-24 sm:pt-28 pb-16 bg-white dark:bg-gray-950 relative flex items-center justify-center min-h-screen transition-colors duration-300"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >

      <div className="relative z-20 max-w-6xl mx-auto px-6 grid md:grid-cols-2 items-center justify-center gap-8">
        {/* Left Section - Image with CircularText Overlay */}
        <div className="flex justify-center md:justify-end">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            viewport={{ once: true }}
          >
            <motion.div
              onClick={handleFlip}
              className="w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 cursor-pointer relative"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Front Side */}
              <div
                className="absolute w-full h-full rounded-2xl overflow-hidden flex justify-center items-center"
                style={{ backfaceVisibility: "hidden" }}
              >
                <img
                  src={LiannFront}
                  alt="Liann Gonzales Front"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              {/* Back Side */}
              <div
                className="absolute w-full h-full rounded-2xl overflow-hidden flex justify-center items-center"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <img
                  src={LiannBack}
                  alt="Liann Gonzales Back"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </motion.div>

            {/* CircularText Overlay - Lower Left Corner */}
            <motion.div 
              className="absolute bottom-0 left-0 pointer-events-none z-10"
              initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative -ml-16 sm:-ml-20 md:-ml-24 -mb-8 sm:-mb-10 md:-mb-12">
                <CircularText
                  text="Information*Technology*"
                  onHover="speedUp"
                  spinDuration={20}
                  className="custom-class"
                />
                {/* Glow effect around circular text */}
                <div className="absolute inset-0 rounded-full blur-xl bg-blue-500/20 opacity-50 -z-10"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-center text-center md:text-left">
          <motion.h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Liann Gonzales
          </motion.h1>

          <motion.div className="text-xl sm:text-2xl mt-3 font-semibold text-blue-400">
            <ReactTyped
              strings={[
                "I am an IT Student 💻",
                "I am a Graphic Designer 🎨",
                "I am a Front-End Developer 🖥️",
                "I am a Digital Artist ✏️",
                "I am a Gymnastics Coach 🤸‍♀️",
                "I am a UI/UX Designer 📱",
              ]}
              typeSpeed={60}
              backSpeed={40}
              backDelay={1500}
              loop
            />
          </motion.div>

          <div className="mt-4">
            <BibleVerse />
          </div>

          <motion.div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
            <a
              href={resume}
              download="LiannGonzalesResume.pdf"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#3246ea] to-blue-500 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              📄 Download Resume
            </a>

            <a
              href="#contact"
              className="inline-flex items-center px-6 py-3 rounded-xl border border-gray-300 dark:border-white/10 text-gray-900 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transform hover:-translate-y-1 transition-all duration-300"
            >
              ✉️ Contact Me
            </a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default Home;