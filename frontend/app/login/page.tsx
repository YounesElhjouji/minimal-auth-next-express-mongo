'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { FaCircleExclamation } from 'react-icons/fa6';

const serverUrl = process.env.NEXT_PUBLIC_API_URL;

const ErrorView = () => {
  const searchParams = useSearchParams();
  const queryError = searchParams.get('error');

  if (!queryError) return null; // Don't render anything if there's no error.

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-red-100 border border-red-300 rounded-md shadow-sm">
      <FaCircleExclamation className="text-2xl text-red-600" />
      <p className="text-red-800 font-medium">{queryError}</p>
    </div>
  );
};

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setLoggedIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        `${serverUrl}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setLoggedIn(true);
      router.push('/profile');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
        <Suspense>
          <ErrorView />
        </Suspense>
        {/* Login Form */}
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
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Login Button */}
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="px-12 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Login
            </button>
            <Link
              href="/forgot-password"
              className="text-indigo-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center space-x-2 my-4">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="text-gray-500">OR</span>
          <div className="border-t border-gray-300 w-full"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <a
            href={`${serverUrl}/auth/google`}
            className="flex items-center justify-center space-x-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
          >
            <FcGoogle className="text-2xl" />
            <span className="text-sm font-medium text-gray-700">
              Login with Google
            </span>
          </a>

          <a
            href={`${serverUrl}/auth/facebook`}
            className="flex items-center justify-center space-x-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            <FaFacebook className="text-2xl" />
            <span className="text-sm font-medium">Login with Facebook</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
