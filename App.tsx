
import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, Share2, Trophy } from 'lucide-react';
import { Denomination, LuckHistory } from './types.ts';
import { generateLixiDeck, formatCurrency } from './utils.ts';
import Envelope from './components/Envelope.tsx';
import ResultModal from './components/ResultModal.tsx';

const App: React.FC = () => {
  const [deck, setDeck] = useState<Denomination[]>([]);
  const [openedId, setOpenedId] = useState<number | null>(null);
  const [currentResult, setCurrentResult] = useState<Denomination | null>(null);
  const [isPermanentlyOpened, setIsPermanentlyOpened] = useState(false);
  const [wonAmount, setWonAmount] = useState<number | null>(null);

  useEffect(() => {
    const savedOpenedStatus = localStorage.getItem('lixi_2026_opened');
    const savedWonAmount = localStorage.getItem('lixi_2026_amount');
    
    if (savedOpenedStatus === 'true') {
      setIsPermanentlyOpened(true);
      if (savedWonAmount) setWonAmount(Number(savedWonAmount));
    } else {
      setDeck(generateLixiDeck());
    }
  }, []);

  const handleOpenEnvelope = useCallback((index: number) => {
    if (isPermanentlyOpened || openedId !== null) return;

    const result = deck[index];
    setOpenedId(index);
    setCurrentResult(result);
    setWonAmount(result.value);
    setIsPermanentlyOpened(true);

    localStorage.setItem('lixi_2026_opened', 'true');
    localStorage.setItem('lixi_2026_amount', result.value.toString());
    
    const historyItem: LuckHistory = {
      id: Date.now().toString(),
      amount: result.value,
      timestamp: Date.now()
    };
    const savedHistory = JSON.parse(localStorage.getItem('lixi_2026_history') || '[]');
    localStorage.setItem('lixi_2026_history', JSON.stringify([historyItem, ...savedHistory]));
  }, [openedId, isPermanentlyOpened, deck]);

  const handleShare = async () => {
    const shareText = `🧧 Tớ vừa bốc được ${formatCurrency(wonAmount || 0)} lộc may mắn năm Bính Ngọ 2026! Mã Đáo Thành Công! Thử vận may của bạn tại đây:`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Lì Xì Bính Ngọ 2026',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
      window.open(fbUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[#fffcf5] relative overflow-hidden">
      <div className="fixed top-12 left-0 w-full pointer-events-none z-0 opacity-10 select-none">
        <div className="text-6xl md:text-8xl animate-horse">🐎</div>
      </div>

      <div className="fixed inset-0 pointer-events-none z-0 opacity-10 md:opacity-20">
        <div className="absolute top-4 left-4 text-4xl md:text-6xl">🏮</div>
        <div className="absolute top-4 right-4 text-4xl md:text-6xl">🏮</div>
        <div className="absolute bottom-24 left-4 text-4xl md:text-6xl">🧨</div>
        <div className="absolute bottom-24 right-4 text-4xl md:text-6xl">🧨</div>
      </div>

      <header className="bg-red-700 text-yellow-400 py-10 md:py-20 px-4 shadow-2xl text-center relative z-10 border-b-[6px] md:border-b-[10px] border-yellow-500">
        <div className="container mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block mb-3 p-3 md:p-4 border-2 md:border-4 border-yellow-400 rounded-full bg-red-800"
          >
            <Trophy className="w-8 h-8 md:w-16 md:h-16" />
          </motion.div>
          <motion.h1 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl sm:text-6xl md:text-9xl font-festive mb-2 md:mb-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]"
          >
            Lì Xì Bính Ngọ
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-block bg-yellow-400 text-red-800 px-4 md:px-6 py-1 rounded-full font-black text-sm md:text-2xl uppercase tracking-[0.1em] md:tracking-[0.2em] shadow-lg"
          >
            Xuân 2026
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8 md:mt-12 relative z-10 flex flex-col items-center">
        {!isPermanentlyOpened ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center w-full"
          >
            <div className="mb-8 md:mb-12 flex items-center gap-3 md:gap-4 text-white bg-red-600 px-6 md:px-10 py-3 md:py-5 rounded-2xl md:rounded-3xl border-2 md:border-4 border-yellow-400 shadow-[0_6px_0_0_#b91c1c] active:shadow-none active:translate-y-1 transition-all text-center">
              <AlertCircle className="w-5 h-5 md:w-8 md:h-8 text-yellow-400 shrink-0" />
              <span className="font-black uppercase text-base md:text-3xl tracking-tight">Chọn lộc duy nhất 1 lần</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-12 max-w-5xl place-items-center">
              {deck.map((_, index) => (
                <Envelope 
                  key={index} 
                  id={index} 
                  onClick={() => handleOpenEnvelope(index)} 
                  isOpened={false}
                  disabled={false}
                />
              ))}
            </div>
            
            <p className="mt-8 md:mt-12 text-red-800 font-bold italic text-sm md:text-base animate-pulse text-center px-4">
              * Ghi chú: 1 triệu và 500k cực hiếm, chỉ xuất hiện 1 lần trong bộ 9 bao!
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center p-6 md:p-14 bg-white rounded-[2rem] md:rounded-[4rem] shadow-[0_20px_40px_-15px_rgba(185,28,28,0.3)] border-[8px] md:border-[15px] border-red-600 max-w-2xl w-full text-center relative"
          >
            <div className="absolute -top-10 md:-top-16 bg-yellow-400 border-4 md:border-8 border-red-600 p-4 md:p-6 rounded-full shadow-2xl">
              <span className="text-4xl md:text-6xl">🐎</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-festive text-red-600 mb-4 md:mb-6 mt-4 md:mt-6">Mã Đáo Thành Công!</h2>
            <p className="text-gray-600 text-base md:text-xl mb-8 md:mb-12 font-medium max-w-md mx-auto leading-relaxed">
              Bạn đã nhận lộc may mắn đầu năm Bính Ngọ. Chúc bạn một năm mới vạn sự hanh thông!
            </p>
            
            <div className="w-full bg-yellow-50 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-2 md:border-4 border-yellow-200 flex flex-col items-center shadow-inner mb-8 md:mb-12 relative overflow-hidden">
              <span className="text-gray-400 text-[10px] md:text-sm uppercase font-black tracking-[0.2em] md:tracking-[0.4em] mb-2 md:mb-4 relative z-10">Lộc Xuân 2026</span>
              <motion.span 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-4xl md:text-7xl font-black text-red-600 drop-shadow-xl relative z-10 whitespace-nowrap"
              >
                {wonAmount ? formatCurrency(wonAmount) : "---"}
              </motion.span>
              <div className="mt-4 md:mt-6 flex gap-3 relative z-10">
                <Sparkles className="text-yellow-500 w-5 h-5 md:w-8 md:h-8 animate-spin-slow" />
                <Sparkles className="text-yellow-500 w-5 h-5 md:w-8 md:h-8 animate-pulse" />
              </div>
            </div>
            
            <div className="w-full">
              <button 
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-yellow-400 font-black py-5 md:py-7 rounded-2xl md:rounded-[2rem] transition-all shadow-[0_6px_0_0_#b91c1c] active:translate-y-1 active:shadow-none text-xl md:text-2xl uppercase tracking-wider"
              >
                <Share2 className="w-7 h-7 md:w-9 md:h-9" />
                Khoe Lộc Với Bạn Bè
              </button>
              <p className="mt-4 text-gray-400 text-xs font-bold italic text-center">Nhấn để chia sẻ niềm vui đầu năm!</p>
            </div>
          </motion.div>
        )}
      </main>

      <ResultModal result={currentResult} onClose={() => setCurrentResult(null)} />

      <footer className="fixed bottom-0 left-0 w-full bg-red-700/95 backdrop-blur-sm border-t-4 md:border-t-8 border-yellow-500 py-3 md:py-6 text-center text-yellow-400 font-black text-sm md:text-xl z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
        🧧 XUÂN BÍNH NGỌ 2026 - VẠN SỰ NHƯ Ý 🧧
      </footer>
    </div>
  );
};

export default App;
