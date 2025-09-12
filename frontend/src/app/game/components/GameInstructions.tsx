export default function GameInstructions() {
  return (
    <div className="backdrop-blur-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl p-6 shadow-2xl border border-white/20 mb-8">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4">
          <span className="text-3xl">🎯</span>
        </div>
        <h1 className="text-4xl font-bold text-white">Real Estate Price Guessing Game</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">🏠</span>
            <h3 className="text-lg font-semibold text-white">Step 1: Explore</h3>
          </div>
          <p className="text-sm text-gray-300">Discover property details, location, and features to understand its value</p>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">🔍</span>
            <h3 className="text-lg font-semibold text-white">Step 2: Research</h3>
          </div>
          <p className="text-sm text-gray-300">Search for similar properties to get market insights and price comparisons</p>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">💰</span>
            <h3 className="text-lg font-semibold text-white">Step 3: Guess</h3>
          </div>
          <p className="text-sm text-gray-300">Make your best price estimate! Get within 30% for Bronze, 20% for Silver, or 10% for Gold medal!</p>
        </div>
      </div>
    </div>
  );
}