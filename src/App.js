import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public Components
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./components/About";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import TechStack from "./components/TechStack";

// Admin Pages 
// NOTE: If you haven't moved these to a 'pages' folder yet, remove 'pages/' from the path below.
import Login from "./pages/Login"; 
import Dashboard from "./pages/Dashboard"; 

// Check for dark mode preference
const isDarkMode = () => {
  if (typeof window === 'undefined') return false;
  return (
    localStorage.theme === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
};

function App() {
  // Set dark mode on initial load
  useEffect(() => {
    if (isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Allow running the app under a subpath (GitHub Pages). Prefer an
  // explicit `REACT_APP_BASENAME` env var for local development so you
  // can force the app to run at root (set to empty). By default we do
  // not automatically use `PUBLIC_URL` during development to avoid the
  // app being served under a repo subpath locally.
  const basename = (process.env.REACT_APP_BASENAME !== undefined)
    ? process.env.REACT_APP_BASENAME
    : "";

  return (
    <Router basename={basename}>
      <div className="min-h-screen bg-base-100 dark:bg-gray-900 transition-colors duration-300">
        <Routes>
          
          {/* Route 1: Public Portfolio */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <main>
                  <Home />
                  <About />
                  <TechStack />
                  <Projects />
                  <Experience />
                  <Contact />
                </main>
                <Footer />
              </>
            }
          />

          {/* Route 2: Admin Login */}
          <Route path="/login" element={<Login />} />

          {/* Route 3: Admin Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;