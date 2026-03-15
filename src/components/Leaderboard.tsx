import React from 'react';
import { ArrowLeft, Trophy, Medal } from 'lucide-react';

interface LeaderboardProps {
  onBack: () => void;
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  // Placeholder data
  const mockScores = [
    { name: 'Heroína123', score: 15400 },
    { name: 'GatoNinja', score: 12250 },
    { name: 'RaposaVeloz', score: 9800 },
    { name: 'TartarugaMestre', score: 8500 },
    { name: 'AbelhaRainha', score: 7200 },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between p-6 bg-slate-800 border-b border-slate-700">
        <button
          onClick={onBack}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          RANKING
        </h2>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {mockScores.map((entry, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  idx === 0 ? 'bg-yellow-500 text-yellow-900' :
                  idx === 1 ? 'bg-slate-300 text-slate-800' :
                  idx === 2 ? 'bg-amber-600 text-amber-100' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {idx + 1}
                </div>
                <span className="font-bold text-xl">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {entry.score}
                </span>
                <span className="text-slate-500 text-sm font-bold uppercase">Pts</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center text-slate-500 text-sm">
          Conecte-se para salvar sua pontuação no ranking global! (Em breve)
        </div>
      </div>
    </div>
  );
}
