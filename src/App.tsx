import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import Store from './components/Store';
import GameCanvas from './components/GameCanvas';
import QuestionModal from './components/QuestionModal';
import GameOver from './components/GameOver';
import Leaderboard from './components/Leaderboard';
import { characters, Question } from './game/data';

type Screen = 'menu' | 'game' | 'store' | 'leaderboard';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [totalCoins, setTotalCoins] = useState(0);
  const [unlockedCharacters, setUnlockedCharacters] = useState<string[]>(['ladybug']);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('ladybug');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionAnswered, setQuestionAnswered] = useState<'correct' | 'incorrect' | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOverStats, setGameOverStats] = useState<{ score: number, coins: number } | null>(null);

  // Load saved data
  useEffect(() => {
    const savedCoins = localStorage.getItem('totalCoins');
    const savedChars = localStorage.getItem('unlockedCharacters');
    const savedSelected = localStorage.getItem('selectedCharacterId');
    
    if (savedCoins) setTotalCoins(parseInt(savedCoins, 10));
    if (savedChars) setUnlockedCharacters(JSON.parse(savedChars));
    if (savedSelected) setSelectedCharacterId(savedSelected);
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('totalCoins', totalCoins.toString());
    localStorage.setItem('unlockedCharacters', JSON.stringify(unlockedCharacters));
    localStorage.setItem('selectedCharacterId', selectedCharacterId);
  }, [totalCoins, unlockedCharacters, selectedCharacterId]);

  const handlePlay = () => {
    setScreen('game');
    setGameOverStats(null);
    setCurrentQuestion(null);
    setQuestionAnswered(null);
    setIsPaused(false);
  };

  const handleGameOver = (score: number, coins: number) => {
    setTotalCoins(prev => prev + coins);
    setGameOverStats({ score, coins });
    setIsPaused(true);
  };

  const handleQuestionTrigger = (question: Question) => {
    setCurrentQuestion(question);
    setIsPaused(true);
  };

  const handleQuestionAnswer = (isCorrect: boolean) => {
    setQuestionAnswered(isCorrect ? 'correct' : 'incorrect');
    setTimeout(() => {
      setCurrentQuestion(null);
      setQuestionAnswered(null);
      setIsPaused(false);
    }, 1000); // Small delay to show result before resuming
  };

  const handleUnlockCharacter = (id: string, cost: number) => {
    if (totalCoins >= cost && !unlockedCharacters.includes(id)) {
      setTotalCoins(prev => prev - cost);
      setUnlockedCharacters(prev => [...prev, id]);
    }
  };

  const selectedCharacter = characters.find(c => c.id === selectedCharacterId) || characters[0];

  return (
    <div className="w-full h-screen bg-slate-950 flex items-center justify-center font-sans overflow-hidden">
      <div className="relative w-full max-w-4xl h-full max-h-[800px] md:h-[600px] md:rounded-3xl shadow-2xl overflow-hidden bg-slate-900 border-4 border-slate-800">
        
        {screen === 'menu' && (
          <MainMenu 
            onPlay={handlePlay} 
            onStore={() => setScreen('store')} 
            onLeaderboard={() => setScreen('leaderboard')} 
            totalCoins={totalCoins} 
            difficulty={difficulty}
            onSelectDifficulty={setDifficulty}
          />
        )}

        {screen === 'store' && (
          <Store 
            onBack={() => setScreen('menu')} 
            totalCoins={totalCoins} 
            unlockedCharacters={unlockedCharacters} 
            selectedCharacterId={selectedCharacterId} 
            onSelectCharacter={setSelectedCharacterId} 
            onUnlockCharacter={handleUnlockCharacter} 
          />
        )}

        {screen === 'leaderboard' && (
          <Leaderboard onBack={() => setScreen('menu')} />
        )}

        {screen === 'game' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-800">
            <GameCanvas 
              character={selectedCharacter} 
              onGameOver={handleGameOver} 
              onQuestionTrigger={handleQuestionTrigger} 
              isPaused={isPaused} 
              questionAnswered={questionAnswered}
              onQuestionResolved={() => setQuestionAnswered(null)}
              difficulty={difficulty}
            />
            
            {/* Mobile Controls Hint */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-slate-400 text-sm opacity-50 pointer-events-none">
              Toque na metade superior para Pular • Toque na metade inferior para Deslizar
            </div>
            
            {currentQuestion && (
              <QuestionModal 
                question={currentQuestion} 
                onAnswer={handleQuestionAnswer} 
              />
            )}

            {gameOverStats && (
              <GameOver 
                score={gameOverStats.score} 
                coins={gameOverStats.coins} 
                onRestart={handlePlay} 
                onHome={() => setScreen('menu')} 
              />
            )}
          </div>
        )}

      </div>
    </div>
  );
}
