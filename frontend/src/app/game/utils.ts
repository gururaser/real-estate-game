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