'use client';

import dynamic from 'next/dynamic';
import { SearchResult, Property } from '../types';
import { formatHomeType } from '../utils';

// Dynamically import map component to avoid SSR issues
const PropertyMap = dynamic(() => import('../../components/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-32 bg-slate-600/50 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-400 border-t-transparent mx-auto mb-1"></div>
        <p className="text-xs text-gray-400">Loading map...</p>
      </div>
    </div>
  )
});

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  loading: boolean;
  loadingMessage: string;
  searchResults: SearchResult | null;
}

export default function SearchSection({
  searchQuery,
  setSearchQuery,
  handleSearch,
  loading,
  loadingMessage,
  searchResults
}: SearchSectionProps) {
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
            placeholder="E.g: A cheap house in California"
            className="w-full p-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-500 ease-out"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="text-gray-400 text-sm">💭</span>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-500 ease-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              {loadingMessage}
            </div>
          ) : (
            '🔍 Search'
          )}
        </button>
      </div>

      {searchResults && (
        <div className="mt-8 animate-in slide-in-from-left-4 fade-in duration-700">
          {/* Applied Filters */}
          <details className="group mb-8 bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <summary className="cursor-pointer p-4 hover:bg-white/10 transition-all duration-500 ease-out flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-xl">🔧</span>
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
                const filters = [
                  { key: 'state_filter', label: 'State', value: searchResults.metadata.search_params?.state_filter, icon: '🏛️' },
                  { key: 'city_filter', label: 'City', value: searchResults.metadata.search_params?.city_filter, icon: '🏙️' },
                  { key: 'county_filter', label: 'County', value: searchResults.metadata.search_params?.county_filter, icon: '🏛️' },
                  { key: 'street_address_filter', label: 'Street Address', value: searchResults.metadata.search_params?.street_address, icon: '🏠' },
                  { key: 'home_type_filter', label: 'Home Type', value: searchResults.metadata.search_params?.home_type_filter, icon: '🏠' },
                  { key: 'event_filter', label: 'Event', value: searchResults.metadata.search_params?.event_filter, icon: '📢' },
                  { key: 'is_bank_owned_filter', label: 'Bank Owned', value: searchResults.metadata.search_params?.is_bank_owned_filter, icon: '🏦' },
                  { key: 'is_for_auction_filter', label: 'Auction', value: searchResults.metadata.search_params?.is_for_auction_filter, icon: '🔨' },
                  { key: 'parking_filter', label: 'Parking', value: searchResults.metadata.search_params?.parking_filter, icon: '🚗' },
                  { key: 'has_garage_filter', label: 'Garage', value: searchResults.metadata.search_params?.has_garage_filter, icon: '🏭' },
                  { key: 'pool_filter', label: 'Pool', value: searchResults.metadata.search_params?.pool_filter, icon: '🏊' },
                  { key: 'spa_filter', label: 'Spa', value: searchResults.metadata.search_params?.spa_filter, icon: '🛁' },
                  { key: 'is_new_construction_filter', label: 'New Construction', value: searchResults.metadata.search_params?.is_new_construction_filter, icon: '🔨' },
                  { key: 'has_pets_allowed_filter', label: 'Pets Allowed', value: searchResults.metadata.search_params?.has_pets_allowed_filter, icon: '🐾' },
                  { key: 'max_price', label: 'Max Price', value: searchResults.metadata.search_params?.max_price, icon: '💰' },
                  { key: 'min_price', label: 'Min Price', value: searchResults.metadata.search_params?.min_price, icon: '💰' },
                  { key: 'max_bedrooms', label: 'Max Bedrooms', value: searchResults.metadata.search_params?.max_bedrooms, icon: '🛏️' },
                  { key: 'min_bedrooms', label: 'Min Bedrooms', value: searchResults.metadata.search_params?.min_bedrooms, icon: '🛏️' },
                  { key: 'max_bathrooms', label: 'Max Bathrooms', value: searchResults.metadata.search_params?.max_bathrooms, icon: '🛁' },
                  { key: 'min_bathrooms', label: 'Min Bathrooms', value: searchResults.metadata.search_params?.min_bathrooms, icon: '🛁' },
                  { key: 'max_living_area', label: 'Max Living Area', value: searchResults.metadata.search_params?.max_living_area, icon: '📐' },
                  { key: 'min_living_area', label: 'Min Living Area', value: searchResults.metadata.search_params?.min_living_area, icon: '📐' },
                ].filter(filter => filter.value !== null && filter.value !== undefined && filter.value !== '');

                return filters.length > 0 ? (
                  <div className="space-y-6">
                    {/* Location & Property Type Filters */}
                    {filters.some(f => ['state_filter', 'city_filter', 'county_filter', 'street_address_filter', 'home_type_filter', 'event_filter'].includes(f.key)) && (
                      <div className="space-y-4">
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-lg">📍</span>
                          </div>
                          <h4 className="text-lg font-semibold text-white">Location & Type</h4>
                        </div>

                        <div className="space-y-3">
                          {filters.filter(f => ['state_filter', 'city_filter', 'county_filter', 'street_address_filter', 'home_type_filter', 'event_filter'].includes(f.key)).map((filter) => (
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
                    {filters.some(f => ['is_bank_owned_filter', 'is_for_auction_filter', 'parking_filter', 'has_garage_filter', 'pool_filter', 'spa_filter', 'is_new_construction_filter', 'has_pets_allowed_filter'].includes(f.key)) && (
                      <div className="space-y-4">
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-lg">🏠</span>
                          </div>
                          <h4 className="text-lg font-semibold text-white">Features & Amenities</h4>
                        </div>

                        <div className="space-y-3">
                          {filters.filter(f => ['is_bank_owned_filter', 'is_for_auction_filter', 'parking_filter', 'has_garage_filter', 'pool_filter', 'spa_filter', 'is_new_construction_filter', 'has_pets_allowed_filter'].includes(f.key)).map((filter) => (
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
                    {filters.some(f => ['max_price', 'min_price', 'max_bedrooms', 'min_bedrooms', 'max_bathrooms', 'min_bathrooms', 'max_living_area', 'min_living_area'].includes(f.key)) && (
                      <div className="space-y-4">
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-lg">📊</span>
                          </div>
                          <h4 className="text-lg font-semibold text-white">Price & Size Ranges</h4>
                        </div>

                        <div className="space-y-3">
                          {filters.filter(f => ['max_price', 'min_price', 'max_bedrooms', 'min_bedrooms', 'max_bathrooms', 'min_bathrooms', 'max_living_area', 'min_living_area'].includes(f.key)).map((filter) => (
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
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🔍</span>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-300 mb-2">No Filters Applied</h4>
                    <p className="text-gray-400">This search used natural language processing without specific filters</p>
                  </div>
                );
              })()}
            </div>
          </details>

          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Search Results</h3>
          </div>

          <div className="space-y-4">
            {searchResults.entries.map((entry, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 ease-out hover:scale-102 animate-in slide-in-from-bottom-4 fade-in duration-700"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-300">
                        ${entry.fields.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                        ${entry.fields.pricePerSquareFoot === 0 ? 'Unknown' : entry.fields.pricePerSquareFoot.toFixed(0)}/sq ft
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-300">
                        <span className="text-gray-400">📍</span> {entry.fields.city}, {entry.fields.state}
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
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {formatHomeType(entry.fields.homeType)}
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
        </div>
      )}
    </div>
  );
}