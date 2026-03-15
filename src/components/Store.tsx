import React from 'react';
import { ArrowLeft, Lock, Unlock } from 'lucide-react';
import { Character, characters } from '../game/data';

interface StoreProps {
  onBack: () => void;
  totalCoins: number;
  unlockedCharacters: string[];
  selectedCharacterId: string;
  onSelectCharacter: (id: string) => void;
  onUnlockCharacter: (id: string, cost: number) => void;
}

export default function Store({
  onBack,
  totalCoins,
  unlockedCharacters,
  selectedCharacterId,
  onSelectCharacter,
  onUnlockCharacter
}: StoreProps) {
  return (
    <div className="flex flex-col h-full bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between p-6 bg-slate-800 border-b border-slate-700">
        <button
          onClick={onBack}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          LOJA DE HERÓIS
        </h2>
        <div className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full font-bold flex items-center space-x-2 border border-yellow-500/30">
          <span>🪙</span>
          <span>{totalCoins}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {characters.map((char) => {
            const isUnlocked = unlockedCharacters.includes(char.id);
            const isSelected = selectedCharacterId === char.id;
            const canAfford = totalCoins >= char.cost;

            return (
              <div
                key={char.id}
                className={`relative flex flex-col p-6 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? 'border-green-500 bg-slate-800 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                    : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: char.color }}>{char.name}</h3>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{char.theme}</p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-full shadow-inner flex items-center justify-center text-3xl"
                    style={{ backgroundColor: char.color }}
                  >
                    {isUnlocked ? char.emoji : '🔒'}
                  </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl mb-6 flex-1">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    <span className="font-bold text-white">Poder:</span> {char.powerDescription}
                  </p>
                </div>

                {isUnlocked ? (
                  <button
                    onClick={() => onSelectCharacter(char.id)}
                    disabled={isSelected}
                    className={`w-full py-3 rounded-xl font-bold text-lg transition-colors ${
                      isSelected
                        ? 'bg-green-500 text-white cursor-default'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {isSelected ? 'SELECIONADO' : 'SELECIONAR'}
                  </button>
                ) : (
                  <button
                    onClick={() => onUnlockCharacter(char.id, char.cost)}
                    disabled={!canAfford}
                    className={`w-full py-3 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-colors ${
                      canAfford
                        ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-900'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Unlock className="w-5 h-5" />
                    <span>DESBLOQUEAR ({char.cost} 🪙)</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
