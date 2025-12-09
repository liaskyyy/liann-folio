import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import { Plus, Trash2, Edit2, RefreshCw, CheckCircle2 } from "lucide-react";

export default function ExperienceManager() {
  // 1. HERE ARE YOUR DEFAULTS (Including Gym Coach & Tech Director)
  const defaultExperiences = [
    {
      id: "temp-1",
      role: "Freelance Graphic Designer",
      period: "2021 – 2022",
      description: "Worked on logo design, branding, and illustration projects for various clients, focusing on visually appealing and impactful designs.",
      is_currently: false
    },
    {
      id: "temp-2",
      role: "Gymnastics Coach",
      period: "2020 – Present",
      description: "Coaching young gymnasts in skills development, discipline, and performance, contributing to recreational and competitive training programs.",
      is_currently: true
    },
    {
      id: "temp-3",
      role: "Technical Director",
      period: "2022 – Present",
      description: "Managing technical aspects of gymnastics competitions, including scoring systems, event coordination, and smooth execution of events.",
      is_currently: true
    },
  ];

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isUsingDefaults, setIsUsingDefaults] = useState(false); 
  
  const [newExp, setNewExp] = useState({
    role: "",
    period: "",
    description: "",
    is_currently: false, 
  });

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("id", { ascending: true });
        
      if (error) throw error;
      
      // If Database has data, show it. If empty, show defaults.
      if (data && data.length > 0) {
        setExperiences(data);
        setIsUsingDefaults(false);
      } else {
        setExperiences(defaultExperiences);
        setIsUsingDefaults(true); 
      }
    } catch (error) {
      console.error("Error fetching experiences:", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleSave = async () => {
    if (!newExp.role || !newExp.period || !newExp.description) {
      alert("Please fill in Role, Period, and Description.");
      return;
    }
    setLoading(true);
    try {
      // --- THE FIX: SAVING DEFAULT ITEMS ---
      // If we are editing a "Default" item for the first time, 
      // we must save ALL defaults to the DB so the others don't disappear.
      if (isUsingDefaults && editingId && String(editingId).startsWith("temp-")) {
        
        // 1. Get the item we are currently editing
        const itemToSave = { ...newExp }; 
        delete itemToSave.id; // Let DB generate a real ID

        // 2. Get the OTHER defaults we aren't touching right now
        const otherDefaults = experiences
            .filter(exp => exp.id !== editingId)
            .map(exp => ({
                role: exp.role,
                period: exp.period,
                description: exp.description,
                is_currently: exp.is_currently
            }));

        // 3. Save EVERYTHING (The edited one + the others) to the database
        const allToInsert = [...otherDefaults, itemToSave]; 

        const { error } = await supabase.from("experiences").insert(allToInsert);
        if (error) throw error;

      } 
      // --- NORMAL EDITING ---
      // If it's already a real DB item
      else if (editingId && !String(editingId).startsWith("temp-")) {
        const { error } = await supabase
          .from("experiences")
          .update(newExp)
          .eq("id", editingId);
        if (error) throw error;
      } 
      // --- ADDING NEW ---
      else {
         const { error } = await supabase
          .from("experiences")
          .insert([newExp]);
        if (error) throw error;
      }

      // Reset form
      setNewExp({ role: "", period: "", description: "", is_currently: false });
      setEditingId(null);
      await fetchExperiences();
      alert("Saved successfully!");
    } catch (error) {
      alert("Error saving: " + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (String(id).startsWith("temp-")) {
      alert("These are demo items. Edit one and save it to start your own list.");
      return;
    }
    if (!window.confirm("Delete this experience?")) return;
    
    try {
      const { error } = await supabase.from("experiences").delete().eq("id", id);
      if (error) throw error;
      fetchExperiences();
    } catch (error) {
      alert("Error deleting: " + error.message);
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setNewExp({
      role: exp.role,
      period: exp.period,
      description: exp.description,
      is_currently: exp.is_currently || exp.isCurrently || false,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewExp({ role: "", period: "", description: "", is_currently: false });
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Manage Experience</h2>
        <button onClick={fetchExperiences} className="bg-gray-700 p-2 rounded text-white hover:bg-gray-600 transition">
            <RefreshCw size={18}/>
        </button>
      </div>

      {/* --- FORM --- */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
        <h3 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">
          {editingId ? "Edit Details" : "Add New Job"}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Role / Job Title</label>
            <input
              type="text"
              placeholder="e.g. Graphic Designer"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
              value={newExp.role}
              onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-1">Time Period</label>
                <input
                type="text"
                placeholder="e.g. 2022 - Present"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
                value={newExp.period}
                onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                />
            </div>

            <div className="flex items-end">
                <label className="flex items-center gap-3 w-full p-3 bg-gray-900/50 border border-gray-600 rounded cursor-pointer hover:bg-gray-900 transition">
                    <input
                        type="checkbox"
                        checked={newExp.is_currently}
                        onChange={(e) => setNewExp({ ...newExp, is_currently: e.target.checked })}
                        className="w-5 h-5 accent-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-300 select-none">Current Job?</span>
                </label>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              placeholder="What did you do there?"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white h-24 focus:border-blue-500 outline-none"
              value={newExp.description}
              onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-[#3246ea] hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Plus size={18} /> {editingId ? "Save Changes" : "Add Experience"}
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
      <div className="space-y-3">
        {experiences.map((exp) => {
           const isTemp = String(exp.id).startsWith("temp-");
           const isActive = exp.is_currently || exp.isCurrently;

           return (
            <div key={exp.id} className={`p-4 rounded-lg border flex justify-between items-start ${isTemp ? 'border-dashed border-gray-600 bg-gray-800/50' : 'border-gray-700 bg-gray-800'}`}>
                <div className="flex-1 pr-4">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        {exp.role} 
                        {isTemp && <span className="text-[10px] bg-gray-600 px-1.5 rounded uppercase">Default</span>}
                    </h4>
                    
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-blue-400 text-sm font-mono">{exp.period}</span>
                        {isActive && (
                            <span className="flex items-center gap-1 text-[10px] bg-green-900/40 text-green-400 px-2 py-0.5 rounded border border-green-900">
                                <CheckCircle2 size={10} /> Active
                            </span>
                        )}
                    </div>
                    
                    <p className="text-gray-300 text-sm mt-2 line-clamp-2">{exp.description}</p>
                </div>
                
                <div className="flex gap-2">
                    <button onClick={() => handleEdit(exp)} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition" title="Edit">
                        <Edit2 size={16}/>
                    </button>
                    {!isTemp && (
                        <button onClick={() => handleDelete(exp.id)} className="p-2 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white rounded transition" title="Delete">
                            <Trash2 size={16}/>
                        </button>
                    )}
                </div>
            </div>
           );
        })}
      </div>
    </div>
  );
}