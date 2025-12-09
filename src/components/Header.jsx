import React from "react";
import Weather from "../api/Weather";
import ThemeToggle from "../ui/ThemeToggle"; 

function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onDocClick = (e) => {
      if (!(e.target.closest && e.target.closest("#nav-menu"))) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-base-100 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200/60 dark:border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <a
          href="#home"
          className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          Liann
        </a>

        {/* Navigation for Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <nav className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
            <a href="#home" className="hover:text-[#3246ea] dark:hover:text-white">Home</a>
            <a href="#about" className="hover:text-[#3246ea] dark:hover:text-white">About</a>
            <a href="#projects" className="hover:text-[#3246ea] dark:hover:text-white">Projects</a>
            <a href="#experience" className="hover:text-[#3246ea] dark:hover:text-white">Experience</a>
            <a href="#contact" className="hover:text-[#3246ea] dark:hover:text-white">Contact</a>
          </nav>
        </div>

        {/* Right Side: Weather + Theme + Menu */}
        <div className="flex items-center gap-3">
          
          <Weather className="md:hidden" />
          <ThemeToggle /> {/* ✅ Added here */}
          <button
            id="nav-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 dark:border-white/10"
            aria-expanded={menuOpen}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6 py-3 grid gap-2 text-gray-700 dark:text-gray-300">
            <a href="#home" className="py-2" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#about" className="py-2" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#projects" className="py-2" onClick={() => setMenuOpen(false)}>Projects</a>
            <a href="#experience" className="py-2" onClick={() => setMenuOpen(false)}>Experience</a>
            <a href="#contact" className="py-2" onClick={() => setMenuOpen(false)}>Contact</a>
            
            <ThemeToggle />
            <Weather />

          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
