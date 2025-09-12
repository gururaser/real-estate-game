'use client';

import { GameResult } from '../types';

interface GuessSectionProps {
  hasSearched: boolean;
  searchResults: any;
  userGuess: string;
  setUserGuess: (guess: string) => void;
  gameResult: GameResult | null;
  handleGuess: () => void;
}

export default function GuessSection({
  hasSearched,
  searchResults,
  userGuess,
  setUserGuess,
  gameResult,
  handleGuess
}: GuessSectionProps) {
  if (!hasSearched) return null;

  return (
    <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-3xl p-8 shadow-2xl border-2 border-yellow-400/50 hover:bg-yellow-500/25 transition-all duration-500 ease-out mt-8 mb-8 animate-in slide-in-from-top-4 fade-in duration-700">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center mr-6 animate-pulse">
          <span className="text-4xl">🎯</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white mb-2">🎯 Your Price Guess</h2>
          <p className="text-lg text-yellow-200 font-medium">Can you guess the property's value within 30%, 20%, or 10% accuracy for Bronze, Silver, or Gold medal?</p>
        </div>
        <div className="ml-auto text-sm text-gray-400 bg-white/10 px-4 py-2 rounded-full border border-yellow-400/30">
          <span className="text-yellow-300 font-semibold">Based on {searchResults?.entries?.length || 0} similar properties</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="number"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            placeholder="E.g: 250000"
            disabled={!!gameResult}
            className={`w-full p-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-500 ease-out appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
              gameResult ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="text-gray-400 text-sm">$</span>
          </div>
        </div>
        <button
          onClick={handleGuess}
          disabled={!!gameResult}
          className={`bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-500 ease-out hover:scale-105 whitespace-nowrap ${
            gameResult ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          🎯 Make Guess
        </button>
      </div>

      {/* Game Result */}
      {gameResult && (
        <div className={`mt-6 p-8 rounded-2xl shadow-lg border-l-4 backdrop-blur-xl transition-all duration-500 ease-out animate-in slide-in-from-right-4 fade-in duration-700 ${
          gameResult.success
            ? 'bg-green-500/10 border-green-400 text-green-300'
            : 'bg-red-500/10 border-red-400 text-red-300'
        }`}>
          <div className="flex items-center mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
              gameResult.success
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-red-500 to-pink-500'
            }`}>
              <span className="text-2xl">{gameResult.success ? '🎉' : '❌'}</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold">
                {gameResult.success ? '🎉 Congratulations! You Won!' : '💪 Keep Trying!'}
              </h3>
              <p className="text-lg text-gray-300 mt-1">
                {gameResult.success && gameResult.medal === 'gold' ? 'Amazing guess! You\'re a real estate expert!' :
                 gameResult.success && gameResult.medal === 'silver' ? 'Excellent work! You have great market insight!' :
                 gameResult.success && gameResult.medal === 'bronze' ? 'Great job! You\'re getting better at this!' :
                 'Great effort! Try again with more research.'}
              </p>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-xl leading-relaxed font-medium">
              {gameResult.message}
            </p>
            {gameResult.success && gameResult.medal === 'gold' && (
              <div className="mt-4 flex items-center text-green-300">
                <span className="text-2xl mr-2">🏆</span>
                <span className="text-lg font-semibold">Perfect! You guessed within 10% of the actual price for Gold Medal!</span>
              </div>
            )}
            {gameResult.success && gameResult.medal === 'silver' && (
              <div className="mt-4 flex items-center text-blue-300">
                <span className="text-2xl mr-2">🥈</span>
                <span className="text-lg font-semibold">Excellent! You guessed within 20% of the actual price for Silver Medal!</span>
              </div>
            )}
            {gameResult.success && gameResult.medal === 'bronze' && (
              <div className="mt-4 flex items-center text-orange-300">
                <span className="text-2xl mr-2">🥉</span>
                <span className="text-lg font-semibold">Great job! You guessed within 30% of the actual price for Bronze Medal!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}