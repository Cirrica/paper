'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function LoginFromTokenContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      try {
        // Save the JWT token to localStorage
        localStorage.setItem('cirricaToken', token);
        setStatus('Login successful! Redirecting to dashboard...');

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } catch (error) {
        console.error('Error saving token:', error);
        setStatus('Error saving authentication token.');
      }
    } else {
      setStatus('No token provided. Please check your login link.');
    }
  }, [searchParams, router]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full space-y-8 p-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            Authenticating...
          </h2>
          <p className='mt-2 text-sm text-gray-600'>{status}</p>
        </div>

        {status.includes('Error') && (
          <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-red-700 text-sm'>
              There was an issue with your login. Please try again or contact
              support.
            </p>
          </div>
        )}

        {status.includes('successful') && (
          <div className='mt-4 p-4 bg-green-50 border border-green-200 rounded-md'>
            <p className='text-green-700 text-sm'>
              Authentication successful! You will be redirected shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginFromToken() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <h2 className='text-3xl font-extrabold text-gray-900'>
              Loading...
            </h2>
          </div>
        </div>
      }
    >
      <LoginFromTokenContent />
    </Suspense>
  );
}
