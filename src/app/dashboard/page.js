'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for the cirricaToken in localStorage
    const storedToken = localStorage.getItem('cirricaToken');

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      // Redirect to login if no token found
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cirricaToken');
    setToken(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex items-center'>
              <h1 className='text-xl font-semibold text-gray-900'>
                Cirrica Dashboard
              </h1>
            </div>
            <div className='flex items-center'>
              <button
                onClick={handleLogout}
                className='bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors'
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='border-4 border-dashed border-gray-200 rounded-lg p-8'>
            <div className='text-center'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Welcome to your Dashboard!
              </h2>
              <p className='text-gray-600 mb-6'>
                You have successfully logged in with your JWT token.
              </p>

              <div className='bg-gray-100 p-4 rounded-lg'>
                <h3 className='text-sm font-medium text-gray-700 mb-2'>
                  Stored Token:
                </h3>
                <p className='text-xs text-gray-500 break-all font-mono'>
                  {token ? `${token.substring(0, 50)}...` : 'No token found'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
