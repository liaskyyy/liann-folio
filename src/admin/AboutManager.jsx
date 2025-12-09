import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../config/supabaseClient";
import { Save, RefreshCw } from "lucide-react";

export default function AboutManager() {
  // 1. DEFINE DEFAULTS (Exact copies from Home.jsx and About.jsx)
  const DEFAULT_DATA = {
    // --- Home.jsx Defaults ---
    name: "Liann Gonzales",
    circular_text: "Information*Technology*",
    resume_link: "",
    typed_strings: [
      "I am an IT Student 💻",
      "I am a Graphic Designer 🎨",
      "I am a Front-End Developer 🖥️",
      "I am a Digital Artist ✏️",
      "I am a Gymnastics Coach 🤸‍♀️",
      "I am a UI/UX Designer 📱",
    ],
    // --- About.jsx Defaults ---
    title: "IT professional and digital creative",
    location: "Bulacan, Philippines",
    paragraph1: "Hi, I'm <strong>Liann Gonzales</strong>, an aspiring <strong>IT professional </strong> and <strong>digital creative</strong> from <strong>Bulacan, Philippines</strong>. I'm passionate about technology, design, and continuous learning. My goal is to bridge creativity and functionality by crafting meaningful digital experiences that make everyday tasks simpler and more enjoyable.",
    paragraph2: "As an <strong>Information Technology student</strong>, I love exploring various fields such as <strong>UI/UX design</strong>, <strong>front-end web development</strong>, and <strong>software innovation</strong>. I enjoy turning ideas into real, interactive projects from designing clean, user-friendly interfaces to building systems that help people stay focused, organized, and productive.",
    paragraph3: "Outside academics, I express my creativity through <strong>graphic design</strong> and <strong> digital art</strong>. I've worked on logo designs, brand identities, and illustrations that reflect personality and purpose. My experience as a <strong> gymnastics coach</strong> and <strong>technical director</strong> has also strengthened my teamwork, leadership, and attention to detail qualities that I apply in both creative and technical work.",
    paragraph4: "I'm constantly learning, experimenting, and improving whether it's mastering new technologies, designing better user flows, or collaborating with others on innovative ideas. Ultimately, I aspire to become a <strong>versatile IT professional</strong> who blends technical knowledge with creative thinking to make a positive impact in the digital world.",
  };

  const [aboutData, setAboutData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 2. Fetch Data
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
        // Merge DB data with Defaults (if DB field is null, use Default)
        setAboutData({
          name: data.name || DEFAULT_DATA.name,
          title: data.title || DEFAULT_DATA.title,
          location: data.location || DEFAULT_DATA.location,
          circular_text: data.circular_text || DEFAULT_DATA.circular_text,
          resume_link: data.resume_link || "",
          // Ensure arrays are handled correctly
          typed_strings: (data.typed_strings && data.typed_strings.length > 0) 
            ? data.typed_strings 
            : DEFAULT_DATA.typed_strings,
          paragraph1: data.paragraph1 || DEFAULT_DATA.paragraph1,
          paragraph2: data.paragraph2 || DEFAULT_DATA.paragraph2,
          paragraph3: data.paragraph3 || DEFAULT_DATA.paragraph3,
          paragraph4: data.paragraph4 || DEFAULT_DATA.paragraph4,
        });
      } else {
        // No data in DB yet? Set state to Defaults so user can save them.
        setAboutData(DEFAULT_DATA);
      }
    } catch (error) {
      console.error("Error fetching about data:", error.message);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchAboutData();
  }, [fetchAboutData]);

  // 3. Save Data
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

  // Helper for Typed Text (Array <-> String)
  const handleTypedStringsChange = (e) => {
    const val = e.target.value;
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
                title="Refresh / Reset to DB"
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

      {/* --- SECTION 1: HOME PAGE CONFIG --- */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
        <h3 className="text-xl font-bold text-[#3246ea] border-b border-gray-600 pb-2">
          🏠 Home Page Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Display Name</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
              value={aboutData.name} 
              onChange={(e) => setAboutData({ ...aboutData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Circular Text</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
              value={aboutData.circular_text}
              onChange={(e) => setAboutData({ ...aboutData, circular_text: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Animated Typed Text (One phrase per line)
          </label>
          <textarea
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white h-40 font-mono text-sm focus:border-blue-500 outline-none leading-relaxed"
            value={aboutData.typed_strings.join("\n")}
            onChange={handleTypedStringsChange}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Resume Link (URL)</label>
          <input
            type="text"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
            value={aboutData.resume_link}
            onChange={(e) => setAboutData({ ...aboutData, resume_link: e.target.value })}
            placeholder="Optional: Paste URL to override default PDF"
          />
        </div>
      </div>

      {/* --- SECTION 2: ABOUT PAGE CONFIG --- */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
        <h3 className="text-xl font-bold text-[#3246ea] border-b border-gray-600 pb-2">
          👤 About Page Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Professional Title</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
              value={aboutData.title}
              onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Location</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
              value={aboutData.location}
              onChange={(e) => setAboutData({ ...aboutData, location: e.target.value })}
            />
          </div>
        </div>

        {/* Dynamic Paragraphs */}
        {[1, 2, 3, 4].map((num) => (
          <div key={num}>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Paragraph {num} <span className="text-xs text-gray-500 font-normal">(HTML tags like &lt;strong&gt; are allowed)</span>
            </label>
            <textarea
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white h-32 focus:border-blue-500 outline-none"
              value={aboutData[`paragraph${num}`]}
              onChange={(e) => setAboutData({ ...aboutData, [`paragraph${num}`]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}