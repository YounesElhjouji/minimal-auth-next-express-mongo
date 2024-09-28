'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  // Check login status
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await axios.get('http://localhost:3001/auth/profile', {
          withCredentials: true,
        });
        setLoggedIn(true);
      } catch (err) {
        setLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await axios.post(
      'http://localhost:3001/auth/logout',
      {},
      { withCredentials: true }
    );
    setLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          Auth App
        </Link>
        <div className="space-x-4">
          {loggedIn ? (
            <>
              <Link href="/profile" className="text-gray-300 hover:text-white">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
              <Link href="/register" className="text-gray-300 hover:text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
