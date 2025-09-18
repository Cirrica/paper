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
    <div className="h-screen overflow-hidden bg-black text-white">
      <div className="flex h-full flex-col lg:flex-row">
        {/* Sidebar (flush left, full height) */}
        <aside className="sticky top-0 hidden h-screen border-r border-white/5 bg-sidebar px-5 py-6 lg:flex lg:w-64 lg:flex-col lg:shrink-0">
          {/* use your Sidebar and pass logout */}
          <Sidebar onLogout={handleLogout} />
        </aside>

        {/* Main content (centered container lives inside main) */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="font-poppins text-xl font-semibold leading-none tracking-wide text-white">Dashboard</h1>
                <p className="mt-2 font-poppins text-sm font-medium leading-none tracking-wide text-white">Welcome back to Cirrica</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-gold to-gold-soft px-4 py-2 font-poppins text-sm font-medium text-surface shadow-md">
                  <svg className="h-4 w-4" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M15.5514 2.92291C15.2701 2.6829 14.8884 2.62209 14.5534 2.76357L11.0447 4.25116L9.31437 0.585112C9.14534 0.226767 8.79977 0 8.42178 0C8.0438 0 7.69823 0.226107 7.52919 0.584452L5.79951 4.25118L2.29082 2.76359C1.95523 2.62144 1.57349 2.68226 1.29218 2.92292C1.01149 3.16359 0.874881 3.54705 0.936008 3.92457L2.13425 11.3399C2.20473 11.7697 2.58835 12.0593 2.99441 11.9892L3.54831 11.892C6.77501 11.3247 10.0685 11.3247 13.2952 11.892L13.8491 11.9892C14.2551 12.0606 14.6394 11.771 14.7086 11.3406L15.9075 3.92455C15.968 3.54703 15.8321 3.16423 15.5514 2.92291ZM13.7674 10.9029L13.4587 10.8487H13.458C10.1234 10.2623 6.72026 10.2623 3.38561 10.8487L3.07685 10.9029L1.91978 3.74599L5.42911 5.23358C5.91065 5.43391 6.45707 5.21375 6.69223 4.7245L8.42191 1.05777L10.1516 4.7245C10.3868 5.21375 10.9332 5.43391 11.4147 5.23358L14.924 3.74533L13.7674 10.9029Z" fill="currentColor" />
                  </svg>
                  <span className="font-poppins text-xs font-medium leading-4 text-current">
                    Create Tournament
                  </span>
                </button>
                <button className="inline-flex items-center gap-2 rounded-md border border-white px-4 py-2 font-poppins text-sm font-medium text-white transition-colors hover:bg-white/10">
                  <svg className="h-4 w-4" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M5.54044 7.83972H4.52944V6.00923C4.52944 5.51708 4.13084 5.11848 3.63869 5.11848C3.14654 5.11848 2.74794 5.51708 2.74794 6.00923V7.83972H1.73583C0.779381 7.83972 0 8.61802 0 9.57555V15.6169C0 16.5745 0.77941 17.3528 1.73583 17.3528H2.74794V19.1844C2.74794 19.6765 3.14654 20.0751 3.63869 20.0751C4.13084 20.0751 4.52944 19.6765 4.52944 19.1844V17.3528H5.54044C6.498 17.3528 7.27627 16.5745 7.27627 15.6169V9.57555C7.27627 8.61799 6.49797 7.83972 5.54044 7.83972ZM5.49479 15.5725L1.78159 15.6171L1.73594 9.62128L5.49503 9.57563L5.49479 15.5725Z" fill="currentColor" />
                    <path d="M15.2642 2.72235H14.2521V0.890746C14.2521 0.398598 13.8535 0 13.3613 0C12.8692 0 12.4706 0.398598 12.4706 0.890746V2.72235H11.4585C10.5009 2.72235 9.72266 3.50065 9.72266 4.45818V10.4996C9.72266 11.4571 10.5021 12.2354 11.4585 12.2354H12.4706V14.0659C12.4706 14.558 12.8692 14.9566 13.3613 14.9566C13.8535 14.9566 14.2521 14.558 14.2521 14.0659V12.2354H15.2642C16.2218 12.2354 17 11.4571 17 10.4996V4.45818C17 3.50062 16.2206 2.72235 15.2642 2.72235ZM15.2186 10.4552L11.5042 10.4997L11.4586 4.50391L15.2185 4.45826L15.2186 10.4552Z" fill="currentColor" />
                  </svg>
                  <span className="font-poppins text-xs font-medium leading-4 text-white">
                    Pick Stocks
                  </span>
                </button>
              </div>
            </div>

            <hr className="mt-5 border-t border-white/20" />

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
