'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, Search } from 'lucide-react'; // ✅ Lucide icons
import Sidebar from '../components/Sidebar';
import { allTournaments, tabs } from '../../app/data/tournamentdata';
import {
  getLevelColor,
  getProgress,
  getStatusColor,
  getStatusLabel,
  handleJoinTournament,
} from '../../app/utils/tournamenthelpers';

export default function TournamentsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Live');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    entry: '',
    multiplier: '',
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('cirricaToken');

    if (storedToken || process.env.NODE_ENV === 'development') {
      setIsAuthenticated(true);
      setIsCheckingAuth(false);
      return;
    }

    router.push('/');
    setIsCheckingAuth(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cirricaToken');
    setIsAuthenticated(false);
    setIsSidebarOpen(false);
    router.push('/');
  };

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleSearch = (query) => setSearchQuery(query);
  const handleTabChange = (tabName) => setActiveTab(tabName);
  const handleFilterChange = (newFilters) => setFilters(newFilters);
  const handleCreateTournament = () => {
    router.push('/createTournament');
  };

  // Filter tournaments
  const filteredTournaments = {
    featured: allTournaments.featured.filter((t) => {
      if (filters.status && t.status !== filters.status) return false;
      if (
        filters.entry &&
        Number(t.entry?.replace('$', '')) !== Number(filters.entry)
      )
        return false;
      if (
        filters.multiplier &&
        Number(t.multiplier.replace(/x/i, '')) !== Number(filters.multiplier)
      )
        return false;
      if (
        searchQuery &&
        !t.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    }),
    regular: allTournaments.regular.filter((t) => {
      if (filters.status && t.status !== filters.status) return false;
      if (
        filters.entry &&
        Number(t.entryFee?.replace('$', '')) !== Number(filters.entry)
      )
        return false;
      if (
        filters.multiplier &&
        Number(t.multiplier.replace(/x/i, '')) !== Number(filters.multiplier)
      )
        return false;
      if (
        searchQuery &&
        !t.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    }),
  };

  if (isCheckingAuth) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black text-white'>
        <p className='font-poppins text-sm text-white/70'>Checking your access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black text-white'>
        <p className='font-poppins text-sm text-white/70'>Redirecting you to sign in...</p>
      </div>
    );
  }

  return (
    <div className='h-screen overflow-hidden bg-black text-white'>
      <div className='flex h-full flex-col lg:flex-row'>
        <aside className='sticky top-0 hidden h-screen border-r border-white/10 bg-surface px-5 py-6 lg:flex lg:w-56 lg:flex-col lg:shrink-0'>
          <Sidebar onLogout={handleLogout} activeItem='tournaments' />
        </aside>

        <main className='flex-1 overflow-y-auto'>
          <div className='sticky top-0 z-30 flex items-center justify-between gap-3 bg-black px-5 py-4 lg:hidden'>
            <button
              type='button'
              onClick={openSidebar}
              className='inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10'
              aria-label='Open navigation'
            >
              <svg
                width='20'
                height='14'
                viewBox='0 0 20 14'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <path
                  d='M1 1H19'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
                <path
                  d='M1 7H19'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
                <path
                  d='M1 13H19'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
              </svg>
              <span className='font-poppins text-xs font-semibold uppercase tracking-wider text-current'>
                Menu
              </span>
            </button>
            <div className='flex-1 text-right'>
              <p className='font-poppins text-xs font-medium uppercase tracking-widest text-white/60'>
                Tournaments
              </p>
            </div>
          </div>

          <div className='mx-auto max-w-7xl px-5 py-8'>
            <div className='flex justify-between items-center mb-8'>
              <div>
                <h1 className='text-3xl font-bold mb-2'>Tournaments</h1>
                <p className='text-gray-400 text-sm'>
                  Complete and win up to 1000x your investment.
                </p>
              </div>
              <button
                className='flex items-center gap-2 bg-gradient-to-r from-yellow-700 to-amber-100 text-black px-6 py-3 rounded-md font-medium hover:from-yellow-400 hover:to-yellow-200 transition'
                onClick={handleCreateTournament}
              >
                <svg
                  className='w-5 h-5'
                  width='16'
                  height='12'
                  viewBox='0 0 16 12'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden='true'
                >
                  <path
                    d='M15.5514 2.92291C15.2701 2.6829 14.8884 2.62209 14.5534 2.76357L11.0447 4.25116L9.31437 0.585112C9.14534 0.226767 8.79977 0 8.42178 0C8.0438 0 7.69823 0.226107 7.52919 0.584452L5.79951 4.25118L2.29082 2.76359C1.95523 2.62144 1.57349 2.68226 1.29218 2.92292C1.01149 3.16359 0.874881 3.54705 0.936008 3.92457L2.13425 11.3399C2.20473 11.7697 2.58835 12.0593 2.99441 11.9892L3.54831 11.892C6.77501 11.3247 10.0685 11.3247 13.2952 11.892L13.8491 11.9892C14.2551 12.0606 14.6394 11.771 14.7086 11.3406L15.9075 3.92455C15.968 3.54703 15.8321 3.16423 15.5514 2.92291ZM13.7674 10.9029L13.4587 10.8487H13.458C10.1234 10.2623 6.72026 10.2623 3.38561 10.8487L3.07685 10.9029L1.91978 3.74599L5.42911 5.23358C5.91065 5.43391 6.45707 5.21375 6.69223 4.7245L8.42191 1.05777L10.1516 4.7245C10.3868 5.21375 10.9332 5.43391 11.4147 5.23358L14.924 3.74533L13.7674 10.9029Z'
                    fill='currentColor'
                    stroke='currentStroke'
                    strokeWidth='0'
                  />
                </svg>
                Create Tournament
              </button>
            </div>

            <div className='mb-8'>
              <SearchAndFilter
                searchQuery={searchQuery}
                onSearchChange={handleSearch}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {filteredTournaments.featured.length > 0 && (
              <section className='mb-8'>
                <h2 className='flex items-center text-xl font-bold mb-6'>
                  <svg
                    className='mr-2 w-5 h-5 text-yellow-400'
                    width='17'
                    height='17'
                    viewBox='0 0 17 17'
                    fill='currentColor'
                    stroke='currentStroke'
                    xmlns='http://www.w3.org/2000/svg'
                    aria-hidden='true'
                  >
                    <path
                      d='M8.5 0L10.36 5.85H16.5L11.07 9.45L13.03 15.5L8.5 11.9L3.97 15.5L5.93 9.45L0.5 5.85H6.64L8.5 0Z'
                      strokeWidth='0'
                    />
                  </svg>{' '}
                  {/* ✅ Custom Star */}
                  Featured Tournament
                </h2>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  {filteredTournaments.featured.map((tournament) => (
                    <FeaturedTournament
                      key={tournament.id}
                      tournament={tournament}
                    />
                  ))}
                </div>
              </section>
            )}

            <div className='mb-6'>
              <TournamentTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </div>

            {filteredTournaments.regular.length > 0 && (
              <section className='mb-8'>
                <TournamentGrid tournaments={filteredTournaments.regular} />
              </section>
            )}

            {filteredTournaments.featured.length === 0 &&
              filteredTournaments.regular.length === 0 && (
                <div className='flex flex-col items-center justify-center py-12 text-center text-gray-400'>
                  <svg
                    className='h-16 w-16 mb-4'
                    width='20'
                    height='19'
                    viewBox='0 0 20 19'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    aria-hidden='true'
                  >
                    <path
                      d='M6.625 7.59961C6.625 8.50466 6.9798 9.37366 7.6123 10.0146C8.24498 10.6558 9.10382 11.0166 10 11.0166C10.8962 11.0166 11.755 10.6558 12.3877 10.0146C13.0202 9.37366 13.375 8.50466 13.375 7.59961V2.2832H6.625V7.59961ZM2.25 6.33301C2.25 6.73419 2.40755 7.11962 2.68848 7.4043C2.96952 7.68909 3.3511 7.84961 3.75 7.84961H4.625V4.18359H2.25V6.33301ZM15.375 7.84961H16.25C16.6489 7.84961 17.0305 7.68909 17.3115 7.4043C17.5925 7.11962 17.75 6.73419 17.75 6.33301V4.18359H15.375V7.84961ZM9 12.9561L8.80664 12.9111C8.03153 12.7311 7.30554 12.3781 6.68066 11.8789C6.0558 11.3797 5.54752 10.7462 5.19336 10.0234L5.125 9.88379H3.75C2.82283 9.88379 1.933 9.5101 1.27637 8.84473C0.619617 8.17922 0.25 7.27559 0.25 6.33301V3.16699C0.25 2.8963 0.356035 2.6367 0.543945 2.44629C0.731735 2.25605 0.985907 2.15039 1.25 2.15039H4.625V0.25H15.375V2.15039H18.75C19.0141 2.15039 19.2683 2.25605 19.4561 2.44629C19.644 2.6367 19.75 2.89629 19.75 3.16699V6.33301C19.75 7.27559 19.3804 8.17922 18.7236 8.84473C18.067 9.5101 17.1772 9.88379 16.25 9.88379H14.875L14.8066 10.0234C14.4525 10.7462 13.9442 11.3797 13.3193 11.8789C12.6945 12.3781 11.9685 12.7311 11.1934 12.9111L11 12.9561V16.7168H15.375V18.75H4.625V16.7168H9V12.9561Z'
                      fill='currentColor'
                      stroke='currentStroke'
                      strokeWidth='0'
                    />
                  </svg>{' '}
                  {/* ✅ Custom Trophy */}
                  <h3 className='text-xl font-semibold mb-2'>
                    No tournaments found
                  </h3>
                  <p className='text-sm'>
                    {searchQuery
                      ? `No tournaments match "${searchQuery}"`
                      : 'No tournaments are currently available.'}
                  </p>
                </div>
              )}
          </div>
        </main>
      </div>

      {isSidebarOpen ? (
        <div className='fixed inset-0 z-40 flex lg:hidden'>
          <button
            type='button'
            className='absolute inset-0 bg-black/70'
            aria-label='Close navigation overlay'
            onClick={closeSidebar}
          />
          <div className='relative z-10 h-full w-64 max-w-[80vw] bg-surface px-5 py-6 shadow-2xl'>
            <Sidebar
              onLogout={handleLogout}
              activeItem='tournaments'
              onNavigate={closeSidebar}
              onClose={closeSidebar}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SearchAndFilter({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    setShowDropdown(false);
  };

  return (
    <div className='flex justify-between gap-4 mb-8 relative'>
      {/* Search input */}
      <div className='relative flex-1 max-w-md'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
        <input
          type='text'
          placeholder='Search tournaments ...'
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          className='w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-700'
        />
      </div>

      {/* Filter button */}
      <div className='relative'>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className='bg-zinc-900 border border-zinc-700 text-white px-6 py-3 rounded-lg font-medium flex items-center hover:bg-zinc-700'
        >
          <Filter className='mr-2 w-5 h-5' />
          Filter
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <div className='absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-lg p-4 z-10 shadow-lg'>
            {/* Status */}
            <div className='mb-4'>
              <label className='block mb-1 text-gray-300'>Status</label>
              <select
                name='status'
                value={localFilters.status}
                onChange={handleInputChange}
                className='w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white'
              >
                <option value=''>All</option>
                <option value='live'>Live</option>
                <option value='upcoming'>Upcoming</option>
                <option value='ending_soon'>Ending Soon</option>
              </select>
            </div>

            {/* Entry Fee Range */}
            <div className='mb-4'>
              <label className='block mb-1 text-gray-300'>Entry Fee ($)</label>
              <div className='flex gap-2'>
                <input
                  type='number'
                  name='entryMin'
                  placeholder='Min'
                  value={localFilters.entryMin || ''}
                  onChange={handleInputChange}
                  className='w-1/2 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white'
                />
                <input
                  type='number'
                  name='entryMax'
                  placeholder='Max'
                  value={localFilters.entryMax || ''}
                  onChange={handleInputChange}
                  className='w-1/2 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white'
                />
              </div>
            </div>

            {/* Multiplier Range */}
            <div className='mb-4'>
              <label className='block mb-1 text-gray-300'>
                Multiplier (X)
              </label>
              <div className='flex gap-2'>
                <input
                  type='number'
                  name='multiplierMin'
                  placeholder='Min'
                  value={localFilters.multiplierMin || ''}
                  onChange={handleInputChange}
                  className='w-1/2 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white'
                />
                <input
                  type='number'
                  name='multiplierMax'
                  placeholder='Max'
                  value={localFilters.multiplierMax || ''}
                  onChange={handleInputChange}
                  className='w-1/2 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white'
                />
              </div>
            </div>

            <button
              onClick={applyFilters}
              className='w-full bg-yellow-700 hover:bg-yellow-600 text-black py-2 rounded-lg font-medium'
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TournamentTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className='flex gap-4 mb-6'>
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => onTabChange(tab.name)}
          className={`px-6 py-3 rounded-lg font-medium ${
            activeTab === tab.name
              ? 'bg-zinc-900 text-white border border-zinc-700'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {tab.name} ({tab.count})
        </button>
      ))}
    </div>
  );
}

function FeaturedTournament({ tournament }) {
  const progress = getProgress(
    tournament.currentParticipants,
    tournament.maxParticipants
  );

  return (
    <div className='bg-zinc-900 rounded-xl p-6 border border-zinc-700 relative'>
      <div className='absolute top-1 right-1 bg-gradient-to-r from-yellow-700 to-amber-100 text-xs font-bold text-black px-2 py-0.5 rounded-full'>
        FEATURED
      </div>

      <div className='flex justify-between items-start mb-4'>
        <h3 className='text-xl font-bold'>{tournament.title}</h3>
        <div className='text-right'>
          <div className='flex items-center font-bold text-yellow-600'>
            <svg
              className='mr-2 w-4 h-4'
              width='10'
              height='16'
              viewBox='0 0 10 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'
            >
              <path
                d='M9.967 7.707C9.89457 7.48596 9.71138 7.32074 9.48596 7.27299L6.38332 6.61619L7.31932 0.758518C7.36567 0.468169 7.21479 0.182163 6.95035 0.0596611C6.68568 -0.0630601 6.37319 0.00778505 6.1861 0.233164L0.151564 7.49206C0.0142876 7.65728 -0.033572 7.88072 0.0237732 8.08869C0.0810876 8.29667 0.2365 8.46276 0.438661 8.53208L3.44796 9.5651L2.23438 15.2072C2.17187 15.4982 2.31153 15.7951 2.57425 15.9296C2.66712 15.9771 2.76714 16 2.86607 16C3.0471 16 3.22513 15.9231 3.351 15.7787L9.83816 8.34588C9.99048 8.17129 10.0396 7.92803 9.967 7.707ZM4.02642 13.0282L4.83441 9.27234C4.90445 8.94711 4.72191 8.6208 4.41047 8.51398L1.75031 7.60084L5.66953 2.8869L5.00852 7.02361C4.95333 7.36846 5.1762 7.69631 5.51433 7.76803L8.13356 8.32235L4.02642 13.0282Z'
                fill='currentColor'
                stroke='currentStroke'
                strokeWidth='0'
              />
            </svg>
            <span className='text-xl'>{tournament.multiplier}</span>
          </div>
          <div className='text-sm text-gray-400'>Entry: {tournament.entry}</div>
        </div>
      </div>

      <div className='flex gap-2 mb-6'>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(
            tournament.level
          )}`}
        >
          {tournament.level}
        </span>
        <span className='bg-zinc-900 text-gray-300 px-3 py-1 rounded-full text-xs font-medium'>
          {tournament.category}
        </span>
      </div>

      <div className='flex items-center justify-between text-sm text-gray-400 mb-4'>
        <div className='flex items-center'>
          <svg
            className='mr-2 w-4 h-4'
            width='22'
            height='15'
            viewBox='0 0 22 15'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
          >
            <path
              d='M9.95406 7.2534C10.8166 6.49593 11.3666 5.37563 11.3666 4.12505C11.3666 1.85071 9.55715 0 7.33325 0C5.10935 0 3.29991 1.85059 3.29991 4.12505C3.29991 5.37565 3.84897 6.49689 4.71245 7.2534C1.96153 8.33526 0 11.0595 0 14.2498C0 14.6641 0.328149 14.9998 0.733314 14.9998C1.13848 14.9998 1.46663 14.6641 1.46663 14.2498C1.46663 10.9414 4.09834 8.24987 7.33314 8.24987C10.5679 8.24987 13.1996 10.9414 13.1996 14.2498C13.1996 14.6641 13.5278 14.9998 13.933 14.9998C14.3381 14.9998 14.6663 14.6641 14.6663 14.2498C14.6663 11.0595 12.7058 8.33603 9.95406 7.2534ZM4.76689 4.12505C4.76689 2.67759 5.91818 1.49998 7.33361 1.49998C8.74903 1.49998 9.90032 2.67744 9.90032 4.12505C9.90032 5.57266 8.74903 6.75013 7.33361 6.75013C5.91818 6.75013 4.76689 5.57266 4.76689 4.12505ZM21.9999 14.25C21.9999 14.6644 21.6717 15 21.2666 15C20.8614 15 20.5333 14.6644 20.5333 14.25C20.5333 10.9417 17.9015 8.25011 14.6667 8.25011C14.2616 8.25011 13.9334 7.9145 13.9334 7.50012C13.9334 7.08574 14.2616 6.75013 14.6667 6.75013C16.082 6.75013 17.2335 5.57266 17.2335 4.12505C17.2335 2.67744 16.0822 1.49998 14.6667 1.49998C14.2643 1.49998 13.8793 1.59185 13.5237 1.77372C13.1607 1.9584 12.7216 1.80934 12.5401 1.43811C12.3586 1.06779 12.5062 0.616862 12.8683 0.432185C13.4293 0.145318 14.0343 0 14.6667 0C16.8905 0 18.7001 1.85059 18.7001 4.12505C18.7001 5.37565 18.151 6.49689 17.2875 7.2534C20.0385 8.33526 22 11.0595 22 14.2498L21.9999 14.25Z'
              fill='currentColor'
              stroke='currentStroke'
              strokeWidth='0'
            />
          </svg>
          {tournament.currentParticipants !== undefined &&
          tournament.maxParticipants !== undefined ? (
            <>
              {tournament.currentParticipants.toLocaleString()} /{' '}
              {tournament.maxParticipants.toLocaleString()}
            </>
          ) : (
            'Loading...'
          )}
        </div>
        <div className='flex items-center'>
          <svg
            className='mr-2 w-4 h-4'
            width='17'
            height='17'
            viewBox='0 0 17 17'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M8.5 17C6.81886 17 5.17545 16.5015 3.77763 15.5675C2.37981 14.6335 1.29037 13.306 0.647024 11.7528C0.00367892 10.1996 -0.164644 8.49058 0.16333 6.84174C0.491305 5.1929 1.30088 3.67835 2.48962 2.4896C3.67837 1.30085 5.1929 0.491302 6.84174 0.163328C8.49058 -0.164647 10.1996 0.00368694 11.7528 0.647032C13.306 1.29038 14.6335 2.37984 15.5675 3.77766C16.5015 5.17548 17 6.81886 17 8.5C17 10.7543 16.1044 12.9163 14.5104 14.5104C12.9163 16.1045 10.7543 17 8.5 17ZM8.5 1.41667C7.09905 1.41667 5.72958 1.8321 4.56473 2.61043C3.39989 3.38875 2.49199 4.49502 1.95587 5.78933C1.41975 7.08364 1.27945 8.50786 1.55276 9.88189C1.82607 11.2559 2.50072 12.5181 3.49134 13.5087C4.48196 14.4993 5.74406 15.1739 7.11809 15.4472C8.49212 15.7205 9.91633 15.5803 11.2106 15.0441C12.5049 14.508 13.6112 13.6001 14.3896 12.4353C15.1679 11.2704 15.5833 9.90095 15.5833 8.5C15.5833 6.62139 14.837 4.81971 13.5087 3.49132C12.1803 2.16294 10.3786 1.41667 8.5 1.41667ZM10.0796 11.1208L8.0042 9.03904C7.93188 8.96799 7.87551 8.88234 7.83887 8.78781C7.80224 8.69327 7.78613 8.59203 7.79166 8.49079V4.95834C7.79166 4.77047 7.86626 4.59031 7.9991 4.45747C8.13194 4.32463 8.31214 4.25 8.5 4.25C8.68786 4.25 8.86806 4.32463 9.0009 4.45747C9.13374 4.59031 9.20833 4.77047 9.20833 4.95834V8.1678L11.1208 10.0803C11.1891 10.1487 11.2434 10.2298 11.2803 10.3191C11.3173 10.4084 11.3363 10.5042 11.3363 10.6008C11.3362 10.6975 11.3171 10.7932 11.2801 10.8825C11.243 10.9717 11.1888 11.0529 11.1205 11.1212C11.0521 11.1895 10.9709 11.2437 10.8816 11.2807C10.7923 11.3176 10.6966 11.3366 10.5999 11.3366C10.5033 11.3366 10.4076 11.3175 10.3183 11.2805C10.229 11.2435 10.1479 11.1892 10.0796 11.1208Z'
              fill='currentColor'
              stroke='currentStroke'
              strokeWidth='0'
            />
          </svg>
          {tournament.countdown}
        </div>
      </div>

      <div className='mb-4'>
        <div className='bg-gray-600 rounded-full h-2 mb-2'>
          <div
            className='bg-gradient-to-r from-yellow-700 to-amber-100 h-2 rounded-full transition-all duration-500'
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <button
        onClick={() => handleJoinTournament(tournament.id, tournament.title)}
        className='w-full bg-gradient-to-r from-yellow-700 to-amber-100 text-black py-3 rounded-lg font-medium flex items-center justify-center'
      >
        <svg
          className='w-5 h-5'
          width='20'
          height='19'
          viewBox='0 0 20 19'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          aria-hidden='true'
        >
          <path
            d='M6.625 7.59961C6.625 8.50466 6.9798 9.37366 7.6123 10.0146C8.24498 10.6558 9.10382 11.0166 10 11.0166C10.8962 11.0166 11.755 10.6558 12.3877 10.0146C13.0202 9.37366 13.375 8.50466 13.375 7.59961V2.2832H6.625V7.59961ZM2.25 6.33301C2.25 6.73419 2.40755 7.11962 2.68848 7.4043C2.96952 7.68909 3.3511 7.84961 3.75 7.84961H4.625V4.18359H2.25V6.33301ZM15.375 7.84961H16.25C16.6489 7.84961 17.0305 7.68909 17.3115 7.4043C17.5925 7.11962 17.75 6.73419 17.75 6.33301V4.18359H15.375V7.84961ZM9 12.9561L8.80664 12.9111C8.03153 12.7311 7.30554 12.3781 6.68066 11.8789C6.0558 11.3797 5.54752 10.7462 5.19336 10.0234L5.125 9.88379H3.75C2.82283 9.88379 1.933 9.5101 1.27637 8.84473C0.619617 8.17922 0.25 7.27559 0.25 6.33301V3.16699C0.25 2.8963 0.356035 2.6367 0.543945 2.44629C0.731735 2.25605 0.985907 2.15039 1.25 2.15039H4.625V0.25H15.375V2.15039H18.75C19.0141 2.15039 19.2683 2.25605 19.4561 2.44629C19.644 2.6367 19.75 2.89629 19.75 3.16699V6.33301C19.75 7.27559 19.3804 8.17922 18.7236 8.84473C18.067 9.5101 17.1772 9.88379 16.25 9.88379H14.875L14.8066 10.0234C14.4525 10.7462 13.9442 11.3797 13.3193 11.8789C12.6945 12.3781 11.9685 12.7311 11.1934 12.9111L11 12.9561V16.7168H15.375V18.75H4.625V16.7168H9V12.9561Z'
            fill='currentColor'
            stroke='currentStroke'
            strokeWidth='0'
          />
        </svg>
        Join Tournament - {tournament.entry}
      </button>
    </div>
  );
}

function TournamentGrid({ tournaments }) {
  if (!tournaments || tournaments.length === 0) {
    return null;
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
}

function TournamentCard({ tournament }) {
  const status = getStatusLabel(tournament.status);

  return (
    <div className='bg-zinc-900 rounded-xl p-6 border border-gray-700'>
      <div className='flex justify-between items-start mb-4'>
        <h3 className='text-xl font-bold'>{tournament.title}</h3>
        <div className='flex items-center font-bold text-yellow-600'>
          <svg
            className='mr-2 w-4 h-4'
            width='10'
            height='16'
            viewBox='0 0 10 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
          >
            <path
              d='M9.967 7.707C9.89457 7.48596 9.71138 7.32074 9.48596 7.27299L6.38332 6.61619L7.31932 0.758518C7.36567 0.468169 7.21479 0.182163 6.95035 0.0596611C6.68568 -0.0630601 6.37319 0.00778505 6.1861 0.233164L0.151564 7.49206C0.0142876 7.65728 -0.033572 7.88072 0.0237732 8.08869C0.0810876 8.29667 0.2365 8.46276 0.438661 8.53208L3.44796 9.5651L2.23438 15.2072C2.17187 15.4982 2.31153 15.7951 2.57425 15.9296C2.66712 15.9771 2.76714 16 2.86607 16C3.0471 16 3.22513 15.9231 3.351 15.7787L9.83816 8.34588C9.99048 8.17129 10.0396 7.92803 9.967 7.707ZM4.02642 13.0282L4.83441 9.27234C4.90445 8.94711 4.72191 8.6208 4.41047 8.51398L1.75031 7.60084L5.66953 2.8869L5.00852 7.02361C4.95333 7.36846 5.1762 7.69631 5.51433 7.76803L8.13356 8.32235L4.02642 13.0282Z'
              fill='currentColor'
              stroke='currentStroke'
              strokeWidth='0'
            />
          </svg>
          {tournament.multiplier}
        </div>
      </div>

      <div className='flex gap-2 mb-6'>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            tournament.status
          )}`}
        >
          {status}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(
            tournament.level
          )}`}
        >
          {tournament.level}
        </span>
      </div>

      <div className='space-y-3 text-sm mb-6'>
        <div className='flex justify-between'>
          <span className='text-gray-400'>Participants</span>
          <span>{tournament.currentParticipants.toLocaleString()}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-400'>Entry Fee</span>
          <span>{tournament.entryFee}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-400'>Time Left</span>
          <span>{tournament.countdown}</span>
        </div>
      </div>

      <button
        onClick={() => handleJoinTournament(tournament.id, tournament.title)}
        className='w-full bg-gradient-to-r from-yellow-700 to-amber-100 text-black py-3 rounded-lg font-medium flex items-center justify-center'
      >
        <svg
          className='w-5 h-5'
          width='20'
          height='19'
          viewBox='0 0 20 19'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          aria-hidden='true'
        >
          <path
            d='M6.625 7.59961C6.625 8.50466 6.9798 9.37366 7.6123 10.0146C8.24498 10.6558 9.10382 11.0166 10 11.0166C10.8962 11.0166 11.755 10.6558 12.3877 10.0146C13.0202 9.37366 13.375 8.50466 13.375 7.59961V2.2832H6.625V7.59961ZM2.25 6.33301C2.25 6.73419 2.40755 7.11962 2.68848 7.4043C2.96952 7.68909 3.3511 7.84961 3.75 7.84961H4.625V4.18359H2.25V6.33301ZM15.375 7.84961H16.25C16.6489 7.84961 17.0305 7.68909 17.3115 7.4043C17.5925 7.11962 17.75 6.73419 17.75 6.33301V4.18359H15.375V7.84961ZM9 12.9561L8.80664 12.9111C8.03153 12.7311 7.30554 12.3781 6.68066 11.8789C6.0558 11.3797 5.54752 10.7462 5.19336 10.0234L5.125 9.88379H3.75C2.82283 9.88379 1.933 9.5101 1.27637 8.84473C0.619617 8.17922 0.25 7.27559 0.25 6.33301V3.16699C0.25 2.8963 0.356035 2.6367 0.543945 2.44629C0.731735 2.25605 0.985907 2.15039 1.25 2.15039H4.625V0.25H15.375V2.15039H18.75C19.0141 2.15039 19.2683 2.25605 19.4561 2.44629C19.644 2.6367 19.75 2.89629 19.75 3.16699V6.33301C19.75 7.27559 19.3804 8.17922 18.7236 8.84473C18.067 9.5101 17.1772 9.88379 16.25 9.88379H14.875L14.8066 10.0234C14.4525 10.7462 13.9442 11.3797 13.3193 11.8789C12.6945 12.3781 11.9685 12.7311 11.1934 12.9111L11 12.9561V16.7168H15.375V18.75H4.625V16.7168H9V12.9561Z'
            fill='currentColor'
            stroke='currentStroke'
            strokeWidth='0'
          />
        </svg>
        Join Tournament
      </button>
    </div>
  );
}
