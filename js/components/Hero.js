const Hero = ({ profile, themeColor, scrollToSection }) => {
  return (
    <section id="hero" className="relative min-h-[calc(100vh-80px)] flex items-center py-16 md:py-24 px-6 overflow-hidden">
      {/* Background canvas effects */}
      <div className="absolute inset-0 bg-[#FFFDF9] z-0"></div>
      <div className="absolute inset-0 opacity-40 z-10">
        <EmberCanvas themeColor={themeColor} />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full z-20 relative">

        {/* Left Column: Text & Stats */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="reveal">
            <span className="text-xs font-extrabold tracking-widest text-gray-400 uppercase">
              HELLO, I'M 👋
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] reveal">
            Bharanishwar <span className="text-brand-orange">P</span>
          </h1>

          <p className="text-lg sm:text-xl font-medium text-brand-orange mb-6 flex items-center gap-1.5 reveal">
            Engineering Student <span className="text-gray-300">|</span> Problem Solver ⚡
          </p>

          <p className="text-base sm:text-lg text-gray-600 max-w-xl mb-10 leading-relaxed font-sans reveal">
            {profile.bio}
          </p>

          {/* Action buttons with cursive "Let's connect" arrow */}
          <div className="flex flex-wrap items-center gap-5 mb-12 relative reveal">
            <button
              onClick={() => scrollToSection('projects')}
              className="bg-brand-orange hover:bg-orange-600 text-white font-medium px-8 py-3.5 rounded-full shadow-lg shadow-orange-500/20 transition-all text-base flex items-center gap-2"
            >
              View My Work <i className="fa-solid fa-arrow-up-right-from-square text-sm"></i>
            </button>

            <a
              href="./resume.pdf"
              download="Bharanishwar_Resume.pdf"
              className="outline-brand-orange bg-white font-medium px-8 py-3.5 rounded-full transition-all text-base text-center flex items-center gap-2 shadow-sm"
            >
              Download CV <i className="fa-solid fa-download text-sm"></i>
            </a>

            {/* Hand-drawn style pointer arrow to download button */}
            <div className="absolute left-[345px] -bottom-[14px] flex items-center gap-1 whitespace-nowrap hidden md:flex">
              <svg className="w-12 h-6 text-brand-orange" viewBox="0 0 50 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M45 5 C35 15, 20 15, 8 10 M8 10 L14 5 M8 10 L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-cursive text-brand-orange text-lg leading-none mt-1">Let's connect!</span>
            </div>
          </div>

          {/* Stats Card bar across the bottom */}
          <div className="bg-white border border-[#FCA57A]/15 rounded-3xl p-5 shadow-xl shadow-orange-100/10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl reveal">
            <div className="flex flex-col items-center text-center md:border-r border-gray-100 md:last:border-none pr-2">
              <div className="w-10 h-10 rounded-full bg-brand-orange-10 text-brand-orange flex items-center justify-center mb-2">
                <i className="fa-solid fa-code text-sm"></i>
              </div>
              <span className="text-2xl font-bold text-gray-900 font-serif">20+</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Projects Completed</span>
            </div>

            <div className="flex flex-col items-center text-center md:border-r border-gray-100 md:last:border-none px-2">
              <div className="w-10 h-10 rounded-full bg-brand-orange-10 text-brand-orange flex items-center justify-center mb-2">
                <i className="fa-solid fa-trophy text-sm"></i>
              </div>
              <span className="text-2xl font-bold text-gray-900 font-serif">3+</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Hackathons Participated</span>
            </div>

            <div className="flex flex-col items-center text-center md:border-r border-gray-100 md:last:border-none px-2">
              <div className="w-10 h-10 rounded-full bg-brand-orange-10 text-brand-orange flex items-center justify-center mb-2">
                <i className="fa-solid fa-certificate text-sm"></i>
              </div>
              <span className="text-2xl font-bold text-gray-900 font-serif">10+</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Certifications</span>
            </div>

            <div className="flex flex-col items-center text-center pl-2">
              <div className="w-10 h-10 rounded-full bg-brand-orange-10 text-brand-orange flex items-center justify-center mb-2">
                <i className="fa-solid fa-rocket text-sm"></i>
              </div>
              <span className="text-2xl font-bold text-gray-900 font-serif">100%</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Passion</span>
            </div>
          </div>
        </div>

        {/* Right Column: futuristic workspace illustration */}
        <div className="lg:col-span-5 flex justify-center items-center relative reveal">
          <div className="relative w-full max-w-md aspect-square">
            {/* Soft backdrop blur circle */}
            <div className="absolute inset-4 bg-gradient-to-br from-brand-orange/15 to-orange-100/40 rounded-full filter blur-3xl opacity-60 animate-pulse"></div>

            {/* The main workspace illustration mockup card */}
            <div className="relative bg-white border border-[#FCA57A]/15 rounded-3xl overflow-hidden shadow-2xl p-2 transition-transform duration-500 hover:scale-[1.015]">
              <img
                src="./hero_workspace.png"
                alt="Bharanishwar P futuristic workspace illustration"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div
        onClick={() => scrollToSection('about')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer text-gray-400 hover:text-brand-orange transition-colors flex flex-col items-center gap-1.5 z-20 animate-bounce"
      >
        <span className="text-[10px] uppercase tracking-widest font-bold">Scroll Down</span>
        <i className="fa-solid fa-chevron-down text-base"></i>
      </div>
    </section>
  );
};

window.Hero = Hero;
