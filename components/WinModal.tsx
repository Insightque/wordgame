import React from 'react';

interface WinModalProps {
  gameStatus: 'intro' | 'playing' | 'won' | 'lost';
  score: number;
  onNextLevel: () => void;
  onRetry: () => void;
  onHome: () => void;
}

const WinModal: React.FC<WinModalProps> = ({ gameStatus, score, onNextLevel, onRetry, onHome }) => {
  if (gameStatus === 'playing' || gameStatus === 'intro') return null;

  const isVictory = gameStatus === 'won';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-cute-sky/80 backdrop-blur-sm p-4 animate-in fade-in duration-300 font-jua">
      <div className="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-2xl border-4 border-cute-pink flex flex-col items-center text-center transform transition-all scale-100 relative overflow-hidden">
        
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-4 bg-cute-pink/20"></div>

        <div className="text-7xl mb-4 animate-bounce">
          {isVictory ? '🎉' : '💧'}
        </div>

        <h2 className={`text-3xl mb-2 ${isVictory ? 'text-pink-500' : 'text-blue-400'}`}>
          {isVictory ? '성공했어요!' : '아쉬워요!'}
        </h2>
        
        <p className="mb-8 text-gray-500 text-lg leading-relaxed">
          {isVictory 
            ? `모든 짝꿍을 찾았습니다!\n남은 턴: ${score}` 
            : '턴이 부족해서 실패했어요.\n다시 도전해볼까요?'}
        </p>

        <div className="w-full flex gap-3">
          <button 
            onClick={onHome}
            className="flex-1 py-3 rounded-2xl font-bold text-white shadow-md bg-gray-300 hover:bg-gray-400 transition-transform active:scale-95"
          >
            처음으로
          </button>
          
          {isVictory ? (
            <button 
              onClick={onNextLevel}
              className="flex-1 py-3 rounded-2xl font-bold text-white shadow-md bg-cute-pink hover:bg-pink-300 transition-transform active:scale-95"
            >
              다음 레벨
            </button>
          ) : (
            <button 
              onClick={onRetry}
              className="flex-1 py-3 rounded-2xl font-bold text-white shadow-md bg-blue-400 hover:bg-blue-500 transition-transform active:scale-95"
            >
              다시하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WinModal;