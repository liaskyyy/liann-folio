import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import { Plus, Trash2, Edit2, RefreshCw, ExternalLink, Image as ImageIcon } from "lucide-react";

// 1. IMPORT LOCAL ASSETS (So we can see defaults)
import orgShirt from "../assets/REVISED ORG POLO SHIRT.png";
import cherryTomato from "../assets/CHERRY TOMATO LOGO w TEXT-03.png";
import frog from "../assets/pepeTheFrog.png";
import tmc from "../assets/tmc-logo.jpg";
import logofolio from "../assets/logofolio.png";

export default function ProjectsManager() {
  const defaultProjects = [
    {
      id: "temp-1",
      title: "Cherry Tomato App (Pomodoro)",
      description: "Created the UI design for our capstone project — a Pomodoro timer app.",
      link: "https://www.figma.com/design/SUhaT4WfdsFubPVW3eOMw9/Cherry-Tomato?node-id=0-1&t=rLvc2qtTrgeSSMsW-1",
      image_url: "cherryTomato", 
      category: "it"
    },
    {
      id: "temp-2",
      title: "Pepe the Frog Mini Game",
      description: "Developed a fun mini game using Godot, featuring Pepe the Frog as the main character.",
      link: "https://github.com/liaskyyy/pepethefroggame.git",
      image_url: "frog",
      category: "it"
    },
    {
      id: "temp-3",
      title: "TMC Website",
      description: "Developed a responsive website for a gymnastics academy.",
      link: "https://github.com/liaskyyy/tmc-website.git",
      image_url: "tmc",
      category: "it"
    },
    {
      id: "temp-4",
      title: "JPSSITE ORG SHIRT",
      description: "Designed the official organization shirt for JPSSITE.",
      link: "#", 
      image_url: "orgShirt",
      category: "design"
    },
    {
      id: "temp-5",
      title: "Logofolio",
      description: "30-day logo challenge by Logocore.",
      link: "#", 
      image_url: "logofolio",
      category: "design"
    },
  ];

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isUsingDefaults, setIsUsingDefaults] = useState(false);

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    link: "",
    image_url: "",
    category: "it",
  });

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
        setIsUsingDefaults(false);
      } else {
        setProjects(defaultProjects);
        setIsUsingDefaults(true);
      }
    } catch (error) {
      console.error("Error fetching projects:", error.message);
      setProjects(defaultProjects);
      setIsUsingDefaults(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 2. HELPER TO RESOLVE IMAGE SOURCE
  const getProjectImage = (imageString) => {
    const map = {
      "cherryTomato": cherryTomato,
      "frog": frog,
      "tmc": tmc,
      "orgShirt": orgShirt,
      "logofolio": logofolio
    };
    // Return the mapped local image OR the raw string (if it's a URL)
    return map[imageString] || imageString;
  };

  const handleSave = async () => {
    if (!newProject.title) {
      alert("Project title is required");
      return;
    }
    setLoading(true);
    try {
      if (isUsingDefaults && editingId && String(editingId).startsWith("temp-")) {
        const itemToSave = { ...newProject };
        delete itemToSave.id;

        const otherDefaults = projects
          .filter((p) => p.id !== editingId)
          .map((p) => ({
            title: p.title,
            description: p.description,
            link: p.link,
            image_url: p.image_url,
            category: p.category
          }));

        const allToInsert = [...otherDefaults, itemToSave];
        const { error } = await supabase.from("projects").insert(allToInsert);
        if (error) throw error;
      }
      else if (editingId && !String(editingId).startsWith("temp-")) {
        const { error } = await supabase
          .from("projects")
          .update(newProject)
          .eq("id", editingId);
        if (error) throw error;
      }
      else {
        const { error } = await supabase.from("projects").insert([newProject]);
        if (error) throw error;
      }

      setNewProject({ title: "", description: "", link: "", image_url: "", category: "it" });
      setEditingId(null);
      await fetchProjects();
      alert("Project saved successfully!");
    } catch (error) {
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (String(id).startsWith("temp-")) {
      alert("These are default items. Edit one to start your own database list.");
      return;
    }
    if (!window.confirm("Delete this project?")) return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      fetchProjects();
    } catch (error) {
      alert("Error deleting: " + error.message);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setNewProject({
      title: project.title,
      description: project.description,
      link: project.link,
      image_url: project.image_url,
      category: project.category,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewProject({ title: "", description: "", link: "", image_url: "", category: "it" });
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Manage Projects</h2>
        <button onClick={fetchProjects} className="bg-gray-700 p-2 rounded text-white hover:bg-gray-600">
            <RefreshCw size={18}/>
        </button>
      </div>

      {/* --- FORM --- */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
        <h3 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">
          {editingId ? "Edit Project" : "Add New Project"}
        </h3>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm text-gray-300 mb-1">Title</label>
                <input
                    type="text"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm text-gray-300 mb-1">Category</label>
                <select
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                >
                    <option value="it">Information Technology</option>
                    <option value="design">Graphic Design</option>
                </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white h-24 focus:border-blue-500 outline-none"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm text-gray-300 mb-1">Project Link (URL)</label>
                <input
                    type="text"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
                    value={newProject.link}
                    onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm text-gray-300 mb-1">Image Link (URL)</label>
                <input
                    type="text"
                    placeholder="https://..."
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
                    value={newProject.image_url}
                    onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-[#3246ea] hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Plus size={18} /> {editingId ? "Save Changes" : "Add Project"}
            </button>
            {editingId && (
              <button onClick={handleCancel} className="px-6 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-semibold">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- LIST --- */}
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => {
           const isTemp = String(project.id).startsWith("temp-");
           // Resolve the image source
           const imgSrc = getProjectImage(project.image_url);

           return (
            <div key={project.id} className={`p-4 rounded-lg border flex gap-4 ${isTemp ? 'border-dashed border-gray-600 bg-gray-800/50' : 'border-gray-700 bg-gray-800'}`}>
                
                {/* 3. SHOW THE IMAGE */}
                <div className="w-24 h-24 flex-shrink-0 bg-gray-700 rounded-lg overflow-hidden border border-gray-600">
                    {imgSrc ? (
                        <img src={imgSrc} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <ImageIcon size={24} />
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <h4 className="text-lg font-bold text-white line-clamp-1">{project.title}</h4>
                            {isTemp && <span className="text-[10px] bg-gray-600 text-white px-1.5 rounded uppercase h-5 flex items-center">Default</span>}
                        </div>
                        
                        <span className={`text-xs font-bold uppercase inline-block mt-1 px-2 py-0.5 rounded ${project.category === 'it' ? 'bg-blue-900/30 text-blue-300' : 'bg-purple-900/30 text-purple-300'}`}>
                            {project.category}
                        </span>

                        <p className="text-sm text-gray-400 mt-2 line-clamp-2">{project.description}</p>
                    </div>

                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700/50">
                        {project.link && (
                             <a href={project.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#3246ea] text-xs hover:underline mr-auto">
                                <ExternalLink size={12}/> View Link
                            </a>
                        )}
                        
                        <button onClick={() => handleEdit(project)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs flex items-center gap-1">
                            <Edit2 size={12} /> Edit
                        </button>
                        {!isTemp && (
                            <button onClick={() => handleDelete(project.id)} className="px-3 py-1 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white rounded text-xs">
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
           );
        })}
      </div>
    </div>
  );
}