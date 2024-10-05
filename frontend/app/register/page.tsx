'use client';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { ErrorView, SuccessView } from '../../components/FormMessages';

const serverUrl = process.env.NEXT_PUBLIC_API_URL;

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [messageView, setMessageView] = useState(<></>);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessageView(<ErrorView message="Passwords do not match" />);
      return;
    }

    try {
      const res = await axios.post(`${serverUrl}/auth/register`, {
        email,
        password,
      });
      setMessageView(
        <SuccessView message="Check email to confirm registration" />
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message: string =
          err.response?.data?.message || 'An unexpected error occurred';
        setMessageView(<ErrorView message={message} />);
      } else {
        setMessageView(<ErrorView message="An unexpected error occurred" />);
      }
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Register
        </h1>
        {messageView}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Confirm your password"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
