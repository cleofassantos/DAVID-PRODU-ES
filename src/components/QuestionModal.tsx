import React, { useState } from 'react';
import { Question } from '../game/data';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuestionModalProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuestionModal({ question, onAnswer }: QuestionModalProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleSelect = (idx: number) => {
    if (isRevealed) return;
    setSelectedIdx(idx);
    setIsRevealed(true);

    const isCorrect = idx === question.correctAnswerIndex;
    
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1500);
  };

  const subjectColors = {
    math: 'bg-blue-500',
    portuguese: 'bg-green-500',
    science: 'bg-purple-500',
    history: 'bg-amber-600'
  };

  const subjectNames = {
    math: 'Matemática',
    portuguese: 'Português',
    science: 'Ciências',
    history: 'História'
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 animate-in zoom-in duration-300">
        <div className={`${subjectColors[question.subject]} p-6 text-white text-center`}>
          <span className="uppercase tracking-widest text-sm font-bold opacity-80">
            Desafio de {subjectNames[question.subject]}
          </span>
          <h2 className="text-2xl md:text-3xl font-black mt-2 leading-tight">
            {question.text}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {question.options.map((opt, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 font-bold text-lg transition-all ";
            let icon = null;

            if (!isRevealed) {
              btnClass += "border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700";
            } else {
              if (idx === question.correctAnswerIndex) {
                btnClass += "border-green-500 bg-green-100 text-green-800";
                icon = <CheckCircle2 className="w-6 h-6 text-green-600" />;
              } else if (idx === selectedIdx) {
                btnClass += "border-red-500 bg-red-100 text-red-800";
                icon = <XCircle className="w-6 h-6 text-red-600" />;
              } else {
                btnClass += "border-slate-200 bg-slate-50 text-slate-400 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isRevealed}
                className={btnClass + " flex items-center justify-between"}
              >
                <span>{opt}</span>
                {icon}
              </button>
            );
          })}
        </div>
        
        {isRevealed && (
          <div className={`p-4 text-center font-bold text-lg ${selectedIdx === question.correctAnswerIndex ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
            {selectedIdx === question.correctAnswerIndex ? 'Resposta Correta! +Poder' : 'Resposta Incorreta!'}
          </div>
        )}
      </div>
    </div>
  );
}
