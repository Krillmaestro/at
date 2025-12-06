// Sidebar Component - Video library sidebar with filters

import { useState } from 'react';
import { SearchIcon, FilterIcon, CalendarIcon, UserIcon } from '../ui/Icons';

export default function Sidebar({
  athletes = [],
  selectedAthlete,
  onAthleteChange,
  searchQuery,
  onSearchChange,
  selectedDiscipline,
  onDisciplineChange,
}) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const disciplines = [
    { value: '', label: 'All Disciplines' },
    { value: 'slalom', label: 'Slalom' },
    { value: 'giant_slalom', label: 'Giant Slalom' },
    { value: 'super_g', label: 'Super-G' },
    { value: 'downhill', label: 'Downhill' },
    { value: 'combined', label: 'Combined' },
  ];

  return (
    <aside className="w-64 bg-bg-secondary border-r border-border-color h-[calc(100vh-64px)] sticky top-16 overflow-y-auto hidden lg:block">
      <div className="p-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Filters Section */}
        <div>
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center justify-between w-full text-text-secondary hover:text-text-primary mb-3"
          >
            <span className="flex items-center gap-2 font-medium">
              <FilterIcon className="w-4 h-4" />
              Filters
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isFiltersOpen && (
            <div className="space-y-4 animate-slideUp">
              {/* Athlete Filter */}
              <div>
                <label className="input-label flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Athlete
                </label>
                <select
                  value={selectedAthlete}
                  onChange={(e) => onAthleteChange(e.target.value)}
                  className="input cursor-pointer"
                >
                  <option value="">All Athletes</option>
                  {athletes.map((athlete) => (
                    <option key={athlete.id} value={athlete.id}>
                      {athlete.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Discipline Filter */}
              <div>
                <label className="input-label flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Discipline
                </label>
                <select
                  value={selectedDiscipline}
                  onChange={(e) => onDisciplineChange(e.target.value)}
                  className="input cursor-pointer"
                >
                  {disciplines.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="pt-4 border-t border-border-color">
          <h3 className="text-sm font-medium text-text-secondary mb-3">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Total Videos</span>
              <span className="text-text-primary font-medium">--</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">This Month</span>
              <span className="text-text-primary font-medium">--</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
