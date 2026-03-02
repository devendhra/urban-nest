'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';

interface Property {
  _id: string;
  name: string;
  price: number;
  address: string;
  city: string;
  state: string;
  country: string;
  floorArea: number;
  status: string;
  images: string[];
}

const PropertyCard = ({ property }: { property: Property }) => {
  return (
    <Link href={`/property/${property._id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
        {property.images && property.images.length > 0 ? (
          <div className="relative h-48">
            <img 
              src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${property.images[0]}`}
              alt={property.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
              {property.images.length} photos
            </div>
          </div>
        ) : (
          <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            No Image Available
          </div>
        )}
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{property.name}</h3>
          <p className="text-2xl font-bold text-blue-600 mb-2">₹{property.price.toLocaleString()}</p>
          <p className="text-gray-600 mb-2">{property.floorArea} sqft</p>
          <p className="text-gray-600 mb-2">
            {property.address}, {property.city}, {property.state}, {property.country}
          </p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            property.status === 'available' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {property.status}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/properties`);
        setProperties(response.data);
        setFilteredProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const filterProperties = () => {
      const lowercasedQuery = searchQuery.toLowerCase();
      return properties.filter(property => {
        return (
          (property.name && property.name.toLowerCase().includes(lowercasedQuery)) ||
          (property.price && property.price.toString().includes(lowercasedQuery)) ||
          (property.address && property.address.toLowerCase().includes(lowercasedQuery)) ||
          (property.city && property.city.toLowerCase().includes(lowercasedQuery)) ||
          (property.state && property.state.toLowerCase().includes(lowercasedQuery))
        );
      });
    };

    setFilteredProperties(filterProperties());
  }, [searchQuery, properties]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/properties" className="text-blue-600 font-semibold">
              Properties
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section with Background */}
      <div className="relative bg-linear-to-br from-blue-600 to-purple-700 py-20">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Properties</h1>
          <p className="text-xl md:text-2xl opacity-90">Find your perfect home from our curated collection</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white py-8 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by property name, price, or address..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-6 py-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {filteredProperties.length} Properties Found
              </h2>
              {searchQuery && (
                <p className="text-gray-600 mt-2">
                  Showing results for "{searchQuery}"
                </p>
              )}
            </div>

            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map(property => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl text-gray-300 mb-4">🏠</div>
                <h3 className="text-2xl font-bold text-gray-600 mb-2">No Properties Found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? `No properties match your search for "${searchQuery}"`
                    : "No properties are currently available"
                  }
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
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
