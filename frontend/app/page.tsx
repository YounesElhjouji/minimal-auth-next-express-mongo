import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Welcome to the Authentication App
        </h1>
        <ul className="flex space-x-4 justify-center">
          <li>
            <Link
              href="/login"
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-md shadow-sm transition-all duration-200"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              href="/register"
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-md shadow-sm transition-all duration-200"
            >
              Register
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-md shadow-sm transition-all duration-200"
            >
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
