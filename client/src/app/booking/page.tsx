'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

const Booking = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [ccv, setCcv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [propertyPrice, setPropertyPrice] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    const fetchPropertyPrice = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`);
        setPropertyPrice(response.data.price);
      } catch (error) {
        console.error('Error fetching property price:', error);
      }
    };
    fetchPropertyPrice();
  }, [id]);

  const validateName = (name: string) => /^[A-Za-z\s]+$/.test(name);
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validateCardNumber = (number: string) => /^\d{16}$/.test(number.replace(/\s/g, ''));
  const validateExpiryDate = (date: string) => /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(date);
  const validateCcv = (ccv: string) => /^\d{3}$/.test(ccv);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setAccountNumber(formatted);
  };

  const handlePayment = async () => {
    if (!validateName(name)) {
      toast.error('Please enter a valid name.');
      return;
    }
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!validateCardNumber(accountNumber)) {
      toast.error('Please enter a valid 16-digit card number.');
      return;
    }
    if (!validateExpiryDate(expiryDate)) {
      toast.error('Please enter a valid expiry date in MM/YY format.');
      return;
    }
    if (!validateCcv(ccv)) {
      toast.error('Please enter a valid 3-digit CCV.');
      return;
    }
    if (propertyPrice === null) {
      toast.error('Property details not loaded fully yet.');
      return;
    }

    setIsLoading(true);

    try {
      const paymentResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/booking/payment`, {
        amount: propertyPrice,
      });

      if (paymentResponse.status === 200) {
        const confirmationResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/booking/confirmation`, {
          email,
          bookingDetails: 'Booking details here...',
        });

        if (confirmationResponse.status === 200) {
          toast.success('Booking confirmed and email sent!');
          if (id) {
            router.push(`/property/${id}`);
          } else {
            router.push('/properties');
          }
        }
      }
    } catch (error) {
      console.error('Error processing booking:', error);
      toast.error('There was an error processing your booking.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Information</h1>
          <h2 className="text-xl text-gray-600">Unlocking Doors By Home Vision</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Credit Card Display */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <div className="relative bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl transform hover:scale-105 transition-transform duration-300">
                {/* Chip */}
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-8 bg-yellow-400 rounded-md flex items-center justify-center">
                    <div className="w-8 h-6 bg-yellow-300 rounded-sm"></div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-75">DEBIT</div>
                  </div>
                </div>

                {/* Card Number */}
                <div className="mb-6">
                  <div className="text-xl font-mono tracking-wider">
                    {accountNumber || '0000 0000 0000 0000'}
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs opacity-75 mb-1">CARDHOLDER NAME</div>
                    <div className="text-sm font-medium uppercase">
                      {name || 'CARDHOLDER NAME'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75 mb-1">EXPIRES</div>
                    <div className="text-sm font-medium">
                      {expiryDate || 'MM/YY'}
                    </div>
                  </div>
                </div>

                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name on Card *
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number *
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  placeholder="0000 0000 0000 0000"
                  value={accountNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono"
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  id="amount"
                  value={propertyPrice !== null ? `₹${propertyPrice.toLocaleString()}` : "Loading..."}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    maxLength={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="ccv" className="block text-sm font-medium text-gray-700 mb-2">
                    CCV *
                  </label>
                  <input
                    type="text"
                    id="ccv"
                    placeholder="000"
                    value={ccv}
                    onChange={(e) => setCcv(e.target.value)}
                    maxLength={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isLoading || propertyPrice === null || !name || !accountNumber || !expiryDate || !ccv || !email}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-lg font-medium text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay ₹${propertyPrice !== null ? propertyPrice.toLocaleString() : '...'}`
                )}
              </button>

              <div className="text-center text-sm text-gray-500">
                <p>🔒 Your payment information is secure and encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
