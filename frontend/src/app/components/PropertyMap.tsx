'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon for target property
const targetIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2C11.0294 2 7 6.02944 7 11C7 16.9706 16 28 16 28C16 28 25 16.9706 25 11C25 6.02944 20.9706 2 16 2Z" fill="#EF4444" stroke="#FFFFFF" stroke-width="2"/>
      <circle cx="16" cy="11" r="4" fill="#FFFFFF"/>
      <path d="M16 7C14.8954 7 14 7.89543 14 9C14 10.1046 14.8954 11 16 11C17.1046 11 18 10.1046 18 9C18 7.89543 17.1046 7 16 7Z" fill="#EF4444"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Custom marker icon for search results
const searchResultIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2C11.0294 2 7 6.02944 7 11C7 16.9706 16 28 16 28C16 28 25 16.9706 25 11C25 6.02944 20.9706 2 16 2Z" fill="#3B82F6" stroke="#FFFFFF" stroke-width="2"/>
      <circle cx="16" cy="11" r="4" fill="#FFFFFF"/>
      <path d="M16 7C14.8954 7 14 7.89543 14 9C14 10.1046 14.8954 11 16 11C17.1046 11 18 10.1046 18 9C18 7.89543 17.1046 7 16 7Z" fill="#3B82F6"/>
    </svg>
  `),
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
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

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  searchResults?: Property[];
  height?: string; // Optional height prop for different sizes
}

export default function PropertyMap({ latitude, longitude, address, city, state, searchResults, height = "h-64" }: PropertyMapProps) {
  // Validate coordinates
  if (!latitude || !longitude || latitude === 0 || longitude === 0) {
    return (
      <div className={`flex items-center justify-center ${height} bg-slate-600/50 rounded-lg`}>
        <div className="text-center">
          <div className="text-2xl mb-2">📍</div>
          <p className="text-sm text-gray-400">Location coordinates not available</p>
        </div>
      </div>
    );
  }

  const position: [number, number] = [latitude, longitude];

  return (
    <div className={`${height} rounded-lg overflow-hidden border border-slate-600 relative`}>
      <MapContainer
        center={position}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Search Results Markers */}
        {searchResults && searchResults.map((property, index) => (
          <Marker 
            key={index}
            position={[property.fields.latitude, property.fields.longitude]} 
            icon={searchResultIcon}
          >
            <Popup>
              <div className="text-sm max-w-48">
                <div className="font-bold text-blue-600 mb-2 flex items-center">
                  <span className="text-lg mr-1">🔍</span>
                  Search Result
                </div>
                <div className="mb-2 text-gray-700">
                  <div className="font-medium">Price:</div>
                  <div className="text-lg font-bold text-green-600">${property.fields.price.toLocaleString()}</div>
                </div>
                {property.fields.streetAddress && (
                  <div className="mb-2 text-gray-700">
                    <div className="font-medium">Address:</div>
                    <div className="text-xs">{property.fields.streetAddress}</div>
                  </div>
                )}
                {property.fields.city && property.fields.state && (
                  <div className="mb-2 text-gray-700">
                    <div className="font-medium">Location:</div>
                    <div className="text-xs">{property.fields.city}, {property.fields.state}</div>
                  </div>
                )}
                <div className="text-xs text-gray-500 border-t pt-2 mt-2">
                  📍 Coordinates: {property.fields.latitude.toFixed(6)}, {property.fields.longitude.toFixed(6)}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Target Property Marker */}
        <Marker position={position} icon={targetIcon}>
          <Popup>
            <div className="text-sm max-w-48">
              <div className="font-bold text-red-600 mb-2 flex items-center">
                <span className="text-lg mr-1">🎯</span>
                Target Property
              </div>
              {address && (
                <div className="mb-2 text-gray-700">
                  <div className="font-medium">Address:</div>
                  <div className="text-xs">{address}</div>
                </div>
              )}
              {city && state && (
                <div className="mb-2 text-gray-700">
                  <div className="font-medium">Location:</div>
                  <div className="text-xs">{city}, {state}</div>
                </div>
              )}
              <div className="text-xs text-gray-500 border-t pt-2 mt-2">
                📍 Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Coordinates overlay */}
      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-3 py-1 rounded-lg backdrop-blur-sm border border-white/20">
        <div className="flex items-center">
          <span className="mr-1">�</span>
          <span>{latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
        </div>
      </div>

      {/* Zoom controls hint */}
      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
        Use mouse wheel to zoom
      </div>
    </div>
  );
}