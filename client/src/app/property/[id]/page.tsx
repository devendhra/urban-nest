'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaRuler,
  FaBed,
  FaBath,
  FaCar,
  FaEnvelope,
  FaHome,
  FaPhone,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

interface Property {
  _id: string;
  name: string;
  price: number;
  address: string;
  city: string;
  state: string;
  country: string;
  floorArea: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  status: string;
  description: string;
  images: string[];
  latitude?: number;
  longitude?: number;
  contactEmail?: string;
  contactName?: string;
  contactPhoneNumber?: string;
}

export default function PropertyDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Image navigation functions
  const nextImage = useCallback(() => {
    if (property?.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  }, [property?.images]);

  const prevImage = useCallback(() => {
    if (property?.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  }, [property?.images]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!property?.images || property.images.length <= 1) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [property?.images, nextImage, prevImage]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      console.log('🔍 ENV DEBUG - NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('🔍 ENV DEBUG - Fallback URL will be used:', !process.env.NEXT_PUBLIC_API_URL);
      console.log('🔍 ENV DEBUG - Final API URL:', process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");
      console.log('🔍 ENV DEBUG - Property ID:', id);

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/contact-owner`, {
        ...contactForm,
        ownerEmail: property?.contactEmail,
        propertyName: property?.name
      });
      alert('Message sent successfully!');
      setShowContactForm(false);
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleBookingClick = () => {
    router.push(`/booking?id=${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h2>
          <Link href="/properties" className="text-blue-600 hover:text-blue-700">
            ← Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              UN
            </div>
            <span className="ml-2 text-xl font-bold text-gray-800">Urban Nest</span>
          </Link>
          
          <Link href="/properties" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Properties
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {property.images && property.images.length > 0 ? (
            <div className="relative group">
              {/* Main Image */}
              <div
                className="h-80 sm:h-96 md:h-[500px] lg:h-[600px] overflow-hidden cursor-pointer select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${property.images[currentImageIndex]}`}
                  alt={`${property.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Navigation Arrows - Hidden on mobile, visible on hover for desktop */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 sm:p-3 rounded-full transition-all duration-200 opacity-0 sm:opacity-100 sm:group-hover:opacity-100 hover:scale-110"
                    aria-label="Previous image"
                  >
                    <FaChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 sm:p-3 rounded-full transition-all duration-200 opacity-0 sm:opacity-100 sm:group-hover:opacity-100 hover:scale-110"
                    aria-label="Next image"
                  >
                    <FaChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black bg-opacity-70 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium">
                {currentImageIndex + 1} / {property.images.length}
              </div>

              {/* Dots Navigation */}
              {property.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-20 px-3 py-2 rounded-full">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                        index === currentImageIndex
                          ? 'bg-white scale-125'
                          : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Touch/Swipe Indicator for Mobile */}
              <div className="sm:hidden absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs">
                ← Swipe to navigate →
              </div>
            </div>
          ) : (
            <div className="h-80 sm:h-96 md:h-[500px] bg-gray-200 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <FaHome className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <span className="text-gray-500 text-sm sm:text-base">No images available</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.name}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{property.address}, {property.city}, {property.state}, {property.country}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    ₹{property.price.toLocaleString()}
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>

              {/* Property Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FaRuler className="text-blue-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Area</div>
                    <div className="font-semibold">{property.floorArea} sqft</div>
                  </div>
                </div>
                {property.bedrooms && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaBed className="text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                      <div className="font-semibold">{property.bedrooms}</div>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaBath className="text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                      <div className="font-semibold">{property.bathrooms}</div>
                    </div>
                  </div>
                )}
                {property.parking && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaCar className="text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Parking</div>
                      <div className="font-semibold">{property.parking}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Interested in this property?</h3>
              
              <div className="space-y-4 mb-6">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaEnvelope className="mr-2" />
                  Contact Owner
                </button>
                
                <button
                  onClick={handleBookingClick}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaHome className="mr-2" />
                  Book Viewing
                </button>
              </div>

              {property.contactPhoneNumber && (
                <div className="border-t pt-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaPhone className="mr-2" />
                    <span className="font-medium">Call directly:</span>
                  </div>
                  <a 
                    href={`tel:${property.contactPhoneNumber}`}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {property.contactPhoneNumber}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Property Owner</h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="I'm interested in this property..."
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              UN
            </div>
            <h3 className="text-xl font-bold">Urban Nest</h3>
          </div>
          <p className="text-gray-300 mb-4">Email: info@urbannest.com | Phone: (+91) 97236 18239</p>
          <p className="text-gray-400">&copy; 2024 Urban Nest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
