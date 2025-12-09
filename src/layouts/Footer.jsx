export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-300">
        <div>© {new Date().getFullYear()} Liann. All rights reserved.</div>
        <div className="opacity-80">Built with React and Tailwind CSS.</div>
      </div>
    </footer>
  );
}
