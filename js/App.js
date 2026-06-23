const { useState, useEffect, useRef, useCallback } = React;

// Retrieve globals from window
const supabase = window.supabase;
const isSupabaseConfigured = window.isSupabaseConfigured;
const DEFAULT_PROFILE = window.DEFAULT_PROFILE;
const DEFAULT_SKILLS = window.DEFAULT_SKILLS;
const DEFAULT_PROJECTS = window.DEFAULT_PROJECTS;
const DEFAULT_EXPERIENCE = window.DEFAULT_EXPERIENCE;
const THEME_PRESETS = window.THEME_PRESETS;

// Retrieve modular components from window
const EmberCanvas = window.EmberCanvas;
const Header = window.Header;
const Hero = window.Hero;
const About = window.About;
const Skills = window.Skills;
const Projects = window.Projects;
const Timeline = window.Timeline;
const Contact = window.Contact;
const Footer = window.Footer;
const AdminPanel = window.AdminPanel;

function App() {
  // Dynamic Theme Color Setup
  const [themeColor, setThemeColor] = useState(() => {
    const saved = localStorage.getItem('themeColor');
    return saved || THEME_PRESETS.ember.value;
  });

  // Data States
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [skills, setSkills] = useState(DEFAULT_SKILLS);
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [experience, setExperience] = useState(DEFAULT_EXPERIENCE);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState('All');
  const [activeNavLink, setActiveNavLink] = useState('hero');

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [submittingContact, setSubmittingContact] = useState(false);

  // Admin Panel States
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminTab, setAdminTab] = useState('dashboard');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Admin Form States for adding/editing items
  const [editingProject, setEditingProject] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);

  // Trigger root variables update when theme changes
  useEffect(() => {
    document.documentElement.style.setProperty('--brand-color', themeColor);
    // Compute RGB format for transparent backgrounds
    let presetKey = Object.keys(THEME_PRESETS).find(key => THEME_PRESETS[key].value === themeColor);
    if (presetKey) {
      document.documentElement.style.setProperty('--brand-color-rgb', THEME_PRESETS[presetKey].rgb);
    }
    localStorage.setItem('themeColor', themeColor);
  }, [themeColor]);

  // Fetch Portfolio Data
  const fetchPortfolioData = useCallback(async () => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      try {
        const [
          { data: profilesData, error: profError },
          { data: projectsData, error: projError },
          { data: skillsData, error: skillError },
          { data: expData, error: expError },
          { data: msgData, error: msgError }
        ] = await Promise.all([
          supabase.from('profiles').select('*').single(),
          supabase.from('projects').select('*').order('sort_order', { ascending: true }),
          supabase.from('skills').select('*').order('sort_order', { ascending: true }),
          supabase.from('experience').select('*').order('sort_order', { ascending: true }),
          supabase.from('messages').select('*').order('created_at', { ascending: false })
        ]);

        if (profilesData) setProfile(profilesData);
        if (projectsData && projectsData.length) setProjects(projectsData);
        if (skillsData && skillsData.length) setSkills(skillsData);
        if (expData && expData.length) setExperience(expData);
        if (msgData) setMessages(msgData);

        // Set logged in session status
        const { data: { session } } = await supabase.auth.getSession();
        if (session) setIsAdminAuthenticated(true);

      } catch (err) {
        console.error('Error fetching from Supabase, rendering fallbacks', err);
      }
    } else {
      // Read local storage for admin mock persistence testing
      const localProfile = localStorage.getItem('mock_profile');
      const localProjects = localStorage.getItem('mock_projects');
      const localSkills = localStorage.getItem('mock_skills');
      const localExperience = localStorage.getItem('mock_experience');
      const localMessages = localStorage.getItem('mock_messages');

      if (localProfile) setProfile(JSON.parse(localProfile));
      if (localProjects) setProjects(JSON.parse(localProjects));
      if (localSkills) setSkills(JSON.parse(localSkills));
      if (localExperience) setExperience(JSON.parse(localExperience));
      if (localMessages) setMessages(JSON.parse(localMessages));
    }
    setIsLoading(false);
  }, []);

  // Initialization Load
  useEffect(() => {
    fetchPortfolioData();

    // Listen for admin toggle key combo (Ctrl + Shift + A)
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'A') {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fetchPortfolioData]);

  // IntersectionObserver for ScrollReveal effects
  useEffect(() => {
    if (isLoading) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    // Setup active section indicator on scroll
    const sections = document.querySelectorAll('section');
    const scrollHandler = () => {
      let currentSectionId = 'hero';
      sections.forEach(s => {
        const top = s.offsetTop - 100;
        if (window.scrollY >= top) {
          currentSectionId = s.id;
        }
      });
      setActiveNavLink(currentSectionId);
    };
    window.addEventListener('scroll', scrollHandler);

    return () => {
      elements.forEach(el => observer.unobserve(el));
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [isLoading]);

  // Supabase / Local database write helpers
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    
    setSubmittingContact(true);

    // Send email via FormSubmit.co
    try {
      await fetch("https://formsubmit.co/ajax/bharanidinesh726@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message
        })
      });
    } catch (emailErr) {
      console.warn("Failed to send email via FormSubmit:", emailErr);
    }

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('messages')
          .insert([
            { name: contactForm.name, email: contactForm.email, message: contactForm.message, read: false }
          ]);
        if (error) throw error;
        setContactSubmitted(true);
        setContactForm({ name: '', email: '', message: '' });
      } catch (err) {
        alert('Could not submit message. Please try again.');
        console.error(err);
      }
    } else {
      // Local fallback simulation
      const newMessage = {
        id: Date.now(),
        name: contactForm.name,
        email: contactForm.email,
        message: contactForm.message,
        read: false,
        created_at: new Date().toISOString()
      };
      const updatedMessages = [newMessage, ...messages];
      setMessages(updatedMessages);
      localStorage.setItem('mock_messages', JSON.stringify(updatedMessages));
      setContactSubmitted(true);
      setContactForm({ name: '', email: '', message: '' });
    }
    setSubmittingContact(false);
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  // Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: loginForm.email,
          password: loginForm.password
        });
        if (error) throw error;
        setIsAdminAuthenticated(true);
        setLoginForm({ email: '', password: '' });
      } catch (err) {
        setLoginError(err.message || 'Invalid login details');
      }
    } else {
      // Mock login credentials: bharani / 2005
      if (loginForm.email === 'bharani' && loginForm.password === '2005') {
        setIsAdminAuthenticated(true);
        setLoginForm({ email: '', password: '' });
      } else {
        setLoginError('Invalid mock details. Use bharani / 2005');
      }
    }
  };

  // Admin Logout
  const handleAdminLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
  };

  // ==========================================
  // DATABASE MUTATION FUNCTIONS (ADMIN PANEL)
  // ==========================================
  
  // Update Profile Details
  const updateProfile = async (updatedData) => {
    if (isSupabaseConfigured) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .upsert({ id: user.id, ...updatedData });
        if (error) alert(error.message);
      }
    } else {
      localStorage.setItem('mock_profile', JSON.stringify(updatedData));
    }
    setProfile(updatedData);
  };

  // Project Mutations
  const saveProject = async (proj) => {
    let updated;
    if (isSupabaseConfigured) {
      if (proj.id && typeof proj.id === 'number' && proj.id < 10000) { // Checking if existing
        const { error } = await supabase.from('projects').update(proj).eq('id', proj.id);
        if (error) alert(error.message);
      } else {
        const { id, ...newProj } = proj; // Remove local dummy id
        const { error } = await supabase.from('projects').insert(newProj);
        if (error) alert(error.message);
      }
      // Reload
      const { data } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
      if (data) setProjects(data);
    } else {
      if (proj.id) {
        updated = projects.map(p => p.id === proj.id ? proj : p);
      } else {
        updated = [...projects, { ...proj, id: Date.now() }];
      }
      setProjects(updated);
      localStorage.setItem('mock_projects', JSON.stringify(updated));
    }
    setEditingProject(null);
  };

  const deleteProject = async (id) => {
    if (confirm('Delete project?')) {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) alert(error.message);
        const { data } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
        if (data) setProjects(data);
      } else {
        const updated = projects.filter(p => p.id !== id);
        setProjects(updated);
        localStorage.setItem('mock_projects', JSON.stringify(updated));
      }
    }
  };

  // Skill Mutations
  const saveSkill = async (sk) => {
    let updated;
    if (isSupabaseConfigured) {
      if (sk.id && typeof sk.id === 'number' && sk.id < 10000) {
        const { error } = await supabase.from('skills').update(sk).eq('id', sk.id);
        if (error) alert(error.message);
      } else {
        const { id, ...newSk } = sk;
        const { error } = await supabase.from('skills').insert(newSk);
        if (error) alert(error.message);
      }
      const { data } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
      if (data) setSkills(data);
    } else {
      if (sk.id) {
        updated = skills.map(s => s.id === sk.id ? sk : s);
      } else {
        updated = [...skills, { ...sk, id: Date.now() }];
      }
      setSkills(updated);
      localStorage.setItem('mock_skills', JSON.stringify(updated));
    }
    setEditingSkill(null);
  };

  const deleteSkill = async (id) => {
    if (confirm('Delete skill?')) {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('skills').delete().eq('id', id);
        if (error) alert(error.message);
        const { data } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
        if (data) setSkills(data);
      } else {
        const updated = skills.filter(s => s.id !== id);
        setSkills(updated);
        localStorage.setItem('mock_skills', JSON.stringify(updated));
      }
    }
  };

  // Experience Mutations
  const saveExperience = async (exp) => {
    let updated;
    if (isSupabaseConfigured) {
      if (exp.id && typeof exp.id === 'number' && exp.id < 10000) {
        const { error } = await supabase.from('experience').update(exp).eq('id', exp.id);
        if (error) alert(error.message);
      } else {
        const { id, ...newExp } = exp;
        const { error } = await supabase.from('experience').insert(newExp);
        if (error) alert(error.message);
      }
      const { data } = await supabase.from('experience').select('*').order('sort_order', { ascending: true });
      if (data) setExperience(data);
    } else {
      if (exp.id) {
        updated = experience.map(e => e.id === exp.id ? exp : e);
      } else {
        updated = [...experience, { ...exp, id: Date.now() }];
      }
      setExperience(updated);
      localStorage.setItem('mock_experience', JSON.stringify(updated));
    }
    setEditingExperience(null);
  };

  const deleteExperience = async (id) => {
    if (confirm('Delete timeline item?')) {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('experience').delete().eq('id', id);
        if (error) alert(error.message);
        const { data } = await supabase.from('experience').select('*').order('sort_order', { ascending: true });
        if (data) setExperience(data);
      } else {
        const updated = experience.filter(e => e.id !== id);
        setExperience(updated);
        localStorage.setItem('mock_experience', JSON.stringify(updated));
      }
    }
  };

  // Message Admin Interactions
  const markMessageRead = async (id, status) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('messages').update({ read: status }).eq('id', id);
      if (error) console.error(error);
      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (data) setMessages(data);
    } else {
      const updated = messages.map(m => m.id === id ? { ...m, read: status } : m);
      setMessages(updated);
      localStorage.setItem('mock_messages', JSON.stringify(updated));
    }
  };

  const deleteMessage = async (id) => {
    if (confirm('Delete contact message?')) {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('messages').delete().eq('id', id);
        if (error) console.error(error);
        const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        if (data) setMessages(data);
      } else {
        const updated = messages.filter(m => m.id !== id);
        setMessages(updated);
        localStorage.setItem('mock_messages', JSON.stringify(updated));
      }
    }
  };

  // Simple navigation smooth scroll function
  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brandWhite">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 rounded-full border-t-transparent animate-spin border-brand-orange pulse-orange"></div>
          <p className="mt-4 font-serif text-brand-orange text-lg tracking-wider">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      
      <Header
        activeNavLink={activeNavLink}
        scrollToSection={scrollToSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <Hero
        profile={profile}
        themeColor={themeColor}
        scrollToSection={scrollToSection}
      />

      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FCA57A]/30 to-transparent"></div>

      <About
        profile={profile}
        projectsCount={projects.length}
        skillsCount={skills.length}
      />

      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FCA57A]/30 to-transparent"></div>

      <Skills
        skills={skills}
        themeColor={themeColor}
      />

      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FCA57A]/30 to-transparent"></div>

      <Projects
        projects={projects}
        projectFilter={projectFilter}
        setProjectFilter={setProjectFilter}
      />

      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FCA57A]/30 to-transparent"></div>

      <Timeline
        experience={experience}
      />

      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FCA57A]/30 to-transparent"></div>

      <Contact
        profile={profile}
        contactForm={contactForm}
        setContactForm={setContactForm}
        handleContactSubmit={handleContactSubmit}
        submittingContact={submittingContact}
        contactSubmitted={contactSubmitted}
      />

      <Footer
        setIsAdminOpen={setIsAdminOpen}
      />

      {/* Sticky Bottom Hire Bar (Mobile Specifics) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#FCA57A]/25 p-3 flex items-center justify-between z-40">
        <span className="font-serif text-sm font-bold text-gray-800">{profile.full_name}</span>
        <button 
          onClick={() => scrollToSection('contact')} 
          className="bg-brand-orange text-white text-xs px-5 py-2.5 font-bold rounded-[6px] tracking-wide"
        >
          Hire Me
        </button>
      </div>

      <AdminPanel
        isAdminOpen={isAdminOpen}
        isAdminAuthenticated={isAdminAuthenticated}
        setIsAdminOpen={setIsAdminOpen}
        adminTab={adminTab}
        setAdminTab={setAdminTab}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        loginError={loginError}
        handleAdminLogin={handleAdminLogin}
        handleAdminLogout={handleAdminLogout}
        profile={profile}
        updateProfile={updateProfile}
        projects={projects}
        saveProject={saveProject}
        deleteProject={deleteProject}
        skills={skills}
        saveSkill={saveSkill}
        deleteSkill={deleteSkill}
        experience={experience}
        saveExperience={saveExperience}
        deleteExperience={deleteExperience}
        messages={messages}
        markMessageRead={markMessageRead}
        deleteMessage={deleteMessage}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
        editingProject={editingProject}
        setEditingProject={setEditingProject}
        editingSkill={editingSkill}
        setEditingSkill={setEditingSkill}
        editingExperience={editingExperience}
        setEditingExperience={setEditingExperience}
      />

    </div>
  );
}

// Render the React Application
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
