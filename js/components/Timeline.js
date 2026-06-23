const Timeline = ({ experience }) => {
  return (
    <section id="timeline" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-20 reveal">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 mb-2">Education & Milestones</h2>
        <div className="w-20 h-1 bg-brand-orange rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 font-sans">
          My academic details, standard certifications, and structural roadmap representing interview preparations.
        </p>
      </div>

      {/* Timeline wrapper */}
      <div className="relative border-l-2 border-[#FCA57A]/30 pl-6 sm:pl-0 sm:border-l-0 reveal">
        
        {/* Centered connector vertical line on desktop */}
        <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-orange via-[#FCA57A]/50 to-brand-orange-10 transform -translate-x-1/2"></div>
        
        <div className="space-y-12">
          {experience.map((item, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={item.id} 
                className={`relative flex flex-col sm:flex-row items-start ${
                  isEven ? 'sm:justify-start' : 'sm:justify-end'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute -left-[31px] sm:left-1/2 sm:-translate-x-1/2 w-4 h-4 rounded-full bg-brand-orange ring-4 ring-orange-100 z-10"></div>
                
                {/* Timeline card */}
                <div 
                  className={`w-full sm:w-[45%] bg-white border border-[#FCA57A]/15 rounded-[12px] p-6 shadow-sm custom-card ${
                    isEven ? 'sm:text-right' : 'sm:text-left'
                  }`}
                >
                  <span className="inline-block bg-brand-orange-10 text-brand-orange font-bold font-sans text-xs px-3 py-1 rounded-full mb-3">
                    {item.start_date} {item.end_date ? `– ${item.end_date}` : ''}
                  </span>

                  <h3 className="font-serif text-lg font-bold text-gray-900 mb-1">
                    {item.role}
                  </h3>

                  <h4 className="font-sans text-sm font-semibold text-brand-orange mb-4">
                    {item.company}
                  </h4>

                  <ul className={`space-y-2 text-sm text-gray-600 font-sans ${isEven ? 'sm:text-right' : 'text-left'}`}>
                    {item.achievements && item.achievements.map((ach, i) => (
                      <li key={i} className="flex gap-2 items-start justify-start sm:justify-items-end">
                        <i className={`fa-solid fa-circle-check text-brand-orange text-xs mt-1 ${isEven ? 'sm:order-2' : ''}`}></i>
                        <span className={isEven ? 'sm:mr-1' : ''}>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

window.Timeline = Timeline;
