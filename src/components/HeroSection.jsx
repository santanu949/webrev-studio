import React, { useEffect, useRef, useState } from 'react'
import { Instagram, Twitter, Linkedin, Mail } from 'lucide-react'

// 1. Services Data
const services = [
  { id: 1, title: 'Custom Website Design', desc: 'Bespoke designs tailored to your brand identity.', gradient: 'from-blue-500/25 to-transparent' },
  { id: 2, title: 'E-commerce Store', desc: 'Scalable online stores engineered to maximize conversions.', gradient: 'from-emerald-500/25 to-transparent' },
  { id: 3, title: 'Landing Pages', desc: 'High-performing pages focused on capturing leads instantly.', gradient: 'from-purple-500/25 to-transparent' },
  { id: 4, title: 'SEO Basics', desc: 'Essential optimizations to rank higher on search engines.', gradient: 'from-orange-500/25 to-transparent' },
  { id: 5, title: 'Website Cleanup', desc: 'Refactoring and fixing bugs to restore site health.', gradient: 'from-cyan-500/25 to-transparent' },
  { id: 6, title: 'Performance Upgrade', desc: 'Speed optimizations for lightning-fast load times.', gradient: 'from-amber-500/25 to-transparent' },
];

// 2. Platform Storyline Content
const platformFeatures = [
  { 
    id: 'feat-1', 
    title: 'Websites That Actually Convert', 
    desc: "We don’t just build websites, we build experiences that turn visitors into customers. Every element is designed with purpose and performance in mind.", 
    tags: ['UI/UX', 'Conversion', 'Performance'] 
  },
  { 
    id: 'feat-2', 
    title: 'Design Meets Functionality', 
    desc: 'From modern UI to seamless backend systems, we create platforms that look premium and work flawlessly across all devices.', 
    tags: ['Frontend', 'Backend', 'Responsive'] 
  },
  { 
    id: 'feat-3', 
    title: 'Built to Scale & Perform', 
    desc: 'Fast, secure, and scalable solutions so your business can grow without worrying about speed, downtime, or limitations.', 
    tags: ['Scalable', 'Secure', 'Optimized'] 
  },
];

// 3. Lab Stats Data
const labStats = [
  { id: 0, value: '15+', label: 'Experiments Built' },
  { id: 1, value: '10+', label: 'Prototypes Developed' },
  { id: 2, value: '5+', label: 'Live Projects' },
  { id: 3, value: '1000+', label: 'Hours R&D' },
];

// 4. Converging Storyline Content
const convergingFeatures = [
  { 
    id: 'conv-1', 
    title: 'Strategy First Approach', 
    desc: 'We start by understanding your business, audience, and goals so every decision is intentional, not guesswork.' 
  },
  { 
    id: 'conv-2', 
    title: 'Design & Development', 
    desc: 'From modern UI/UX to seamless development, we build websites that look premium and perform flawlessly.' 
  },
  { 
    id: 'conv-3', 
    title: 'Performance & Growth', 
    desc: 'Optimized for speed, SEO, and scalability so your website not only launches but continues to grow with your business.' 
  },
  { 
    id: 'conv-cta', 
    title: 'READY TO BUILD?', 
    desc: "Tell us about your project. We'll get back to you within 24 hours with a plan and a quote.", 
    isCta: true 
  }
];

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isBuilderVisible, setIsBuilderVisible] = useState(false);
  
  const sectionRef = useRef(null);
  const builderRef = useRef(null);
  const scrollRef = useRef(null);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileTouched, setIsMobileTouched] = useState(false);

  // Scroll Story States
  const [activeStory, setActiveStory] = useState('feat-1');
  const [activeConv, setActiveConv] = useState('conv-1');
  
  // Converging Circles Progress State
  const convergingWrapperRef = useRef(null);
  const [convProgress, setConvProgress] = useState(0);

  // Lab State
  const labRef = useRef(null);
  const [isLabVisible, setIsLabVisible] = useState(false);
  const [isLabHovered, setIsLabHovered] = useState(false);
  const [activeLabStat, setActiveLabStat] = useState(0);

  // Modal Trigger Helper
  const triggerContactModal = () => {
    window.dispatchEvent(new Event('open-contact'));
  };

  // WhatsApp Redirect Helper
  const handleWhatsAppChat = () => {
    window.open("https://wa.me/917738961119", "_blank");
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'what-we-offer') setIsVisible(true);
            if (entry.target.id === 'builder') setIsBuilderVisible(true);
            if (entry.target.id === 'lab') setIsLabVisible(true);
          }
        });
      }, { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    if (builderRef.current) observer.observe(builderRef.current);
    if (labRef.current) observer.observe(labRef.current);

    const mobileObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
          else entry.target.classList.remove('is-visible');
        });
      }, { threshold: 0.3 }
    );
    document.querySelectorAll('.mobile-pricing-card').forEach(el => mobileObserver.observe(el));

    const storyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains('story-step')) setActiveStory(entry.target.id);
            if (entry.target.classList.contains('conv-step')) setActiveConv(entry.target.id);
          }
        });
      }, { rootMargin: '-35% 0px -35% 0px' } 
    );
    document.querySelectorAll('.story-step, .conv-step').forEach(el => storyObserver.observe(el));

    return () => {
      observer.disconnect();
      mobileObserver.disconnect();
      storyObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    let animationFrameId;
    const scrollContainer = scrollRef.current;
    
    const handleScrollAndProgress = () => {
      if (scrollContainer && window.innerWidth >= 640 && !isHovered) {
        scrollContainer.scrollLeft += 0.6; 
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) scrollContainer.scrollLeft = 0;
      }

      if (convergingWrapperRef.current) {
        const rect = convergingWrapperRef.current.getBoundingClientRect();
        const stickyTopOffset = window.innerWidth < 640 ? 96 : 0; 
        
        const scrollStart = stickyTopOffset;
        const scrollEnd = - (rect.height - window.innerHeight);
        
        let progress = (rect.top - scrollStart) / (scrollEnd - scrollStart);
        setConvProgress(Math.max(0, Math.min(1, progress)));
      }

      animationFrameId = requestAnimationFrame(handleScrollAndProgress);
    };
    animationFrameId = requestAnimationFrame(handleScrollAndProgress);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  const activeIdx = Math.max(0, platformFeatures.findIndex(f => f.id === activeStory));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

        /* Strict Global Font Override */
        * {
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif !important;
        }

        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes marquee-ltr { 0% { transform: translate3d(-50%, 0, 0); } 100% { transform: translate3d(0%, 0, 0); } }
        @keyframes marquee-rtl { 0% { transform: translate3d(0%, 0, 0); } 100% { transform: translate3d(-50%, 0, 0); } }
        
        .animate-marquee-ltr { animation: marquee-ltr 50s linear infinite; will-change: transform; }
        .animate-marquee-rtl { animation: marquee-rtl 50s linear infinite; will-change: transform; }
        .pause-animation { animation-play-state: paused !important; }

        @media (max-width: 639px) {
          .mobile-pricing-card {
            opacity: 0.4; filter: blur(3px); transform: scale(0.96) translateY(10px);
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); will-change: opacity, filter, transform;
          }
          .mobile-pricing-card.is-visible { opacity: 1; filter: blur(0); transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#fafafa] pt-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[5%] left-[-15%] w-[60%] max-w-[900px] h-[700px] bg-blue-400/30 blur-[130px] rounded-full" />
          <div className="absolute top-[-15%] right-[-10%] w-[60%] max-w-[900px] h-[600px] bg-orange-400/30 blur-[140px] rounded-full" />
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[80%] max-w-[1000px] h-[350px] bg-amber-300/30 blur-[100px] rounded-full" />
        </div> 

        <div className="relative z-10 flex flex-col items-center px-6 max-w-4xl text-center w-full mt-8">
          <img src="/logo1.png" alt="Horizon Logo" className="w-32 h-32 object-contain mb-8 drop-shadow-sm" />
          <div className="px-5 py-1.5 rounded-full bg-[#f0f4f8] text-[#4a5568] text-xs font-semibold tracking-wide mb-8 shadow-sm border border-gray-200/50">
            India's Trusted WEB Infrastructure
          </div>
          <h1 className="text-5xl md:text-7xl text-gray-900 mb-6 font-bold tracking-tight">
            Powering the Future of WEB
          </h1>
          <p className="text-gray-500 max-w-xl text-base md:text-lg mb-10 leading-relaxed">
            Building advanced WEB infrastructure to fuel innovation and scale for enterprises worldwide.
          </p>
          <div className="flex flex-row items-center justify-center gap-3 w-full sm:w-auto mt-2">
            <button 
              onClick={triggerContactModal}
              className="w-1/2 sm:w-auto relative overflow-hidden rounded-full bg-[#1a1a1a] px-2 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-sm text-white font-medium transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] whitespace-nowrap"
            >
              <span className="relative z-10">Experience</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
            </button>
            <button 
              onClick={handleWhatsAppChat}
              className="w-1/2 sm:w-auto px-2 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-medium border border-gray-300 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm text-gray-800 whitespace-nowrap"
            >
              Chat
            </button>
          </div>
        </div>
      </section>

      {/* 2. WHAT WE OFFER SECTION */}
      <section id="what-we-offer" ref={sectionRef} className={`relative w-full py-24 bg-[#fafafa] flex flex-col items-center overflow-hidden transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[5%] left-[-15%] w-[60%] max-w-[900px] h-[700px] bg-blue-400/30 blur-[130px] rounded-full" />
          <div className="absolute top-[-15%] right-[-10%] w-[60%] max-w-[900px] h-[600px] bg-orange-400/30 blur-[140px] rounded-full" />
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[80%] max-w-[1000px] h-[350px] bg-amber-300/30 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 px-10 py-3 rounded-full bg-[#f0f4f8] text-[#4a5568] text-2xl font-semibold tracking-wide mb-16 shadow-sm border border-gray-200/50">
          What We Offer
        </div>

        <div className="hidden sm:block relative z-10 w-full max-w-[100vw]" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div ref={scrollRef} className="flex overflow-x-auto hide-scrollbar gap-6 px-0 pb-12" style={{ scrollBehavior: 'auto' }}>
            {[...services, ...services].map((service, idx) => (
              <div key={`${service.id}-${idx}-desktop`} className={`shrink-0 w-[400px] transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[60px]'}`} style={{ transitionDelay: `${(idx % 6) * 150}ms` }}>
                <div className="relative overflow-hidden flex justify-between items-start bg-white/85 backdrop-blur-xl border border-white rounded-[24px] p-8 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.12)] h-full w-full group hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18)] hover:-translate-y-1 transition-all duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/80 blur-3xl rounded-full group-hover:bg-white transition-colors duration-500 pointer-events-none" />
                  <div className={`relative z-10 flex flex-shrink-0 items-center justify-center w-24 h-24 rounded-[20px] bg-white/90 border border-white/80 shadow-sm backdrop-blur-md transition-all duration-500 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} style={{ transitionDelay: `${(idx % 6) * 150 + 350}ms` }}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/60 rounded-[20px] pointer-events-none" />
                    <img src="/logo1.png" alt="Horizon Logo" className="w-14 h-14 object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="relative z-10 text-right ml-6 flex flex-col justify-center w-full min-h-[96px]">
                    <h3 className="text-[22px] font-bold text-gray-900 tracking-tight leading-snug">{service.title}</h3>
                    <p className="text-[15px] text-gray-600 mt-2.5 leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="block sm:hidden relative z-10 w-full max-w-[100vw] overflow-hidden pb-12" onTouchStart={() => setIsMobileTouched(true)} onTouchEnd={() => setIsMobileTouched(false)}>
          <div className={`flex w-max gap-4 animate-marquee-ltr ${isMobileTouched ? 'pause-animation' : ''}`}>
            {[...services, ...services].map((service, idx) => (
              <div key={`${service.id}-${idx}-mobile-top`} className="shrink-0 w-[85vw]">
                <div className="relative overflow-hidden flex justify-between items-start bg-white/85 backdrop-blur-xl border border-white rounded-[24px] p-6 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.12)] h-full w-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-70 pointer-events-none`} />
                  <div className="relative z-10 flex flex-shrink-0 items-center justify-center w-14 h-14 rounded-[14px] bg-white/90 border border-white/80 shadow-sm backdrop-blur-md">
                    <img src="/logo1.png" alt="Horizon Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
                  </div>
                  <div className="relative z-10 text-right ml-4 flex flex-col justify-center w-full min-h-[56px]">
                    <h3 className="text-[17px] font-bold text-gray-900 tracking-tight leading-snug">{service.title}</h3>
                    <p className="text-[14px] text-gray-600 mt-1.5 leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PLATFORM STORYLINE SECTION */}
      <section id="platform" className="relative w-full bg-[#fafafa] py-10 md:py-24">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rotate-180 opacity-60">
          <div className="absolute top-[5%] left-[-15%] w-[60%] max-w-[900px] h-[700px] bg-blue-400/30 blur-[130px] rounded-full" />
          <div className="absolute top-[-15%] right-[-10%] w-[60%] max-w-[900px] h-[600px] bg-orange-400/30 blur-[140px] rounded-full" />
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[80%] max-w-[1000px] h-[350px] bg-amber-300/30 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-[1100px] mx-auto px-6 w-full">
          <div className="flex flex-col md:flex-row gap-8 md:gap-24 items-start relative">
            <div className="w-full md:w-1/2 sticky top-24 md:top-32 z-20 bg-[#fafafa]/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none pt-4 pb-6 md:py-0">
              <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-full mx-auto aspect-square rounded-[32px] bg-gradient-to-br from-[#ff8c00] via-[#ffaf5a] to-[#abc6ff] flex items-center justify-center relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(255,140,0,0.25)]">
                <div className="absolute w-[50%] h-[50%] sm:w-[55%] sm:h-[55%] flex items-center justify-center rotate-45">
                  <div className="absolute w-full h-full border-2 border-white/40 bg-white/20 backdrop-blur-md rounded-[24px] sm:rounded-[32px] shadow-lg transition-transform duration-1000 ease-out" style={{ transform: `translate(${-15 + (activeIdx * 8)}px, ${-15 + (activeIdx * 8)}px)` }} />
                  <div className="absolute w-full h-full border-2 border-white/60 bg-white/30 backdrop-blur-md rounded-[24px] sm:rounded-[32px] shadow-lg transition-transform duration-1000 ease-out" style={{ transform: `translate(0px, 0px)` }} />
                  <div className="absolute w-full h-full border-2 border-white/80 bg-white/40 backdrop-blur-md rounded-[24px] sm:rounded-[32px] shadow-lg transition-transform duration-1000 ease-out" style={{ transform: `translate(${15 - (activeIdx * 8)}px, ${15 - (activeIdx * 8)}px)` }} />
                  <div className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-black/70 rounded-full z-10 shadow-inner" />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 pt-[5vh] md:pt-[10vh] pb-[40vh] md:pb-[40vh]">
              {platformFeatures.map((feature) => {
                const isActive = activeStory === feature.id;
                return (
                  <div key={feature.id} id={feature.id} className={`story-step py-12 md:py-16 transition-all duration-700 ease-out ${isActive ? 'opacity-100 blur-0 scale-100' : 'opacity-30 blur-[4px] scale-[0.98]'}`}>
                    <h3 className="text-[24px] md:text-[32px] font-semibold text-gray-900 mb-4 tracking-tight leading-snug">{feature.title}</h3>
                    <p className="text-[16px] md:text-[18px] text-gray-500 leading-relaxed mb-6">{feature.desc}</p>
                    {feature.tags.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {feature.tags.map((tag, i) => (
                          <span key={i} className="px-5 py-2 text-[14px] text-gray-600 bg-transparent border border-gray-200/80 rounded-full font-medium">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. LAB / ABOUT US SECTION */}
      <section 
        id="lab" 
        ref={labRef}
        className={`relative w-full py-24 md:py-32 bg-[#fafafa] flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 ease-out z-20 ${
          isLabVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[5%] left-[-15%] w-[60%] max-w-[900px] h-[700px] bg-blue-400/30 blur-[130px] rounded-full" />
          <div className="absolute top-[-15%] right-[-10%] w-[60%] max-w-[900px] h-[600px] bg-orange-400/30 blur-[140px] rounded-full" />
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[80%] max-w-[1000px] h-[350px] bg-amber-300/30 blur-[100px] rounded-full" />
        </div>

        <div className="text-center z-10 max-w-3xl px-6 mb-16">
          <div className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[12px] mb-4">
            FOUNDED IN 2026
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight uppercase">
            We Build<span className="text-[#e85d45]"> High Performance</span> Web Experiences
          </h2>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto font-medium">
            Our mission has always been to craft modern, performance driven digital experiences.
          </p>
        </div>

        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8 max-w-7xl w-full px-6 z-10 mt-8"
          onMouseEnter={() => setIsLabHovered(true)}
          onMouseLeave={() => setIsLabHovered(false)}
        >
          {labStats.map((stat, i) => {
            const isActive = activeLabStat === i;

            return (
              <div 
                key={stat.id} 
                className={`relative flex flex-col items-center justify-center py-12 px-6 cursor-pointer group transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  ${isActive ? 'scale-105 z-30 opacity-100 drop-shadow-xl' : 'scale-95 z-10 opacity-40 hover:opacity-60 hover:scale-100'}
                `}
                onMouseEnter={() => setActiveLabStat(i)}
                onClick={() => setActiveLabStat(i)}
              >
                <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 transition-colors duration-500 ${isActive ? 'border-orange-400' : 'border-gray-200'}`} />
                <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 transition-colors duration-500 ${isActive ? 'border-orange-400' : 'border-gray-200'}`} />
                <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 transition-colors duration-500 ${isActive ? 'border-orange-400' : 'border-gray-200'}`} />
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 transition-colors duration-500 ${isActive ? 'border-orange-400' : 'border-gray-200'}`} />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none z-0">
                  <div className={`absolute w-14 h-16 sm:w-20 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded shadow-lg border-[3px] border-white transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom
                    ${isActive ? 'opacity-100 -translate-x-10 -translate-y-16 sm:-translate-x-14 sm:-translate-y-20 -rotate-12 scale-100' : 'opacity-0 scale-50'}`}
                  />
                  <div className={`absolute w-14 h-16 sm:w-20 sm:h-24 bg-gradient-to-bl from-orange-50 to-orange-100 rounded shadow-lg border-[3px] border-white transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom
                    ${isActive ? 'opacity-100 translate-x-10 -translate-y-16 sm:translate-x-14 sm:-translate-y-20 rotate-12 scale-100' : 'opacity-0 scale-50'}`}
                  />
                  <div className={`absolute w-16 h-20 sm:w-24 sm:h-28 bg-white rounded shadow-xl border-[3px] border-white transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom z-10
                    ${isActive ? 'opacity-100 translate-x-0 -translate-y-20 sm:-translate-y-24 rotate-0 scale-100' : 'opacity-0 scale-50'}`}
                  />
                </div>

                <div className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#e85d45] z-10 transition-transform duration-300 bg-white px-2 ${isActive ? 'scale-105 drop-shadow-sm' : 'scale-100'}`}>
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-[12px] text-gray-500 uppercase tracking-widest mt-4 font-semibold text-center z-10 bg-white px-2">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CINEMATIC CONVERGING CIRCLES & CTA */}
      <section id="cta" ref={convergingWrapperRef} className="relative w-full bg-[#fafafa]">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="sticky top-0 w-full h-screen overflow-hidden">
            <div className="absolute top-[5%] left-[-15%] w-[60%] max-w-[900px] h-[700px] bg-blue-400/30 blur-[130px] rounded-full" />
            <div className="absolute top-[-15%] right-[-10%] w-[60%] max-w-[900px] h-[600px] bg-orange-400/30 blur-[140px] rounded-full" />
            <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[80%] max-w-[1000px] h-[350px] bg-amber-300/30 blur-[100px] rounded-full" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start relative w-full max-w-[1100px] mx-auto px-6">
            <div className="w-full sm:w-1/2 sticky top-24 sm:top-0 h-[45vh] sm:h-screen z-20 flex items-center justify-center pt-8 sm:pt-0 bg-[#fafafa]/90 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none">
              <div className="w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] relative flex items-center justify-center">
                <div 
                  className="absolute top-1/2 left-1/2 w-28 h-28 sm:w-40 sm:h-40 rounded-full border border-white/60 bg-white/40 backdrop-blur-md flex items-center justify-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.06)] z-20"
                  style={{ transform: `translate(-50%, calc(-150% + ${convProgress * 100}%))` }}
                >
                  <span className="text-[12px] sm:text-[14px] font-semibold text-gray-700 leading-tight">Modern<br/>UI/UX</span>
                </div>

                <div 
                  className="absolute top-1/2 left-1/2 w-28 h-28 sm:w-40 sm:h-40 rounded-full border border-white/60 bg-white/40 backdrop-blur-md flex items-center justify-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.06)] z-20"
                  style={{ transform: `translate(calc(-150% + ${convProgress * 100}%), calc(50% - ${convProgress * 100}%))` }}
                >
                  <span className="text-[12px] sm:text-[14px] font-semibold text-gray-700 leading-tight">Full Website<br/>Development</span>
                </div>

                <div 
                  className="absolute top-1/2 left-1/2 w-28 h-28 sm:w-40 sm:h-40 rounded-full border border-white/60 bg-white/40 backdrop-blur-md flex items-center justify-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.06)] z-20"
                  style={{ transform: `translate(calc(50% - ${convProgress * 100}%), calc(50% - ${convProgress * 100}%))` }}
                >
                  <span className="text-[12px] sm:text-[14px] font-semibold text-gray-700 leading-tight">Performance<br/>& SEO</span>
                </div>

                <div 
                  className="absolute top-1/2 left-1/2 w-14 h-14 sm:w-20 sm:h-20 bg-white shadow-xl rounded-full flex items-center justify-center z-30 transition-all duration-300 ease-out"
                  style={{ 
                    opacity: convProgress > 0.85 ? 1 : 0, 
                    transform: `translate(-50%, -50%) scale(${convProgress > 0.85 ? 1 : 0.5})` 
                  }}
                >
                  <img src="/logo1.png" alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12 object-contain" />
                </div>
              </div>
            </div>

            <div className="w-full sm:w-1/2 pt-[5vh] sm:pt-[15vh] z-10 px-2 sm:px-0">
              {convergingFeatures.map((feat) => {
                const isActive = activeConv === feat.id;
                return (
                  <div 
                    key={feat.id} 
                    id={feat.id} 
                    className={`conv-step transition-all duration-700 ease-out flex flex-col
                      ${feat.isCta ? 'justify-start min-h-0 pt-20 sm:pt-24 pb-0' : 'py-20 sm:py-24 justify-center min-h-[50vh] sm:min-h-[60vh]'}
                      ${isActive ? 'opacity-100 blur-0 scale-100' : 'opacity-30 blur-[4px] scale-[0.98]'}`
                    }
                  >
                    {feat.isCta ? (
                      <div className="text-left">
                        <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
                          READY TO <br/> BUILD?
                        </h2>
                        <p className="text-[16px] sm:text-[18px] text-gray-600 leading-relaxed mb-10 max-w-md">{feat.desc}</p>
                        <button 
                          onClick={triggerContactModal}
                          className="w-full sm:w-auto px-8 py-4 bg-[#1a1a1a] text-white text-[13px] md:text-[14px] font-semibold uppercase tracking-[1px] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:scale-[1.03] transition-all duration-300"
                        >
                          Send a Message &rarr;
                        </button>
                      </div>
                    ) : (
                      <div className="text-left">
                        <h3 className="text-[26px] sm:text-[32px] font-semibold text-gray-900 mb-4 tracking-tight leading-snug">{feat.title}</h3>
                        <p className="text-[16px] sm:text-[18px] text-gray-500 leading-relaxed">{feat.desc}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
        </div>

        {/* FOOTER */}
        <div className="relative z-10 w-full mt-[75px] border-t border-b border-gray-300/40 py-6 sm:py-8 bg-transparent">
          <div className="w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-0 text-center md:text-left">
            <div className="text-lg font-semibold tracking-wide text-gray-800">WEBREV</div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-5 text-gray-700">
                <a href="#" className="hover:text-black hover:scale-110 transition-all"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="hover:text-black hover:scale-110 transition-all"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="hover:text-black hover:scale-110 transition-all"><Linkedin className="w-5 h-5" /></a>
                <a href="mailto:webrevinfo@gmail.com" className="hover:text-black hover:scale-110 transition-all"><Mail className="w-5 h-5" /></a>
              </div>
              <p className="text-sm text-gray-500">© 2026 All rights reserved.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HeroSection;