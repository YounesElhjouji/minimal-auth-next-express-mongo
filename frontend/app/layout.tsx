import './global.css';
import Navbar from '../components/Navbar';

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
      <body>
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
