'use client';

import { useState } from 'react';
import axios from 'axios';

const serverUrl = process.env.NEXT_PUBLIC_API_URL;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${serverUrl}/auth/forgot-password`, {
        email,
      });
      setMessage(res.data.message);
      setError(''); // Clear any previous errors
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
      setMessage(''); // Clear any previous success message
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password
        </h1>
        {message && <p className="text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6 w-96">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
