'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const { loggedIn, handleLogout } = useAuth(); // Get loggedIn and handleLogout from context

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3001/auth/profile', {
          withCredentials: true,
        });
        setProfile(res.data);
      } catch (err) {
        router.push('/login');
      }
    };

    fetchProfile();
  }, [router, loggedIn]);

  return profile ? (
    <div className="flex flex-col  items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Profile
        </h1>
        <div className="mt-4 space-y-4">
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Email:</span> {profile.email}
          </p>
          <button
            onClick={async () => {
              await axios.post(
                'http://localhost:3001/auth/logout',
                {},
                { withCredentials: true }
              );
              router.push('/login');
            }}
            className="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center flex-grow">
      <p className="text-lg font-semibold text-gray-700">Loading...</p>
    </div>
  );
};

export default ProfilePage;
