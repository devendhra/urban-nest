'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';

interface FormData {
  name: string;
  description: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  floorArea: string;
  totalFloors: string;
  amenities: string;
  address: string;
  city: string;
  state: string;
  country: string;
  contactName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  legalDocumentation: string;
  price: string;
}

const EditProperty = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    images: [],
    bedrooms: 0,
    bathrooms: 0,
    floorArea: '',
    totalFloors: '',
    amenities: '',
    address: '',
    city: '',
    state: '',
    country: '',
    contactName: '',
    contactEmail: '',
    contactPhoneNumber: '',
    legalDocumentation: '',
    price: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property:', error);
        toast.error('Failed to load property data');
        router.push('/admin');
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, images: imageUrls });
  };

  const validate = () => {
    let formErrors = [];

    if (!formData.name.trim()) formErrors.push('Property name is required');
    if (!formData.description.trim()) formErrors.push('Property description is required');

    if (!formData.contactEmail) {
      formErrors.push('Contact email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      formErrors.push('Email address is invalid');
    }

    if (!formData.contactPhoneNumber) {
      formErrors.push('Contact phone number is required');
    } else if (!/^\d{10}$/.test(formData.contactPhoneNumber)) {
      formErrors.push('Phone number must be exactly 10 digits');
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      formErrors.push('Price must be a positive number');
    }

    if (formErrors.length > 0) {
      toast.error(formErrors.join('\n'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Property updated successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading property data...</div>
      </div>
    );
  }

  const formFields = [
    { label: 'Property Name', name: 'name', type: 'text', placeholder: 'Enter the property name', required: true },
    { label: 'Property Description', name: 'description', type: 'textarea', placeholder: 'Enter the property description', required: true },
    { label: 'Number of Bedrooms', name: 'bedrooms', type: 'number', placeholder: 'Enter the number of bedrooms', required: true },
    { label: 'Number of Bathrooms', name: 'bathrooms', type: 'number', placeholder: 'Enter the number of bathrooms', required: true },
    { label: 'Floor Area (sq. ft.)', name: 'floorArea', type: 'text', placeholder: 'Enter the floor area in square feet' },
    { label: 'Total Floors', name: 'totalFloors', type: 'number', placeholder: 'Enter the total number of floors' },
    { label: 'Amenities (comma separated)', name: 'amenities', type: 'text', placeholder: 'Enter amenities separated by commas' },
    { label: 'Address', name: 'address', type: 'text', placeholder: 'Enter the property address', required: true },
    { label: 'City', name: 'city', type: 'text', placeholder: 'Enter the city', required: true },
    { label: 'State', name: 'state', type: 'text', placeholder: 'Enter the state', required: true },
    { label: 'Country', name: 'country', type: 'text', placeholder: 'Enter the country', required: true },
    { label: 'Contact Name', name: 'contactName', type: 'text', placeholder: 'Enter the contact name', required: true },
    { label: 'Contact Email', name: 'contactEmail', type: 'email', placeholder: 'Enter the contact email', required: true },
    { label: 'Contact Phone Number', name: 'contactPhoneNumber', type: 'text', placeholder: 'Enter the contact phone number', required: true },
    { label: 'Legal Documentation', name: 'legalDocumentation', type: 'textarea', placeholder: 'Enter any legal documentation details' },
    { label: 'Price', name: 'price', type: 'number', placeholder: 'Enter the price', required: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8" style={{
      backgroundImage: "url('/images/epnew.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Property</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formFields.map(({ label, name, type, placeholder, required }) => (
              <div key={name} className={type === 'textarea' ? 'col-span-2' : ''}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                  {label} {required && '*'}
                </label>
                {type === 'textarea' ? (
                  <textarea
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    required={required}
                    rows={4}
                    value={formData[name as keyof FormData] as string}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <input
                    type={type}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    required={required}
                    value={formData[name as keyof FormData]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}

            {/* Property Images */}
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                Property Images
              </label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.images && formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.startsWith('blob:') ? image : `${process.env.NEXT_PUBLIC_API_URL}${image}`}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                {saving ? 'Updating Property...' : 'Update Property'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;
