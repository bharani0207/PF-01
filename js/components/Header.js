const Header = ({ activeNavLink, scrollToSection, mobileMenuOpen, setMobileMenuOpen }) => {
  return (
    <React.Fragment>
      {/* ==========================================
          STICKY HEADER NAVIGATION
          ========================================== */}
      <header className="sticky top-0 bg-brandWhite/90 backdrop-blur-md border-b border-[#FCA57A]/20 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="cursor-pointer flex items-center" onClick={() => scrollToSection('hero')}>
            <span className="font-cursive text-4xl font-bold tracking-tight text-brand-orange">BP.</span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            {['hero', 'about', 'skills', 'projects', 'timeline', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`capitalize tracking-wide transition-colors relative pb-2 hover:text-brand-orange ${
                  activeNavLink === item ? 'text-brand-orange font-semibold' : ''
                }`}
              >
                {item === 'timeline' ? 'Experience' : item}
                {activeNavLink === item && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-brand-orange rounded-full"></span>
                )}
              </button>
            ))}
          </nav>

          {/* CTA Action button */}
          <div className="hidden md:block">
            <a 
              href="./resume.pdf"
              download="Bharanishwar_Resume.pdf"
              className="bg-brand-orange hover:bg-orange-600 text-white font-medium text-sm px-6 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-md shadow-orange-500/10"
            >
              Download CV
              <i className="fa-solid fa-download text-xs"></i>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            className="md:hidden text-gray-700 hover:text-brand-orange focus:outline-none"
          >
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
        </div>
      </header>

      {/* ==========================================
          MOBILE DRAWER MENU
          ========================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay Backdrop */}
          <div className="fixed inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          
          {/* Drawer Container */}
          <div className="relative ml-auto w-4/5 max-w-sm h-full bg-brandWhite shadow-2xl flex flex-col z-50 transform translate-x-0 transition-transform duration-300">
            <div className="flex items-center justify-between p-6 border-b border-[#FCA57A]/30 bg-brand-orange text-white">
              <span className="font-serif text-xl font-bold tracking-wide">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-orange-200">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <div className="flex-1 px-6 py-8 flex flex-col space-y-6">
              {['hero', 'about', 'skills', 'projects', 'timeline', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`text-left text-lg font-medium capitalize border-b border-[#FCA57A]/10 pb-2 transition-colors ${
                    activeNavLink === item ? 'text-brand-orange font-bold pl-2 border-l-2 border-brand-orange' : 'text-gray-600'
                  }`}
                >
                  {item === 'timeline' ? 'Experience / Education' : item}
                </button>
              ))}
            </div>
            
            <div className="p-6 border-t border-[#FCA57A]/20">
              <button 
                onClick={() => scrollToSection('contact')} 
                className="w-full bg-brand-orange text-white text-center py-3 rounded-[8px] font-medium"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

window.Header = Header;
