import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sectionRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            
            // Add additional animation classes based on data attributes
            if (entry.target.dataset.animation === "fade-up") {
              entry.target.classList.add("animate-fade-up");
            }
            if (entry.target.dataset.animation === "fade-left") {
              entry.target.classList.add("animate-fade-left");
            }
            if (entry.target.dataset.animation === "fade-right") {
              entry.target.classList.add("animate-fade-right");
            }
            if (entry.target.dataset.animation === "scale") {
              entry.target.classList.add("animate-scale");
            }
          } else {
            // Remove animation classes when element is out of view
            // This allows animations to trigger again when scrolling back up
            entry.target.classList.remove("visible");
            entry.target.classList.remove("animate-fade-up");
            entry.target.classList.remove("animate-fade-left");
            entry.target.classList.remove("animate-fade-right");
            entry.target.classList.remove("animate-scale");
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const sections = document.querySelectorAll(".fade-in");
    sections.forEach((section) => observer.observe(section));

    // Also observe elements with specific animation classes
    const animatedElements = document.querySelectorAll('[data-animation]');
    animatedElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="scroll-smooth text-gray-800 bg-gradient-to-br from-blue-50 via-white to-green-50 font-['Inter'] overflow-x-hidden">
      {/* Background Animations */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-48 wave-container">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </div>
        {[...Array(15)].map((_, i) => (
          <div key={i} className="absolute text-blue-400 opacity-20 animate-float" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 10}s`, animationDuration: `${10 + Math.random() * 20}s` }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></svg>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-200/50">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <a href="#home" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L8.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd"></path></svg>
            </div>
            <span className="text-2xl font-bold text-blue-900"><span className="text-green-600">Rain</span>Worth</span>
          </a>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 font-medium relative group">
              <span>Home</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#mission" className="text-gray-700 font-medium relative group">
              <span>About</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#how-it-works" className="text-gray-700 font-medium relative group">
              <span>How It Works</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#benefits" className="text-gray-700 font-medium relative group">
              <span>Benefits</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
          
          <div className="hidden lg:flex items-center">
            <button onClick={() => navigate("/form")} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md text-white">
              Start Assessment
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-blue-600 focus:outline-none">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path></svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="px-6 pb-4 flex flex-col items-start space-y-4">
            <a href="#home" className="text-gray-700 font-medium w-full text-left" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#mission" className="text-gray-700 font-medium w-full text-left" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#how-it-works" className="text-gray-700 font-medium w-full text-left" onClick={() => setIsMenuOpen(false)}>How It Works</a>
            <a href="#benefits" className="text-gray-700 font-medium w-full text-left" onClick={() => setIsMenuOpen(false)}>Benefits</a>
            <button onClick={() => { setIsMenuOpen(false); navigate("/form"); }} className="w-full bg-blue-600 text-white font-semibold py-3 mt-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md text-white">
              Start Assessment
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-start justify-center px-4 relative pt-18">
        <div className="text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="block text-blue-900" data-animation="fade-up">Save Rainwater,</span>
            <span className="block bg-gradient-to-r from-green-500 via-blue-600 to-purple-500 bg-clip-text text-transparent" data-animation="fade-up">Raise the Future.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed" data-animation="fade-up">
            Transform your rooftop into a <span className="font-semibold text-blue-600">water conservation powerhouse</span> with intelligent rainwater harvesting insights.
          </p>
          {/* Enhanced CTA Button */}
          <div className="relative inline-block group" data-animation="scale">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-green-500 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-1000 animate-pulse-slow"></div>
            <button onClick={() => navigate("/form")} className="relative bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold py-4 px-8 rounded-full text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center justify-center space-x-2">
                <span>Start Your Assessment</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-16 md:py-24 relative z-10">
        {/* Problem Statement Section */}
        <section id="mission" className="text-center mb-16 md:mb-24 fade-in">
          <h2 className="font-extrabold text-4xl md:text-5xl text-blue-900 mb-4" data-animation="fade-up">Our Challenge & Solution</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12" data-animation="fade-up">Rainworth is designed to bridge the gap between the vast potential of rainwater harvesting and public participation by providing a simple, data-driven tool for every citizen.</p>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-t-4 border-red-500 fade-in" data-animation="fade-left">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
              <h3 className="text-2xl font-bold text-red-600 mb-3">The Problem</h3>
              <p className="text-gray-600">A lack of accessible tools prevents individuals from assessing their rainwater harvesting potential, creating a barrier to widespread adoption and water conservation efforts.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-t-4 border-green-500 fade-in" data-animation="fade-right">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
              <h3 className="text-2xl font-bold text-green-600 mb-3">Our Solution</h3>
              <p className="text-gray-600">A user-friendly digital platform that provides instant, personalized feasibility reports for rooftop rainwater harvesting, empowering everyone to contribute to groundwater replenishment.</p>
            </div>
          </div>
          <div className="mt-12 bg-blue-50/50 p-6 rounded-xl inline-block backdrop-blur-sm fade-in" data-animation="fade-up">
            <p className="text-gray-500 font-semibold">An initiative by</p>
            <h3 className="text-2xl font-bold text-blue-800">Ministry of Jal Shakti</h3>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="text-center mb-16 md:mb-24 fade-in">
          <h2 className="font-extrabold text-4xl md:text-5xl text-blue-900 mb-4" data-animation="fade-up">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12" data-animation="fade-up">Get a detailed report in three simple steps.</p>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 right-0 w-2/3 mx-auto h-1 border-t-2 border-dashed border-blue-200 -z-10"></div>
            {[
              { title: "Enter Details", desc: "Provide basic info like location and roof area.", icon: <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>, color: "blue", animation: "fade-left" },
              { title: "Data Analysis", desc: "Our system analyzes local GIS data, rainfall, and groundwater levels.", icon: <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M12 8h.01M15 8h.01M15 5h.01M12 5h.01M9 5h.01M4 7h1m16 0h1M4 12h1m16 0h1M4 17h1m16 0h1" /></svg>, color: "green", animation: "fade-up" },
              { title: "Get Report", desc: "Receive a personalized report with recommendations and cost estimates.", icon: <svg className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, color: "purple", animation: "fade-right" }
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-lg flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative border-t-4 fade-in" style={{borderColor: step.color}} data-animation={step.animation}>
                <div className="absolute -top-5 bg-white p-1 rounded-full"><div className={`bg-${step.color}-100 rounded-full p-5`}>{step.icon}</div></div>
                <h3 className="text-xl font-bold mb-2 mt-20">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="text-center fade-in">
          <h2 className="font-extrabold text-4xl md:text-5xl text-blue-900 mb-4" data-animation="fade-up">What are the Benefits?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12" data-animation="fade-up">This application empowers individuals and communities with the knowledge to make impactful decisions for a water-secure future.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Accurate Information", desc: "Access hyperlocal data on groundwater levels, rainfall patterns, and soil types.", icon: "📊", animation: "fade-up" },
              { title: "Personalized Suggestions", desc: "Get tailored recommendations for the most suitable recharge structures for your home.", icon: "🎯", animation: "fade-up" },
              { title: "Cost Estimation", desc: "Receive a clear estimate of the costs and potential long-term benefits of implementation.", icon: "💰", animation: "fade-up" },
              { title: "Public Awareness", desc: "Understand the importance of water conservation and inspire your community.", icon: "🌍", animation: "fade-up" },
              { title: "Easy Access", desc: "Our tool will support regional languages to ensure inclusivity for all users.", icon: "🗣️", animation: "fade-up" },
              { title: "Sustainable Impact", desc: "Directly contribute to sustainable water management and a healthier environment.", icon: "🌱", animation: "fade-up" },
            ].map((benefit, i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col items-center text-center fade-in" data-animation={benefit.animation} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="font-bold text-xl mb-2 text-blue-700">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white relative z-10 mt-16">
        <div className="container mx-auto px-6 py-12 text-center md:text-left">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold text-white mb-4"><span className="text-green-400">Rain</span>worth</div>
              <p className="text-gray-400 max-w-md">Empowering communities to conserve water through innovative technology and public participation. An initiative by the Ministry of Jal Shakti, Government of India.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#mission" className="text-gray-400 hover:text-white">The Problem</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white">How It Works</a></li>
                <li><a href="#benefits" className="text-gray-400 hover:text-white">Benefits</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Harvesting Guide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Conservation Tips</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Rainworth. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Assessment Modal Trigger */}
      

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        .animate-float { animation: float 10s linear infinite; }

        .wave-container { position: absolute; bottom: 0; left: 0; width: 100%; height: 12rem; overflow: hidden; }
        .wave { background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" style="fill:rgba(59, 130, 246, 0.3);"></path></svg>'); background-repeat: repeat-x; position: absolute; bottom: 0; width: 200%; height: 100%; background-position: 0 bottom; transform-origin: center bottom; }
        .wave1 { animation: wave-move 15s linear infinite; opacity: 1; }
        .wave2 { animation: wave-move 10s linear infinite; opacity: 0.5; }
        .wave3 { animation: wave-move 8s linear infinite; opacity: 0.3; }
        @keyframes wave-move { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        
        /* New animation classes */
        [data-animation] { opacity: 0; transition: all 0.6s ease-out; }
        
        .animate-fade-up { 
          animation: fadeUp 0.6s forwards;
        }
        
        .animate-fade-left { 
          animation: fadeLeft 0.6s forwards;
        }
        
        .animate-fade-right { 
          animation: fadeRight 0.6s forwards;
        }
        
        .animate-scale { 
          animation: scaleIn 0.6s forwards;
        }
        
        @keyframes fadeUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeLeft {
          from { 
            opacity: 0;
            transform: translateX(-30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeRight {
          from { 
            opacity: 0;
            transform: translateX(30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in-fast { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-pulse-slow { animation: pulse 3s infinite; }
        @keyframes pulse { 50% { opacity: .6; } }
      `}</style>
    </div>
  );
}