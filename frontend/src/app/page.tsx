import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-pink-500/20"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-12 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
                <span className="text-3xl">🏠</span>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-4 leading-tight">
                Real Estate Price Guessing Game
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
            </div>

            {/* Description */}
            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              ✨ Guess real estate prices using natural language search!
              Examine randomly selected property features, find similar properties, and guess the price.
            </p>

            {/* How to Play */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-10 border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center justify-center">
                <span className="mr-2">🎯</span>
                How to Play?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                  <div className="text-purple-300 text-3xl mb-3">1️⃣</div>
                  <h3 className="text-white font-semibold mb-2">Examine Property</h3>
                  <p className="text-gray-300 text-sm">A random property listing appears (price hidden)</p>
                </div>
                <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl p-6 border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300">
                  <div className="text-pink-300 text-3xl mb-3">2️⃣</div>
                  <h3 className="text-white font-semibold mb-2">Search and Find</h3>
                  <p className="text-gray-300 text-sm">Search for similar properties using natural language</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
                  <div className="text-blue-300 text-3xl mb-3">3️⃣</div>
                  <h3 className="text-white font-semibold mb-2">Make Guess</h3>
                  <p className="text-gray-300 text-sm">Guess the price and see the result</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/game"
              className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 text-lg"
            >
              <span className="mr-3 text-2xl">🎮</span>
              Start Game
              <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                <div className="text-2xl font-bold text-purple-300">43K+</div>
                <div className="text-sm text-gray-400">Property Listings</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                <div className="text-2xl font-bold text-pink-300">AI</div>
                <div className="text-sm text-gray-400">Natural Language Search</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                <div className="text-2xl font-bold text-blue-300">%10</div>
                <div className="text-sm text-gray-400">Success Tolerance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
