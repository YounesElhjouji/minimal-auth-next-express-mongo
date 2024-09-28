'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext'; // Import the custom hook

const Navbar = () => {
  const { loggedIn, handleLogout } = useAuth(); // Get loggedIn and handleLogout from context

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
