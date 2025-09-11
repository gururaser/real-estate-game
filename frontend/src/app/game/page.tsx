'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import map component to avoid SSR issues
const PropertyMap = dynamic(() => import('../components/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-slate-600/50 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-400 border-t-transparent mx-auto mb-2"></div>
        <p className="text-sm text-gray-400">Loading map...</p>
      </div>
    </div>
  )
});

interface Property {
  id: string;
  fields: {
    description: string;
    streetAddress: string;
    city: string;
    state: string;
    county: string;
    price: number;
    pricePerSquareFoot: number;
    yearBuilt: number;
    zipcode: number;
    longitude: number;
    latitude: number;
    livingArea: number;
    livingAreaValue: number;
    bathrooms: number;
    bedrooms: number;
    buildingArea: number;
    garageSpaces: number;
    levels: string;
    country: string;
    datePostedString: string;
    event: string;
    currency: string;
    lotAreaUnits: string;
    homeType: string;
    is_bankOwned: number;
    is_forAuction: number;
    parking: number;
    hasGarage: number;
    pool: number;
    spa: number;
    isNewConstruction: number;
    hasPetsAllowed: number;
    time: number;
  };
}

interface SearchResult {
  entries: Property[];
  metadata: any;
}

export default function Game() {
  console.log('Game component rendered');
  const [targetProperty, setTargetProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [userGuess, setUserGuess] = useState('');
  const [gameResult, setGameResult] = useState<{ success: boolean; message: string } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  console.log('Game component state initialized');

  useEffect(() => {
    console.log('useEffect triggered');
    fetchRandomProperty();
  }, []);

  console.log('Game component about to render, targetProperty:', targetProperty);

  const fetchRandomProperty = async () => {
    console.log('fetchRandomProperty function called');
    console.log('Starting to fetch random property...');
    try {
      console.log('Making API call to /api/qdrant/collections/default/points/query');
      const response = await fetch('/api/qdrant/collections/default/points/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: { sample: 'random' },
          limit: 1,
          with_payload: true,
        }),
      });
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        console.error('Response not ok:', response.status, response.statusText);
        return;
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.result && data.result.points && data.result.points.length > 0) {
        const point = data.result.points[0];
        console.log('Point data:', point);
        // Transform payload to match expected format
        const transformedProperty = {
          id: point.id,
          fields: {
            description: point.payload['__schema_field__RealEstate_description'] || '',
            streetAddress: point.payload['__schema_field__RealEstate_streetAddress'] || '',
            city: point.payload['__schema_field__RealEstate_city'] || '',
            state: point.payload['__schema_field__RealEstate_state'] || '',
            county: point.payload['__schema_field__RealEstate_county'] || '',
            price: point.payload['__schema_field__RealEstate_price'] || 0,
            pricePerSquareFoot: point.payload['__schema_field__RealEstate_pricePerSquareFoot'] || 0,
            yearBuilt: point.payload['__schema_field__RealEstate_yearBuilt'] || 0,
            zipcode: point.payload['__schema_field__RealEstate_zipcode'] || 0,
            longitude: point.payload['__schema_field__RealEstate_longitude'] || 0,
            latitude: point.payload['__schema_field__RealEstate_latitude'] || 0,
            livingArea: point.payload['__schema_field__RealEstate_livingArea'] || 0,
            livingAreaValue: point.payload['__schema_field__RealEstate_livingAreaValue'] || 0,
            bathrooms: point.payload['__schema_field__RealEstate_bathrooms'] || 0,
            bedrooms: point.payload['__schema_field__RealEstate_bedrooms'] || 0,
            buildingArea: point.payload['__schema_field__RealEstate_buildingArea'] || 0,
            garageSpaces: point.payload['__schema_field__RealEstate_garageSpaces'] || 0,
            levels: point.payload['__schema_field__RealEstate_levels'] || '',
            country: point.payload['__schema_field__RealEstate_country'] || '',
            datePostedString: point.payload['__schema_field__RealEstate_datePostedString'] || '',
            event: point.payload['__schema_field__RealEstate_event'] || '',
            currency: point.payload['__schema_field__RealEstate_currency'] || '',
            lotAreaUnits: point.payload['__schema_field__RealEstate_lotAreaUnits'] || '',
            homeType: point.payload['__schema_field__RealEstate_homeType'] || '',
            is_bankOwned: point.payload['__schema_field__RealEstate_is_bankOwned'] || 0,
            is_forAuction: point.payload['__schema_field__RealEstate_is_forAuction'] || 0,
            parking: point.payload['__schema_field__RealEstate_parking'] || 0,
            hasGarage: point.payload['__schema_field__RealEstate_hasGarage'] || 0,
            pool: point.payload['__schema_field__RealEstate_pool'] || 0,
            spa: point.payload['__schema_field__RealEstate_spa'] || 0,
            isNewConstruction: point.payload['__schema_field__RealEstate_isNewConstruction'] || 0,
            hasPetsAllowed: point.payload['__schema_field__RealEstate_hasPetsAllowed'] || 0,
            time: point.payload['__schema_field__RealEstate_time'] || 0,
          },
        };
        console.log('Transformed property:', transformedProperty);
        setTargetProperty(transformedProperty);
      } else {
        console.error('No points found in response:', data);
      }
    } catch (error) {
      console.error('Error fetching random property:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !targetProperty) return;

    setLoading(true);
    try {
      const response = await fetch('/api/superlinked/api/v1/search/property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-include-metadata': 'True',
        },
        body: JSON.stringify({
          natural_query: searchQuery.toLowerCase(),
          limit: 5,
          ids_exclude: [targetProperty.id],
        }),
      });
      const data = await response.json();
      setSearchResults(data);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuess = () => {
    if (!targetProperty || !userGuess) return;

    // Clean the user input by removing all non-numeric characters except decimal point
    const cleanedGuess = userGuess.replace(/[^\d.]/g, '');
    const guess = parseFloat(cleanedGuess);
    const actualPrice = targetProperty.fields.price;
    const deviation = Math.abs(guess - actualPrice) / actualPrice;

    if (deviation <= 0.1) {
      setGameResult({
        success: true,
        message: `Congratulations! Your guess was successful. Actual price: $${actualPrice.toLocaleString()}`,
      });
    } else {
      setGameResult({
        success: false,
        message: `Sorry, your guess was unsuccessful. Actual price: $${actualPrice.toLocaleString()}`,
      });
    }
  };

  const resetGame = () => {
    setTargetProperty(null);
    setSearchQuery('');
    setSearchResults(null);
    setUserGuess('');
    setGameResult(null);
    setHasSearched(false);
    fetchRandomProperty();
  };

  if (!targetProperty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-transparent mx-auto mb-4"></div>
            <p className="text-xl text-white font-medium">Loading random property...</p>
            <p className="text-sm text-gray-400 mt-2">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-pink-500/20"></div>
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/"
              className="group inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-2xl border border-white/20 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Main Page
            </Link>
            <button
              onClick={resetGame}
              className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            >
              <span className="mr-2">🔄</span>
              New Game
            </button>
          </div>

          {/* Guess Section - Moved to top after search */}
          {hasSearched && (
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 mt-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Your Price Guess</h2>
                <div className="ml-auto text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                  Based on {searchResults?.entries?.length || 0} similar properties
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    placeholder="E.g: 250000"
                    className="w-full p-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-300"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-gray-400 text-sm">$</span>
                  </div>
                </div>
                <button
                  onClick={handleGuess}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 whitespace-nowrap"
                >
                  🎯 Make Guess
                </button>
              </div>

              {/* Game Result */}
              {gameResult && (
                <div className={`mt-6 p-6 rounded-2xl shadow-lg border-l-4 backdrop-blur-xl transition-all duration-300 ${
                  gameResult.success
                    ? 'bg-green-500/10 border-green-400 text-green-300'
                    : 'bg-red-500/10 border-red-400 text-red-300'
                }`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${
                      gameResult.success
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-red-500 to-pink-500'
                    }`}>
                      <span className="text-xl">{gameResult.success ? '🎉' : '😞'}</span>
                    </div>
                    <h3 className="text-2xl font-bold">
                      {gameResult.success ? 'Congratulations! 🎉' : 'Sorry 😞'}
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed">
                    {gameResult.message}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Target Property */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Target Property</h2>
              </div>

              <div className="space-y-4">
                {/* Basic Information */}
                <details className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <summary className="cursor-pointer p-4 hover:bg-white/10 transition-all duration-300 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-lg">📋</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                        <p className="text-sm text-gray-400">Property location and basic structure details</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">City</p>
                        <p className="text-lg font-semibold text-white">{targetProperty.fields.city}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">State</p>
                        <p className="text-lg font-semibold text-white">{targetProperty.fields.state}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">County</p>
                        <p className="text-lg font-semibold text-white">{targetProperty.fields.county}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Year Built</p>
                        <p className="text-lg font-semibold text-white">{targetProperty.fields.yearBuilt}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">ZIP Code</p>
                        <p className="text-lg font-semibold text-teal-300">{targetProperty.fields.zipcode}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Country</p>
                        <p className="text-lg font-semibold text-teal-300">{targetProperty.fields.country}</p>
                      </div>
                    </div>
                  </div>
                </details>

                {/* Physical Features */}
                <details className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <summary className="cursor-pointer p-4 hover:bg-white/10 transition-all duration-300 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-lg">🏠</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Physical Features</h3>
                        <p className="text-sm text-gray-400">Property size, room count, and building characteristics</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 border-t border-white/10">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Bedrooms</p>
                        <p className="text-xl font-bold text-purple-300">{targetProperty.fields.bedrooms}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Bathrooms</p>
                        <p className="text-xl font-bold text-pink-300">{targetProperty.fields.bathrooms}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Living Area (sq ft)</p>
                        <p className="text-lg font-semibold text-blue-300">{targetProperty.fields.livingArea}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Building Area</p>
                        <p className="text-lg font-semibold text-cyan-300">{targetProperty.fields.buildingArea} sq ft</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Levels</p>
                        <p className="text-lg font-semibold text-orange-300">{targetProperty.fields.levels}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Home Type</p>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {targetProperty.fields.homeType}
                        </span>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Lot Area Units</p>
                        <p className="text-lg font-semibold text-green-300">{targetProperty.fields.lotAreaUnits}</p>
                      </div>
                    </div>
                  </div>
                </details>

                {/* Garage & Parking */}
                <details className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <summary className="cursor-pointer p-4 hover:bg-white/10 transition-all duration-300 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-lg">🚗</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Garage & Parking</h3>
                        <p className="text-sm text-gray-400">Property parking and garage features</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Garage Spaces</p>
                        <p className="text-lg font-semibold text-indigo-300">{targetProperty.fields.garageSpaces}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Has Garage</p>
                        <p className="text-lg font-semibold text-indigo-300">{targetProperty.fields.hasGarage ? 'Yes' : 'No'}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Parking</p>
                        <p className="text-lg font-semibold text-indigo-300">{targetProperty.fields.parking}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Garage</p>
                        <p className="text-lg font-semibold text-indigo-300">{targetProperty.fields.hasGarage ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </details>

                {/* Amenities */}
                <details className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <summary className="cursor-pointer p-4 hover:bg-white/10 transition-all duration-300 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-lg">🏊</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Amenities</h3>
                        <p className="text-sm text-gray-400">Property pool, spa, and comfort features</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 border-t border-white/10">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Pool</p>
                        <p className="text-lg font-semibold text-blue-300">{targetProperty.fields.pool ? 'Yes' : 'No'}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Spa</p>
                        <p className="text-lg font-semibold text-pink-300">{targetProperty.fields.spa ? 'Yes' : 'No'}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Pets Allowed</p>
                        <p className="text-lg font-semibold text-green-300">{targetProperty.fields.hasPetsAllowed ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </details>

                {/* Property Status */}
                <details className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <summary className="cursor-pointer p-4 hover:bg-white/10 transition-all duration-300 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-lg">🏦</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Property Status</h3>
                        <p className="text-sm text-gray-400">Property sale status and special conditions</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Bank Owned</p>
                        <p className="text-lg font-semibold text-red-300">{targetProperty.fields.is_bankOwned ? 'Yes' : 'No'}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">For Auction</p>
                        <p className="text-lg font-semibold text-yellow-300">{targetProperty.fields.is_forAuction ? 'Yes' : 'No'}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">New Construction</p>
                        <p className="text-lg font-semibold text-green-300">{targetProperty.fields.isNewConstruction ? 'Yes' : 'No'}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Event Type</p>
                        <p className="text-lg font-semibold text-violet-300">{targetProperty.fields.event}</p>
                      </div>
                    </div>
                  </div>
                </details>

                {/* Location Coordinates */}
                <details className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <summary className="cursor-pointer p-4 hover:bg-white/10 transition-all duration-300 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-lg">📍</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Location Coordinates</h3>
                        <p className="text-sm text-gray-400">Property GPS coordinates</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 border-t border-white/10">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Latitude</p>
                          <p className="text-lg font-semibold text-emerald-300">{targetProperty.fields.latitude}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Longitude</p>
                          <p className="text-lg font-semibold text-emerald-300">{targetProperty.fields.longitude}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </details>                {/* Date & Time Information */}
                <details className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <summary className="cursor-pointer p-4 hover:bg-white/10 transition-all duration-300 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-lg">📅</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Date & Time Information</h3>
                        <p className="text-sm text-gray-400">Property listing date and time information</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Listing Date</p>
                        <p className="text-sm font-semibold text-violet-300">{targetProperty.fields.datePostedString}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Time Stamp</p>
                        <p className="text-sm font-semibold text-violet-300">{targetProperty.fields.time}</p>
                      </div>
                    </div>
                  </div>
                </details>

                {/* Financial Information */}
                <details className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <summary className="cursor-pointer p-4 hover:bg-white/10 transition-all duration-300 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-lg">💰</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Financial Information</h3>
                        <p className="text-sm text-gray-400">Property price and financial metrics</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Price per Sq Ft</p>
                        <p className="text-lg font-semibold text-lime-300">${targetProperty.fields.pricePerSquareFoot}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Living Area Value</p>
                        <p className="text-lg font-semibold text-lime-300">${targetProperty.fields.livingAreaValue}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Currency</p>
                        <p className="text-lg font-semibold text-yellow-300">{targetProperty.fields.currency}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Time Stamp</p>
                        <p className="text-lg font-semibold text-yellow-300">{targetProperty.fields.time}</p>
                      </div>
                    </div>
                  </div>
                </details>

                {/* Descriptions */}
                <details className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <summary className="cursor-pointer p-4 hover:bg-white/10 transition-all duration-300 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-lg">📝</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Descriptions</h3>
                        <p className="text-sm text-gray-400">Property detailed description and address information</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 border-t border-white/10 space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-sm text-gray-400 mb-2">Property Description</p>
                      <div className="text-sm text-gray-300 max-h-32 overflow-y-auto leading-relaxed custom-scrollbar">
                        {targetProperty.fields.description}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-sm text-gray-400 mb-2">Street Address</p>
                      <p className="text-sm text-gray-300">{targetProperty.fields.streetAddress}</p>
                    </div>
                  </div>
                </details>
              </div>

              {/* Property Location Map */}
              <div className="mt-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🗺️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Property Location</h3>
                </div>

                <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-4 border border-slate-600">
                  <PropertyMap
                    latitude={targetProperty.fields.latitude}
                    longitude={targetProperty.fields.longitude}
                    address={targetProperty.fields.streetAddress}
                    city={targetProperty.fields.city}
                    state={targetProperty.fields.state}
                  />
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Natural Language Search</h2>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="E.g: A cheap house in California"
                    className="w-full p-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-gray-400 text-sm">💭</span>
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Searching...
                    </div>
                  ) : (
                    '🔍 Search'
                  )}
                </button>
              </div>

              {searchResults && (
                <div className="mt-8">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                      <span className="text-xl">📊</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Search Results</h3>
                  </div>

                  <div className="space-y-4">
                    {searchResults.entries.map((entry, index) => (
                      <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-102">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-green-300">
                                ${entry.fields.price.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                                ${entry.fields.pricePerSquareFoot.toFixed(0)}/sq ft
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
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center space-x-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                {entry.fields.homeType}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <p className="text-xs text-gray-400 mb-1">Bedrooms</p>
                                <p className="text-lg font-bold text-purple-300">{entry.fields.bedrooms}</p>
                              </div>
                              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <p className="text-xs text-gray-400 mb-1">Bathrooms</p>
                                <p className="text-lg font-bold text-pink-300">{entry.fields.bathrooms}</p>
                              </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                              <p className="text-xs text-gray-400 mb-1">Living Area</p>
                              <p className="text-lg font-semibold text-blue-300">{entry.fields.livingArea} sq ft</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                              <p className="text-xs text-gray-400 mb-1">Year Built</p>
                              <p className="text-lg font-semibold text-cyan-300">{entry.fields.yearBuilt}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10">
                          <details className="group">
                            <summary className="cursor-pointer text-gray-300 hover:text-white font-medium flex items-center justify-between transition-colors">
                              <span>More Information</span>
                              <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </summary>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-400">
                              <div className="space-y-2">
                                <p><span className="text-gray-300">🚗 Garage:</span> {entry.fields.garageSpaces} spaces</p>
                                <p><span className="text-gray-300">🏢 Levels:</span> {entry.fields.levels}</p>
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

                  <div className="mt-6">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center justify-between w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all duration-300 group"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-3">
                          <span className="text-lg">⚙️</span>
                        </div>
                        <h4 className="text-lg font-semibold text-white">Applied Filters</h4>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showFilters && (
                      <div className="mt-4 bg-white/5 rounded-2xl p-4 border border-white/10">
                        <pre className="text-xs text-gray-300 bg-black/20 p-3 rounded-xl overflow-x-auto border border-white/10">
                          {JSON.stringify(searchResults.metadata.search_params, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Property Map Section */}
                    </div>

          {/* Search Section */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
        </div>
      </div>
    </div>
  );
}
