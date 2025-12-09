import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../config/supabaseClient";
import { Save, RefreshCw } from "lucide-react";

export default function AboutManager() {
  // 1. Define Defaults
  const DEFAULT_STRINGS = [
    "I am an IT Student 💻",
    "I am a Graphic Designer 🎨",
    "I am a Front-End Developer 🖥️",
    "I am a Digital Artist ✏️",
    "I am a Gymnastics Coach 🤸‍♀️",
    "I am a UI/UX Designer 📱"
  ];

  // 2. Initialize state
  const [aboutData, setAboutData] = useState({
    name: "Liann Gonzales",
    title: "IT professional and digital creative",
    location: "Bulacan, Philippines",
    circular_text: "Information*Technology*",
    resume_link: "",
    typed_strings: DEFAULT_STRINGS, 
    paragraph1: "",
    paragraph2: "",
    paragraph3: "",
    paragraph4: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 3. Fetch Data Function
  const fetchAboutData = useCallback(async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from("about")
        .select("*")
        .eq("id", 1)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setAboutData({
          name: data.name || "",
          title: data.title || "",
          location: data.location || "",
          circular_text: data.circular_text || "",
          resume_link: data.resume_link || "",
          // Ensure it's an array
          typed_strings: (Array.isArray(data.typed_strings) && data.typed_strings.length > 0)
            ? data.typed_strings 
            : DEFAULT_STRINGS,
          paragraph1: data.paragraph1 || "",
          paragraph2: data.paragraph2 || "",
          paragraph3: data.paragraph3 || "",
          paragraph4: data.paragraph4 || "",
        });
      }
    } catch (error) {
      console.error("Error fetching about data:", error.message);
    }
    setFetching(false);
  }, []); // Empty dependency array ensures this function is stable

  // 4. useEffect to run on mount
  useEffect(() => {
    fetchAboutData();
  }, [fetchAboutData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("about")
        .upsert({ id: 1, ...aboutData });

      if (error) throw error;
      alert("✅ Information saved successfully!");
    } catch (error) {
      alert("❌ Error saving: " + error.message);
    }
    setLoading(false);
  };

  const handleTypedStringsChange = (e) => {
    const val = e.target.value;
    // Split by new line to create array
    const array = val.split("\n"); 
    setAboutData({ ...aboutData, typed_strings: array });
  };

  if (fetching) return <div className="text-white p-6">Loading editor...</div>;

  return (
    <div className="space-y-8 max-w-4xl pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Content Manager</h2>
        <div className="flex gap-2">
            <button
                onClick={fetchAboutData}
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition"
                title="Refresh Data"
            >
                <RefreshCw size={18} />
            </button>
            <button
                onClick={handleSave}
                disabled={loading}
                className="bg-[#3246ea] hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold flex items-center gap-2 transition disabled:opacity-50"
            >
                <Save size={18} /> {loading ? "Saving..." : "Save All"}
            </button>
        </div>
      </div>

      {/* --- SECTION 1: HOME PAGE DETAILS --- */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
        <h3 className="text-xl font-bold text-[#3246ea] border-b border-gray-600 pb-2">
          🏠 Home Page Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
              value={aboutData.name} 
              onChange={(e) => setAboutData({ ...aboutData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Circular Text
            </label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
              value={aboutData.circular_text}
              onChange={(e) => setAboutData({ ...aboutData, circular_text: e.target.value })}
            />
          </div>
        </div>

        {/* --- TYPED TEXT AREA --- */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Animated Typed Text (One phrase per line)
          </label>
          <textarea
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white h-48 font-mono text-sm focus:border-blue-500 outline-none leading-relaxed"
            // Join array with newlines for display, use optional chaining
            value={aboutData.typed_strings?.join("\n") || ""}
            onChange={handleTypedStringsChange}
            placeholder="I am an IT Student&#10;I am a Graphic Designer"
          />
          <p className="text-xs text-gray-400 mt-2">
            * Each line creates a new typing animation phrase.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Resume Link (URL)
          </label>
          <input
            type="text"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
            value={aboutData.resume_link}
            onChange={(e) => setAboutData({ ...aboutData, resume_link: e.target.value })}
            placeholder="Leave empty to use the default PDF file"
          />
          <p className="text-xs text-gray-400 mt-1">
            If this is empty, the "Download Resume" button will download your default PDF file.
          </p>
        </div>
      </div>

      {/* --- SECTION 2: ABOUT PAGE DETAILS --- */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
        <h3 className="text-xl font-bold text-[#3246ea] border-b border-gray-600 pb-2">
          👤 About Page Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
              value={aboutData.title}
              onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
              value={aboutData.location}
              onChange={(e) => setAboutData({ ...aboutData, location: e.target.value })}
            />
          </div>
        </div>

        {/* Paragraphs Loop */}
        {[1, 2, 3, 4].map((num) => (
          <div key={num}>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Bio Paragraph {num}
            </label>
            <textarea
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white h-24 focus:border-blue-500 outline-none"
              value={aboutData[`paragraph${num}`] || ""}
              onChange={(e) => setAboutData({ ...aboutData, [`paragraph${num}`]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}