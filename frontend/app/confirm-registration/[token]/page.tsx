'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const serverUrl = process.env.NEXT_PUBLIC_API_URL;

const ConfirmRegistrationPage = ({ params }: { params: { token: string } }) => {
  const router = useRouter();
  const { token } = params;

  useEffect(() => {
    async function postConfirmation() {
      await axios.post(`${serverUrl}/auth/confirm-registration/${token}`);
      router.push('/login');
    }
    postConfirmation();
  }, [token, router]);

  return <div>Confirming user registration</div>;
};

export default ConfirmRegistrationPage;
