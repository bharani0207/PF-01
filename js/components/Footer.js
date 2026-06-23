const Footer = ({ setIsAdminOpen }) => {
  return (
    <footer className="bg-white border-t border-[#FCA57A]/20 py-8 px-6 text-center text-xs text-gray-500 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          Made with ❤️ in Tamil Nadu · Bharanishwar P · 2025
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400">Built with Supabase Backend</span>
          
          {/* Hidden admin clicker */}
          <button 
            onClick={() => setIsAdminOpen(true)} 
            title="Admin Settings Panel"
            className="text-gray-300 hover:text-brand-orange transition-colors duration-200 cursor-pointer"
          >
            ⚡
          </button>
        </div>
      </div>
    </footer>
  );
};

window.Footer = Footer;
