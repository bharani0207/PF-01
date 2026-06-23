const { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } = window.Recharts || {};

const Skills = ({ skills, themeColor }) => {
  const getRadarChartData = () => {
    const categories = {
      'AI / ML': [],
      'Frontend': [],
      'Backend': [],
      'Database': [],
      'DevOps': []
    };

    skills.forEach(s => {
      let cat = s.category;
      if (cat === 'Database & DevOps') {
        if (s.name.includes('Docker') || s.name.includes('Git') || s.name.includes('GitHub')) {
          categories['DevOps'].push(s.level);
        } else {
          categories['Database'].push(s.level);
        }
      } else if (cat === 'AI/ML') {
        categories['AI / ML'].push(s.level);
      } else if (categories[cat]) {
        categories[cat].push(s.level);
      }
    });

    return Object.keys(categories).map(cat => {
      const values = categories[cat];
      const average = values.length ? (values.reduce((sum, val) => sum + val, 0) / values.length) * 10 : 70; // fallback to 70
      return {
        subject: cat,
        value: Math.round(average),
        fullMark: 100
      };
    });
  };

  const chartData = getRadarChartData();

  return (
    <section id="skills" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16 reveal">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 mb-2">Technical Expertise</h2>
        <div className="w-20 h-1 bg-brand-orange rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 font-sans">
          A modular breakdown of my technical capability scorecards and direct experience levels across backend, frontend, database systems, and AI models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Radar Chart (Left Column - Desktop Only) */}
        <div className="lg:col-span-6 hidden md:block h-96 reveal flex items-center justify-center">
          {ResponsiveContainer ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="#FCA57A" opacity={0.3} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 13, fontFamily: 'DM Sans', fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <Radar
                  name="Bharani"
                  dataKey="value"
                  stroke={themeColor}
                  fill={themeColor}
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">Loading chart graphics...</p>
          )}
        </div>

        {/* Skills Tags List (Right Column - Desktop / Full list) */}
        <div className="lg:col-span-6 space-y-8 reveal">
          
          {/* Horizontal Scroll on Mobile, Standard Grid on Desktop */}
          <div className="block md:hidden overflow-x-auto whitespace-nowrap pb-4 scrollbar-thin">
            <div className="flex gap-3">
              {skills.map(s => (
                <div 
                  key={s.id} 
                  className="inline-block bg-white border border-[#FCA57A]/20 px-4 py-2.5 rounded-[8px] shadow-sm min-w-[140px]"
                >
                  <div className="text-xs text-gray-400 font-sans mb-1 font-medium">{s.category}</div>
                  <div className="font-bold text-gray-800 text-sm font-sans">{s.name}</div>
                  <div className="w-full bg-gray-100 h-1 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-brand-orange h-full rounded-full" 
                      style={{ width: `${s.level * 10}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Category layout */}
          <div className="hidden md:grid grid-cols-1 gap-6">
            {['AI/ML', 'Frontend', 'Backend', 'Database & DevOps'].map((category) => {
              const categorySkills = skills.filter(s => s.category === category);
              return (
                <div key={category} className="space-y-3">
                  <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-brand-orange">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categorySkills.map((s) => (
                      <div 
                        key={s.id} 
                        className="bg-white border border-[#FCA57A]/15 px-4 py-3 rounded-[8px] shadow-sm flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-sans font-semibold text-gray-800 text-sm">{s.name}</span>
                          <span className="text-xs font-mono text-gray-500 font-bold">{s.level}/10</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-brand-orange h-full rounded-full transition-all duration-500" 
                            style={{ width: `${s.level * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

window.Skills = Skills;
