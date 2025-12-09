import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../config/supabaseClient";
import { Mail, Github } from "lucide-react";

const Contact = () => {
  // 1. Default Data
  const [contactInfo, setContactInfo] = useState({
    section_title: "Contact Me",
    section_description: "I’d love to hear from you! Whether it’s a question, collaboration, or just a hello — feel free to reach out.",
    email: "lianngonzales7@gmail.com",
    github_url: "https://github.com/liaskyyy",
    behance_url: "https://www.behance.net/lianngonza304c",
  });

  // 2. Fetch Data from Supabase
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const { data, error } = await supabase
          .from("contact")
          .select("*")
          .eq("id", 1)
          .single();

        if (data) {
          setContactInfo({
            section_title: data.section_title || contactInfo.section_title,
            section_description: data.section_description || contactInfo.section_description,
            email: data.email || contactInfo.email,
            github_url: data.github_url || contactInfo.github_url,
            behance_url: data.behance_url || contactInfo.behance_url,
          });
        }
      } catch (err) {
        console.error("Error fetching contact info:", err);
      }
    };

    fetchContact();
  }, []);

  // Helper to remove 'https://' for a cleaner look
  const formatUrl = (url) => {
    if (!url) return "";
    return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  };

  return (
    <section 
      id="contact" 
      // UPDATED: Changed dark:bg-[#0a0f1c] to dark:bg-black
      className="py-20 bg-gray-50 dark:bg-black text-gray-900 dark:text-white min-h-screen flex flex-col items-center justify-center transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto px-6 w-full">
        
        {/* --- Header Section --- */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">{contactInfo.section_title}</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            {contactInfo.section_description}
          </p>
        </motion.div>

        {/* --- Links Row (Email, GitHub, Behance) --- */}
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-16 text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {/* Email */}
          <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 hover:text-[#3246ea] dark:hover:text-white transition-colors font-medium">
            <Mail size={20} />
            <span>{contactInfo.email}</span>
          </a>

          {/* GitHub */}
          {contactInfo.github_url && (
            <a 
              href={contactInfo.github_url} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 hover:text-[#3246ea] dark:hover:text-white transition-colors font-medium"
            >
              <Github size={20} />
              <span>{formatUrl(contactInfo.github_url)}</span>
            </a>
          )}

          {/* Behance */}
          {contactInfo.behance_url && (
            <a 
              href={contactInfo.behance_url} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 hover:text-[#3246ea] dark:hover:text-white transition-colors font-medium"
            >
              <span className="font-bold text-lg">Bē</span>
              <span>{formatUrl(contactInfo.behance_url)}</span>
            </a>
          )}
        </motion.div>


        {/* --- Form Section --- */}
        <motion.div 
          className="w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-center text-[#3246ea] text-2xl font-semibold mb-6">
            Send Me a Message
          </h3>

          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-400 mb-1 text-sm font-medium">Name</label>
              <input 
                type="text" 
                className="w-full p-3 rounded-md border outline-none transition-all
                           bg-white dark:bg-[#1a1f2e] 
                           border-gray-300 dark:border-gray-700 
                           text-gray-900 dark:text-white 
                           focus:ring-2 focus:ring-[#3246ea] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-400 mb-1 text-sm font-medium">Email</label>
              <input 
                type="email" 
                className="w-full p-3 rounded-md border outline-none transition-all
                           bg-white dark:bg-[#1a1f2e] 
                           border-gray-300 dark:border-gray-700 
                           text-gray-900 dark:text-white 
                           focus:ring-2 focus:ring-[#3246ea] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-400 mb-1 text-sm font-medium">Subject</label>
              <input 
                type="text" 
                className="w-full p-3 rounded-md border outline-none transition-all
                           bg-white dark:bg-[#1a1f2e] 
                           border-gray-300 dark:border-gray-700 
                           text-gray-900 dark:text-white 
                           focus:ring-2 focus:ring-[#3246ea] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-400 mb-1 text-sm font-medium">Message</label>
              <textarea 
                className="w-full p-3 rounded-md border outline-none transition-all h-32 resize-none
                           bg-white dark:bg-[#1a1f2e] 
                           border-gray-300 dark:border-gray-700 
                           text-gray-900 dark:text-white 
                           focus:ring-2 focus:ring-[#3246ea] focus:border-transparent"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#3246ea] hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Send Message
            </button>
          </form>
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;