import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../config/supabaseClient";
import { Save, RefreshCw, Upload, User, FileText } from "lucide-react";

export default function AboutManager() {
  // 1. DEFINE DEFAULTS
  const DEFAULT_DATA = {
    // --- Home.jsx Defaults ---
    name: "Liann Gonzales",
    circular_text: "Information*Technology*",
    profile_picture_front: "",
    profile_picture_back: "",
    resume_file: "",
    resume_link: "",
    typed_strings: [
      "I am an IT Student 💻",
      "I am a Graphic Designer 🎨",
      "I am a Front-End Developer 🖥️",
      "I am a Digital Artist ✏️",
      "I am a Gymnastics Coach 🤸‍♀️",
      "I am a UI/UX Designer 📱",
    ],
    title: "IT professional and digital creative",
    location: "Bulacan, Philippines",
    paragraph1: "Hi, I'm <strong>Liann Gonzales</strong>, an aspiring <strong>IT professional </strong> and <strong>digital creative</strong> from <strong>Bulacan, Philippines</strong>. I'm passionate about technology, design, and continuous learning...",
    paragraph2: "As an <strong>Information Technology student</strong>, I love exploring various fields such as <strong>UI/UX design</strong>...",
    paragraph3: "Outside academics, I express my creativity through <strong>graphic design</strong>...",
    paragraph4: "I'm constantly learning, experimenting, and improving...",
  };

  const [aboutData, setAboutData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // File Upload States
  const [imageFile, setImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
        setAboutData({
          ...DEFAULT_DATA,
          ...data,
          typed_strings: (data.typed_strings && data.typed_strings.length > 0) 
            ? data.typed_strings 
            : DEFAULT_DATA.typed_strings,
        });
        if (data.profile_picture_front) setImagePreview(data.profile_picture_front);
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

  // 3. Handle File Upload
  const handleFileUpload = async (file, type) => {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${type}_${Date.now()}.${fileExt}`;
    const filePath = `${type}s/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  // 4. Handle Profile Picture Upload
  const handleProfilePictureChange = async (e, type = 'front') => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const publicUrl = await handleFileUpload(file, `profile_${type}`);
      setAboutData({ 
        ...aboutData, 
        [`profile_picture_${type}`]: publicUrl 
      });
    } catch (error) {
      alert(`❌ Error uploading ${type} profile picture: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. Handle Resume Upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const publicUrl = await handleFileUpload(file, 'resume');
      setAboutData({ ...aboutData, resume_file: publicUrl, resume_link: publicUrl });
    } catch (error) {
      alert("❌ Error uploading resume: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 6. Save Data
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

      {/* --- SECTION 1: PROFILE PICTURES --- */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-6">
        <h3 className="text-xl font-bold text-[#3246ea] border-b border-gray-600 pb-2">
          👤 Profile Pictures
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Front Profile Picture */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-300">Front Profile</h4>
            <div className="w-full aspect-square max-w-xs mx-auto rounded-full bg-gray-700 border-2 border-gray-600 overflow-hidden flex items-center justify-center">
              {aboutData.profile_picture_front ? (
                <img 
                  src={aboutData.profile_picture_front} 
                  alt="Front Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '';
                    e.target.parentElement.innerHTML = (
                      '<div class="w-full h-full flex items-center justify-center text-gray-400">' +
                      '<User size={48} />' +
                      '</div>'
                    );
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User size={48} />
                </div>
              )}
            </div>
            
            <div>
              <label className="flex items-center justify-center w-full p-3 bg-gray-700 border border-gray-600 rounded text-white hover:bg-gray-600 cursor-pointer transition">
                <Upload className="mr-2 h-4 w-4" />
                {aboutData.profile_picture_front ? 'Change Front' : 'Upload Front'}
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleProfilePictureChange(e, 'front')}
                  disabled={loading}
                />
              </label>
            </div>
          </div>

          {/* Back Profile Picture */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-300">Back Profile</h4>
            <div className="w-full aspect-square max-w-xs mx-auto rounded-full bg-gray-700 border-2 border-gray-600 overflow-hidden flex items-center justify-center">
              {aboutData.profile_picture_back ? (
                <img 
                  src={aboutData.profile_picture_back} 
                  alt="Back Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '';
                    e.target.parentElement.innerHTML = (
                      '<div class="w-full h-full flex items-center justify-center text-gray-400">' +
                      '<User size={48} />' +
                      '</div>'
                    );
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User size={48} />
                </div>
              )}
            </div>
            
            <div>
              <label className="flex items-center justify-center w-full p-3 bg-gray-700 border border-gray-600 rounded text-white hover:bg-gray-600 cursor-pointer transition">
                <Upload className="mr-2 h-4 w-4" />
                {aboutData.profile_picture_back ? 'Change Back' : 'Upload Back'}
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleProfilePictureChange(e, 'back')}
                  disabled={loading}
                />
              </label>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-400 text-center mt-2">
          Recommended size: 400x400px (1:1 ratio) for both images
        </p>
      </div>

      {/* --- SECTION 2: HOME PAGE CONFIG --- */}
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Resume File</label>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="flex items-center justify-center w-full p-3 bg-gray-700 border border-gray-600 rounded text-white hover:bg-gray-600 cursor-pointer transition">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Resume
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    disabled={loading}
                  />
                </label>
                <p className="mt-1 text-xs text-gray-400">Accepted formats: .pdf, .doc, .docx</p>
              </div>
              {aboutData.resume_file && (
                <a 
                  href={aboutData.resume_file} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 bg-gray-700 border border-gray-600 rounded text-white hover:bg-gray-600 transition"
                >
                  <FileText className="h-4 w-4" />
                  View Current Resume
                </a>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Or use external resume link (overrides uploaded file)
            </label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 outline-none"
              value={aboutData.resume_link}
              onChange={(e) => setAboutData({ ...aboutData, resume_link: e.target.value })}
              placeholder="https://example.com/my-resume.pdf"
            />
          </div>
        </div>
      </div>

      {/* --- SECTION 3: ABOUT PAGE CONFIG --- */}
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