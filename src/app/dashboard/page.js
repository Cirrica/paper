'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/sidebar';
import OverviewPanels from '@/app/components/overviewPanels';

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
    <div className="min-h-screen bg-black text-white">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] min-h-screen">
        {/* Sidebar (flush left, full height) */}
  <aside className="hidden lg:flex flex-col sticky top-0 h-screen overflow-auto border-r border-white/5 bg-[#0e0e0e] px-5 py-6">
          {/* use your Sidebar and pass logout */}
          <Sidebar onLogout={handleLogout} />
        </aside>

        {/* Main content (centered container lives inside main) */}
        <main className="w-full">
          <div className="mx-auto max-w-7xl px-5 lg:px-8 py-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="font-poppins font-semibold text-[20.45px] leading-[100%] tracking-[0.06em] text-white">Dashboard</h1>
                <p className="mt-2 font-poppins font-medium text-[14px] leading-[100%] tracking-[0.06em] text-white">Welcome back to Cirrica</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex h-[36px] w-[156px] items-center justify-center gap-[7.16px] rounded-[3.58px] p-[7.16px] bg-gradient-to-r from-[#DAA56A] to-[#FADABD] text-[#050505] shadow-md">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-['Poppins'] font-medium text-[12.52px] leading-[16.1px] tracking-[0px] text-current align-middle">
                    Create Tournament
                  </span>
                </button>
                <button className="flex h-[36px] w-[119px] items-center justify-center gap-[7.16px] rounded-[3.58px] border border-white p-[7.16px] bg-transparent text-white">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-['Poppins'] font-medium text-[12.52px] leading-[16.1px] tracking-[0px] text-white align-middle">
                    Pick Stocks
                  </span>
                </button>
              </div>
            </div>

            <hr className="border border-[#FFFFFF33] mt-5" />

            {/* Stats and overview panels */}
            <div>
              <OverviewPanels />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
