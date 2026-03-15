import React from 'react';
import { Play, Store, Trophy, Target } from 'lucide-react';

interface MainMenuProps {
  onPlay: () => void;
  onStore: () => void;
  onLeaderboard: () => void;
  totalCoins: number;
  difficulty: 'easy' | 'medium' | 'hard';
  onSelectDifficulty: (diff: 'easy' | 'medium' | 'hard') => void;
}

export default function MainMenu({ onPlay, onStore, onLeaderboard, totalCoins, difficulty, onSelectDifficulty }: MainMenuProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 p-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-3xl shadow-2xl text-white">
      <div className="text-center space-y-2">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-red-500 drop-shadow-lg">
          MIRACURES WOLD
        </h1>
        <p className="text-xl md:text-2xl font-bold text-blue-100 uppercase tracking-widest">David produção</p>
      </div>

      <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full flex items-center space-x-3 border border-white/30">
        <span className="text-2xl">🪙</span>
        <span className="text-2xl font-bold">{totalCoins} Moedas</span>
      </div>

      <div className="flex flex-col w-full max-w-xs space-y-4">
        <div className="bg-white/10 p-3 rounded-2xl border border-white/20 flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2 text-blue-100 font-bold uppercase tracking-wider text-sm mb-1">
            <Target className="w-4 h-4" />
            <span>Dificuldade</span>
          </div>
          <div className="flex w-full space-x-2">
            <button 
              onClick={() => onSelectDifficulty('easy')}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${difficulty === 'easy' ? 'bg-green-500 text-white shadow-lg scale-105' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            >
              Fácil
            </button>
            <button 
              onClick={() => onSelectDifficulty('medium')}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${difficulty === 'medium' ? 'bg-yellow-500 text-white shadow-lg scale-105' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            >
              Médio
            </button>
            <button 
              onClick={() => onSelectDifficulty('hard')}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${difficulty === 'hard' ? 'bg-red-500 text-white shadow-lg scale-105' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            >
              Difícil
            </button>
          </div>
        </div>

        <button
          onClick={onPlay}
          className="group relative flex items-center justify-center space-x-3 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow-xl transform transition-all hover:scale-105 active:scale-95"
        >
          <Play className="w-8 h-8 fill-current" />
          <span>JOGAR</span>
          <div className="absolute inset-0 rounded-2xl ring-4 ring-white/20 group-hover:ring-white/40 transition-all"></div>
        </button>

        <button
          onClick={onStore}
          className="flex items-center justify-center space-x-3 bg-white/10 hover:bg-white/20 text-white text-xl font-bold py-4 px-8 rounded-2xl backdrop-blur-sm border border-white/20 transition-all hover:scale-105 active:scale-95"
        >
          <Store className="w-6 h-6" />
          <span>LOJA DE HERÓIS</span>
        </button>

        <button
          onClick={onLeaderboard}
          className="flex items-center justify-center space-x-3 bg-white/10 hover:bg-white/20 text-white text-xl font-bold py-4 px-8 rounded-2xl backdrop-blur-sm border border-white/20 transition-all hover:scale-105 active:scale-95"
        >
          <Trophy className="w-6 h-6" />
          <span>RANKING</span>
        </button>
      </div>
    </div>
  );
}
