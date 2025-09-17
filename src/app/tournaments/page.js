'use client';

import React, { useState } from 'react';
import { Search, Filter, Users, Clock, Trophy, Crown, LayoutDashboard, ChartCandlestick, Gift, LogOut, Star, Zap, Circle } from 'lucide-react';

const TournamentsPage = () => {
    const [activeTab, setActiveTab] = useState('Live');
    const [searchQuery, setSearchQuery] = useState('');

// Static data for page
const allTournaments = {
    featured: [
      {
        id: 1,
        title: 'Mega Million Monday',
        multiplier: '1000x',
        entry: '$10',
        level: 'Expert',
        category: 'featured',
        currentparticipants: 15420,
        maxparticipants: 20000,
        countdown: '1d 14h 32m',
        status: 'live',
      },
      {
        id: 2,
        title: 'Tech Giants Weekly',
        multiplier: '500X',
        entry: '$5',
        level: 'Intermediate',
        category: 'Tech',
        currentParticipants: 8420,
        maxParticipants: 10000,
        countdown: '3d 14h 32m',
        status: 'live'
      }
    ],
    regular: [
      {
        id: 3,
        title: 'Blue Chip Challenge',
        multiplier: '250X',
        level: 'Beginner',
        currentParticipants: 2341,
        maxParticipants: 5000,
        entryFee: '$25',
        countdown: '2h 15m',
        status: 'ending_soon'
      },
      {
        id: 4,
        title: 'Crypto Crusher',
        multiplier: '750X',
        level: 'Expert',
        currentParticipants: 2341,
        maxParticipants: 3000,
        entryFee: '$25',
        countdown: '5d 2h 15m',
        status: 'live'
      },
      {
        id: 5,
        title: 'Small Cap Hunters',
        multiplier: '300X',
        level: 'Beginner',
        currentParticipants: 2341,
        maxParticipants: 4000,
        entryFee: '$25',
        countdown: '2h 15m',
        status: 'ending_soon'
      },
      {
        id: 6,
        title: 'Forex Masters',
        multiplier: '400X',
        level: 'Expert',
        currentParticipants: 1850,
        maxParticipants: 2500,
        entryFee: '$50',
        countdown: '6h 45m',
        status: 'live'
      },
      {
        id: 7,
        title: 'Penny Stock Pro',
        multiplier: '150X',
        level: 'Beginner',
        currentParticipants: 4200,
        maxParticipants: 6000,
        entryFee: '$15',
        countdown: '12h 30m',
        status: 'live'
      },
      {
        id: 8,
        title: 'Options Elite',
        multiplier: '800X',
        level: 'Expert',
        currentParticipants: 1205,
        maxParticipants: 1500,
        entryFee: '$75',
        countdown: '1h 20m',
        status: 'ending_soon'
      }
    ]
  };

  // Filtering out tournaments from search
const filteredTournaments = {
    featured: allTournaments.featured.filter(tournament =>
        tournament.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    regular: allTournaments.regular.filter(tournament =>
        tournament.title.toLowerCase().includes(searchQuery.toLowerCase())
        )   
};

// Progress Bar Calculation
const getProgress = (current, max) => {
    return Math.min((current / max) * 100, 100);
};

const handleJoinTournament = (tournamentId, tournamentName) => {
    alert('Joined "${tournamentName}" tournament!');
};

const handlesearch = (query) => {
    setSearchQuery(query);
};

const tabs = [
    {name: 'Live', count: 3},
    {name: 'Upcoming', count: 1},
    {name: 'Complete', count: 4}
];

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert': return 'bg-gradient-to-r from-yellow-600 to-amber-100 text-black';
      case 'Intermediate': return 'bg-gradient-to-r from-yellow-600 to-amber-100 text-black';
      case 'Beginner': return 'bg-gradient-to-r from-yellow-600 to-amber-100 text-black';
      default: return 'bg-black text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-emerald-400 text-black';
      case 'ending_soon': return 'bg-red-400 text-black';
      default: return 'bg-black text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'live': return 'Live';
      case 'ending_soon': return 'Ending Soon';
      case 'complete': return 'Complete';
      case 'upcoming': return 'Upcoming';
      default: return 'Live';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-700">
        {/* Logo */}
        <div className="flex items-center p-6">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-600 to-amber-100 rounded-full flex items-center justify-center">
            <Circle className="w-5 h-5" fill="black" stroke="none" />
          </div>
          <span className="ml-3 text-xl font-semibold">Cirrica</span>
        </div>

        {/* Navigation */}
        <nav className="mt-8">
          <div className="px-6 space-y-2">
            <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-black rounded-lg">
            <LayoutDashboard className="mr-3 w-5 h-5" />
              Dashboard
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-black rounded-lg">
              <Users className="mr-3 w-5 h-5" />
              Teams
            </a>
            <a href="#" className="flex items-center px-4 py-3 bg-gradient-to-r from-yellow-600 to-amber-100 text-black rounded-lg">
              <Trophy className="mr-3 w-5 h-5" />
              Tournaments
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-black rounded-lg">
            <ChartCandlestick />
              Select Stock
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-black rounded-lg">
            <Gift />
              Promotions
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-black rounded-lg">
              <Users className="mr-3 w-5 h-5" />
              Friends
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-black rounded-lg">
              <span className="mr-3">⚙️</span>
              Setting
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-red-400 hover:bg-black rounded-lg">
            <LogOut />
              Logout
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tournaments</h1>
            <p className="text-gray-400">Complete and win up to 1000x your investment.</p>
          </div>
          <button className="bg-gradient-to-r from-yellow-700 to-amber-100 hover:bg-amber-600 text-black px-6 py-3 rounded-lg font-medium flex items-center">
            <Crown className="mr-2 w-5 h-5" />
            Create Tournament
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tournaments ..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-700"
            />
          </div>
          <button className="bg-zinc-900 border border-zinc-700 text-white px-6 py-3 rounded-lg font-medium flex items-center hover:bg-zinc-700">
            <Filter className="mr-2 w-5 h-5" />
            Filter
          </button>
        </div>

        {/* Featured Tournaments */}
        {filteredTournaments.featured.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center">
            <Star className="mr-2 w-5 h-5 stroke-yellow-600" />
              Featured Tournament
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTournaments.featured.map((tournament) => {
                const progress = getProgress(tournament.currentParticipants, tournament.maxParticipants);
                
                return (
                  <div key={tournament.id} className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 relative">
                    <div className="absolute top-1 right-1 bg-gradient-to-r from-yellow-700 to-amber-100 text-xs font-bold text-black px-2 py-0.5 rounded-full">
                      FEATURED
                    </div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{tournament.title}</h3>
                      <div className="text-right">
                      <div className="flex items-center font-bold text-yellow-600"> 
                      <Zap className="mr-2 w-4 h-4" />
                    <span className="text-xl">{tournament.multiplier}</span>
                     </div>
                        <div className="text-sm text-gray-400">Entry: {tournament.entry}</div>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(tournament.level)}`}>
                        {tournament.level}
                      </span>
                      <span className="bg-zinc-900 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                        {tournament.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Users className="mr-2 w-4 h-4" />
                        {tournament.currentParticipants !== undefined && tournament.maxParticipants !== undefined ? (
  <>
    {tournament.currentParticipants.toLocaleString()} / {tournament.maxParticipants.toLocaleString()}
  </>
) : (
  'Loading...'
)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 w-4 h-4" />
                        {tournament.countdown}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="bg-gray-600 rounded-full h-2 mb-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-700 to-amber-100 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleJoinTournament(tournament.id, tournament.title)}
                      className="w-full bg-gradient-to-r from-yellow-700 to-amber-100 text-black py-3 rounded-lg font-medium flex items-center justify-center"
                    >
                      <Trophy className="w-5 h-5" />
                      Join Tournament - {tournament.entry}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tournament Tabs */}
        <div className="flex gap-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
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

        {/* Regular Tournaments Grid */}
        {filteredTournaments.regular.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTournaments.regular.map((tournament) => {
              const status = getStatusLabel(tournament.status);
              
              return (
                <div key={tournament.id} className="bg-zinc-900 rounded-xl p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{tournament.title}</h3>
                    <div className="flex items-center font-bold text-yellow-600">
                    <Zap className="mr-2 w-4 h-4" />
                    {tournament.multiplier}
                    </div>
                  </div>

                  <div className="flex gap-2 mb-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
                      {status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(tournament.level)}`}>
                      {tournament.level}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Participants</span>
                      <span>{tournament.currentParticipants.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Entry Fee</span>
                      <span>{tournament.entryFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time Left</span>
                      <span>{tournament.countdown}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleJoinTournament(tournament.id, tournament.title)}
                    className="w-full bg-gradient-to-r from-yellow-700 to-amber-100 text-black py-3 rounded-lg font-medium flex items-center justify-center"
                  >
                    <Trophy className="w-5 h-5" />
                    Join Tournament
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredTournaments.featured.length === 0 && filteredTournaments.regular.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No tournaments found</h3>
            <p className="text-gray-400">
              {searchQuery ? `No tournaments match "${searchQuery}"` : 'No tournaments are currently available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentsPage;