import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronDown, XIcon, X } from 'lucide-react'

// Desktop Mega Menu Component 
const NavItemWithMegaMenu = ({ title, links, imageText, imageSubtext, gradient, onTitleClick, onCardClick }) => (
  <div className="group relative py-4 font-['Playfair_Display',_Georgia,_serif]">
    <button 
      onClick={onTitleClick}
      className="hover:text-[#e85d45] transition-colors uppercase cursor-pointer text-sm font-semibold tracking-wide text-gray-700"
    >
      {title}
    </button>
    
    {links && links.length > 0 && (
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[600px] rounded-2xl bg-white/95 backdrop-blur-xl p-6 shadow-2xl border border-gray-100
                      invisible opacity-0 translate-y-3 transition-all duration-300 ease-out 
                      group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 flex gap-6 text-left cursor-default">
        
        <div className="w-1/2 flex flex-col gap-4 border-r border-gray-100 pr-4">
          {links.map((link, idx) => (
            <Link key={idx} to="/" className="block group/link">
              <h4 className="font-semibold text-gray-900 group-hover/link:text-blue-600 transition-colors flex justify-between items-center text-sm">
                {link.title} <ArrowUpRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
              </h4>
              <p className="text-xs text-gray-500 mt-1 normal-case font-normal">{link.desc}</p>
            </Link>
          ))}
        </div>

        <div onClick={onCardClick} className="w-1/2 group/card cursor-pointer flex flex-col justify-center">
          <div className={`bg-gradient-to-br ${gradient} rounded-xl h-36 w-full flex items-center justify-center text-white font-bold text-2xl shadow-inner mb-4 transition-transform duration-300 group-hover/card:scale-[1.03]`}>
            {title}
          </div>
          <h4 className="font-bold text-gray-900 text-sm">{imageText}</h4>
          <p className="text-xs text-gray-500 mt-1 normal-case font-normal leading-relaxed">{imageSubtext}</p>
        </div>
      </div>
    )}
  </div>
);

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [activeMobileMenu, setActiveMobileMenu] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Local Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  // Listen for trigger from Hero Section
  useEffect(() => {
    const handleOpen = () => setIsModalOpen(true);
    window.addEventListener('open-contact', handleOpen);
    return () => window.removeEventListener('open-contact', handleOpen);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (open || isModalOpen) ? 'hidden' : 'auto';
  }, [open, isModalOpen]);

  // CTA Button Behavior: Mail Redirect Logic
  const handleMailRedirect = (e) => {
    e.preventDefault();
    const { name, email, phone, subject, message } = formData;
    
    const subjectLine = `New Inquiry - ${subject}`;
    const bodyText = `Name: ${name}%0AEmail: ${email}%0APhone: ${phone}%0A%0AMessage:%0A${message}`;
    
    window.location.href = `mailto:webrevinfo@gmail.com?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(bodyText)}`;
    setIsModalOpen(false); // Close modal after redirecting
  };

  const handleSmoothScroll = (e, targetId) => {
    if (e) e.preventDefault();
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setOpen(false); 
    }
  };

  const menuData = {
    about: { id: 'about', title: "About Us", gradient: "from-blue-500 to-indigo-600", imageText: "Growth Engine", imageSubtext: "High-performance infrastructure.", links: [{title: "Website Builder", desc: "Custom, scalable websites"}, {title: "Analytics Engine", desc: "Track users, performance, growth"}] },
    contact: { id: 'contact', title: "Contact Us", gradient: "from-emerald-400 to-teal-600", imageText: "UI/UX Design Systems", imageSubtext: "Clean, user-focused interfaces.", links: [] }, // Removed links for modal trigger
    services: { id: 'services', title: "Services", gradient: "from-purple-500 to-pink-600", imageText: "Modern Tech Stack", imageSubtext: "Frontend, backend & scalable architecture", links: [{ title: "Security & Performance", desc: "Optimized speed with secure infrastructure" }, { title: "Cloud & Deployment", desc: "Reliable hosting and seamless deployment" }] },
    products: { id: 'products', title: "Products", gradient: "from-orange-400 to-orange-600", imageText: "Business Websites", imageSubtext: "Custom websites built for your brand", links: [{ title: "E-commerce Platforms", desc: "Online stores designed to convert" }, { title: "SEO & Growth Tools", desc: "Boost visibility and drive traffic" }] },
    lab: { id: 'lab', title: "Lab", gradient: "from-cyan-400 to-blue-500", imageText: "Innovation Lab", imageSubtext: "Exploring next-gen digital solutions", links: [{ title: "Experimental Projects", desc: "Testing ideas and new technologies" }, { title: "Open Builds", desc: "Concepts, prototypes & creative experiments" }] }
  };

  const toggleMobileMenu = (menuId, e) => {
    if (menuId === 'products') {
      handleSmoothScroll(e, 'what-we-offer');
    } else if (menuId === 'contact') {
      setIsModalOpen(true);
      setOpen(false);
    } else {
      setActiveMobileMenu(activeMobileMenu === menuId ? null : menuId);
    }
  };

  return (
    <div className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center w-full px-3 md:px-8 pointer-events-none font-['Playfair_Display',_Georgia,_serif]">
      <style>{`
        /* Consistent Modal Background Animation */
        @keyframes smooth-bg-modal {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .modal-gradient-bg {
          background: linear-gradient(-45deg, #2a2a2a, #3f2a24, #1e293b, #1f3a3a);
          background-size: 300% 300%;
          animation: smooth-bg-modal 15s ease infinite;
        }
      `}</style>
      {/* Navbar Container */}
      <nav className="pointer-events-auto flex items-center justify-between w-full max-w-5xl px-5 sm:px-8 py-2.5 bg-white/20 backdrop-blur-xl rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/40 transition-colors duration-300">
        
        {/* LOGO */}
        <Link to="/" className="text-lg sm:text-xl tracking-[0.15em] font-bold text-gray-900 z-[70]">
          WEBREV
        </Link>

        {/* DESKTOP MENU LINKS */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {Object.values(menuData).map((menu) => (
            <NavItemWithMegaMenu 
              key={menu.id} 
              {...menu} 
              onTitleClick={(e) => {
                if (menu.id === 'products') handleSmoothScroll(e, 'what-we-offer');
                else if (menu.id === 'contact') setIsModalOpen(true);
              }}
              onCardClick={(e) => {
                if (menu.id === 'products') handleSmoothScroll(e, 'what-we-offer');
                else if (menu.id === 'contact') setIsModalOpen(true);
              }}
            />
          ))}
        </div>

        {/* RIGHT SIDE BUTTONS */}
        <div className="flex items-center gap-2 sm:gap-4 z-[70]">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="hidden md:block relative overflow-hidden rounded-full bg-[#1a1a1a] px-5 py-2 text-sm text-white font-medium transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
          >
            <span className="relative z-10">Experience WEBREV</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
          </button>

          {/* HAMBURGER MENU ICON (MOBILE ONLY) */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-[4px] ml-1 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <span className={`block w-5 h-[2px] bg-gray-900 rounded-full transition-all duration-300 ease-in-out ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
            <span className={`block w-5 h-[2px] bg-gray-900 rounded-full transition-all duration-300 ease-in-out ${open ? 'opacity-0 translate-x-3' : 'opacity-100'}`} />
            <span className={`block w-5 h-[2px] bg-gray-900 rounded-full transition-all duration-300 ease-in-out ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {/* --- MOBILE HAMBURGER DRAWER --- */}
      <div className={`pointer-events-auto fixed inset-0 bg-[#f8f8f8] z-[60] lg:hidden overflow-y-auto transition-opacity duration-300 ease-out font-['Playfair_Display',_Georgia,_serif] ${open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        
        <button onClick={() => setOpen(false)} className="absolute top-6 right-6 p-2 bg-white border border-gray-200 shadow-sm rounded-full z-[70]">
          <XIcon className="w-5 h-5 text-gray-900" />
        </button>
        
        <div className="flex flex-col pt-24 pb-10 px-4 min-h-full">
          <div className="w-full bg-[#ffffff] rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] mb-6">
            {Object.values(menuData).map((menu, idx, arr) => (
              <div key={menu.id} className={`w-full ${idx !== arr.length - 1 ? 'border-b border-black/[0.08]' : ''}`}>
                <button onClick={(e) => toggleMobileMenu(menu.id, e)} className="w-full flex justify-between items-center px-[20px] py-[16px]">
                  <span className="text-[15px] font-semibold text-[#111111] uppercase tracking-[0.5px]">{menu.title}</span>
                  {menu.links.length > 0 && (
                    <ChevronDown className={`w-5 h-5 transition-transform ${activeMobileMenu === menu.id ? 'rotate-180' : ''}`} />
                  )}
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
            <button
              onClick={() => { setOpen(false); setIsModalOpen(true); }}
              className="w-full px-4 py-4 text-[14px] font-bold text-white uppercase tracking-[0.5px] bg-[#0a0a0a] rounded-full hover:bg-black transition-colors shadow-md text-center"
            >
              Experience Webrev
            </button>
          </div>
        </div>
      </div>

      {/* --- COMPACT CONTACT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-auto font-['Playfair_Display',_Georgia,_serif]">
          {/* Soft Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          
          {/* Modal Container: Updated background */}
          <div className="relative w-full max-w-lg modal-gradient-bg rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            
            {/* Ambient Background Blobs */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
               <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500/20 blur-[80px] rounded-full" />
               <div className="absolute bottom-0 right-0 w-48 h-48 bg-orange-500/20 blur-[80px] rounded-full" />
            </div>
            
            {/* Glossy Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-0" />

            {/* Form Content */}
            <div className="relative z-10 px-5 py-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Send a Message</h2>
                  <p className="text-gray-300 text-xs mt-0.5">We'll respond as soon as possible.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full text-gray-300 hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleMailRedirect}>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder=" Tanish Bhagat " 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-400/50 outline-none transition-all placeholder:text-gray-400" 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                  <input 
                    type="tel" 
                    placeholder="+91 ..." 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-400/50 outline-none transition-all placeholder:text-gray-400" 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="TanishB@example.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-400/50 outline-none transition-all placeholder:text-gray-400" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none cursor-pointer appearance-none"
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  >
                    <option className="text-black" value="General Inquiry">General Inquiry</option>
                    <option className="text-black" value="Project Proposal">Project Proposal</option>
                    <option className="text-black" value="Website Design">Website Design</option>
                    <option className="text-black" value="Development">Development</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    required
                    placeholder="Tell us about your project..." 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-400/50 outline-none transition-all resize-none min-h-[100px] h-28 placeholder:text-gray-400" 
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                <button type="submit" className="md:col-span-2 w-full bg-white/10 hover:bg-white/20 border border-white/20 active:scale-95 py-2.5 rounded-lg text-white font-bold text-sm transition-all shadow-lg mt-2 backdrop-blur-sm">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar