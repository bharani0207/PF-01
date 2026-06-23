const Contact = ({ profile, contactForm, setContactForm, handleContactSubmit, submittingContact, contactSubmitted }) => {
  return (
    <section id="contact" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Info Column (Right Side Visuals) */}
        <div className="lg:col-span-5 space-y-8 reveal">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 mb-2">Let's Connect</h2>
            <div className="w-20 h-1 bg-brand-orange rounded-full"></div>
          </div>

          <p className="text-gray-600 font-sans leading-relaxed">
            Have an interesting project, job opportunity, or just want to chat about AI & Web systems? Send a direct message!
          </p>

          <div className="space-y-4 font-sans text-sm text-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-orange-10 text-brand-orange flex items-center justify-center">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div>
                <div className="font-semibold text-gray-400 text-xs uppercase tracking-wider">Email</div>
                <a href={`mailto:${profile.social_links?.email || 'bharanishwar@email.com'}`} className="hover:text-brand-orange font-medium">{profile.social_links?.email || 'bharanishwar@email.com'}</a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-orange-10 text-brand-orange flex items-center justify-center">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <div className="font-semibold text-gray-400 text-xs uppercase tracking-wider">Location</div>
                <div className="font-medium text-gray-800">Tamil Nadu, India</div>
              </div>
            </div>
          </div>

          {/* Social links */}
          <div className="space-y-3">
            <div className="font-semibold text-gray-400 text-xs uppercase tracking-wider">Follow Me</div>
            <div className="flex gap-3">
              {profile.social_links?.github && (
                <a 
                  href={profile.social_links.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full border border-[#FCA57A]/30 text-gray-600 hover:text-brand-orange hover:border-brand-orange flex items-center justify-center transition-all"
                >
                  <i className="fa-brands fa-github text-lg"></i>
                </a>
              )}
              {profile.social_links?.linkedin && (
                <a 
                  href={profile.social_links.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full border border-[#FCA57A]/30 text-gray-600 hover:text-brand-orange hover:border-brand-orange flex items-center justify-center transition-all"
                >
                  <i className="fa-brands fa-linkedin-in text-lg"></i>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Form Column (Left Side Visuals) */}
        <div className="lg:col-span-7 bg-white border border-[#FCA57A]/15 p-8 rounded-[16px] shadow-sm reveal">
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="form-name" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Your Name</label>
                <input 
                  type="text" 
                  id="form-name" 
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full bg-brandWhite border border-[#FCA57A]/20 px-4 py-3 rounded-[8px] text-sm focus-brand-orange" 
                  placeholder="Bharani"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="form-email" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Your Email</label>
                <input 
                  type="email" 
                  id="form-email" 
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full bg-brandWhite border border-[#FCA57A]/20 px-4 py-3 rounded-[8px] text-sm focus-brand-orange" 
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="form-message" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Your Message</label>
              <textarea 
                id="form-message" 
                rows="5"
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full bg-brandWhite border border-[#FCA57A]/20 px-4 py-3 rounded-[8px] text-sm focus-brand-orange" 
                placeholder="Hi Bharani, I love your projects..."
              ></textarea>
            </div>

            {contactSubmitted && (
              <div className="bg-emerald-50 text-emerald-700 text-sm border border-emerald-200 px-4 py-3 rounded-[8px] flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600"></i>
                <span>Message successfully saved! Thank you.</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={submittingContact}
              className="w-full bg-brand-orange hover:opacity-90 disabled:opacity-60 text-white font-semibold py-3.5 rounded-[8px] transition-all flex items-center justify-center gap-2"
            >
              {submittingContact ? 'Submitting...' : 'Send Message'}
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

window.Contact = Contact;
