'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Building, CheckCircle, FileText } from 'lucide-react';

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
  totalFloors?: number;
  amenities?: string[];
  legalDocumentation?: string;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`);
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
    setIsSubmitting(true);
    try {
      await axios.post(`/api/contact-owner`, {
        ...contactForm,
        ownerEmail: property?.contactEmail,
        propertyName: property?.name
      });
      toast.success('Message sent successfully!');
      setShowContactForm(false);
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
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
            <div className="w-12 h-12 relative flex items-center justify-center">
              <img src="/logo.png" alt="Urban Nest Logo" className="object-contain w-full h-full drop-shadow-md" />
            </div>
            <span className="ml-3 text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-indigo-900 tracking-tight">Urban Nest</span>
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
                  src={`${process.env.NEXT_PUBLIC_API_URL}${property.images[currentImageIndex]}`}
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
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${index === currentImageIndex
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
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${property.status === 'available'
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
                {Math.max(0, property.parking) > 0 && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaCar className="text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Parking</div>
                      <div className="font-semibold">{property.parking}</div>
                    </div>
                  </div>
                )}
                {property.totalFloors && property.totalFloors > 0 && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Building className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Total Floors</div>
                      <div className="font-semibold">{property.totalFloors}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        <span className="font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {property.description && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </div>
              )}

              {/* Legal Documentation */}
              {property.legalDocumentation && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Documents</h3>
                  <a
                    href={property.legalDocumentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors font-medium border border-indigo-200"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    View Legal Documentation
                  </a>
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
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            style={{
              backgroundImage: "url('/images/sgnew.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay',
              backgroundColor: 'rgba(0, 0, 0, 0.75)'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl relative max-w-md w-full p-8 border border-white/20"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Contact Property Owner</h3>
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="I'm very interested in this property..."
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-md transition-all hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 relative mx-auto mb-4">
              <img src="/logo.png" alt="Urban Nest Logo" className="object-contain w-full h-full drop-shadow-lg" />
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
