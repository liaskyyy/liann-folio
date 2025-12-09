// src/Login.jsx
import React, { useState } from "react";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6 relative overflow-hidden">
      
      {/* Background Decor (Blue Glow) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#3246ea]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#3246ea]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Card Container */}
      <div className="w-full max-w-md p-8 bg-[#121212] rounded-3xl shadow-2xl border border-gray-800 z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#3246ea] to-blue-400">
            Welcome Back
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            Enter your credentials to access the admin panel.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#3246ea] transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-800 bg-[#1a1a1a] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3246ea] focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#3246ea] transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-800 bg-[#1a1a1a] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3246ea] focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            disabled={loading}
            className="w-full py-3 bg-[#3246ea] hover:bg-blue-600 text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                Login <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}