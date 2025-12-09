import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";
import { supabase } from "../config/supabaseClient"; // Import Supabase
import LiannFront from "../assets/LiannFront.png";
import LiannBack from "../assets/LiannBack.png";
import defaultResume from "../assets/LiannGonzalesResume.pdf"; // Renamed to default
import BibleVerse from "../api/BibleVerse";
import CircularText from "../ui/CircularText";

function Home() {
  const [flipped, setFlipped] = useState(false);
  
  // State for dynamic content
  const [homeData, setHomeData] = useState({
    name: "Liann Gonzales",
    circular_text: "Information*Technology*",
    resume_link: null,
    typed_strings: [
      "I am an IT Student 💻",
      "I am a Graphic Designer 🎨",
      "I am a Front-End Developer 🖥️",
      "I am a Digital Artist ✏️",
      "I am a Gymnastics Coach 🤸‍♀️",
      "I am a UI/UX Designer 📱",
    ]
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const { data, error } = await supabase
          .from("about")
          .select("name, circular_text, typed_strings, resume_link")
          .eq("id", 1)
          .single();

        if (data) {
          setHomeData(prev => ({
            ...prev,
            name: data.name || prev.name,
            circular_text: data.circular_text || prev.circular_text,
            resume_link: data.resume_link,
            // Only update typed_strings if the array has items
            typed_strings: (data.typed_strings && data.typed_strings.length > 0) 
              ? data.typed_strings 
              : prev.typed_strings
          }));
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };

    fetchHomeData();
  }, []);

  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  return (
    <motion.section
      id="home"
      className="pt-24 sm:pt-28 pb-16 bg-white dark:bg-black relative flex items-center justify-center min-h-screen"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="relative z-20 max-w-6xl mx-auto px-6 grid md:grid-cols-2 items-center justify-center gap-8">
        
        {/* Left Section - Image */}
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
                  alt="Liann Front"
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
                  alt="Liann Back"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </motion.div>

            {/* CircularText Overlay */}
            <motion.div 
              className="absolute bottom-0 left-0 pointer-events-none z-10"
              initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative -ml-16 sm:-ml-20 md:-ml-24 -mb-8 sm:-mb-10 md:-mb-12">
                <CircularText
                  text={homeData.circular_text} 
                  onHover="speedUp"
                  spinDuration={20}
                  className="custom-class"
                />
                <div className="absolute inset-0 rounded-full blur-xl bg-blue-500/20 opacity-50 -z-10"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-center text-center md:text-left">
          <motion.h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {homeData.name}
          </motion.h1>

          <motion.div className="text-xl sm:text-2xl mt-3 font-semibold text-blue-400">
            {/* Key forces re-render if strings change */}
            <ReactTyped
              key={homeData.typed_strings.join('')} 
              strings={homeData.typed_strings}
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
              href={homeData.resume_link || defaultResume}
              download={!homeData.resume_link ? "LiannGonzalesResume.pdf" : undefined}
              target={homeData.resume_link ? "_blank" : undefined}
              rel="noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#3246ea] to-blue-500 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              📄 {homeData.resume_link ? "View Resume" : "Download Resume"}
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