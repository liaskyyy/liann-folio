import React from "react";
import { LogOut } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const tabs = [
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "techstack", label: "Tech Stack" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col gap-8 z-40">
      <div className="text-white text-2xl font-bold">Admin Panel</div>
      
      <nav className="flex flex-col gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-left px-4 py-3 rounded-lg capitalize transition-all ${
              activeTab === tab.id
                ? "bg-[#3246ea] text-white font-semibold"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="mt-auto flex items-center gap-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
