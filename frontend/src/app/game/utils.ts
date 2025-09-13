// Helper function to format home type
export const formatHomeType = (homeType: string) => {
  return homeType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Get random loading message for search
export const getRandomLoadingMessage = () => {
  const messages = [
    "🧠 Processing natural language query...",
    "✨ Extracting search filters from your description...",
    "🏠 Finding properties that match your criteria...",
    "✨ Analyzing property features and characteristics...",
    "✨ Matching your preferences with available listings...",
    "✨ Understanding your ideal property requirements...",
    "🔬 Applying intelligent filtering algorithms...",
    "✨ Ranking properties by relevance and quality...",
    "🏡 Discovering the perfect property match...",
    "✨ Using AI to find your dream home..."
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

// Filter options for property search
export const FILTER_OPTIONS = {
  state: ['ca', 'ga'],
  homeType: ['lot', 'single_family', 'condo', 'multi_family', 'townhouse', 'apartment'],
  event: ['listed for sale', 'price change', 'listing removed', 'sold', 'listed for rent', 'pending sale'],
  levels: ['0', '1', '2', '3+', 'multi', '4', 'other', '5+', '1.5', '2+', '2.5'],
  lotAreaUnits: ['acres', 'sqft'],
  currency: ['usd'],
  country: ['usa'],
  // Boolean filters (0/1)
  booleanFilters: [
    { key: 'is_bankOwned', label: 'Bank Owned' },
    { key: 'is_forAuction', label: 'For Auction' },
    { key: 'parking', label: 'Has Parking' },
    { key: 'hasGarage', label: 'Has Garage' },
    { key: 'pool', label: 'Has Pool' },
    { key: 'spa', label: 'Has Spa' },
    { key: 'isNewConstruction', label: 'New Construction' },
    { key: 'hasPetsAllowed', label: 'Pets Allowed' },
  ],
  // Numeric range filters
  rangeFilters: [
    { key: 'price', label: 'Price', min: 1, max: 95000000 },
    { key: 'bedrooms', label: 'Bedrooms', min: 0, max: 99 },
    { key: 'bathrooms', label: 'Bathrooms', min: 0, max: 89 },
    { key: 'livingArea', label: 'Living Area (sq ft)', min: 0, max: 9061351 },
  ],
};