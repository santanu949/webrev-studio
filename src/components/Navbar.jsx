import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpRight, ChevronDown, XIcon, X, Lock, Loader2, CheckCircle } from 'lucide-react'

// --- APPS SCRIPT URL ---
const API_URL = 'https://script.google.com/macros/s/AKfycbwa8j5TD4_XnaxMngSSHYZILEpx1Km6OsZuyiz4_MJRloHxob5FszsRwtoTq7Tkp8-SVQ/exec';

const NavItemWithMegaMenu = ({ title, links, imageText, imageSubtext, gradient, onTitleClick, onCardClick }) => (
  <div className="group relative py-4 font-['Playfair_Display',_Georgia,_serif]">
    <button onClick={onTitleClick} className="hover:text-[#e85d45] transition-colors uppercase cursor-pointer text-sm font-semibold tracking-wide text-gray-700">{title}</button>
    {links && links.length > 0 && (
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[600px] rounded-2xl bg-white/95 backdrop-blur-xl p-6 shadow-2xl border border-gray-100 invisible opacity-0 translate-y-3 transition-all duration-300 ease-out group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 flex gap-6 text-left cursor-default">
        <div className="w-1/2 flex flex-col gap-4 border-r border-gray-100 pr-4">
          {links.map((link, idx) => (
            <Link key={idx} to="/" className="block group/link">
              <h4 className="font-semibold text-gray-900 group-hover/link:text-blue-600 transition-colors flex justify-between items-center text-sm">{link.title} <ArrowUpRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" /></h4>
              <p className="text-xs text-gray-500 mt-1 normal-case font-normal">{link.desc}</p>
            </Link>
          ))}
        </div>
        <div onClick={onCardClick} className="w-1/2 group/card cursor-pointer flex flex-col justify-center">
          <div className={`bg-gradient-to-br ${gradient} rounded-xl h-36 w-full flex items-center justify-center text-white font-bold text-2xl shadow-inner mb-4 transition-transform duration-300 group-hover/card:scale-[1.03]`}>{title}</div>
          <h4 className="font-bold text-gray-900 text-sm">{imageText}</h4>
          <p className="text-xs text-gray-500 mt-1 normal-case font-normal leading-relaxed">{imageSubtext}</p>
        </div>
      </div>
    )}
  </div>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState(null);
  
  // MODALS
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  
  // STATES
  const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
  const [adminStatus, setAdminStatus] = useState({ loading: false, error: '' });
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' });
  const [contactStatus, setContactStatus] = useState({ loading: false, success: false, error: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = () => setIsModalOpen(true);
    window.addEventListener('open-contact', handleOpen);
    return () => window.removeEventListener('open-contact', handleOpen);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (open || isModalOpen || isAdminModalOpen) ? 'hidden' : 'auto';
  }, [open, isModalOpen, isAdminModalOpen]);

  // --- NEW: SEND TO GOOGLE SHEETS INSTEAD OF GMAIL ---
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus({ loading: true, success: false, error: '' });

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'contact', ...formData })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setContactStatus({ loading: false, success: true, error: '' });
        // Automatically close modal after 2 seconds and clear form
        setTimeout(() => {
          setIsModalOpen(false);
          setContactStatus({ loading: false, success: false, error: '' });
          setFormData({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' });
        }, 2000);
      } else {
        setContactStatus({ loading: false, success: false, error: 'Failed to send message.' });
      }
    } catch (err) {
      setContactStatus({ loading: false, success: false, error: 'Connection failed. Please try again.' });
    }
  };

  // ADMIN LOGIN LOGIC
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminStatus({ loading: true, error: '' });
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'login', ...adminCreds })
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('webrev_admin_auth', 'true');
        setIsAdminModalOpen(false);
        navigate('/admin');
      } else {
        setAdminStatus({ loading: false, error: result.message || 'Invalid Credentials' });
      }
    } catch (err) {
      setAdminStatus({ loading: false, error: 'Connection failed. Please try again.' });
    }
  };

  const handleSmoothScroll = (e, targetId) => {
    if (e) e.preventDefault();
    const section = document.getElementById(targetId);
    if (section) { section.scrollIntoView({ behavior: 'smooth' }); setOpen(false); }
  };

  const menuData = {
    about: { id: 'about', title: "About Us", gradient: "from-blue-500 to-indigo-600", imageText: "Growth Engine", imageSubtext: "High-performance infrastructure.", links: [{title: "Website Builder", desc: "Custom, scalable websites"}, {title: "Analytics Engine", desc: "Track users, performance, growth"}] },
    services: { id: 'services', title: "Services", gradient: "from-purple-500 to-pink-600", imageText: "Modern Tech Stack", imageSubtext: "Frontend, backend & scalable architecture", links: [{ title: "Security & Performance", desc: "Optimized speed with secure infrastructure" }, { title: "Cloud & Deployment", desc: "Reliable hosting and seamless deployment" }] },
    products: { id: 'products', title: "Products", gradient: "from-orange-400 to-orange-600", imageText: "Business Websites", imageSubtext: "Custom websites built for your brand", links: [{ title: "E-commerce Platforms", desc: "Online stores designed to convert" }, { title: "SEO & Growth Tools", desc: "Boost visibility and drive traffic" }] },
    lab: { id: 'lab', title: "Lab", gradient: "from-cyan-400 to-blue-500", imageText: "Innovation Lab", imageSubtext: "Exploring next-gen digital solutions", links: [{ title: "Experimental Projects", desc: "Testing ideas and new technologies" }, { title: "Open Builds", desc: "Concepts, prototypes & creative experiments" }] }
  };

  const toggleMobileMenu = (menuId, e) => {
    if (menuId === 'products') handleSmoothScroll(e, 'what-we-offer');
    else setActiveMobileMenu(activeMobileMenu === menuId ? null : menuId);
  };

  return (
    <div className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center w-full px-3 md:px-8 pointer-events-none font-['Playfair_Display',_Georgia,_serif]">
      <style>{`
        @keyframes smooth-bg-modal { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .modal-gradient-bg { background: linear-gradient(-45deg, #2a2a2a, #3f2a24, #1e293b, #1f3a3a); background-size: 300% 300%; animation: smooth-bg-modal 15s ease infinite; }
      `}</style>
      
      {/* NAVBAR CONTAINER */}
      <nav className="pointer-events-auto flex items-center justify-between w-full max-w-5xl px-5 sm:px-8 py-2.5 bg-white/20 backdrop-blur-xl rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/40 transition-colors duration-300">
        <Link to="/" className="text-lg sm:text-xl tracking-[0.15em] font-bold text-gray-900 z-[70]">WEBREV</Link>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {Object.values(menuData).map((menu) => (
            <NavItemWithMegaMenu key={menu.id} {...menu} onTitleClick={(e) => handleSmoothScroll(e, 'what-we-offer')} onCardClick={(e) => handleSmoothScroll(e, 'what-we-offer')} />
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 z-[70]">
          <button onClick={() => setIsModalOpen(true)} className="hidden md:block relative overflow-hidden rounded-full bg-[#1a1a1a] px-5 py-2 text-sm text-white font-medium transition-all duration-300 ease-out hover:scale-105">
            <span className="relative z-10">Experience WEBREV</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
          </button>

          <button onClick={() => setIsAdminModalOpen(true)} className="p-2 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
            <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button onClick={() => setOpen(!open)} className="lg:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-[4px] ml-1 focus:outline-none">
            <span className={`block w-5 h-[2px] bg-gray-900 rounded-full transition-all duration-300 ease-in-out ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
            <span className={`block w-5 h-[2px] bg-gray-900 rounded-full transition-all duration-300 ease-in-out ${open ? 'opacity-0 translate-x-3' : 'opacity-100'}`} />
            <span className={`block w-5 h-[2px] bg-gray-900 rounded-full transition-all duration-300 ease-in-out ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {/* MOBILE HAMBURGER DRAWER */}
      <div className={`pointer-events-auto fixed inset-0 bg-[#f8f8f8] z-[60] lg:hidden overflow-y-auto transition-opacity duration-300 ease-out font-['Playfair_Display',_Georgia,_serif] ${open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <button onClick={() => setOpen(false)} className="absolute top-6 right-6 p-2 bg-white border border-gray-200 shadow-sm rounded-full z-[70]"><XIcon className="w-5 h-5 text-gray-900" /></button>
        <div className="flex flex-col pt-24 pb-10 px-4 min-h-full">
          <div className="w-full bg-[#ffffff] rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] mb-6">
            {Object.values(menuData).map((menu, idx, arr) => (
              <div key={menu.id} className={`w-full ${idx !== arr.length - 1 ? 'border-b border-black/[0.08]' : ''}`}>
                <button onClick={(e) => toggleMobileMenu(menu.id, e)} className="w-full flex justify-between items-center px-[20px] py-[16px]">
                  <span className="text-[15px] font-semibold text-[#111111] uppercase tracking-[0.5px]">{menu.title}</span>
                  {menu.links.length > 0 && <ChevronDown className={`w-5 h-5 transition-transform ${activeMobileMenu === menu.id ? 'rotate-180' : ''}`} />}
                </button>
                {menu.links.length > 0 && (
                  <div className={`overflow-hidden transition-all duration-300 ${activeMobileMenu === menu.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col gap-1 px-[20px] pb-5 pt-1">
                      {menu.links.map((link, idx) => (
                        <Link to="/" key={idx} onClick={(e) => { e.preventDefault(); handleSmoothScroll(e, menu.id); }} className="py-2.5">
                          <h4 className="font-medium text-[#111111] text-[15px]">{link.title}</h4>
                          <p className="text-black/60 text-[13px] mt-0.5">{link.desc}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 mt-auto w-full">
            <button onClick={() => { setOpen(false); setIsModalOpen(true); }} className="w-full px-4 py-4 text-[14px] font-bold text-white uppercase tracking-[0.5px] bg-[#0a0a0a] rounded-full hover:bg-black transition-colors shadow-md text-center">
              Experience Webrev
            </button>
          </div>
        </div>
      </div>

      {/* ADMIN LOGIN MODAL */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto font-['Inter',_sans-serif]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsAdminModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-[#111] border border-white/10 shadow-2xl rounded-2xl p-6 animate-in fade-in zoom-in-95 duration-300">
            <button onClick={() => setIsAdminModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5"/></button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3"><Lock className="w-6 h-6"/></div>
              <h2 className="text-xl font-bold text-white tracking-tight">Admin Authentication</h2>
              <p className="text-gray-400 text-xs mt-1">Authorized personnel only.</p>
            </div>
            {adminStatus.error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-lg text-center">{adminStatus.error}</div>}
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">User ID</label>
                <input type="text" required value={adminCreds.username} onChange={(e) => setAdminCreds({...adminCreds, username: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" placeholder="Admin ID" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Password</label>
                <input type="password" required value={adminCreds.password} onChange={(e) => setAdminCreds({...adminCreds, password: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={adminStatus.loading} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-sm py-3 rounded-lg mt-2 transition-colors flex items-center justify-center gap-2">
                {adminStatus.loading ? <><Loader2 className="w-4 h-4 animate-spin"/> Authenticating...</> : 'Secure Login'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- CONTACT MODAL (NOW SENDS TO GOOGLE SHEETS) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-auto font-['Playfair_Display',_Georgia,_serif]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg modal-gradient-bg rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
               <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500/20 blur-[80px] rounded-full" />
               <div className="absolute bottom-0 right-0 w-48 h-48 bg-orange-500/20 blur-[80px] rounded-full" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-0" />
            <div className="relative z-10 px-5 py-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Send a Message</h2>
                  <p className="text-gray-300 text-xs mt-0.5">We'll respond as soon as possible.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full text-gray-300 hover:text-white transition-all"><X className="w-5 h-5" /></button>
              </div>
              
              <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleContactSubmit}>
                <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name *</label><input type="text" required placeholder="Tanish Bhagat" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-400/50 outline-none transition-all placeholder:text-gray-400" onChange={(e) => setFormData({...formData, name: e.target.value})} value={formData.name} disabled={contactStatus.loading || contactStatus.success} /></div>
                <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone</label><input type="tel" placeholder="+91 ..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-400/50 outline-none transition-all placeholder:text-gray-400" onChange={(e) => setFormData({...formData, phone: e.target.value})} value={formData.phone} disabled={contactStatus.loading || contactStatus.success} /></div>
                <div className="md:col-span-2 space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address *</label><input type="email" required placeholder="TanishB@example.com" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-400/50 outline-none transition-all placeholder:text-gray-400" onChange={(e) => setFormData({...formData, email: e.target.value})} value={formData.email} disabled={contactStatus.loading || contactStatus.success} /></div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none cursor-pointer appearance-none" onChange={(e) => setFormData({...formData, subject: e.target.value})} value={formData.subject} disabled={contactStatus.loading || contactStatus.success}>
                    <option className="text-black" value="General Inquiry">General Inquiry</option>
                    <option className="text-black" value="Project Proposal">Project Proposal</option>
                    <option className="text-black" value="Website Design">Website Design</option>
                    <option className="text-black" value="Development">Development</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Message</label><textarea required placeholder="Tell us about your project..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-400/50 outline-none transition-all resize-none min-h-[100px] h-28 placeholder:text-gray-400" onChange={(e) => setFormData({...formData, message: e.target.value})} value={formData.message} disabled={contactStatus.loading || contactStatus.success} /></div>
                
                {/* SUBMIT BUTTON WITH LOADING & SUCCESS STATES */}
                <button 
                  type="submit" 
                  disabled={contactStatus.loading || contactStatus.success}
                  className={`md:col-span-2 w-full active:scale-95 py-2.5 rounded-lg text-white font-bold text-sm transition-all shadow-lg mt-2 backdrop-blur-sm flex items-center justify-center gap-2
                    ${contactStatus.success ? 'bg-emerald-500 border border-emerald-400' : 'bg-white/10 hover:bg-white/20 border border-white/20'}
                  `}
                >
                  {contactStatus.loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {contactStatus.success && <CheckCircle className="w-4 h-4" />}
                  {contactStatus.loading ? 'Sending...' : contactStatus.success ? 'Message Sent Successfully!' : 'Send Message'}
                </button>
                {contactStatus.error && <p className="md:col-span-2 text-red-400 text-xs text-center">{contactStatus.error}</p>}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar