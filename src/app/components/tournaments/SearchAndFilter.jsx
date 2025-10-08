import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const SearchAndFilter = ({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    setShowDropdown(false);
  };

  return (
    <div className='flex gap-4 mb-8 relative'>
      {/* Search input */}
      <div className='relative flex-1 max-w-md'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
        <input
          type='text'
          placeholder='Search tournaments ...'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
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
              <label className='block mb-1 text-gray-300'>Multiplier (X)</label>
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
};

export default SearchAndFilter;
