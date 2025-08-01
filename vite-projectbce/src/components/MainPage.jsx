import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navg = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const features = [
    { title: "Quick Signup", desc: "Create your account in just a few clicks and get started instantly." },
    { title: "Easy Donations", desc: "Donate unused medicines to help people who really need them." },
    { title: "Smart Search", desc: "Find medicines available near you with advanced filtering." },
    { title: "Secure Platform", desc: "Your data is safe with end-to-end security and privacy." },
    { title: "AI Suggestions", desc: "Get AI-based recommendations for donations and needs." },
  ];

  const testimonials = [
    { name: "Aarav", msg: "This platform helped me find affordable medicines easily!" },
    { name: "Neha", msg: "Donating medicines has never been this smooth. Love it!" },
    { name: "Rahul", msg: "A great initiative to reduce medicine waste and help society." },
  ];

  return (
    <div className="font-sans bg-gray-50">
      {/* ✅ Navbar */}
      <motion.nav
        className="flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-50"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-2xl font-bold text-blue-600">MediConnect</div>
        <div className="hidden md:flex space-x-6 text-lg font-medium">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#about" className="hover:text-blue-600">About</a>
          <a href="#testimonials" className="hover:text-blue-600">Testimonials</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
        </div>
        <div className="space-x-3 relative">
          <button 
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
          
          {/* Modal Backdrop */}
          <AnimatePresence>
            {isModalOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
                  onClick={() => setIsModalOpen(false)}
                />
                
                {/* Modal Content */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
                >
                  {/* Tabs */}
                  <div className="flex border-b">
                    <button
                      className={`flex-1 py-3 font-medium ${activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                      onClick={() => setActiveTab('login')}
                    >
                      Login
                    </button>
                    <button
                      className={`flex-1 py-3 font-medium ${activeTab === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                      onClick={() => setActiveTab('signup')}
                    >
                      Sign Up
                    </button>
                  </div>
                  
                  {/* Tab Content */}
                  <div className="p-4">
                    {activeTab === 'login' ? (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Welcome back!</h3>
                        <button 
                          onClick={() => navg('/login')}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors mb-2"
                        >
                          Continue to Login
                        </button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Create an account</h3>
                        <button 
                          onClick={() => navg('/signup')}
                          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Continue to Sign Up
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* ✅ Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-r from-blue-50 to-white">
        <motion.h1
          className="text-5xl font-extrabold text-gray-800 mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Connecting Donors & Needy Users
        </motion.h1>

        <motion.p
          className="text-lg text-gray-600 max-w-xl mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          A platform to share unused medicines with those in need. Join us today and make a difference in someone's life.
        </motion.p>

        <motion.div
          className="flex space-x-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <button 
            onClick={() => {
              setActiveTab('login');
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setIsModalOpen(true);
            }}
            className="bg-gray-100 text-gray-800 px-6 py-3 rounded-xl shadow-md hover:bg-gray-200 transition-colors"
          >
            Signup
          </button>
        </motion.div>
      </section>

      {/* ✅ Features Section */}
      <section id="features" className="py-16 px-6">
        <motion.h2
          className="text-4xl font-bold text-center text-gray-800 mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Key Features
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-3">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✅ About Section */}
      <section id="about" className="py-20 px-6 bg-gray-100">
        <motion.h2
          className="text-4xl font-bold text-center text-gray-800 mb-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About MediConnect
        </motion.h2>
        <p className="text-lg text-gray-700 max-w-3xl text-center mx-auto">
          MediConnect is a platform designed to bridge the gap between donors who have unused medicines and people who need them.  
          Our mission is to reduce medicine waste while helping those in need. We ensure safety, trust, and simplicity in every step.
        </p>
      </section>

      {/* ✅ Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <motion.h2
          className="text-4xl font-bold text-center text-gray-800 mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          What People Say
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-gray-700 mb-4">"{t.msg}"</p>
              <h3 className="text-lg font-semibold text-blue-600">- {t.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✅ Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gray-100 text-center">
        <motion.h2
          className="text-4xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Get in Touch
        </motion.h2>

        <p className="text-lg text-gray-700 mb-6">We would love to hear from you! Contact us anytime.</p>

        <p className="text-gray-800"><strong>Email:</strong> jpdhillon7176@gmail.com</p>
        <p className="text-gray-800"><strong>Instagram:</strong> @dhillonjaspinder</p>
        <p className="text-gray-800"><strong>LinkedIn:</strong> Jaspinder Singh Dhillon</p>
        <p className="text-gray-800"><strong>Contact:</strong> +91 9988776655</p>
      </section>

      {/* ✅ Footer */}
      <footer className="bg-blue-600 text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center mb-4">© 2025 MediConnect. All rights reserved.</p>
          
          {/* Developer Credit */}
          <div className="mt-6 p-4 bg-blue-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Built with ❤️ by Jaspinder Singh Dhillon</h3>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-100">
              <span className="flex items-center">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                React + Vite Frontend
              </span>
              <span className="flex items-center">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                ServerMVC Backend
              </span>
              <span className="flex items-center">
                <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Gemini AI Integration
              </span>
            </div>
            <p className="mt-3 text-sm text-blue-100">
              This platform connects donors with those in need, making medicine donation simple, secure, and efficient.
              Powered by modern web technologies and AI to serve humanity better.
            </p>
          </div>
          
          {/* Contact Links */}
          <div className="mt-6 text-center">
            <p className="flex flex-wrap justify-center gap-4">
              <a href="mailto:jpdhillon7176@gmail.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
                📧 jpdhillon7176@gmail.com
              </a>
              <a href="https://instagram.com/dhillonjaspinder" target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
                📸 @dhillonjaspinder
              </a>
              <a href="https://linkedin.com/in/jaspindersinghdhillon" target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
                💼 Jaspinder Singh Dhillon
              </a>
              <span className="flex items-center">
                📞 +91 9988776655
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
