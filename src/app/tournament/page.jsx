'use client';

import React, { useState } from 'react';
import { Crown, Star, Trophy } from 'lucide-react'; // ✅ Lucide icons
import Sidebar from '../components/Sidebar';
import SearchAndFilter from '../../app/components/tournaments/SearchAndFilter';
import TournamentTabs from '../components/tournaments/TournamentTabs';
import FeaturedTournament from '../../app/components/tournaments/FeaturedTournament';
import TournamentGrid from '../components/tournaments/TournamentGrid';
import { allTournaments, tabs } from '../../app/data/tournamentdata';

const TournamentsPage = () => {
  const [activeTab, setActiveTab] = useState('Live');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    entry: '',
    multiplier: '',
  });

  const handleSearch = (query) => setSearchQuery(query);
  const handleTabChange = (tabName) => setActiveTab(tabName);
  const handleFilterChange = (newFilters) => setFilters(newFilters);

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

  return (
    <div className='flex h-screen overflow-hidden bg-black text-white'>
      {/* Sidebar */}
      <aside className='w-64 border-r border-gray-700'>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className='flex-1 flex flex-col overflow-auto p-8'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>Tournaments</h1>
            <p className='text-gray-400 text-sm'>
              Complete and win up to 1000x your investment.
            </p>
          </div>
          <button className='flex items-center gap-2 bg-gradient-to-r from-yellow-700 to-amber-100 text-black px-6 py-3 rounded-md font-medium hover:from-yellow-400 hover:to-yellow-200 transition'>
            <Crown className='w-5 h-5' /> {/* ✅ Lucide Crown */}
            Create Tournament
          </button>
        </div>

        {/* Search and Filter */}
        <div className='mb-8'>
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Featured Tournaments */}
        {filteredTournaments.featured.length > 0 && (
          <section className='mb-8'>
            <h2 className='flex items-center text-xl font-bold mb-6'>
              <Star className='mr-2 w-5 h-5 text-yellow-400' />{' '}
              {/* ✅ Lucide Star */}
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

        {/* Tournament Tabs */}
        <div className='mb-6'>
          <TournamentTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Regular Tournaments Grid */}
        {filteredTournaments.regular.length > 0 && (
          <section className='mb-8'>
            <TournamentGrid tournaments={filteredTournaments.regular} />
          </section>
        )}

        {/* Empty State */}
        {filteredTournaments.featured.length === 0 &&
          filteredTournaments.regular.length === 0 && (
            <div className='flex flex-col items-center justify-center py-12 text-center text-gray-400'>
              <Trophy className='h-16 w-16 mb-4' /> {/* ✅ Lucide Trophy */}
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
      </main>
    </div>
  );
};

export default TournamentsPage;
