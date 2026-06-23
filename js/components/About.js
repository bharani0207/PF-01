const About = ({ profile, projectsCount, skillsCount }) => {
  const [avatarSrc, setAvatarSrc] = React.useState(profile.avatar_url || '');

  React.useEffect(() => {
    setAvatarSrc(profile.avatar_url || '');
  }, [profile.avatar_url]);

  const statusChips = [
    { icon: 'fa-circle-dot', label: 'Available for Work', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
    { icon: 'fa-graduation-cap', label: 'B.Tech AIDS · DSEC', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
    { icon: 'fa-location-dot', label: 'Tamil Nadu, India', color: '#FF5500', bg: 'rgba(255,85,0,0.08)' },
    { icon: 'fa-code-branch', label: 'Open Source', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
  ];

  return (
    <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
      <style>{`
        /* ── HUD Corner Brackets ── */
        @keyframes hud-in {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes light-breathe {
          0%,100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 0.85; transform: scale(1.12); }
        }
        @keyframes hud-pulse {
          0%,100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }
        @keyframes chip-slide {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes hud-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes border-glow {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,85,0,0.15), 0 8px 40px rgba(0,0,0,0.18); }
          50%      { box-shadow: 0 0 30px 4px rgba(255,85,0,0.18), 0 8px 40px rgba(0,0,0,0.22); }
        }
        @keyframes dot-blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.2; }
        }
        .hud-card { animation: hud-float 5s ease-in-out infinite; }
        .hud-border-glow { animation: border-glow 3s ease-in-out infinite; }
        .hud-corner {
          position: absolute; width: 22px; height: 22px;
          animation: hud-in 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .hud-corner-tl { top: -2px; left: -2px; border-top: 3px solid #FF5500; border-left: 3px solid #FF5500; border-radius: 4px 0 0 0; }
        .hud-corner-tr { top: -2px; right: -2px; border-top: 3px solid #FF5500; border-right: 3px solid #FF5500; border-radius: 0 4px 0 0; animation-delay: 0.1s; }
        .hud-corner-bl { bottom: -2px; left: -2px; border-bottom: 3px solid #FF5500; border-left: 3px solid #FF5500; border-radius: 0 0 0 4px; animation-delay: 0.2s; }
        .hud-corner-br { bottom: -2px; right: -2px; border-bottom: 3px solid #FF5500; border-right: 3px solid #FF5500; border-radius: 0 0 4px 0; animation-delay: 0.3s; }
        .hud-light-orb {
          position: absolute; border-radius: 50%; pointer-events: none;
          filter: blur(28px); mix-blend-mode: screen;
          animation: light-breathe 4s ease-in-out infinite;
        }
        .hud-light-orb-1 {
          width: 140px; height: 140px; top: -30px; left: -30px;
          background: radial-gradient(circle, rgba(255,120,40,0.55) 0%, transparent 70%);
          animation-delay: 0s;
        }
        .hud-light-orb-2 {
          width: 120px; height: 120px; bottom: -20px; right: -20px;
          background: radial-gradient(circle, rgba(99,102,241,0.45) 0%, transparent 70%);
          animation-delay: 2s;
        }
        .hud-light-orb-3 {
          width: 90px; height: 90px; top: 40%; left: 50%; transform: translate(-50%,-50%);
          background: radial-gradient(circle, rgba(255,200,80,0.2) 0%, transparent 70%);
          animation-delay: 1s;
        }
        .hud-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,85,0,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,85,0,0.06) 1px, transparent 1px);
          background-size: 24px 24px;
          border-radius: inherit;
        }
        .status-chip {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 14px; border-radius: 10px;
          font-size: 11.5px; font-weight: 700;
          border: 1px solid currentColor;
          animation: chip-slide 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: default;
        }
        .status-chip:hover { transform: translateX(-4px); box-shadow: 4px 0 18px rgba(0,0,0,0.1); }
        .dot-live { animation: dot-blink 1.2s ease-in-out infinite; }
        .hud-tag {
          position: absolute;
          background: rgba(15,15,20,0.85);
          color: #FF5500; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 600;
          padding: 3px 8px; border-radius: 4px;
          letter-spacing: 0.08em;
          border: 1px solid rgba(255,85,0,0.3);
          backdrop-filter: blur(4px);
          animation: hud-pulse 2s ease-in-out infinite;
        }
        .hud-tag-tl { top: -12px; left: 8px; animation-delay: 0s; }
        .hud-tag-br { bottom: -12px; right: 8px; animation-delay: 1s; }
        .hud-tag-tr { top: 16px; right: -52px; animation-delay: 0.5s; }
        @media (max-width: 1024px) {
          .hud-tag-tr { display: none; }
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

        {/* ── About Text (Left) ── */}
        <div className="lg:col-span-7 space-y-8 reveal">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 mb-2">
              About Me
            </h2>
            <div className="w-20 h-1 bg-brand-orange rounded-full"></div>
          </div>

          <p className="text-lg text-gray-600 leading-relaxed font-sans">
            {profile.bio}
          </p>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: projectsCount, label: "Projects Built" },
              { value: "4",           label: "Certifications" },
              { value: skillsCount,   label: "Tech Skills" },
              { value: "3rd",         label: "Year at DSEC" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-5 border border-[#FCA57A]/15 rounded-[12px] shadow-sm flex flex-col justify-center">
                <span className="text-3xl font-serif font-bold text-brand-orange mb-1">{stat.value}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold font-sans">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Certification Badges */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-gray-800">Certifications</h3>
            <div className="flex flex-wrap gap-3">
              {["Coursera Full Stack Development","IBM Full Stack Development","Google Generative AI","AWS Generative AI"].map((cert, i) => (
                <span key={i} className="bg-brand-orange-10 border border-brand-orange/20 text-brand-orange font-semibold text-xs px-3.5 py-2 rounded-full inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-award"></i>{cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── HUD Profile Card (Right) ── */}
        <div className="lg:col-span-5 flex justify-center items-start gap-4 reveal">

          {/* Status Chips — stacked on left of card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '24px', minWidth: '160px' }}>
            {statusChips.map((chip, i) => (
              <div
                key={i}
                className="status-chip"
                style={{
                  color: chip.color,
                  background: chip.bg,
                  borderColor: chip.color + '40',
                  animationDelay: (i * 0.12) + 's'
                }}
              >
                <i
                  className={`fa-solid ${chip.icon}`}
                  style={{
                    fontSize: '11px',
                    ...(i === 0 ? { animation: 'dot-blink 1.2s ease-in-out infinite' } : {})
                  }}
                ></i>
                <span style={{ fontFamily: 'DM Sans, sans-serif', lineHeight: 1.2 }}>{chip.label}</span>
              </div>
            ))}
          </div>

          {/* Photo HUD Frame */}
          <div className="hud-card" style={{ position: 'relative', flexShrink: 0 }}>

            {/* HUD meta tags */}
            <div className="hud-tag hud-tag-tl">SYS::PROFILE</div>
            <div className="hud-tag hud-tag-br">AIDS · 2027</div>
            <div className="hud-tag hud-tag-tr">ACTIVE</div>

            {/* Outer glow frame */}
            <div className="hud-border-glow" style={{
              width: '240px',
              height: '290px',
              borderRadius: '18px',
              border: '1.5px solid rgba(255,85,0,0.25)',
              overflow: 'hidden',
              position: 'relative',
              background: 'linear-gradient(160deg, #0f0f14 0%, #1a1020 100%)',
            }}>
              {/* Grid overlay */}
              <div className="hud-grid"></div>

              {/* Corner brackets */}
              <div className="hud-corner hud-corner-tl"></div>
              <div className="hud-corner hud-corner-tr"></div>
              <div className="hud-corner hud-corner-bl"></div>
              <div className="hud-corner hud-corner-br"></div>


              {/* Ambient light orbs */}
              <div className="hud-light-orb hud-light-orb-1"></div>
              <div className="hud-light-orb hud-light-orb-2"></div>
              <div className="hud-light-orb hud-light-orb-3"></div>


              {/* Photo */}
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Bharanishwar P"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'top center',
                    display: 'block',
                    filter: 'contrast(1.05) saturate(1.1)',
                    position: 'relative', zIndex: 2
                  }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  position: 'relative', zIndex: 2
                }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '90px', fontWeight: 700, color: '#FF5500', opacity: 0.85 }}>B</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '0.12em', marginTop: '4px' }}>BHARANISHWAR</span>
                </div>
              )}

              {/* Bottom name bar */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 8,
                background: 'linear-gradient(to top, rgba(10,8,16,0.92) 0%, rgba(10,8,16,0.6) 60%, transparent 100%)',
                padding: '28px 14px 12px',
                display: 'flex', flexDirection: 'column', gap: '2px'
              }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: '15px', fontFamily: 'Playfair Display, serif', letterSpacing: '0.02em' }}>
                  Bharanishwar P
                </span>
                <span style={{ color: 'rgba(255,85,0,0.9)', fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.1em' }}>
                  AI &amp; FULL STACK DEVELOPER
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

window.About = About;
