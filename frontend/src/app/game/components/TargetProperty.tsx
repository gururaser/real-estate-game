'use client';

import dynamic from 'next/dynamic';
import { Property } from '../types';
import { formatHomeType } from '../utils';

// Dynamically import map component to avoid SSR issues
const PropertyMap = dynamic(() => import('../../components/PropertyMap'), {
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

interface TargetPropertyProps {
  targetProperty: Property;
  searchResults: any;
}

export default function TargetProperty({ targetProperty, searchResults }: TargetPropertyProps) {
  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-purple-500/10">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
          <span className="text-2xl">🏠</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Target Property</h2>
          <p className="text-sm text-gray-400 mt-1">Study this property carefully to estimate its market value</p>
        </div>
      </div>

      {/* Property Overview */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
            <span className="text-xl">📋</span>
          </div>
          <h3 className="text-2xl font-bold text-white">Property Overview</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-300">🆔</span>
              <div>
                <p className="text-sm text-gray-400">Property ID</p>
                <span className="inline-flex items-center px-2 py-1 mt-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30 text-xs font-medium text-blue-300">
                  {targetProperty.realId}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-300">🏙️</span>
              <div>
                <p className="text-sm text-gray-400">City</p>
                <p className="text-xl font-bold text-white">{targetProperty.fields.city}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-300">📍</span>
              <div>
                <p className="text-sm text-gray-400">State</p>
                <p className="text-xl font-bold text-white">
                  {(targetProperty.fields.state.toLowerCase() === 'ga' ? 'Georgia' :
                   targetProperty.fields.state.toLowerCase() === 'ca' ? 'California' :
                   targetProperty.fields.state).toLowerCase()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-300">🌍</span>
              <div>
                <p className="text-sm text-gray-400">Country</p>
                <p className="text-xl font-bold text-white">{targetProperty.fields.country}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-300">🏛️</span>
              <div>
                <p className="text-sm text-gray-400">County</p>
                <p className="text-xl font-bold text-white">{targetProperty.fields.county}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-300">🏠</span>
              <div>
                <p className="text-sm text-gray-400">Home Type</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {formatHomeType(targetProperty.fields.homeType)}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-300">📮</span>
              <div>
                <p className="text-sm text-gray-400">ZIP Code</p>
                <p className="text-xl font-bold text-teal-300">{targetProperty.fields.zipcode === 0 ? 'Unknown' : targetProperty.fields.zipcode}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-300">🏠</span>
              <div>
                <p className="text-sm text-gray-400">Street Address</p>
                <p className="text-lg font-semibold text-white">{targetProperty.fields.streetAddress}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-300">🏗️</span>
              <div>
                <p className="text-sm text-gray-400">Year Built</p>
                <p className="text-xl font-bold text-cyan-300">{targetProperty.fields.yearBuilt === 0 ? 'Unknown' : targetProperty.fields.yearBuilt}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-300">📅</span>
              <div>
                <p className="text-sm text-gray-400">Listing Date</p>
                <p className="text-lg font-semibold text-violet-300">{targetProperty.fields.datePostedString}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-start space-x-4">
            <span className="text-lg font-semibold text-gray-300 mt-1">📝</span>
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-2">Description</p>
              <div className="text-sm text-gray-300 max-h-32 overflow-y-auto leading-relaxed custom-scrollbar bg-white/5 p-3 rounded-lg">
                {targetProperty.fields.description}
              </div>
            </div>
          </div>
        </div>

        {/* Property Location Map inside Overview */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-3">
              <span className="text-lg">🗺️</span>
            </div>
            <h4 className="text-xl font-bold text-white">Location Map</h4>
          </div>

          {/* Coordinates Display */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-sm text-gray-400 mb-1">Latitude</p>
              <p className="text-lg font-semibold text-emerald-300">{targetProperty.fields.latitude.toFixed(6)}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-sm text-gray-400 mb-1">Longitude</p>
              <p className="text-lg font-semibold text-teal-300">{targetProperty.fields.longitude.toFixed(6)}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-4 border border-slate-600">
            <PropertyMap
              latitude={targetProperty.fields.latitude}
              longitude={targetProperty.fields.longitude}
              address={targetProperty.fields.streetAddress}
              city={targetProperty.fields.city}
              state={targetProperty.fields.state}
              searchResults={searchResults?.entries || []}
              height="h-64"
              targetProperty={targetProperty}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Physical Features */}
        <details className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <summary className="cursor-pointer p-4 hover:bg-white/10 transition-all duration-500 ease-out flex items-center justify-between">
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
                <p className="text-xl font-bold text-purple-300">{targetProperty.fields.bedrooms === 0 ? 'N/A' : targetProperty.fields.bedrooms}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-sm text-gray-400 mb-1">Bathrooms</p>
                <p className="text-xl font-bold text-pink-300">{targetProperty.fields.bathrooms === 0 ? 'N/A' : targetProperty.fields.bathrooms}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-sm text-gray-400 mb-1">Living Area (sq ft)</p>
                <p className="text-lg font-semibold text-blue-300">{targetProperty.fields.livingArea === 0 ? 'Unknown' : targetProperty.fields.livingArea}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-sm text-gray-400 mb-1">Building Area</p>
                <p className="text-lg font-semibold text-cyan-300">{targetProperty.fields.buildingArea === 0 ? 'Unknown' : `${targetProperty.fields.buildingArea} sq ft`}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-sm text-gray-400 mb-1">Levels</p>
                <p className="text-lg font-semibold text-orange-300">{targetProperty.fields.levels === '' ? 'Unknown' : targetProperty.fields.levels}</p>
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
          <summary className="cursor-pointer p-4 hover:bg-white/10 transition-all duration-500 ease-out flex items-center justify-between">
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
                <p className="text-lg font-semibold text-indigo-300">{targetProperty.fields.garageSpaces === 0 ? 'None' : targetProperty.fields.garageSpaces}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-sm text-gray-400 mb-1">Has Garage</p>
                <p className="text-lg font-semibold text-indigo-300">{targetProperty.fields.hasGarage ? 'Yes' : 'No'}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-sm text-gray-400 mb-1">Parking</p>
                <p className="text-lg font-semibold text-indigo-300">{targetProperty.fields.parking === 0 ? 'None' : targetProperty.fields.parking}</p>
              </div>
            </div>
          </div>
        </details>

        {/* Amenities */}
        <details className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <summary className="cursor-pointer p-4 hover:bg-white/10 transition-all duration-500 ease-out flex items-center justify-between">
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
          <summary className="cursor-pointer p-4 hover:bg-white/10 transition-all duration-500 ease-out flex items-center justify-between">
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
      </div>
    </div>
  );
}