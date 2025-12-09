import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import { Reorder } from "framer-motion"; // Import Reorder
import { Plus, Trash2, Edit2, RefreshCw, GripVertical, Save } from "lucide-react";

export default function TechStackManager() {
  // --- 1. CONFIG & DEFAULTS ---
  const defaultSkills = [
    { id: "temp-1", title: "HTML", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { id: "temp-2", title: "CSS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { id: "temp-3", title: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { id: "temp-4", title: "React", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { id: "temp-5", title: "Python", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { id: "temp-6", title: "C++", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
    { id: "temp-7", title: "Java", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { id: "temp-8", title: "MySQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    { id: "temp-9", title: "Node.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { id: "temp-10", title: "Figma", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
    { id: "temp-11", title: "Adobe Ai", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg" },
    { id: "temp-12", title: "Photoshop", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" },
    { id: "temp-13", title: "InDesign", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/indesign/indesign-original.svg" },
    { id: "temp-17", title: "MS Excel", src: "https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg" },
    { id: "temp-18", title: "MS Word", src: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Microsoft_Office_Word_%282019%E2%80%93present%29.svg" },
    { id: "temp-14", title: "Canva", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg" },
    { id: "temp-15", title: "UI/UX Design", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-original.svg" },
    { id: "temp-16", title: "Git & GitHub", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", invert_dark: true },
  ];

  // --- 2. STATE ---
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isUsingDefaults, setIsUsingDefaults] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);

  const [newSkill, setNewSkill] = useState({
    title: "",
    src: "",
    invert_dark: false,
  });

  // --- 3. INITIAL FETCH ---
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("order_index", { ascending: true }) // Order by our new column
        .order("id", { ascending: true }); // Fallback

      if (error) throw error;
      
      if (data && data.length > 0) {
        setSkills(data);
        setIsUsingDefaults(false);
      } else {
        setSkills(defaultSkills);
        setIsUsingDefaults(true);
      }
    } catch (error) {
      console.error("Error fetching skills:", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // --- 4. CRUD OPERATIONS ---
  const handleSave = async () => {
    if (!newSkill.title || !newSkill.src) {
      alert("Title and Icon URL are required");
      return;
    }
    setLoading(true);
    try {
      // Logic to save (Create/Update) and handle Defaults -> Real DB conversion
      let operation;
      const nextOrderIndex = skills.length; // Put new items at the end

      if (isUsingDefaults && editingId && String(editingId).startsWith("temp-")) {
        // Convert all defaults to real DB items
        const itemToSave = { ...newSkill, order_index: nextOrderIndex };
        delete itemToSave.id;

        const otherDefaults = skills
          .filter((s) => s.id !== editingId)
          .map((s, index) => ({
            title: s.title,
            src: s.src,
            invert_dark: s.invert_dark || s.invertDark || false,
            order_index: index // Assign initial order
          }));

        const allToInsert = [...otherDefaults, itemToSave];
        operation = supabase.from("skills").insert(allToInsert);
      }
      else if (editingId && !String(editingId).startsWith("temp-")) {
        // Update existing
        operation = supabase.from("skills").update(newSkill).eq("id", editingId);
      }
      else {
        // Insert new
        operation = supabase.from("skills").insert([{ ...newSkill, order_index: nextOrderIndex }]);
      }

      const { error } = await operation;
      if (error) throw error;

      setNewSkill({ title: "", src: "", invert_dark: false });
      setEditingId(null);
      await fetchSkills();
      alert("Skill saved!");
    } catch (error) {
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (String(id).startsWith("temp-")) {
      alert("Cannot delete defaults. Add a new skill to start your own list.");
      return;
    }
    if (!window.confirm("Delete this skill?")) return;
    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
      fetchSkills();
    } catch (error) {
      alert("Error deleting: " + error.message);
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setNewSkill({
      title: skill.title,
      src: skill.src,
      invert_dark: skill.invert_dark || skill.invertDark || false,
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewSkill({ title: "", src: "", invert_dark: false });
  };

  // --- 5. REORDERING LOGIC ---
  const handleReorder = (newOrder) => {
    setSkills(newOrder);
    setOrderChanged(true);
  };

  const saveNewOrder = async () => {
    if (isUsingDefaults) {
        alert("You must add or edit a skill to save it to the database before reordering.");
        return;
    }

    setLoading(true);
    try {
        // Create an array of updates: { id: 1, order_index: 0 }, { id: 5, order_index: 1 }...
        const updates = skills.map((skill, index) => ({
            id: skill.id,
            title: skill.title, // Required for upsert in some configs, usually ID is enough but safer to pass existing
            src: skill.src,
            order_index: index
        }));

        const { error } = await supabase.from("skills").upsert(updates);
        if (error) throw error;
        
        setOrderChanged(false);
        alert("New arrangement saved!");
    } catch (error) {
        alert("Error saving order: " + error.message);
    }
    setLoading(false);
  };

  // --- 6. RENDER ---
  return (
    <div className="space-y-8 max-w-4xl pb-10">
      
      {/* Header */}
      <div className="flex justify-between items-center sticky top-0 bg-[#0f172a] z-20 py-4 border-b border-gray-800">
        <h2 className="text-3xl font-bold text-white">Manage Tech Stack</h2>
        <div className="flex gap-2">
            {orderChanged && !isUsingDefaults && (
                <button 
                    onClick={saveNewOrder} 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 animate-pulse"
                >
                    <Save size={18} /> Save Order
                </button>
            )}
            <button onClick={fetchSkills} className="bg-gray-700 p-2 rounded text-white hover:bg-gray-600">
                <RefreshCw size={18}/>
            </button>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4 shadow-lg">
        <h3 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">
          {editingId ? "Edit Skill" : "Add New Skill"}
        </h3>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm text-gray-300 mb-1">Skill Name</label>
                <input
                    type="text"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
                    placeholder="e.g. React"
                    value={newSkill.title}
                    onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm text-gray-300 mb-1">Icon URL</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
                        placeholder="https://..."
                        value={newSkill.src}
                        onChange={(e) => setNewSkill({ ...newSkill, src: e.target.value })}
                    />
                    <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center border border-gray-600">
                        {newSkill.src ? (
                             <img src={newSkill.src} alt="" className="w-8 h-8 object-contain" onError={(e) => e.target.style.display='none'}/>
                        ) : (
                            <span className="text-xs text-gray-500">Preview</span>
                        )}
                    </div>
                </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded border border-gray-600">
            <input
              type="checkbox"
              id="invertDark"
              checked={newSkill.invert_dark}
              onChange={(e) => setNewSkill({ ...newSkill, invert_dark: e.target.checked })}
              className="w-5 h-5 accent-blue-500 cursor-pointer"
            />
            <label htmlFor="invertDark" className="text-sm text-gray-300 cursor-pointer select-none">
              Invert color in Dark Mode? (Check this for black icons like GitHub/Next.js)
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-[#3246ea] hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Plus size={18} /> {editingId ? "Save Changes" : "Add Skill"}
            </button>
            {editingId && (
              <button onClick={handleCancel} className="px-6 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-semibold">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reorderable List */}
      <div className="space-y-2">
        <div className="flex justify-between items-end mb-2">
            <h3 className="text-xl font-bold text-white">Current Stack</h3>
            <span className="text-xs text-gray-400 italic">Drag items to reorder</span>
        </div>
        
        <Reorder.Group axis="y" values={skills} onReorder={handleReorder} className="space-y-3">
            {skills.map((skill) => {
                const isTemp = String(skill.id).startsWith("temp-");
                const shouldInvert = skill.invert_dark || skill.invertDark; 

                return (
                    <Reorder.Item 
                        key={skill.id} 
                        value={skill}
                        className={`group p-3 rounded-lg border flex items-center justify-between cursor-grab active:cursor-grabbing bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-colors ${isTemp ? 'opacity-80 border-dashed' : ''}`}
                    >
                        <div className="flex items-center gap-4">
                            {/* Drag Handle */}
                            <div className="text-gray-500 cursor-grab active:cursor-grabbing hover:text-white">
                                <GripVertical size={20} />
                            </div>

                            {/* Icon */}
                            <div className={`w-10 h-10 bg-gray-900 rounded-md flex items-center justify-center border border-gray-700 ${shouldInvert ? 'filter invert' : ''}`}>
                                <img src={skill.src} alt={skill.title} className="w-6 h-6 object-contain pointer-events-none" />
                            </div>

                            {/* Text */}
                            <div>
                                <h4 className="text-white font-medium">{skill.title}</h4>
                                {isTemp && <span className="text-[10px] text-gray-500 uppercase">Default</span>}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => handleEdit(skill)} 
                                className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded"
                            >
                                <Edit2 size={16}/>
                            </button>
                            {!isTemp && (
                                <button 
                                    onClick={() => handleDelete(skill.id)} 
                                    className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded"
                                >
                                    <Trash2 size={16}/>
                                </button>
                            )}
                        </div>
                    </Reorder.Item>
                );
            })}
        </Reorder.Group>
      </div>
    </div>
  );
}