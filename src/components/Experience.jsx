import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../config/supabaseClient";

export default function Experience() {
  const defaultExperiences = [
    {
      id: 1,
      role: "Freelance Graphic Designer",
      period: "2021 – 2022",
      description: "Worked on logo design, branding, and illustration projects for various clients, focusing on visually appealing and impactful designs.",
      is_currently: false
    },
    {
      id: 2,
      role: "Gymnastics Coach",
      period: "2020 – Present",
      description: "Coaching young gymnasts in skills development, discipline, and performance, contributing to recreational and competitive training programs.",
      is_currently: true
    },
    {
      id: 3,
      role: "Technical Director",
      period: "2022 – Present",
      description: "Managing technical aspects of gymnastics competitions, including scoring systems, event coordination, and smooth execution of events.",
      is_currently: true
    },
  ];

  const [experiences, setExperiences] = useState(defaultExperiences);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchExperiences = async () => {
      try {
        const { data, error } = await supabase
          .from("experiences")
          .select("*")
          .order("id", { ascending: true }); // Keep chronological order

        if (error) throw error;
        
        if (mounted && data && data.length > 0) {
          setExperiences(data);
        }
      } catch (err) {
        console.error("Error fetching experiences:", err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchExperiences();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="experience" className="bg-white dark:bg-gray-950 py-20 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto relative">
        <motion.h2
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#3246ea] text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Experience
        </motion.h2>

        <div className="relative">
          {/* Vertical Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 dark:bg-gray-800" />
          
          <div className="space-y-12">
            {loading ? (
              <p className="text-center text-gray-500">Loading experiences…</p>
            ) : (
              experiences.map((exp, index) => {
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={exp.id || index}
                    className={`relative flex items-center md:justify-between ${
                      isEven ? "flex-row-reverse" : ""
                    }`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    
                    <div className="hidden md:block w-5/12" />

                    {/* Center Dot */}
                    <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-gray-950 bg-[#3246ea] z-10 shadow-md">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>

                    {/* Card Content */}
                    <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                        
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {exp.role}
                        </h3>
                        
                        <span className="inline-block text-sm font-semibold text-[#3246ea] bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full mb-3">
                          {exp.period}
                        </span>
                        
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                          {exp.description}
                        </p>
                        
                        {/* Check for is_currently OR isCurrently to be safe */}
                        {(exp.is_currently || exp.isCurrently) && (
                          <div className={`mt-3 flex items-center gap-2 ${isEven ? "md:justify-end" : ""}`}>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                              Active
                            </span>
                          </div>
                        )}

                      </div>
                    </div>

                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}