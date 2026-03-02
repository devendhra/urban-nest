'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { User, LogOut, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { motion, Variants } from 'framer-motion';

interface UserData {
  username: string;
  email: string;
  _id: string;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  const [user, setUser] = useState<UserData | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      //fetching user
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, formData);
      if (response.status === 200) {
        toast.success('Message received successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('There was an error sending the message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <div className="w-12 h-12 relative flex items-center justify-center transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="Urban Nest Logo" className="object-contain w-full h-full drop-shadow-md" />
            </div>
            <span className="ml-3 text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-indigo-900 tracking-tight">Urban Nest</span>
          </Link>

          <nav className="hidden md:flex ml-auto mr-8 space-x-8">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/properties" className="text-gray-700 hover:text-blue-600 transition-colors">
              Property
            </Link>
            <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">
              Services
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About Us
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact Us
            </a>
          </nav>

          {user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-hidden ring-offset-2"
                aria-label="User menu"
              >
                <User size={20} />
              </button>

              {dropdownVisible && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-10 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 mb-1">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="font-semibold text-gray-900 truncate">{user.username}</p>
                  </div>
                  <Link
                    href="/update-profile"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Edit size={16} className="mr-3" /> Update Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-50"
                  >
                    <LogOut size={16} className="mr-3" /> Sign out
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-32 overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container mx-auto px-4 text-center relative z-10"
        >
          {user && (
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-100 text-sm font-medium mb-4 backdrop-blur-sm">
                Welcome back, {user.username}!
              </span>
            </motion.div>
          )}
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Find Your <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-purple-300">Dream Home</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl mb-12 text-blue-100 font-light max-w-2xl mx-auto">
            Discover the perfect property with our comprehensive, premium real estate platform.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link
              href="/properties"
              className="inline-block px-10 py-5 bg-white text-blue-800 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
            >
              Explore Properties
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Our Premium Services</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {/* Service Cards */}
            <motion.div variants={fadeInUp} className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all border border-gray-100 hover:border-blue-100 group">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Custom Home Design</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive personalized home design suggestions from our experts. Whether you're renovating or building from scratch, our tailored designs ensure your vision becomes a reality.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all border border-gray-100 hover:border-blue-100 group">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Home Renovation</h3>
              <p className="text-gray-600 leading-relaxed">
                Revitalize your living spaces with our comprehensive renovation services. From kitchens to bathrooms, we transform outdated areas into modern, functional spaces.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all border border-gray-100 hover:border-blue-100 group">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">New Home Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Find your dream home with our advanced search tools. Explore a curated selection of properties that match your desired location, style, and luxury budget.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all border border-gray-100 hover:border-blue-100 group">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Builder Connections</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with top-rated luxury builders in your area. Whether you're planning a major renovation or a new construction, our trusted partners deliver unparalleled quality.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">About Urban Nest</h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.p variants={fadeInUp} className="text-gray-600 text-lg leading-relaxed">
                At Urban Nest, we are passionate about transforming the way people interact with their living spaces. Our platform integrates cutting-edge technology with user-friendly interfaces to offer a premium, comprehensive solution.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-gray-600 text-lg leading-relaxed">
                Founded with the mission to simplify and enhance the home buying and renovation process, Urban Nest provides a seamless experience for homeowners and homebuyers. Our expert real-estate team is dedicated to rigorous standards of excellence.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-gray-600 text-lg leading-relaxed">
                From personalized design suggestions to connecting you with trusted builders, we strive to make every step of your home journey enjoyable and stress-free. Welcome home.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="w-full max-w-lg h-96 relative rounded-3xl overflow-hidden shadow-2xl group flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-200 border border-white">
                {/* Large Logo display replacing the UN text block */}
                <div className="w-48 h-48 relative transform group-hover:scale-110 transition-transform duration-700 ease-out">
                  <img src="/logo.png" alt="Urban Nest" className="w-full h-full object-contain filter drop-shadow-2xl opacity-90" />
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Get in Touch</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
            <p className="mt-6 text-gray-400 max-w-xl mx-auto">Have questions about a premium property or our services? Our expert agents are standing by to assist you.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto bg-gray-800/50 backdrop-blur-md p-10 rounded-3xl border border-gray-700 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-300">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all resize-none"
                  placeholder="I'm interested in..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-blue-400 disabled:to-indigo-400 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Message...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="bg-gray-950 py-12 border-t border-gray-900">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 relative mx-auto mb-6">
            <img src="/logo.png" alt="Urban Nest Logo" className="object-contain w-full h-full opacity-70 hover:opacity-100 transition-opacity" />
          </div>
          <div className="space-y-3">
            <p className="text-gray-400 font-medium">info@urbannest.com <span className="mx-2 text-gray-700">|</span> (+91) 93841 29834</p>
            <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} Urban Nest Real Estate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
