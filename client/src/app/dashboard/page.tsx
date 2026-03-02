'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaSignOutAlt, FaUserEdit, FaPlus, FaHome } from 'react-icons/fa';

interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{
      backgroundImage: "url('/images/dsnew.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="w-12 h-12 relative flex items-center justify-center">
              <img src="/logo.png" alt="Urban Nest Logo" className="object-contain w-full h-full drop-shadow-md" />
            </div>
            <span className="ml-3 text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-indigo-900 tracking-tight">Urban Nest</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/properties" className="text-gray-700 hover:text-blue-600 transition-colors">
              Properties
            </Link>
            <Link href="/dashboard" className="text-blue-600 font-semibold">
              Dashboard
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
              Admin
            </Link>
          </nav>

          {user && (
            <div className="relative">
              <FaUserCircle
                onClick={toggleDropdown}
                className="w-8 h-8 text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
              />
              {dropdownVisible && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  <Link
                    href="/update-profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FaUserEdit className="mr-2" /> Update Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Welcome Section */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-blue-100 text-lg">
                Manage your properties and explore new opportunities
              </p>
            </div>
            <div className="hidden md:block">
              <FaHome className="text-6xl text-blue-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <Link
            href="/properties"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500"
          >
            <div className="flex items-center">
              <FaHome className="text-green-500 text-2xl mr-4" />
              <div>
                <h3 className="font-semibold text-gray-800">Browse Properties</h3>
                <p className="text-gray-600 text-sm">Explore available homes</p>
              </div>
            </div>
          </Link>

          <Link
            href="/update-profile"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500"
          >
            <div className="flex items-center">
              <FaUserEdit className="text-purple-500 text-2xl mr-4" />
              <div>
                <h3 className="font-semibold text-gray-800">Update Profile</h3>
                <p className="text-gray-600 text-sm">Edit your information</p>
              </div>
            </div>
          </Link>

          <Link
            href="/booking"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-orange-500"
          >
            <div className="flex items-center">
              <div className="text-orange-500 text-2xl mr-4">📅</div>
              <div>
                <h3 className="font-semibold text-gray-800">Book Viewing</h3>
                <p className="text-gray-600 text-sm">Schedule property tours</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* User Info Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="bg-gray-50 px-4 py-3 rounded-lg border">
                {user?.username}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="bg-gray-50 px-4 py-3 rounded-lg border">
                {user?.email}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="bg-gray-50 px-4 py-3 rounded-lg border">
                {user?.phone}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
              <div className="bg-gray-50 px-4 py-3 rounded-lg border">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/update-profile"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Information
            </Link>
          </div>
        </div>
      </div>

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
