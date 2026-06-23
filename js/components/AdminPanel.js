const AdminPanel = ({
  isAdminOpen,
  isAdminAuthenticated,
  setIsAdminOpen,
  adminTab,
  setAdminTab,
  loginForm,
  setLoginForm,
  loginError,
  handleAdminLogin,
  handleAdminLogout,
  profile,
  updateProfile,
  projects,
  saveProject,
  deleteProject,
  skills,
  saveSkill,
  deleteSkill,
  experience,
  saveExperience,
  deleteExperience,
  messages,
  markMessageRead,
  deleteMessage,
  themeColor,
  setThemeColor,
  editingProject,
  setEditingProject,
  editingSkill,
  setEditingSkill,
  editingExperience,
  setEditingExperience
}) => {
  // Read hooks & globals
  const { useState, useEffect, useRef } = React;
  const isSupabaseConfigured = window.isSupabaseConfigured;
  const THEME_PRESETS = window.THEME_PRESETS;

  // Media upload and cropper states
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [avatarUploadStatus, setAvatarUploadStatus] = useState('');
  const [resumeUploadStatus, setResumeUploadStatus] = useState('');

  const [croppingImage, setCroppingImage] = useState(null);
  const [zoomVal, setZoomVal] = useState(1);
  const [flipX, setFlipX] = useState(1);
  const [flipY, setFlipY] = useState(1);

  const imageRef = useRef(null);
  const cropperInstance = useRef(null);

  // Initialize Cropper.js instance when modal opens
  useEffect(() => {
    if (croppingImage && imageRef.current) {
      if (cropperInstance.current) {
        cropperInstance.current.destroy();
      }
      cropperInstance.current = new window.Cropper(imageRef.current, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.9,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        zoom: function (e) {
          setZoomVal(e.detail.ratio);
        }
      });
    }
    return () => {
      if (cropperInstance.current) {
        cropperInstance.current.destroy();
        cropperInstance.current = null;
      }
    };
  }, [croppingImage]);

  // Adjustments handlers
  const handleRotate = (deg) => {
    if (cropperInstance.current) {
      cropperInstance.current.rotate(deg);
    }
  };

  const handleFlipX = () => {
    if (cropperInstance.current) {
      const next = flipX === 1 ? -1 : 1;
      setFlipX(next);
      cropperInstance.current.scaleX(next);
    }
  };

  const handleFlipY = () => {
    if (cropperInstance.current) {
      const next = flipY === 1 ? -1 : 1;
      setFlipY(next);
      cropperInstance.current.scaleY(next);
    }
  };

  const handleZoomSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    if (cropperInstance.current) {
      cropperInstance.current.zoomTo(val);
    }
  };

  // Profile picture base64 crop & upload trigger
  const handleCropUpload = async () => {
    if (!cropperInstance.current) return;
    setUploadingAvatar(true);
    setAvatarUploadStatus('');
    try {
      const canvas = cropperInstance.current.getCroppedCanvas({
        width: 300,
        height: 300
      });
      const base64Data = canvas.toDataURL('image/png');

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename: 'developer_avatar.png', base64Data })
      });

      const data = await res.json();
      if (res.ok) {
        setAvatarUploadStatus('Success! Profile photo updated.');
        updateProfile({ ...profile, avatar_url: './developer_avatar.png?t=' + Date.now() });
        setCroppingImage(null);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      setAvatarUploadStatus('Error: ' + err.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // General File Picker Handler (specifically for Resume PDF and launching Cropper modal)
  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'avatar') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCroppingImage(event.target.result);
        setZoomVal(1);
        setFlipX(1);
        setFlipY(1);
      };
      reader.readAsDataURL(file);
    } else if (type === 'resume') {
      setUploadingResume(true);
      setResumeUploadStatus('');
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64Data = event.target.result;
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename: 'resume.pdf', base64Data })
          });
          const data = await res.json();
          if (res.ok) {
            setResumeUploadStatus('Success! Resume PDF uploaded successfully.');
          } else {
            throw new Error(data.error || 'Upload failed');
          }
        } catch (err) {
          console.error(err);
          setResumeUploadStatus('Error: ' + err.message);
        } finally {
          setUploadingResume(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAdminOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans">
      
      {!isAdminAuthenticated ? (
        /* ------------------------------------------
           ADMIN LOGIN PANEL
           ------------------------------------------ */
        <div className="w-full max-w-md bg-white border border-[#FCA57A]/30 rounded-2xl shadow-2xl p-8 relative animate-fade-in">
          <button 
            onClick={() => setIsAdminOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
          
          <div className="text-center mb-6">
            <span className="inline-block p-3 rounded-full bg-orange-100 text-brand-orange mb-3">
              <i className="fa-solid fa-lock text-2xl"></i>
            </span>
            <h2 className="font-serif text-2xl font-bold text-gray-900">Admin Control Hub</h2>
            <p className="text-xs text-gray-500 mt-1">
              {isSupabaseConfigured ? 'Authenticate with Supabase Credentials' : 'Authenticate with simulated credentials'}
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Username / Email</label>
              <input 
                type="text" 
                value={loginForm.email} 
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder={isSupabaseConfigured ? "admin@domain.com" : "bharani"} 
                className="w-full bg-brandWhite border border-[#FCA57A]/25 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Password</label>
              <input 
                type="password" 
                value={loginForm.password} 
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••" 
                className="w-full bg-brandWhite border border-[#FCA57A]/25 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                required
              />
            </div>

            {loginError && (
              <p className="text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded-lg">{loginError}</p>
            )}

            <button 
              type="submit" 
              className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20"
            >
              Sign In
            </button>
          </form>
        </div>
      ) : (
        /* ------------------------------------------
           MAIN ADMIN HUB INTERFACE (LOGGED IN)
           ------------------------------------------ */
        <div className="w-full max-w-5xl h-[85vh] bg-white border border-[#FCA57A]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-fade-in">
          
          {/* Navigation Sidebar */}
          <aside className="w-full md:w-64 bg-gray-50 border-r border-[#FCA57A]/10 flex flex-col shrink-0">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-800">Admin Control</h3>
                <span className="text-[10px] text-gray-400 font-semibold tracking-wide uppercase">Workspace Active</span>
              </div>
              <button 
                onClick={() => setIsAdminOpen(false)} 
                className="md:hidden text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
              {[
                { key: 'dashboard', name: 'Dashboard', icon: 'fa-chart-line' },
                { key: 'profile', name: 'Profile Editor', icon: 'fa-user-gear' },
                { key: 'projects', name: 'Projects Manager', icon: 'fa-diagram-project' },
                { key: 'skills', name: 'Skills Deck', icon: 'fa-brain' },
                { key: 'experience', name: 'Timeline Deck', icon: 'fa-briefcase' },
                { key: 'messages', name: 'Contact Messages', icon: 'fa-envelope', badge: messages.filter(m => !m.read).length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setAdminTab(tab.key)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                    adminTab === tab.key 
                      ? 'bg-brand-orange text-white shadow-md shadow-orange-500/10' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <i className={`fa-solid ${tab.icon} w-5`}></i>
                    {tab.name}
                  </div>
                  {tab.badge > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      adminTab === tab.key ? 'bg-white text-brand-orange' : 'bg-brand-orange text-white'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-100 bg-white">
              <button 
                onClick={handleAdminLogout} 
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-colors duration-200"
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                Sign Out
              </button>
            </div>
          </aside>

          {/* Dynamic Content Panel */}
          <main className="flex-1 p-8 overflow-y-auto bg-brandWhite/30 flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
              <h2 className="font-serif text-2xl font-bold text-gray-800 capitalize">
                {adminTab === 'experience' ? 'Timeline / Experience Deck' : `${adminTab} panel`}
              </h2>
              <button 
                onClick={() => setIsAdminOpen(false)}
                className="hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                title="Close Admin Panel"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* TAB CONTENT SWITCH */}
            <div className="flex-1">
              
              {/* 1. DASHBOARD */}
              {adminTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-100 p-6 rounded-2xl">
                    <h3 className="font-serif text-lg font-bold text-gray-800">Welcome Back, {profile.full_name}!</h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      This dashboard allows you to modify all profile descriptions, upload visual artifacts, handle incoming client inquiries, and manage items inside your timeline and project card decks.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: 'Projects Card Deck', count: projects.length, icon: 'fa-diagram-project', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
                      { name: 'Total Skills Deck', count: skills.length, icon: 'fa-brain', color: 'text-amber-600 bg-amber-50 border-amber-100' },
                      { name: 'Experience & Milestone Timeline', count: experience.length, icon: 'fa-briefcase', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                      { name: 'Client Inquiries', count: messages.length, icon: 'fa-envelope', color: 'text-rose-600 bg-rose-50 border-rose-100' }
                    ].map((stat, i) => (
                      <div key={i} className={`p-5 rounded-2xl border flex flex-col justify-between ${stat.color} hover:scale-[1.02] transition-transform duration-200`}>
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-3xl font-extrabold">{stat.count}</span>
                          <i className={`fa-solid ${stat.icon} text-lg`}></i>
                        </div>
                        <span className="text-xs font-bold mt-3 text-gray-700">{stat.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Theme Quick Actions Card */}
                  <div className="bg-white border border-[#FCA57A]/15 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-serif text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Accent Theme Preset Selection</h4>
                    <div className="flex flex-wrap gap-4">
                      {Object.keys(THEME_PRESETS).map(key => {
                        const preset = THEME_PRESETS[key];
                        return (
                          <button
                            key={key}
                            onClick={() => setThemeColor(preset.value)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                              themeColor === preset.value 
                                ? 'border-brand-orange bg-orange-50/50 shadow-sm' 
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <span 
                              className="w-5 h-5 rounded-full inline-block shadow-inner" 
                              style={{ backgroundColor: preset.value }}
                            ></span>
                            <div className="text-left">
                              <span className="text-xs font-bold text-gray-800 block">{preset.name}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PROFILE EDITOR */}
              {adminTab === 'profile' && (
                <div className="space-y-6">
                  {/* Basic Profile form */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = {
                        ...profile,
                        full_name: e.target.full_name.value,
                        tagline: e.target.tagline.value,
                        bio: e.target.bio.value,
                        social_links: {
                          github: e.target.github_url.value,
                          linkedin: e.target.linkedin_url.value,
                          portfolio: e.target.portfolio_url.value
                        }
                      };
                      updateProfile(formData);
                      alert('Profile data saved successfully!');
                    }} 
                    className="bg-white border border-[#FCA57A]/15 rounded-2xl p-6 shadow-sm space-y-4"
                  >
                    <h3 className="font-serif text-base font-bold text-gray-800 pb-3 border-b border-gray-50">Profile Core Metadata</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                        <input 
                          type="text" 
                          name="full_name" 
                          defaultValue={profile.full_name} 
                          className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tagline</label>
                        <input 
                          type="text" 
                          name="tagline" 
                          defaultValue={profile.tagline} 
                          className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Bio Description</label>
                      <textarea 
                        name="bio" 
                        defaultValue={profile.bio} 
                        rows="3" 
                        className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">GitHub URL</label>
                        <input 
                          type="url" 
                          name="github_url" 
                          defaultValue={profile.social_links?.github || ''} 
                          className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">LinkedIn URL</label>
                        <input 
                          type="url" 
                          name="linkedin_url" 
                          defaultValue={profile.social_links?.linkedin || ''} 
                          className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Portfolio Link</label>
                        <input 
                          type="url" 
                          name="portfolio_url" 
                          defaultValue={profile.social_links?.portfolio || ''} 
                          className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex justify-end">
                      <button 
                        type="submit" 
                        className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
                      >
                        Save Profile Details
                      </button>
                    </div>
                  </form>

                  {/* Asset Upload Section */}
                  <div className="bg-white border border-[#FCA57A]/15 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-serif text-base font-bold text-gray-800 pb-3 border-b border-gray-50 mb-4">Document & Media Uploads</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Avatar Image Uploader */}
                      <div className="border border-[#FCA57A]/20 rounded-xl p-5 space-y-4">
                        <div className="flex items-center gap-3.5">
                          <img 
                            src={profile.avatar_url} 
                            alt="Avatar preview" 
                            className="w-12 h-12 rounded-full object-cover border border-gray-200" 
                          />
                          <div>
                            <span className="font-bold text-sm text-gray-800 block">Avatar Photo (1:1 Ratio)</span>
                            <span className="text-[10px] text-gray-400 font-medium">JPEG, PNG · Interactive Crop Tool</span>
                          </div>
                        </div>

                        <div>
                          <label className="cursor-pointer inline-flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm">
                            <i className="fa-solid fa-image"></i>
                            Select New Avatar
                            <input 
                              type="file" 
                              accept="image/png, image/jpeg" 
                              onChange={(e) => handleFileChange(e, 'avatar')} 
                              className="hidden" 
                            />
                          </label>
                        </div>
                        {avatarUploadStatus && (
                          <p className={`text-[11px] font-semibold ${avatarUploadStatus.includes('Error') ? 'text-red-600' : 'text-emerald-600'}`}>
                            {avatarUploadStatus}
                          </p>
                        )}
                      </div>

                      {/* Resume PDF Uploader */}
                      <div className="border border-[#FCA57A]/20 rounded-xl p-5 space-y-4">
                        <div className="flex items-center gap-3.5">
                          <span className="w-12 h-12 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center border border-orange-100 text-xl">
                            <i className="fa-solid fa-file-pdf"></i>
                          </span>
                          <div>
                            <span className="font-bold text-sm text-gray-800 block">Resume PDF Document</span>
                            <span className="text-[10px] text-gray-400 font-medium">PDF document upload for CV downloads</span>
                          </div>
                        </div>

                        <div>
                          <label className={`cursor-pointer inline-flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm ${
                            uploadingResume ? 'opacity-50 cursor-wait' : ''
                          }`}>
                            <i className="fa-solid fa-cloud-arrow-up"></i>
                            {uploadingResume ? 'Uploading...' : 'Select Resume PDF'}
                            <input 
                              type="file" 
                              accept=".pdf" 
                              onChange={(e) => handleFileChange(e, 'resume')} 
                              className="hidden" 
                              disabled={uploadingResume}
                            />
                          </label>
                        </div>
                        {resumeUploadStatus && (
                          <p className={`text-[11px] font-semibold ${resumeUploadStatus.includes('Error') ? 'text-red-600' : 'text-emerald-600'}`}>
                            {resumeUploadStatus}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. PROJECTS MANAGER */}
              {adminTab === 'projects' && (
                <div className="space-y-6">
                  {editingProject ? (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const p = {
                          ...editingProject,
                          title: e.target.title.value,
                          description: e.target.description.value,
                          tech_stack: e.target.tech_stack.value.split(',').map(s => s.trim()).filter(Boolean),
                          category: e.target.category.value,
                          featured: e.target.featured.checked,
                          github_url: e.target.github_url.value,
                          demo_url: e.target.demo_url.value,
                          sort_order: parseInt(e.target.sort_order.value) || 10
                        };
                        saveProject(p);
                      }}
                      className="bg-white border border-[#FCA57A]/15 rounded-2xl p-6 shadow-sm space-y-4"
                    >
                      <h3 className="font-serif text-base font-bold text-gray-800 pb-3 border-b border-gray-50">
                        {editingProject.id ? 'Edit Project details' : 'Add New Project'}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Project Title</label>
                          <input 
                            type="text" 
                            name="title" 
                            defaultValue={editingProject.title || ''} 
                            className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                          <input 
                            type="text" 
                            name="category" 
                            defaultValue={editingProject.category || ''} 
                            placeholder="AI/ML, Full Stack, etc."
                            className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                        <textarea 
                          name="description" 
                          defaultValue={editingProject.description || ''} 
                          rows="3" 
                          className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                          required
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tech Stack (comma-separated)</label>
                        <input 
                          type="text" 
                          name="tech_stack" 
                          defaultValue={editingProject.tech_stack ? editingProject.tech_stack.join(', ') : ''} 
                          placeholder="React, Supabase, Node.js"
                          className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">GitHub Repo URL</label>
                          <input 
                            type="url" 
                            name="github_url" 
                            defaultValue={editingProject.github_url || ''} 
                            className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Live Demo URL</label>
                          <input 
                            type="url" 
                            name="demo_url" 
                            defaultValue={editingProject.demo_url || ''} 
                            className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sort Order</label>
                          <input 
                            type="number" 
                            name="sort_order" 
                            defaultValue={editingProject.sort_order || 1} 
                            className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 py-2">
                        <input 
                          type="checkbox" 
                          id="featured"
                          name="featured" 
                          defaultChecked={editingProject.featured || false} 
                          className="w-4 h-4 rounded text-brand-orange focus:ring-brand-orange"
                        />
                        <label htmlFor="featured" className="text-xs font-bold text-gray-600 uppercase tracking-wider">Highlight as Featured Project</label>
                      </div>

                      <div className="pt-4 border-t border-gray-50 flex justify-end gap-3">
                        <button 
                          type="button" 
                          onClick={() => setEditingProject(null)}
                          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
                        >
                          Save Project
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total: {projects.length} projects</span>
                        <button 
                          onClick={() => setEditingProject({})}
                          className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-orange-500/10"
                        >
                          <i className="fa-solid fa-plus"></i>
                          Add Project
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {projects.map(proj => (
                          <div key={proj.id} className="bg-white border border-[#FCA57A]/10 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-[#FCA57A]/25 transition-all">
                            <div className="space-y-1 pr-6 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-serif font-bold text-gray-800 text-base">{proj.title}</h4>
                                <span className="bg-orange-50 border border-orange-100 text-[10px] text-brand-orange px-2 py-0.5 rounded-[4px] font-bold uppercase tracking-wider">
                                  {proj.category}
                                </span>
                                {proj.featured && (
                                  <span className="bg-amber-50 border border-amber-100 text-[10px] text-amber-600 px-2 py-0.5 rounded-[4px] font-bold uppercase tracking-wider flex items-center gap-1">
                                    <i className="fa-solid fa-star"></i> Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{proj.description}</p>
                              <div className="flex flex-wrap gap-1.5 pt-1.5">
                                {proj.tech_stack?.map((t, idx) => (
                                  <span key={idx} className="bg-gray-50 border border-gray-150 text-[9px] text-gray-500 px-1.5 py-0.5 rounded-[3px] font-medium">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button 
                                onClick={() => setEditingProject(proj)}
                                className="w-9 h-9 rounded-xl hover:bg-gray-100 text-gray-600 border border-gray-100 flex items-center justify-center transition-colors"
                                title="Edit Project"
                              >
                                <i className="fa-solid fa-pen text-xs"></i>
                              </button>
                              <button 
                                onClick={() => deleteProject(proj.id)}
                                className="w-9 h-9 rounded-xl hover:bg-red-50 text-red-600 border border-red-50 flex items-center justify-center transition-colors"
                                title="Delete Project"
                              >
                                <i className="fa-solid fa-trash-can text-xs"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. SKILLS MANAGER */}
              {adminTab === 'skills' && (
                <div className="space-y-6">
                  {editingSkill ? (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const sk = {
                          ...editingSkill,
                          name: e.target.name.value,
                          category: e.target.category.value,
                          level: parseInt(e.target.level.value) || 5,
                          sort_order: parseInt(e.target.sort_order.value) || 10
                        };
                        saveSkill(sk);
                      }}
                      className="bg-white border border-[#FCA57A]/15 rounded-2xl p-6 shadow-sm space-y-4"
                    >
                      <h3 className="font-serif text-base font-bold text-gray-800 pb-3 border-b border-gray-50">
                        {editingSkill.id ? 'Edit Skill details' : 'Add New Skill'}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Skill Name</label>
                          <input 
                            type="text" 
                            name="name" 
                            defaultValue={editingSkill.name || ''} 
                            placeholder="e.g. React, Python"
                            className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category Group</label>
                          <select 
                            name="category"
                            defaultValue={editingSkill.category || 'Frontend'}
                            className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800 font-medium"
                          >
                            <option value="AI/ML">AI/ML</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Database & DevOps">Database & DevOps</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Proficiency Level</label>
                            <span className="text-brand-orange font-mono font-bold text-xs">{editingSkill.level || 5}/10</span>
                          </div>
                          <input 
                            type="range" 
                            name="level" 
                            min="1" 
                            max="10"
                            defaultValue={editingSkill.level || 5} 
                            className="w-full accent-brand-orange h-2 bg-gray-150 rounded-lg cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sort Order</label>
                          <input 
                            type="number" 
                            name="sort_order" 
                            defaultValue={editingSkill.sort_order || 1} 
                            className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                            required
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-50 flex justify-end gap-3">
                        <button 
                          type="button" 
                          onClick={() => setEditingSkill(null)}
                          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
                        >
                          Save Skill
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total: {skills.length} skills in deck</span>
                        <button 
                          onClick={() => setEditingSkill({})}
                          className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-orange-500/10"
                        >
                          <i className="fa-solid fa-plus"></i>
                          Add Skill
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {skills.map(sk => (
                          <div key={sk.id} className="bg-white border border-[#FCA57A]/10 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                            <div className="space-y-1">
                              <span className="font-bold text-gray-800 text-sm block">{sk.name}</span>
                              <div className="flex items-center gap-2.5">
                                <span className="bg-orange-50 text-brand-orange text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                  {sk.category}
                                </span>
                                <span className="text-[10px] text-gray-400 font-semibold">Proficiency: {sk.level}/10</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button 
                                onClick={() => setEditingSkill(sk)}
                                className="w-8 h-8 rounded-xl hover:bg-gray-100 text-gray-500 border border-gray-100 flex items-center justify-center transition-colors"
                                title="Edit Skill"
                              >
                                <i className="fa-solid fa-pen text-[11px]"></i>
                              </button>
                              <button 
                                onClick={() => deleteSkill(sk.id)}
                                className="w-8 h-8 rounded-xl hover:bg-red-50 text-red-500 border border-red-50 flex items-center justify-center transition-colors"
                                title="Delete Skill"
                              >
                                <i className="fa-solid fa-trash-can text-[11px]"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. EXPERIENCE & TIMELINE MANAGER */}
              {adminTab === 'experience' && (
                <div className="space-y-6">
                  {editingExperience ? (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const exp = {
                          ...editingExperience,
                          role: e.target.role.value,
                          company: e.target.company.value,
                          start_date: e.target.start_date.value,
                          end_date: e.target.end_date.value,
                          is_current: e.target.is_current.checked,
                          type: e.target.type.value,
                          sort_order: parseInt(e.target.sort_order.value) || 10,
                          achievements: e.target.achievements.value.split('\n').map(s => s.trim()).filter(Boolean)
                        };
                        saveExperience(exp);
                      }}
                      className="bg-white border border-[#FCA57A]/15 rounded-2xl p-6 shadow-sm space-y-4"
                    >
                      <h3 className="font-serif text-base font-bold text-gray-800 pb-3 border-b border-gray-50">
                        {editingExperience.id ? 'Edit Timeline Event' : 'Add New Timeline Event'}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Role Title / Degree</label>
                          <input 
                            type="text" 
                            name="role" 
                            defaultValue={editingExperience.role || ''} 
                            placeholder="e.g. B.Tech AIDS Student"
                            className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Company / Institution</label>
                          <input 
                            type="text" 
                            name="company" 
                            defaultValue={editingExperience.company || ''} 
                            placeholder="e.g. Dhanalakshmi Srinivasan College"
                            className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Start Date/Year</label>
                          <input 
                            type="text" 
                            name="start_date" 
                            defaultValue={editingExperience.start_date || ''} 
                            placeholder="e.g. 2023"
                            className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">End Date/Year</label>
                          <input 
                            type="text" 
                            name="end_date" 
                            defaultValue={editingExperience.end_date || ''} 
                            placeholder="e.g. 2027 (Expected)"
                            className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                            required={!editingExperience.is_current}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Event Type</label>
                          <select 
                            name="type"
                            defaultValue={editingExperience.type || 'Experience'}
                            className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800 font-medium"
                          >
                            <option value="Education">Education</option>
                            <option value="Certification">Certification</option>
                            <option value="Milestone">Milestone</option>
                            <option value="Experience">Experience</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Achievements / Key Points (One per line)</label>
                        <textarea 
                          name="achievements" 
                          defaultValue={editingExperience.achievements ? editingExperience.achievements.join('\n') : ''} 
                          rows="4" 
                          placeholder="Awarded first prize in hackathon&#10;Completed full curriculum on Web Dev"
                          className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                          required
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2.5 py-2">
                          <input 
                            type="checkbox" 
                            id="is_current"
                            name="is_current" 
                            defaultChecked={editingExperience.is_current || false} 
                            className="w-4 h-4 rounded text-brand-orange focus:ring-brand-orange"
                          />
                          <label htmlFor="is_current" className="text-xs font-bold text-gray-600 uppercase tracking-wider">Presently Active (Current Role)</label>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sort Order</label>
                          <input 
                            type="number" 
                            name="sort_order" 
                            defaultValue={editingExperience.sort_order || 1} 
                            className="w-full bg-brandWhite border border-[#FCA57A]/20 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-orange text-gray-800"
                            required
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-50 flex justify-end gap-3">
                        <button 
                          type="button" 
                          onClick={() => setEditingExperience(null)}
                          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
                        >
                          Save Event
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total: {experience.length} timeline events</span>
                        <button 
                          onClick={() => setEditingExperience({})}
                          className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-orange-500/10"
                        >
                          <i className="fa-solid fa-plus"></i>
                          Add Timeline Event
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {experience.map(exp => (
                          <div key={exp.id} className="bg-white border border-[#FCA57A]/10 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-[#FCA57A]/25 transition-all">
                            <div className="space-y-1.5 pr-6 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-serif font-bold text-gray-800 text-base">{exp.role}</h4>
                                <span className="text-gray-400 font-normal text-xs">@ {exp.company}</span>
                                <span className="bg-orange-50 border border-orange-100 text-[10px] text-brand-orange px-2 py-0.5 rounded-[4px] font-bold uppercase tracking-wider">
                                  {exp.type}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 font-semibold">{exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}</p>
                              <ul className="list-disc list-inside text-xs text-gray-600 pl-1.5 space-y-1 pt-1.5">
                                {exp.achievements?.map((ach, idx) => (
                                  <li key={idx} className="leading-relaxed">{ach}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button 
                                onClick={() => setEditingExperience(exp)}
                                className="w-9 h-9 rounded-xl hover:bg-gray-100 text-gray-600 border border-gray-100 flex items-center justify-center transition-colors"
                                title="Edit Event"
                              >
                                <i className="fa-solid fa-pen text-xs"></i>
                              </button>
                              <button 
                                onClick={() => deleteExperience(exp.id)}
                                className="w-9 h-9 rounded-xl hover:bg-red-50 text-red-600 border border-red-50 flex items-center justify-center transition-colors"
                                title="Delete Event"
                              >
                                <i className="fa-solid fa-trash-can text-xs"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 6. CONTACT MESSAGES */}
              {adminTab === 'messages' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      Total Inbox: {messages.length} messages ({messages.filter(m => !m.read).length} unread)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {messages.length === 0 ? (
                      <div className="text-center py-12 bg-white border border-[#FCA57A]/10 rounded-2xl">
                        <span className="text-gray-300 text-5xl inline-block mb-3">
                          <i className="fa-solid fa-inbox"></i>
                        </span>
                        <p className="text-sm font-semibold text-gray-500 font-serif">Inbox is empty</p>
                        <p className="text-xs text-gray-400 mt-1">Incoming client contact forms will show up here.</p>
                      </div>
                    ) : (
                      messages.map(msg => (
                        <div 
                          key={msg.id} 
                          className={`border rounded-2xl p-5 transition-all shadow-sm ${
                            !msg.read 
                              ? 'bg-white border-[#FCA57A]/35 shadow-md shadow-orange-500/5' 
                              : 'bg-white border-[#FCA57A]/10'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                            <div className="flex items-center gap-3">
                              <div>
                                <span className="font-bold text-gray-800 text-sm block">{msg.name}</span>
                                <span className="text-xs text-gray-400 font-normal">{msg.email}</span>
                              </div>
                              {!msg.read && (
                                <span className="bg-brand-orange text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">New</span>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono font-normal">
                              {new Date(msg.created_at).toLocaleString()}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 font-sans font-normal leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </p>

                          <div className="mt-4 flex gap-4 text-xs font-bold pt-3 border-t border-gray-50 justify-end">
                            {!msg.read ? (
                              <button 
                                onClick={() => markMessageRead(msg.id, true)} 
                                className="text-emerald-600 hover:opacity-85"
                              >
                                Mark as Read
                              </button>
                            ) : (
                              <button 
                                onClick={() => markMessageRead(msg.id, false)} 
                                className="text-gray-400 hover:text-gray-600"
                              >
                                Mark as Unread
                              </button>
                            )}
                            <button 
                              onClick={() => deleteMessage(msg.id)} 
                              className="text-red-500 hover:opacity-85"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>
          </main>

        </div>
      )}

      {/* ------------------------------------------
         IMAGE CROPPER OVERLAY MODAL
         ------------------------------------------ */}
      {croppingImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <h3 className="font-serif text-xl font-bold text-gray-900">Adjust & Crop Photo</h3>
              <button 
                onClick={() => setCroppingImage(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Image Canvas container */}
            <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center overflow-hidden min-h-[300px]">
              <div className="max-w-full max-h-[320px] rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                <img 
                  ref={imageRef} 
                  src={croppingImage} 
                  alt="Source photo to crop" 
                  className="block max-w-full"
                />
              </div>
            </div>

            {/* Adjustments Panel */}
            <div className="p-6 border-t border-gray-100 space-y-5 bg-white shrink-0">
              {/* Zoom Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                  <span className="uppercase tracking-wide">Zoom Level</span>
                  <span className="text-brand-orange font-mono font-bold">{Math.round(zoomVal * 100)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-magnifying-glass-minus text-xs text-gray-400"></i>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="3" 
                    step="0.01" 
                    value={zoomVal} 
                    onChange={handleZoomSliderChange} 
                    className="flex-1 accent-brand-orange h-1.5 bg-gray-150 rounded-lg cursor-pointer"
                  />
                  <i className="fa-solid fa-magnifying-glass-plus text-xs text-gray-400"></i>
                </div>
              </div>

              {/* Manipulation Actions */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleRotate(-45)}
                    className="w-10 h-10 rounded-xl hover:bg-gray-150 border border-gray-200 text-gray-600 flex items-center justify-center transition-colors text-xs font-bold gap-1"
                    title="Rotate 45° Left"
                  >
                    <i className="fa-solid fa-rotate-left"></i>
                    -45°
                  </button>
                  <button 
                    onClick={() => handleRotate(45)}
                    className="w-10 h-10 rounded-xl hover:bg-gray-150 border border-gray-200 text-gray-600 flex items-center justify-center transition-colors text-xs font-bold gap-1"
                    title="Rotate 45° Right"
                  >
                    <i className="fa-solid fa-rotate-right"></i>
                    +45°
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleFlipX}
                    className="w-10 h-10 rounded-xl hover:bg-gray-150 border border-gray-200 text-gray-600 flex items-center justify-center transition-colors text-xs font-bold"
                    title="Flip Horizontally"
                  >
                    <i className="fa-solid fa-arrows-left-right"></i>
                  </button>
                  <button 
                    onClick={handleFlipY}
                    className="w-10 h-10 rounded-xl hover:bg-gray-150 border border-gray-200 text-gray-600 flex items-center justify-center transition-colors text-xs font-bold"
                    title="Flip Vertically"
                  >
                    <i className="fa-solid fa-arrows-up-down"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0 bg-white">
              <button 
                type="button" 
                onClick={() => setCroppingImage(null)}
                className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleCropUpload}
                disabled={uploadingAvatar}
                className="bg-brand-orange hover:bg-orange-600 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-orange-500/10"
              >
                {uploadingAvatar ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 rounded-full border-t-transparent animate-spin border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check"></i>
                    Crop & Upload
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

window.AdminPanel = AdminPanel;
