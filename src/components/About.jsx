import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../config/supabaseClient";

function About() {
  const defaultAbout = {
    name: "Liann Gonzales",
    profile_image: "", // Fallback empty
    title: "IT professional and digital creative",
    location: "Bulacan, Philippines",
    paragraph1: "Hi, I'm <strong>Liann Gonzales</strong>...",
    paragraph2: "As an <strong>Information Technology student</strong>...",
    paragraph3: "Outside academics...",
    paragraph4: "I'm constantly learning...",
  };

  const [about, setAbout] = useState(defaultAbout);

  useEffect(() => {
    let mounted = true;
    const fetchAbout = async () => {
      try {
        const { data, error } = await supabase
          .from("about")
          .select("*") // Selecting * ensures we get profile_image and any other new columns
          .eq("id", 1)
          .single();
        
        if (error) throw error;
        if (mounted && data) setAbout(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchAbout();
    return () => { mounted = false; };
  }, []);

  return (
    <motion.section
      id="about"
      className="py-20 bg-base-100 dark:bg-gray-950 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Main Title - Mobile: Center, Desktop: Left */}
        <div className="text-center md:text-left mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#3246ea] to-blue-400">
            About Me
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">{about.title} • {about.location}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
          
          {/* LEFT COLUMN: Profile Image */}
          <motion.div 
            className="w-64 h-64 md:w-80 md:h-96 flex-shrink-0 relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Decorative background box */}
            <div className="absolute inset-0 bg-[#3246ea] rounded-2xl rotate-6 -z-10 opacity-20"></div>
            
            {about.profile_image ? (
              <img 
                src={about.profile_image} 
                alt={about.name} 
                className="w-full h-full object-cover rounded-2xl shadow-2xl border-2 border-white/10"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 rounded-2xl flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </motion.div>

          {/* RIGHT COLUMN: Text Paragraphs */}
          <motion.div 
            className="flex-1 space-y-6 text-center md:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: about.paragraph1 }} />
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: about.paragraph2 }} />
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: about.paragraph3 }} />
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: about.paragraph4 }} />
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
}

export default About;