'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Property, SearchResult, GameResult } from './types';
import { getRandomLoadingMessage } from './utils';
import ResultModal from './components/ResultModal';
import GameInstructions from './components/GameInstructions';
import GuessSection from './components/GuessSection';
import TargetProperty from './components/TargetProperty';
import SearchSection from './components/SearchSection';
import dynamic from 'next/dynamic';

// Dynamically import map component to avoid SSR issues
const PropertyMap = dynamic(() => import('../components/PropertyMap'), {
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

export default function Game() {
  console.log('Game component rendered');
  const [targetProperty, setTargetProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [userGuess, setUserGuess] = useState('');
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  console.log('Game component state initialized');

  // Update loading message periodically when loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (loading) {
      // Set initial message
      setLoadingMessage(getRandomLoadingMessage());
      
      // Change message every 1.5 seconds
      interval = setInterval(() => {
        setLoadingMessage(getRandomLoadingMessage());
      }, 1500);
    } else {
      setLoadingMessage('');
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [loading]);

  useEffect(() => {
    console.log('useEffect triggered');
    fetchRandomProperty();
  }, []);

  // Load new property when modal closes
  useEffect(() => {
    if (!showResultModal && gameResult) {
      // Load new property when modal is closed and there's a result
      // resetGame(); // Temporarily disabled for user control
    }
  }, [showResultModal]);

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
        const originalEntityId = point.payload['__original_entity_id__'] || '';
        const realId = originalEntityId.replace('RealEstate:', '');
        
        const transformedProperty = {
          id: point.id,
          realId: realId, // Real ID from Superlinked schema
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
          limit: 30,
          ids_exclude: [targetProperty.realId],
        }),
      });
      const data = await response.json();
      setSearchResults(data);
      console.log('Applied Filters JSON:', data.metadata.search_params);
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

    let medal: 'gold' | 'silver' | 'bronze' | undefined = undefined;
    let success = false;
    let message = '';

    if (deviation <= 0.1) {
      medal = 'gold';
      success = true;
      message = 'Congratulations! You won the Gold Medal!';
    } else if (deviation <= 0.2) {
      medal = 'silver';
      success = true;
      message = 'Congratulations! You won the Silver Medal!';
    } else if (deviation <= 0.3) {
      medal = 'bronze';
      success = true;
      message = 'Congratulations! You won the Bronze Medal!';
    } else {
      success = false;
      message = 'Sorry, your guess was unsuccessful. Try again!';
    }

    setGameResult({
      success,
      medal,
      message,
      guess,
      actualPrice,
      deviation: deviation * 100, // Convert to percentage
    });
    setShowResultModal(true);
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

      {/* Result Modal */}
      <ResultModal
        isOpen={showResultModal}
        gameResult={gameResult}
        onClose={() => setShowResultModal(false)}
        onNewGame={() => {
          setShowResultModal(false);
          resetGame();
        }}
      />

      <div className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Game Instructions */}
          <GameInstructions />

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/"
              className="group inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-2xl border border-white/20 transition-all duration-500 ease-out hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Main Page
            </Link>
            <div className="flex gap-4">
              <button
                onClick={resetGame}
                className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all duration-500 ease-out hover:scale-105"
              >
                <span className="mr-2">🔄</span>
                New Game
              </button>
            </div>
          </div>

          {/* Guess Section */}
          <GuessSection
            hasSearched={hasSearched}
            searchResults={searchResults}
            userGuess={userGuess}
            setUserGuess={setUserGuess}
            gameResult={gameResult}
            handleGuess={handleGuess}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Target Property */}
            <TargetProperty targetProperty={targetProperty} searchResults={searchResults} />

            {/* Search Section */}
            <SearchSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              loading={loading}
              loadingMessage={loadingMessage}
              searchResults={searchResults}
              targetProperty={targetProperty}
            />
          </div>

          {/* Property Map Section */}
        </div>
      </div>
    </div>
  );
}
