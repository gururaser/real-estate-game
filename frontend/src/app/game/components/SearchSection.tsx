'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SearchResult, Property } from '../types';
import { formatHomeType, FILTER_OPTIONS } from '../utils';

// Dynamically import map component to avoid SSR issues
const PropertyMap = dynamic(() => import('../../components/PropertyMap'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-32 bg-slate-600/50 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-400 border-t-transparent mx-auto mb-1"></div>
      <p className="text-xs text-gray-400">Loading map...</p>
    </div>
  </div>
});

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  loading: boolean;
  loadingMessage: string;
  searchResults: SearchResult | null;
  targetProperty: Property | null;
  weights: Record<string, number>;
  setWeights: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  filters: Record<string, any>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export default function SearchSection({
  searchQuery,
  setSearchQuery,
  handleSearch,
  loading,
  loadingMessage,
  searchResults,
  targetProperty,
  weights,
  setWeights,
  filters,
  setFilters
}: SearchSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const itemsPerPage = 3;

  const totalPages = searchResults ? Math.ceil(searchResults.entries?.length / itemsPerPage) : 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = searchResults ? searchResults.entries.slice(startIndex, endIndex) : [];

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Auto search functions for modal buttons
  const handleSaveSettings = () => {
    setShowSettingsModal(false);
    // Only auto-search if there's a previous search query
    if (searchQuery.trim()) {
      handleSearch();
    }
  };

  const handleApplyFilters = () => {
    setShowFiltersModal(false);
    // Only auto-search if there's a previous search query
    if (searchQuery.trim()) {
      handleSearch();
    }
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = R * c;
    const distanceMiles = distanceKm * 0.621371;
    return { km: distanceKm, miles: distanceMiles };
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
          <span className="text-2xl">🔍</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Market Research</h2>
          <p className="text-sm text-gray-400 mt-1">Find similar properties to understand market value and make informed guesses</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleSearch();
              }
            }}
            placeholder="E.g: A cheap house in California"
            className="w-full p-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-500 ease-out"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="text-gray-400 text-sm">💭</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex-1 min-w-32 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-500 ease-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                <span className="min-w-24 text-center truncate">{loadingMessage}</span>
              </div>
            ) : (
              '🔍 Search'
            )}
          </button>
          
          <button
            onClick={() => setShowFiltersModal(true)}
            className="px-4 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-500 ease-out hover:scale-105"
            title="Filters"
          >
            🎯
          </button>
          
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-4 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-500 ease-out hover:scale-105"
            title="Search Settings"
          >
            ⚙️
          </button>
        </div>
      </div>

      {searchResults && (
        <div className="mt-8 animate-in slide-in-from-left-4 fade-in duration-700">
          {/* Applied Filters */}
          <details className="group mb-8 bg-white/5 rounded-xl border border-white/10 overflow-hidden relative z-10">
            <summary className="cursor-pointer p-4 hover:bg-white/10 transition-all duration-500 ease-out flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Applied Filters</h3>
                  <p className="text-sm text-blue-200">Search parameters used for this query</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="p-4 border-t border-white/10">
              {(() => {
                const appliedFilters = [
                  { key: 'state_filter', label: 'State', value: filters.state_filter, icon: '🏛️' },
                  { key: 'city_filter', label: 'City', value: filters.city_filter, icon: '🏙️' },
                  { key: 'county_filter', label: 'County', value: filters.county_filter, icon: '🏛️' },
                  { key: 'home_type_filter', label: 'Home Type', value: filters.home_type_filter, icon: '🏠' },
                  { key: 'event_filter', label: 'Event', value: filters.event_filter, icon: '📢' },
                  { key: 'levels_filter', label: 'Levels', value: filters.levels_filter, icon: '🏢' },
                  { key: 'is_bank_owned_filter', label: 'Bank Owned', value: filters.is_bank_owned_filter, icon: '🏦' },
                  { key: 'is_for_auction_filter', label: 'Auction', value: filters.is_for_auction_filter, icon: '🔨' },
                  { key: 'parking_filter', label: 'Parking', value: filters.parking_filter, icon: '🚗' },
                  { key: 'has_garage_filter', label: 'Garage', value: filters.has_garage_filter, icon: '🏭' },
                  { key: 'pool_filter', label: 'Pool', value: filters.pool_filter, icon: '🏊' },
                  { key: 'spa_filter', label: 'Spa', value: filters.spa_filter, icon: '🛁' },
                  { key: 'is_new_construction_filter', label: 'New Construction', value: filters.is_new_construction_filter, icon: '🔨' },
                  { key: 'has_pets_allowed_filter', label: 'Pets Allowed', value: filters.has_pets_allowed_filter, icon: '🐾' },
                  { key: 'max_price', label: 'Max Price', value: filters.max_price, icon: '💰' },
                  { key: 'min_price', label: 'Min Price', value: filters.min_price, icon: '💰' },
                  { key: 'max_bedrooms', label: 'Max Bedrooms', value: filters.max_bedrooms, icon: '🛏️' },
                  { key: 'min_bedrooms', label: 'Min Bedrooms', value: filters.min_bedrooms, icon: '🛏️' },
                  { key: 'max_bathrooms', label: 'Max Bathrooms', value: filters.max_bathrooms, icon: '🛁' },
                  { key: 'min_bathrooms', label: 'Min Bathrooms', value: filters.min_bathrooms, icon: '🛁' },
                  { key: 'max_living_area', label: 'Max Living Area', value: filters.max_living_area, icon: '📐' },
                  { key: 'min_living_area', label: 'Min Living Area', value: filters.min_living_area, icon: '📐' },
                ].filter(filter => {
                  // For arrays, check if they have elements
                  if (Array.isArray(filter.value)) {
                    return filter.value.length > 0;
                  }
                  // For other values, check if they're not empty/null/undefined
                  return filter.value !== null && filter.value !== undefined && filter.value !== '';
                });

                const detectedFromQuery = [
                  { key: 'street_address', label: 'Street Address', value: searchResults.metadata.search_params?.street_address, icon: '🏠' },
                  { key: 'city', label: 'City', value: searchResults.metadata.search_params?.city_filter, icon: '🏙️' },
                  { key: 'county', label: 'County', value: searchResults.metadata.search_params?.county_filter, icon: '🏛️' },
                  { key: 'state', label: 'State', value: searchResults.metadata.search_params?.state_filter, icon: '🏛️' },
                  { key: 'home_type', label: 'Home Type', value: searchResults.metadata.search_params?.home_type_filter, icon: '🏠' },
                  { key: 'event', label: 'Event', value: searchResults.metadata.search_params?.event_filter, icon: '📢' },
                  { key: 'max_price_detected', label: 'Max Price', value: searchResults.metadata.search_params?.max_price, icon: '💰' },
                  { key: 'min_price_detected', label: 'Min Price', value: searchResults.metadata.search_params?.min_price, icon: '💰' },
                  { key: 'max_bedrooms_detected', label: 'Max Bedrooms', value: searchResults.metadata.search_params?.max_bedrooms, icon: '🛏️' },
                  { key: 'min_bedrooms_detected', label: 'Min Bedrooms', value: searchResults.metadata.search_params?.min_bedrooms, icon: '🛏️' },
                  { key: 'max_bathrooms_detected', label: 'Max Bathrooms', value: searchResults.metadata.search_params?.max_bathrooms, icon: '🛁' },
                  { key: 'min_bathrooms_detected', label: 'Min Bathrooms', value: searchResults.metadata.search_params?.min_bathrooms, icon: '🛁' },
                  { key: 'max_living_area_detected', label: 'Max Living Area', value: searchResults.metadata.search_params?.max_living_area, icon: '📐' },
                  { key: 'min_living_area_detected', label: 'Min Living Area', value: searchResults.metadata.search_params?.min_living_area, icon: '📐' },
                ].filter(filter => {
                  // Only show values detected from query that were NOT manually selected by user
                  const filterKey = filter.key.replace('_detected', '');
                  const userAppliedValue = filters[filterKey];
                  
                  // Convert both values to the same type for comparison
                  const normalizedFilterValue = typeof filter.value === 'number' ? filter.value.toString() : filter.value;
                  const normalizedUserValue = typeof userAppliedValue === 'number' ? userAppliedValue.toString() : userAppliedValue;
                  
                  return filter.value !== null && 
                         filter.value !== undefined && 
                         filter.value !== '' && 
                         normalizedFilterValue !== normalizedUserValue;
                });

                return (
                  <div className="space-y-8">
                    {/* Applied Filters Section */}
                    {appliedFilters.length > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-lg">🎯</span>
                          </div>
                          <h4 className="text-lg font-semibold text-white">Applied Filters</h4>
                          <p className="text-sm text-blue-200 ml-2">User-selected filters</p>
                        </div>

                        {/* Location & Property Type Filters */}
                        {appliedFilters.some(f => ['state_filter', 'city_filter', 'county_filter', 'home_type_filter', 'event_filter', 'levels_filter'].includes(f.key)) && (
                          <div className="space-y-4">
                            <div className="flex items-center mb-4">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-sm">📍</span>
                              </div>
                              <h5 className="text-base font-semibold text-white">Location & Type</h5>
                            </div>

                            <div className="space-y-3">
                              {appliedFilters.filter(f => ['state_filter', 'city_filter', 'county_filter', 'home_type_filter', 'event_filter', 'levels_filter'].includes(f.key)).map((filter) => (
                                <div key={filter.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                  <div className="flex items-center">
                                    <span className="text-lg mr-3">{filter.icon}</span>
                                    <span className="text-sm text-gray-300">{filter.label}</span>
                                  </div>
                                  <div className="text-sm font-semibold text-white">
                                    {Array.isArray(filter.value) ? (
                                      <div className="flex flex-wrap gap-1">
                                        {filter.value.map((item, idx) => (
                                          <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                                            {item}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-cyan-300">
                                        {typeof filter.value === 'number' ? filter.value.toLocaleString() : filter.value}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Features & Amenities Filters */}
                        {appliedFilters.some(f => ['is_bank_owned_filter', 'is_for_auction_filter', 'parking_filter', 'has_garage_filter', 'pool_filter', 'spa_filter', 'is_new_construction_filter', 'has_pets_allowed_filter'].includes(f.key)) && (
                          <div className="space-y-4">
                            <div className="flex items-center mb-4">
                              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-sm">🏠</span>
                              </div>
                              <h5 className="text-base font-semibold text-white">Features & Amenities</h5>
                            </div>

                            <div className="space-y-3">
                              {appliedFilters.filter(f => ['is_bank_owned_filter', 'is_for_auction_filter', 'parking_filter', 'has_garage_filter', 'pool_filter', 'spa_filter', 'is_new_construction_filter', 'has_pets_allowed_filter'].includes(f.key)).map((filter) => (
                                <div key={filter.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                  <div className="flex items-center">
                                    <span className="text-lg mr-3">{filter.icon}</span>
                                    <span className="text-sm text-gray-300">{filter.label}</span>
                                  </div>
                                  <div className="text-sm font-semibold text-white">
                                    {Array.isArray(filter.value) ? (
                                      <div className="flex flex-wrap gap-1">
                                        {filter.value.map((item, idx) => (
                                          <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                                            {item}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-emerald-300">
                                        {typeof filter.value === 'number' ? filter.value.toLocaleString() : filter.value}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Price & Size Filters */}
                        {appliedFilters.some(f => ['max_price', 'min_price', 'max_bedrooms', 'min_bedrooms', 'max_bathrooms', 'min_bathrooms', 'max_living_area', 'min_living_area'].includes(f.key)) && (
                          <div className="space-y-4">
                            <div className="flex items-center mb-4">
                              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-sm">📊</span>
                              </div>
                              <h5 className="text-base font-semibold text-white">Price & Size Ranges</h5>
                            </div>

                            <div className="space-y-3">
                              {appliedFilters.filter(f => ['max_price', 'min_price', 'max_bedrooms', 'min_bedrooms', 'max_bathrooms', 'min_bathrooms', 'max_living_area', 'min_living_area'].includes(f.key)).map((filter) => (
                                <div key={filter.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                  <div className="flex items-center">
                                    <span className="text-lg mr-3">{filter.icon}</span>
                                    <span className="text-sm text-gray-300">{filter.label}</span>
                                  </div>
                                  <div className="text-sm font-semibold text-white">
                                    {Array.isArray(filter.value) ? (
                                      <div className="flex flex-wrap gap-1">
                                        {filter.value.map((item, idx) => (
                                          <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                            {item}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-pink-300">
                                        {typeof filter.value === 'number' ? filter.value.toLocaleString() : filter.value}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Detected from Query Section */}
                    {detectedFromQuery.length > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-lg">🔍</span>
                          </div>
                          <h4 className="text-lg font-semibold text-white">Detected from Query</h4>
                          <p className="text-sm text-orange-200 ml-2">Automatically extracted from natural language</p>
                        </div>

                        <div className="space-y-3">
                          {detectedFromQuery.map((filter) => (
                            <div key={filter.key} className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                              <div className="flex items-center">
                                <span className="text-lg mr-3">{filter.icon}</span>
                                <span className="text-sm text-gray-300">{filter.label}</span>
                              </div>
                              <div className="text-sm font-semibold text-white">
                                {Array.isArray(filter.value) ? (
                                  <div className="flex flex-wrap gap-1">
                                    {filter.value.map((item, idx) => (
                                      <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white">
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-orange-300">
                                    {typeof filter.value === 'number' ? filter.value.toLocaleString() : filter.value}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No Filters or Detection Message */}
                    {appliedFilters.length === 0 && detectedFromQuery.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">🔍</span>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-300 mb-2">No Filters Applied</h4>
                        <p className="text-gray-400">This search used natural language processing without specific filters</p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </details>

          <div className="flex items-center mb-6 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Search Results</h3>
          </div>

          <div className="space-y-4 relative z-10">
            {currentItems.map((entry, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 ease-out hover:scale-102 animate-in slide-in-from-bottom-4 fade-in duration-700 relative z-10"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-green-300">
                          ${entry.fields.price.toLocaleString()}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 mt-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30 text-xs font-medium text-blue-300">
                          🆔 {entry.id}
                        </span>
                        <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full mt-2 inline-block">
                          ${entry.fields.pricePerSquareFoot === 0 ? 'Unknown' : entry.fields.pricePerSquareFoot.toFixed(0)}/sq ft
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-300">
                        <span className="text-gray-400">📍</span> {entry.fields.city}, {entry.fields.state} {entry.fields.zipcode !== 0 && <span className="text-cyan-400 font-medium">({entry.fields.zipcode})</span>}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">🏛️</span> {entry.fields.county}
                      </p>
                      <p className="text-gray-300 text-sm">
                        <span className="text-gray-400">🏠</span> {entry.fields.streetAddress}
                      </p>

                      {/* Mini Location Map */}
                      <div className="mt-3 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-2 border border-slate-600">
                        <PropertyMap
                          latitude={entry.fields.latitude}
                          longitude={entry.fields.longitude}
                          address={entry.fields.streetAddress}
                          city={entry.fields.city}
                          state={entry.fields.state}
                          height="h-32"
                          targetProperty={targetProperty}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white whitespace-nowrap">
                        {formatHomeType(entry.fields.homeType)}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white whitespace-nowrap">
                        🎯 {entry.metadata?.score ? `${(entry.metadata.score * 100).toFixed(1)}%` : 'N/A'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <p className="text-xs text-gray-400 mb-1">Bedrooms</p>
                        <p className="text-lg font-bold text-purple-300">{entry.fields.bedrooms === 0 ? 'N/A' : entry.fields.bedrooms}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <p className="text-xs text-gray-400 mb-1">Bathrooms</p>
                        <p className="text-lg font-bold text-pink-300">{entry.fields.bathrooms === 0 ? 'N/A' : entry.fields.bathrooms}</p>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <p className="text-xs text-gray-400 mb-1">Living Area</p>
                      <p className="text-lg font-semibold text-blue-300">{entry.fields.livingArea === 0 ? 'Unknown' : `${entry.fields.livingArea} sq ft`}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <p className="text-xs text-gray-400 mb-1">Year Built</p>
                      <p className="text-lg font-semibold text-cyan-300">{entry.fields.yearBuilt === 0 ? 'Unknown' : entry.fields.yearBuilt}</p>
                    </div>
                    {targetProperty && (
                      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-3 border border-blue-500/30">
                        <p className="text-xs text-gray-400 mb-1">📍 Distance to Target</p>
                        <p className="text-sm font-bold text-white">
                          {(() => {
                            const distance = calculateDistance(
                              targetProperty.fields.latitude,
                              targetProperty.fields.longitude,
                              entry.fields.latitude,
                              entry.fields.longitude
                            );
                            return `${distance.km.toFixed(1)} km / ${distance.miles.toFixed(1)} mi`;
                          })()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <details className="group">
                    <summary className="cursor-pointer text-gray-300 hover:text-white font-medium flex items-center justify-between transition-all duration-500 ease-out">
                      <span>More Information</span>
                      <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-400">
                      <div className="space-y-2">
                        <p><span className="text-gray-300">🚗 Garage:</span> {entry.fields.garageSpaces === 0 ? 'None' : `${entry.fields.garageSpaces} spaces`}</p>
                        <p><span className="text-gray-300">🏢 Levels:</span> {entry.fields.levels === '' ? 'Unknown' : entry.fields.levels}</p>
                        <p><span className="text-gray-300">🏊 Pool:</span> {entry.fields.pool ? 'Yes' : 'No'}</p>
                        <p><span className="text-gray-300">🛁 Spa:</span> {entry.fields.spa ? 'Yes' : 'No'}</p>
                      </div>
                      <div className="space-y-2">
                        <p><span className="text-gray-300">🔨 New Construction:</span> {entry.fields.isNewConstruction ? 'Yes' : 'No'}</p>
                        <p><span className="text-gray-300">🏦 Bank Owned:</span> {entry.fields.is_bankOwned ? 'Yes' : 'No'}</p>
                        <p><span className="text-gray-300">📅 Listing Date:</span> {entry.fields.datePostedString}</p>
                        <p><span className="text-gray-300">📢 Listing Type:</span> {entry.fields.event}</p>
                      </div>
                    </div>

                    {/* Property Description */}
                    {entry.fields.description && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-sm text-gray-400 mb-2">📝 Description:</p>
                        <div className="text-sm text-gray-300 max-h-24 overflow-y-auto leading-relaxed custom-scrollbar bg-white/5 p-3 rounded-lg">
                          {entry.fields.description}
                        </div>
                      </div>
                    )}
                  </details>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between relative z-10">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-medium transition-all duration-300 ease-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="text-white font-medium">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-medium transition-all duration-300 ease-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Search Settings</h2>
                  <p className="text-sm text-gray-400 mt-1">Adjust importance weights for different property attributes</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {Object.entries(weights).map(([key, value]) => {
                const labels = {
                  description_weight: 'Description',
                  city_weight: 'City',
                  street_address_weight: 'Street Address',
                  county_weight: 'County',
                  price_weight: 'Price',
                  price_per_sqft_weight: 'Price per Sqft',
                  living_area_weight: 'Living Area',
                  home_type_weight: 'Home Type',
                  event_weight: 'Event',
                  levels_weight: 'Levels',
                };
                
                const descriptions = {
                  description_weight: 'How much to prioritize description matches',
                  city_weight: 'How much to prioritize city matches',
                  street_address_weight: 'How much to prioritize street address matches',
                  county_weight: 'How much to prioritize county matches',
                  price_weight: 'How much to prioritize price similarity',
                  price_per_sqft_weight: 'How much to prioritize price per sqft similarity',
                  living_area_weight: 'How much to prioritize living area similarity',
                  home_type_weight: 'How much to prioritize home type matching',
                  event_weight: 'How much to prioritize event type',
                  levels_weight: 'How much to prioritize levels',
                };

                return (
                  <div key={key} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white font-medium">{labels[key as keyof typeof labels]}</label>
                      <span className="text-cyan-300 font-bold">{value.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">{descriptions[key as keyof typeof descriptions]}</p>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={value}
                      onChange={(e) => setWeights({ ...weights, [key]: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setWeights({
                    description_weight: 1.0,
                    city_weight: 0.8,
                    street_address_weight: 0.6,
                    county_weight: 0.6,
                    price_weight: 0.5,
                    price_per_sqft_weight: 0.4,
                    living_area_weight: 0.3,
                    home_type_weight: 0.7,
                    event_weight: 0.2,
                    levels_weight: 0.1,
                  });
                  // Only auto-search if there's a previous search query
                  if (searchQuery.trim()) {
                    setTimeout(() => handleSearch(), 100); // Small delay to ensure state update
                  }
                }}
                className="px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-orange-500/25 transition-all duration-300 ease-out hover:scale-105"
                title="Reset all weights to default values"
              >
                🔄 Reset Defaults
              </button>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-2xl font-semibold transition-all duration-300 ease-out"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-500 ease-out hover:scale-105"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Property Filters</h2>
                  <p className="text-sm text-gray-400 mt-1">Filter properties by specific criteria</p>
                </div>
              </div>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-8">
              {/* Location & Property Type Filters */}
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-lg">📍</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Location & Type</h3>
                  <p className="text-sm text-blue-200 ml-2">(Select multiple or none)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* State Filter */}
                  <div className="space-y-3">
                    <label className="text-white font-medium">State</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                      {FILTER_OPTIONS.state.map((state) => (
                        <label key={state} className="flex items-center space-x-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={Array.isArray(filters.state_filter) ? filters.state_filter.includes(state) : false}
                            onChange={(e) => {
                              const currentValues = Array.isArray(filters.state_filter) ? filters.state_filter : [];
                              if (e.target.checked) {
                                setFilters({ ...filters, state_filter: [...currentValues, state] });
                              } else {
                                setFilters({ ...filters, state_filter: currentValues.filter(s => s !== state) });
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-white text-sm">{state.toUpperCase()}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Home Type Filter */}
                  <div className="space-y-3">
                    <label className="text-white font-medium">Home Type</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                      {FILTER_OPTIONS.homeType.map((type) => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={Array.isArray(filters.home_type_filter) ? filters.home_type_filter.includes(type) : false}
                            onChange={(e) => {
                              const currentValues = Array.isArray(filters.home_type_filter) ? filters.home_type_filter : [];
                              if (e.target.checked) {
                                setFilters({ ...filters, home_type_filter: [...currentValues, type] });
                              } else {
                                setFilters({ ...filters, home_type_filter: currentValues.filter(t => t !== type) });
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-white text-sm">{formatHomeType(type)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Event Filter */}
                  <div className="space-y-3">
                    <label className="text-white font-medium">Event</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                      {FILTER_OPTIONS.event.map((event) => (
                        <label key={event} className="flex items-center space-x-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={Array.isArray(filters.event_filter) ? filters.event_filter.includes(event) : false}
                            onChange={(e) => {
                              const currentValues = Array.isArray(filters.event_filter) ? filters.event_filter : [];
                              if (e.target.checked) {
                                setFilters({ ...filters, event_filter: [...currentValues, event] });
                              } else {
                                setFilters({ ...filters, event_filter: currentValues.filter(e => e !== event) });
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-white text-sm">{event.charAt(0).toUpperCase() + event.slice(1)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Levels Filter */}
                  <div className="space-y-3">
                    <label className="text-white font-medium">Levels</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                      {FILTER_OPTIONS.levels.map((level) => (
                        <label key={level} className="flex items-center space-x-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={Array.isArray(filters.levels_filter) ? filters.levels_filter.includes(level) : false}
                            onChange={(e) => {
                              const currentValues = Array.isArray(filters.levels_filter) ? filters.levels_filter : [];
                              if (e.target.checked) {
                                setFilters({ ...filters, levels_filter: [...currentValues, level] });
                              } else {
                                setFilters({ ...filters, levels_filter: currentValues.filter(l => l !== level) });
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-white text-sm">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Features & Amenities */}
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-lg">🏠</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Features & Amenities</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {FILTER_OPTIONS.booleanFilters.map((filter) => (
                    <div key={filter.key} className="space-y-2">
                      <label className="text-white font-medium text-sm">{filter.label}</label>
                      <select
                        value={filters[`${filter.key}_filter`]}
                        onChange={(e) => setFilters({ ...filters, [`${filter.key}_filter`]: e.target.value })}
                        className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300"
                      >
                        <option value="">Any</option>
                        <option value="1" className="bg-slate-800">Yes</option>
                        <option value="0" className="bg-slate-800">No</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Size Ranges */}
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-lg">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Price & Size Ranges</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FILTER_OPTIONS.rangeFilters.map((filter) => (
                    <div key={filter.key} className="space-y-4">
                      <label className="text-white font-medium">{filter.label}</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-400">Min</label>
                          <input
                            type="number"
                            value={filters[`min_${filter.key}`]}
                            onChange={(e) => setFilters({ ...filters, [`min_${filter.key}`]: e.target.value })}
                            placeholder={`Min ${filter.label.toLowerCase()}`}
                            className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-400">Max</label>
                          <input
                            type="number"
                            value={filters[`max_${filter.key}`]}
                            onChange={(e) => setFilters({ ...filters, [`max_${filter.key}`]: e.target.value })}
                            placeholder={`Max ${filter.label.toLowerCase()}`}
                            className="w-full p-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setFilters({
                    state_filter: [],
                    city_filter: '',
                    county_filter: '',
                    home_type_filter: [],
                    event_filter: [],
                    levels_filter: [],
                    is_bank_owned_filter: '',
                    is_for_auction_filter: '',
                    parking_filter: '',
                    has_garage_filter: '',
                    pool_filter: '',
                    spa_filter: '',
                    is_new_construction_filter: '',
                    has_pets_allowed_filter: '',
                    max_price: '',
                    min_price: '',
                    max_bedrooms: '',
                    min_bedrooms: '',
                    max_bathrooms: '',
                    min_bathrooms: '',
                    max_living_area: '',
                    min_living_area: '',
                  });
                  // Only auto-search if there's a previous search query
                  if (searchQuery.trim()) {
                    setTimeout(() => handleSearch(), 100); // Small delay to ensure state update
                  }
                }}
                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-2xl font-semibold transition-all duration-300 ease-out"
              >
                Clear All
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-500 ease-out hover:scale-105"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}