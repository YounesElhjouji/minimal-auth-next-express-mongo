import { AuthProvider } from 'frontend/context/AuthContext';
import Navbar from '../components/Navbar';
import './global.css';

export const metadata = {
  title: 'Auth App',
  description: 'A simple authentication app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex flex-col items-center justify-center flex-grow bg-gray-100">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
