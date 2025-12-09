import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import { Save, RefreshCw } from "lucide-react";

export default function ContactManager() {
  // 1. Initialize state with your specific defaults
  const [contactData, setContactData] = useState({
    section_title: "Contact Me",
    section_description: "I'd love to hear from you! Whether it's a question, collaboration, or just a hello — feel free to reach out.",
    email: "lianngonzales7@gmail.com",
    github_url: "https://github.com/liaskyyy",
    behance_url: "https://www.behance.net/lianngonza304c", // Default text shown here
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from("contact")
        .select("*")
        .eq("id", 1)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setContactData({
          section_title: data.section_title || "Contact Me",
          section_description: data.section_description || "I'd love to hear from you! Whether it's a question, collaboration, or just a hello — feel free to reach out.",
          email: data.email || "lianngonzales7@gmail.com",
          github_url: data.github_url || "https://github.com/liaskyyy",
          // Use DB data, otherwise fallback to your specific Behance URL
          behance_url: data.behance_url || "https://www.behance.net/lianngonza304c",
        });
      }
    } catch (error) {
      console.error("Error fetching contact data:", error.message);
    }
    setFetching(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("contact")
        .upsert({ id: 1, ...contactData });

      if (error) throw error;
      alert("✅ Contact information updated!");
    } catch (error) {
      alert("❌ Error saving: " + error.message);
    }
    setLoading(false);
  };

  if (fetching) return <div className="text-white p-6">Loading contact info...</div>;

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Edit Contact Section</h2>
        <div className="flex gap-2">
            <button
                onClick={fetchContactData}
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
            <Save size={18} /> {loading ? "Saving..." : "Save All Changes"}
            </button>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Section Title
          </label>
          <input
            type="text"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 outline-none"
            value={contactData.section_title}
            onChange={(e) =>
              setContactData({ ...contactData, section_title: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Section Description
          </label>
          <textarea
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 h-24 focus:border-blue-500 outline-none"
            value={contactData.section_description}
            onChange={(e) =>
              setContactData({ ...contactData, section_description: e.target.value })
            }
          />
        </div>

        <div className="border-t border-gray-600 pt-4">
          <p className="text-sm text-gray-400 mb-4 font-bold uppercase tracking-wider">
            Contact Links
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 outline-none"
            value={contactData.email}
            onChange={(e) =>
              setContactData({ ...contactData, email: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GitHub */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 outline-none"
              value={contactData.github_url}
              onChange={(e) =>
                setContactData({ ...contactData, github_url: e.target.value })
              }
            />
          </div>

          {/* Behance */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Behance URL
            </label>
            <input
              type="url"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 outline-none"
              value={contactData.behance_url}
              onChange={(e) =>
                setContactData({ ...contactData, behance_url: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}