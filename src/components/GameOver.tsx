import React from 'react';
import { RotateCcw, Home, Trophy } from 'lucide-react';

interface GameOverProps {
  score: number;
  coins: number;
  onRestart: () => void;
  onHome: () => void;
}

export default function GameOver({ score, coins, onRestart, onHome }: GameOverProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4">
      <div className="bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-700 text-center p-8 animate-in slide-in-from-bottom-10 duration-500">
        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-2">
          FIM DE JOGO
        </h2>
        <p className="text-slate-400 mb-8 font-medium">Os vilões escaparam desta vez!</p>

        <div className="bg-slate-900/50 rounded-2xl p-6 mb-8 space-y-4 border border-slate-700/50">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-sm">Pontuação Final</span>
            <span className="text-3xl font-black text-white">{Math.floor(score)}</span>
          </div>
          <div className="h-px bg-slate-700/50 w-full"></div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-sm">Moedas Coletadas</span>
            <span className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
              <span>🪙</span> {coins}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-6 h-6" />
            <span className="text-xl">JOGAR NOVAMENTE</span>
          </button>
          
          <button
            onClick={onHome}
            className="w-full flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl transition-colors"
          >
            <Home className="w-6 h-6" />
            <span className="text-lg">MENU PRINCIPAL</span>
          </button>
        </div>
      </div>
    </div>
  );
}
