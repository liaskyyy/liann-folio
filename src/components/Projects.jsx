import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";

// Local Assets Imports
import orgShirt from "../assets/REVISED ORG POLO SHIRT.png";
import cherryTomato from "../assets/CHERRY TOMATO LOGO w TEXT-03.png";
import frog from "../assets/pepeTheFrog.png";
import tmc from "../assets/tmc-logo.jpg";
import logofolio from "../assets/logofolio.png";
import logofolioPdf from "../assets/logofolio.pdf";

export default function Projects() {
  const [tab, setTab] = useState("it");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Defaults (Same as Manager)
  const defaultProjects = [
    {
      id: "temp-1",
      title: "Cherry Tomato App (Pomodoro)",
      description: "Created the UI design for our capstone project — a Pomodoro timer app with task management and progress tracking features.",
      link: "https://www.figma.com/design/SUhaT4WfdsFubPVW3eOMw9/Cherry-Tomato?node-id=0-1&t=rLvc2qtTrgeSSMsW-1",
      image_url: "cherryTomato", 
      category: "it"
    },
    {
      id: "temp-2",
      title: "Pepe the Frog Mini Game",
      description: "Developed a fun mini game using Godot, featuring Pepe the Frog as the main character. Focused on simple mechanics, smooth controls, and engaging gameplay.",
      link: "https://github.com/liaskyyy/pepethefroggame.git",
      image_url: "frog",
      category: "it"
    },
    {
      id: "temp-3",
      title: "The Making of a Champion",
      description: "Developed a responsive website for a gymnastics academy, featuring programs, coaches, and events with user-friendly navigation.",
      link: "https://tmc-gymnastics-beryl.vercel.app/",
      image_url: "tmc",
      category: "it"
    },
    {
      id: "temp-4",
      title: "JPSSITE ORG SHIRT",
      description: "Designed the official organization shirt for JPSSITE, combining creativity and branding. Recognized as the winning design.",
      link: orgShirt, // Use imported file for default link
      image_url: "orgShirt",
      category: "design",
      isDownload: true
    },
    {
      id: "temp-5",
      title: "Logofolio",
      description: "30-day logo challenge by Logocore. Created unique logos daily, exploring various styles and concepts to enhance my design skills.",
      link: logofolioPdf,
      image_url: "logofolio",
      category: "design",
      isDownload: true
    },
  ];

  useEffect(() => {
    fetchProjects();
    
    // Hash handling
    const applyFromHash = () => {
      if (window.location.hash === "#projects-design") setTab("design");
      if (window.location.hash === "#projects-it") setTab("it");
    };
    applyFromHash();
    window.addEventListener("hashchange", applyFromHash);
    return () => window.removeEventListener("hashchange", applyFromHash);
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setProjects(data);
      } else {
        setProjects(defaultProjects);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects(defaultProjects); // Fallback
    }
    setLoading(false);
  };

  // Helper to get image source (Local Import OR Remote URL)
  const getProjectImage = (imageString) => {
    const map = {
      "cherryTomato": cherryTomato,
      "frog": frog,
      "tmc": tmc,
      "orgShirt": orgShirt,
      "logofolio": logofolio
    };
    // Return mapped local image OR the raw string (if it's a URL)
    return map[imageString] || imageString;
  };

  // Filter projects based on active tab
  const filteredProjects = projects.filter(p => p.category === tab);

  return (
    <section id="projects" className="bg-white dark:bg-gray-950 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-sm font-medium text-[#3246ea]">Selected Work</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Projects I've Built
          </h2>

          {/* Tabs */}
          <div className="mt-6 inline-flex rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
            <button
              onClick={() => setTab("it")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                tab === "it"
                  ? "bg-[#3246ea] text-white"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              Information Technology
            </button>
            <button
              onClick={() => setTab("design")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                tab === "design"
                  ? "bg-[#3246ea] text-white"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              Graphic Design
            </button>
          </div>
        </div>

        <div className="mt-10">
          {loading ? (
             <div className="text-center text-gray-500">Loading projects...</div>
          ) : (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                    const isDownload = project.isDownload || false;
                    let link = project.link;
                    
                    // Special handling for default assets that are downloads
                    if (project.id === "temp-4") {
                        link = orgShirt;
                    } else if (project.id === "temp-5") {
                        link = logofolioPdf;
                    }
                    
                    return (
                        <Card 
                            key={project.id}
                            title={project.title}
                            description={project.description}
                            image={getProjectImage(project.image_url)}
                            link={link}
                            download={isDownload}
                        />
                    );
                })} 
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Card({ title, description, image, link, download }) {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden flex flex-col h-full border border-gray-100 dark:border-white/5">
      <figure className="w-full h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
      </figure>

      <div className="flex flex-col flex-grow p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="mt-3 flex-grow text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
          {description}
        </p>

        <div className="mt-6 flex justify-end">
          {link && link !== "#" ? (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              download={download ? download : undefined}
              className="px-5 py-2 bg-[#3246ea] text-white rounded-full font-medium hover:bg-[#2536b3] transition-colors duration-300 text-sm"
            >
              View Project
            </a>
          ) : (
            <button
              disabled
              className="px-5 py-2 bg-gray-300 dark:bg-gray-800 text-gray-500 rounded-full font-medium cursor-not-allowed text-sm"
            >
              Coming Soon
            </button>
          )}
        </div>
      </div>
    </div>
  );
}