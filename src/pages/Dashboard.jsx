import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient"; // Note the path change
import { useNavigate } from "react-router-dom";

// Import the pieces from the admin folder
import Sidebar from "../admin/Sidebar";
import AboutManager from "../admin/AboutManager";
import ContactManager from "../admin/ContactManager";
import ExperienceManager from "../admin/ExperienceManager";
import ProjectsManager from "../admin/ProjectsManager";
import TechStackManager from "../admin/TechStackManager";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");
  const [loading, setLoading] = useState(true);

  // Check Login Status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate("/login");
      setLoading(false);
    };
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) return <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-[#121212] text-gray-300 font-sans">
      {/* Sidebar Component */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {activeTab === "about" && <AboutManager />}
        {activeTab === "contact" && <ContactManager />}
        {activeTab === "experience" && <ExperienceManager />}
        {activeTab === "projects" && <ProjectsManager />}
        {activeTab === "techstack" && <TechStackManager />}
      </main>
    </div>
  );
}