import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../config/supabaseClient";

function About() {
  const defaultAbout = {
    name: "Liann Gonzales",
    title: "IT professional and digital creative",
    location: "Bulacan, Philippines",
    paragraph1:
      "Hi, I'm <strong>Liann Gonzales</strong>, an aspiring <strong>IT professional </strong> and <strong>digital creative</strong> from <strong>Bulacan, Philippines</strong>. I'm passionate about technology, design, and continuous learning. My goal is to bridge creativity and functionality by crafting meaningful digital experiences that make everyday tasks simpler and more enjoyable.",
    paragraph2:
      "As an <strong>Information Technology student</strong>, I love exploring various fields such as <strong>UI/UX design</strong>, <strong>front-end web development</strong>, and <strong>software innovation</strong>. I enjoy turning ideas into real, interactive projects from designing clean, user-friendly interfaces to building systems that help people stay focused, organized, and productive.",
    paragraph3:
      "Outside academics, I express my creativity through <strong>graphic design</strong> and <strong> digital art</strong>. I've worked on logo designs, brand identities, and illustrations that reflect personality and purpose. My experience as a <strong> gymnastics coach</strong> and <strong>technical director</strong> has also strengthened my teamwork, leadership, and attention to detail qualities that I apply in both creative and technical work.",
    paragraph4:
      "I'm constantly learning, experimenting, and improving whether it's mastering new technologies, designing better user flows, or collaborating with others on innovative ideas. Ultimately, I aspire to become a <strong>versatile IT professional</strong> who blends technical knowledge with creative thinking to make a positive impact in the digital world.",
  };

  const [about, setAbout] = useState(defaultAbout);

  useEffect(() => {
    let mounted = true;
    const fetchAbout = async () => {
      try {
        const { data, error } = await supabase
          .from("about")
          .select("name, title, location, paragraph1, paragraph2, paragraph3, paragraph4")
          .eq("id", 1)
          .single();
        if (error) throw error;
        if (mounted && data) setAbout(data);
      } catch (err) {
        // fallback to default
      } finally {
        // cleanup
      }
    };
    fetchAbout();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <motion.section
      id="about"
      className="py-20 bg-base-100 dark:bg-gray-950"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#3246ea] to-blue-400">
          About Me
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: about.paragraph1 }} />
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: about.paragraph2 }} />
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: about.paragraph3 }} />
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: about.paragraph4 }} />
      </div>
    </motion.section>
  );
}

export default About;
