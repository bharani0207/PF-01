const Projects = ({ projects, projectFilter, setProjectFilter }) => {
  // Project items filter
  const filteredProjects = projects.filter(proj => {
    if (projectFilter === 'All') return true;
    if (projectFilter === 'AI-ML') return proj.category === 'AI/ML';
    if (projectFilter === 'Full Stack') return proj.category === 'Full Stack';
    return true;
  });

  return (
    <section id="projects" className="py-24 px-6 max-w-7xl mx-auto">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 reveal">
        <div className="text-left">
          <span className="text-xs font-extrabold tracking-widest text-brand-orange uppercase">
            FEATURED PROJECTS
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold font-serif text-gray-900 mt-2">
            Things I <span className="hand-drawn-underline">Build</span>
          </h2>
        </div>
        <div>
          <a 
            href="#projects" 
            onClick={(e) => {
              e.preventDefault();
              setProjectFilter('All');
            }}
            className="border border-[#FCA57A]/25 bg-white text-gray-600 hover:text-brand-orange text-xs font-bold px-6 py-3 rounded-xl transition-all duration-300 inline-flex items-center gap-2 shadow-sm hover:border-brand-orange"
          >
            View All Projects <i className="fa-solid fa-arrow-right text-xs"></i>
          </a>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2.5 mb-10 reveal">
        {['All', 'AI-ML', 'Full Stack'].map((filter) => (
          <button
            key={filter}
            onClick={() => setProjectFilter(filter)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
              projectFilter === filter 
                ? 'bg-brand-orange text-white shadow-md shadow-orange-500/10' 
                : 'bg-white border border-[#FCA57A]/15 text-gray-500 hover:text-brand-orange hover:border-brand-orange'
            }`}
          >
            {filter === 'All' ? 'All Work' : filter === 'AI-ML' ? 'AI / ML' : 'Full Stack'}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Quote Card Column (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white border border-[#FCA57A]/15 p-8 rounded-3xl shadow-xl shadow-orange-100/5 flex flex-col justify-between min-h-[280px] lg:min-h-[360px] relative overflow-hidden reveal">
          {/* Subtle background graphic */}
          <div className="absolute right-0 bottom-0 opacity-[0.04] pointer-events-none transform translate-x-6 translate-y-6">
            <svg width="200" height="200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="#FF5500" strokeWidth="2"/>
              <circle cx="50" cy="50" r="35" stroke="#FF5500" strokeWidth="1" strokeDasharray="3 3"/>
            </svg>
          </div>

          <div className="space-y-6 z-10">
            <span className="text-brand-orange text-6xl font-serif leading-none block">“</span>
            <p className="text-xl sm:text-2xl font-serif font-semibold text-gray-800 leading-relaxed">
              Engineering is not just my degree, it's my mindset.
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-gray-50 z-10">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange"></span>
              <span className="text-xs uppercase font-extrabold tracking-wider text-gray-400">Bharanishwar P</span>
            </div>
            <i className="fa-solid fa-heart text-brand-orange text-sm animate-pulse"></i>
          </div>
        </div>

        {/* Right Project Grid Column (lg:col-span-8) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 reveal">
          {filteredProjects.map((proj) => {
            const isAI = proj.category === 'AI/ML' || proj.title.toLowerCase().includes('ai') || proj.title.toLowerCase().includes('neethi');
            
            return (
              <div 
                key={proj.id} 
                className="group bg-white border border-[#FCA57A]/15 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[400px]"
              >
                {/* Top Block: Dark Dashboard Simulation */}
                <div className="h-40 project-card-header-bg p-5 flex flex-col justify-between relative">
                  {/* Top header bar */}
                  <div className="flex items-center justify-between z-10">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500/80"></span>
                      <span className="w-2 h-2 rounded-full bg-yellow-500/80"></span>
                      <span className="w-2 h-2 rounded-full bg-green-500/80"></span>
                    </div>
                    <span className="text-[9px] font-mono text-gray-500 bg-gray-900/60 px-2 py-0.5 rounded border border-gray-800/55">
                      {isAI ? 'nlp_agent.py' : 'dashboard.js'}
                    </span>
                  </div>

                  {/* Dynamic Inner Graphics */}
                  {isAI ? (
                    /* AI/ML Code/Visual Layout */
                    <div className="flex-1 flex items-center justify-center z-10 pt-3">
                      <div className="w-full space-y-2">
                        <div className="flex items-center justify-between text-[9px] font-mono text-brand-orange opacity-90">
                          <span>$ python query_rag.py</span>
                          <span className="text-[8px] bg-brand-orange-10 text-brand-orange px-1.5 py-0.5 rounded border border-brand-orange/10">Active</span>
                        </div>
                        <div className="bg-[#0f0f18]/90 border border-gray-800/80 rounded-lg p-2.5 font-mono text-[9px] text-gray-300 space-y-1 shadow-inner">
                          <div className="flex gap-1"><span className="text-orange-400">import</span><span>embeddings, llm</span></div>
                          <div className="flex gap-1"><span className="text-purple-400">def</span><span className="text-blue-400">ask_legal_assistant</span><span>(query):</span></div>
                          <div className="flex gap-1 pl-4"><span className="text-orange-400">return</span><span>llm.generate(query, context)</span></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Full Stack / Stock dashboard graphic */
                    <div className="flex-1 flex items-center justify-center z-10 pt-3">
                      <div className="w-full space-y-2">
                        <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400 opacity-95">
                          <span>$ npm run start_dev</span>
                          <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-400/10">200 OK</span>
                        </div>
                        {/* Fake mini graph layout */}
                        <div className="bg-[#0f0f18]/90 border border-gray-800/80 rounded-lg p-2 flex items-end justify-between h-14 shadow-inner relative px-4">
                          <span className="absolute top-1 left-2 text-[7px] font-mono text-gray-500">Live Analytics</span>
                          <div className="w-[10%] bg-brand-orange/20 rounded-t h-[25%]"></div>
                          <div className="w-[10%] bg-brand-orange/40 rounded-t h-[50%]"></div>
                          <div className="w-[10%] bg-brand-orange/30 rounded-t h-[35%]"></div>
                          <div className="w-[10%] bg-brand-orange/60 rounded-t h-[70%]"></div>
                          <div className="w-[10%] bg-brand-orange/50 rounded-t h-[55%]"></div>
                          <div className="w-[10%] bg-brand-orange/80 rounded-t h-[85%]"></div>
                          <div className="w-[10%] bg-brand-orange rounded-t h-[95%]"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Block: Project details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="bg-brand-orange-10 text-brand-orange font-bold font-sans text-[9px] tracking-wider uppercase px-2.5 py-0.5 rounded border border-brand-orange/10">
                        {proj.category}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-brand-orange transition-colors duration-200">
                      {proj.title}
                    </h3>
                    
                    <p className="text-gray-500 font-sans text-xs leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-gray-50">
                    {/* Tech badges limit to 3 */}
                    <div className="flex flex-wrap gap-1">
                      {proj.tech_stack && proj.tech_stack.slice(0, 3).map((tech, i) => (
                        <span 
                          key={i} 
                          className="bg-gray-50 text-gray-400 font-mono text-[9px] px-2 py-0.5 rounded border border-gray-100"
                        >
                          {tech}
                        </span>
                      ))}
                      {proj.tech_stack && proj.tech_stack.length > 3 && (
                        <span className="text-[9px] font-mono text-gray-400 px-1 py-0.5">
                          +{proj.tech_stack.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-2">
                      {proj.github_url && (
                        <a 
                          href={proj.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          title="View Repository"
                          className="w-7 h-7 rounded-full border border-gray-100 text-gray-400 hover:text-brand-orange hover:border-brand-orange flex items-center justify-center transition-all duration-300"
                        >
                          <i className="fa-brands fa-github text-sm"></i>
                        </a>
                      )}
                      {proj.demo_url && (
                        <a 
                          href={proj.demo_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          title="View Live Demo"
                          className="w-7 h-7 rounded-full border border-gray-100 text-gray-400 hover:text-brand-orange hover:border-brand-orange flex items-center justify-center transition-all duration-300"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

window.Projects = Projects;
