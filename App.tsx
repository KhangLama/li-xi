
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { History, Coins, Gift, Sparkles, AlertCircle, Share2, Camera } from 'lucide-react';
import { Denomination, LuckHistory } from './types';
import { generateLixiDeck, formatCurrency } from './utils';
import Envelope from './components/Envelope';
import ResultModal from './components/ResultModal';

const App: React.FC = () => {
  // Trạng thái bộ bài hiện tại (chỉ tạo 1 lần nếu chưa bốc)
  const [deck, setDeck] = useState<Denomination[]>([]);
  const [openedId, setOpenedId] = useState<number | null>(null);
  const [currentResult, setCurrentResult] = useState<Denomination | null>(null);
  const [history, setHistory] = useState<LuckHistory[]>([]);
  const [isPermanentlyOpened, setIsPermanentlyOpened] = useState(false);
  const [wonAmount, setWonAmount] = useState<number | null>(null);

  // Khởi tạo và kiểm tra trạng thái từ localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('tet_lixi_history');
    const savedOpenedStatus = localStorage.getItem('tet_lixi_opened_status');
    const savedWonAmount = localStorage.getItem('tet_lixi_won_amount');
    
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    if (savedOpenedStatus === 'true') {
      setIsPermanentlyOpened(true);
      if (savedWonAmount) setWonAmount(Number(savedWonAmount));
    } else {
      // Nếu chưa bốc, tạo bộ bài mới
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

    const newHistoryItem: LuckHistory = {
      id: Math.random().toString(36).substr(2, 9),
      amount: result.value,
      timestamp: Date.now()
    };

    // Lưu vào lịch sử và khóa trạng thái
    const newHistory = [newHistoryItem, ...history];
    localStorage.setItem('tet_lixi_history', JSON.stringify(newHistory));
    localStorage.setItem('tet_lixi_opened_status', 'true');
    localStorage.setItem('tet_lixi_won_amount', result.value.toString());
    setHistory(newHistory);
  }, [openedId, history, isPermanentlyOpened, deck]);

  return (
    <div className="min-h-screen pb-20 bg-[#fff5f5] relative overflow-hidden selection:bg-red-200">
      {/* Cành đào trang trí nền */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
        <div className="absolute top-10 left-10 text-6xl animate-pulse">🏮</div>
        <div className="absolute bottom-20 right-10 text-6xl animate-pulse delay-700">🏮</div>
        <div className="absolute top-1/4 right-10 text-4xl animate-bounce">🌸</div>
        <div className="absolute bottom-1/4 left-10 text-5xl animate-bounce delay-300">🍑</div>
      </div>

      <header className="bg-red-600 text-yellow-400 py-16 px-4 shadow-2xl text-center relative z-10 border-b-8 border-yellow-500">
        <div className="container mx-auto">
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-9xl font-festive mb-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
          >
            Lì Xì Tết 2025
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-3xl font-black tracking-[0.3em] uppercase opacity-95 drop-shadow-sm"
          >
            {isPermanentlyOpened ? "Lộc Xuân Của Bạn" : "Một Lần Duy Nhất - Vạn Sự Như Ý"}
          </motion.p>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-12 relative z-10 flex flex-col items-center">
        {!isPermanentlyOpened ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="mb-12 flex items-center gap-4 text-red-700 bg-yellow-400 px-8 py-4 rounded-full border-4 border-red-600 shadow-xl animate-bounce">
              <AlertCircle className="w-8 h-8" />
              <span className="font-black uppercase text-xl md:text-2xl">Hãy chọn 1 bao lì xì may mắn!</span>
            </div>

            {/* Deck Area */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-12 max-w-4xl">
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
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center p-10 md:p-16 bg-white rounded-[4rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border-[12px] border-red-600 max-w-2xl w-full text-center relative"
          >
            <div className="absolute -top-12 bg-yellow-400 border-4 border-red-600 p-4 rounded-full shadow-lg">
              <Gift className="w-12 h-12 text-red-600" />
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-red-600 mb-4 mt-4">Chúc Mừng Năm Mới!</h2>
            <p className="text-gray-500 text-lg md:text-xl mb-10 italic max-w-md mx-auto">
              Bạn đã nhận được lộc xuân đầu năm. Chúc bạn một năm mới bình an, hạnh phúc và phát tài!
            </p>
            
            <div className="w-full bg-red-50 p-10 rounded-[3rem] border-4 border-red-100 flex flex-col items-center shadow-inner mb-10">
              <span className="text-gray-400 text-sm uppercase font-black tracking-[0.2em] mb-4">Mệnh giá lộc của bạn</span>
              <motion.span 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-5xl md:text-7xl font-black text-red-600 drop-shadow-sm"
              >
                {wonAmount ? formatCurrency(wonAmount) : "---"}
              </motion.span>
              <div className="mt-6 flex gap-2">
                <Sparkles className="text-yellow-500 w-6 h-6 animate-spin-slow" />
                <Sparkles className="text-yellow-500 w-6 h-6 animate-pulse" />
                <Sparkles className="text-yellow-500 w-6 h-6 animate-bounce" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <button 
                onClick={() => alert("Chụp màn hình lại để khoe lộc với mọi người nhé! 📸")}
                className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-yellow-400 font-black py-5 rounded-3xl transition-all shadow-xl active:scale-95 text-xl"
              >
                <Camera className="w-6 h-6" />
                Lưu làm kỷ niệm
              </button>
              
              <button 
                onClick={() => alert("Chúc mừng năm mới 2025! App được thiết kế để mỗi người chỉ bốc 1 lần duy nhất.")}
                className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-black py-5 rounded-3xl transition-all shadow-lg border-2 border-gray-100 active:scale-95 text-xl"
              >
                <Share2 className="w-6 h-6" />
                Gửi lời chúc
              </button>
            </div>

            <p className="mt-8 text-xs text-gray-400 uppercase font-bold tracking-widest opacity-50">
              Mỗi trình duyệt chỉ được tham gia 1 lần duy nhất
            </p>
          </motion.div>
        )}
      </main>

      {/* Kết quả hiện ra ngay khi vừa bấm */}
      <ResultModal result={currentResult} onClose={() => setCurrentResult(null)} />

      <footer className="fixed bottom-0 left-0 w-full bg-red-600/90 backdrop-blur-md border-t-4 border-yellow-500 py-4 text-center text-yellow-400 font-black text-sm md:text-base z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
        🧧 XUÂN ẤT TỴ 2025 - AN KHANG THỊNH VƯỢNG 🧧
      </footer>
    </div>
  );
};

export default App;
