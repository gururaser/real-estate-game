'use client';

import Confetti from 'react-confetti';
import { GameResult } from '../types';

interface ResultModalProps {
  isOpen: boolean;
  gameResult: GameResult | null;
  onClose: () => void;
  onNewGame: () => void;
}

export default function ResultModal({ isOpen, gameResult, onClose, onNewGame }: ResultModalProps) {
  if (!isOpen || !gameResult) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {gameResult.success && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 1920}
          height={typeof window !== 'undefined' ? window.innerHeight : 1080}
          recycle={false}
          numberOfPieces={200}
          gravity={0.1}
        />
      )}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full animate-in zoom-in-95 fade-in duration-300">
        <div className="text-center">
          {/* Medal Display */}
          {gameResult.medal && (
            <div className="mb-6">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                gameResult.medal === 'gold' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                gameResult.medal === 'silver' ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                'bg-gradient-to-r from-amber-600 to-amber-800'
              } shadow-lg animate-bounce`}>
                <span className="text-4xl">
                  {gameResult.medal === 'gold' ? '🥇' : gameResult.medal === 'silver' ? '🥈' : '🥉'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-4 capitalize">
                {gameResult.medal} Medal!
              </h2>
            </div>
          )}

          {/* Congratulation Message */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              {gameResult.success ? 'Congratulations!' : 'Keep Trying!'}
            </h3>
            <p className="text-gray-300">
              {gameResult.message}
            </p>
          </div>

          {/* Results Details */}
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Your Guess:</span>
                <span className="text-white font-semibold">${gameResult.guess?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Actual Price:</span>
                <span className="text-white font-semibold">${gameResult.actualPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Deviation:</span>
                <span className={`font-semibold ${
                  gameResult.deviation! <= 10 ? 'text-green-400' :
                  gameResult.deviation! <= 20 ? 'text-yellow-400' :
                  gameResult.deviation! <= 30 ? 'text-orange-400' :
                  'text-red-400'
                }`}>
                  {gameResult.deviation?.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-gray-500/25 transition-all duration-300 hover:scale-105"
            >
              Stay Here
            </button>
            <button
              onClick={onNewGame}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            >
              Continue Playing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}