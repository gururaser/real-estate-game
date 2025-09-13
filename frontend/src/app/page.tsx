import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-pink-500/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{animationDelay: '6s'}}></div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Enhanced Main Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-500 hover:shadow-purple-500/20">
            {/* Enhanced Header */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-3xl mb-6 shadow-lg hover:shadow-purple-500/30 transition-all duration-500 hover:scale-110">
                <span className="text-4xl animate-bounce">🏠</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 leading-tight animate-fade-in">
                Real Estate Price
                <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Guessing Game
                </span>
              </h1>
              <div className="w-40 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mx-auto rounded-full animate-pulse"></div>
            </div>

            {/* Enhanced Description */}
            <p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto animate-fade-in-up">
              ✨ <strong className="text-purple-300">AI-Powered</strong> real estate price prediction game!
              Use natural language to search similar properties, analyze market data, and guess the hidden price.
              <br />
              <span className="text-sm text-gray-400 mt-2 block">
                Challenge yourself with 43K+ real property listings from California & Georgia
              </span>
            </p>

            {/* Enhanced How to Play */}
            <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-10 mb-12 border border-white/10 hover:border-purple-500/30 transition-all duration-500">
              <h2 className="text-3xl font-semibold text-white mb-8 flex items-center justify-center">
                <span className="mr-3 text-3xl animate-spin-slow">🎯</span>
                How to Play?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 hover:shadow-purple-500/20">
                  <div className="text-purple-300 text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">1️⃣</div>
                  <h3 className="text-white font-bold text-lg mb-3">Examine Property</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">A random property listing appears with price hidden. Study all available details carefully.</p>
                </div>
                <div className="group bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl p-8 border border-pink-500/30 hover:border-pink-400/60 transition-all duration-500 hover:scale-105 hover:shadow-pink-500/20">
                  <div className="text-pink-300 text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">2️⃣</div>
                  <h3 className="text-white font-bold text-lg mb-3">Search & Analyze</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Use AI-powered natural language search to find comparable properties and market insights.</p>
                </div>
                <div className="group bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-500 hover:scale-105 hover:shadow-blue-500/20">
                  <div className="text-blue-300 text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">3️⃣</div>
                  <h3 className="text-white font-bold text-lg mb-3">Make Your Guess</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Guess the price and earn Gold, Silver, or Bronze medals based on accuracy!</p>
                </div>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link
                href="/game"
                className="group inline-flex items-center px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white font-bold rounded-3xl shadow-lg hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-500 text-xl hover:rotate-1"
              >
                <span className="mr-4 text-3xl group-hover:animate-bounce">🎮</span>
                Start Game
                <svg className="ml-4 w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <button className="group inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
                <span className="mr-3 text-xl">📊</span>
                View Leaderboard
                <span className="ml-2 text-xs bg-purple-500/30 px-2 py-1 rounded-full">Coming Soon</span>
              </button>
            </div>

            {/* Enhanced Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/10">
                <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">43K+</div>
                <div className="text-sm text-gray-300 font-medium">Property Listings</div>
                <div className="text-xs text-gray-400 mt-1">CA & GA</div>
              </div>
              <div className="group bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-pink-500/30 transition-all duration-300 hover:scale-105 hover:shadow-pink-500/10">
                <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">AI</div>
                <div className="text-sm text-gray-300 font-medium">Powered Search</div>
                <div className="text-xs text-gray-400 mt-1">Natural Language</div>
              </div>
              <div className="group bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/10">
                <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">±10%</div>
                <div className="text-sm text-gray-300 font-medium">Success Tolerance</div>
                <div className="text-xs text-gray-400 mt-1">Gold Medal</div>
              </div>
              <div className="group bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-indigo-500/30 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/10">
                <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">∞</div>
                <div className="text-sm text-gray-300 font-medium">Possibilities</div>
                <div className="text-xs text-gray-400 mt-1">Endless Fun</div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-400 mb-2">
                  Developed by Gurur Aşer using <a href="https://github.com/qdrant/qdrant" target="_blank" rel="noopener noreferrer" className="text-purple-300 font-semibold hover:text-purple-200 transition-colors duration-300">Qdrant</a> & <a href="https://github.com/superlinked/superlinked" target="_blank" rel="noopener noreferrer" className="text-pink-300 font-semibold hover:text-pink-200 transition-colors duration-300">Superlinked</a>
                </p>
                <div className="flex justify-center gap-6 text-sm">
                  <a
                    href="https://www.linkedin.com/in/gururaser/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center gap-2 hover:scale-105 transform"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/gururaser"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 hover:scale-105 transform"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
