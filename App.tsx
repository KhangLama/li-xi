
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Coins, Gift, Sparkles, X, AlertCircle, Share2 } from 'lucide-react';
import { Denomination, LuckHistory } from './types';
import { getRandomDenomination, formatCurrency } from './utils';
import Envelope from './components/Envelope';
import ResultModal from './components/ResultModal';

const App: React.FC = () => {
  const [envelopes] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [openedId, setOpenedId] = useState<number | null>(null);
  const [currentResult, setCurrentResult] = useState<Denomination | null>(null);
  const [history, setHistory] = useState<LuckHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [totalLuck, setTotalLuck] = useState(0);
  const [isPermanentlyOpened, setIsPermanentlyOpened] = useState(false);

  // Xác định các mệnh giá lớn đã từng trúng để loại bỏ khỏi pool vĩnh viễn
  const wonGrandPrizes = useMemo(() => {
    const grandValues = [500000, 1000000];
    return history
      .filter(h => grandValues.includes(h.amount))
      .map(h => h.amount);
  }, [history]);

  // Khởi tạo và kiểm tra trạng thái từ localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('tet_lixi_history');
    const savedOpenedStatus = localStorage.getItem('tet_lixi_opened_status');
    
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
        const total = parsed.reduce((acc: number, item: LuckHistory) => acc + item.amount, 0);
        setTotalLuck(total);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    if (savedOpenedStatus === 'true') {
      setIsPermanentlyOpened(true);
    }
  }, []);

  const handleOpenEnvelope = useCallback((id: number) => {
    // Nếu đã mở rồi thì không cho mở thêm (bảo vệ bằng cả state và localStorage)
    if (isPermanentlyOpened || openedId !== null) return;

    // Lấy mệnh giá, loại trừ các mệnh giá lớn đã trúng trước đó
    const result = getRandomDenomination(wonGrandPrizes);
    
    setOpenedId(id);
    setCurrentResult(result);
    setIsPermanentlyOpened(true);

    const newHistoryItem: LuckHistory = {
      id: Math.random().toString(36).substr(2, 9),
      amount: result.value,
      timestamp: Date.now()
    };

    const newHistory = [newHistoryItem, ...history];
    setHistory(newHistory);
    setTotalLuck(prev => prev + result.value);
    
    // Lưu vĩnh viễn
    localStorage.setItem('tet_lixi_history', JSON.stringify(newHistory));
    localStorage.setItem('tet_lixi_opened_status', 'true');
  }, [openedId, history, wonGrandPrizes, isPermanentlyOpened]);

  return (
    <div className="min-h-screen pb-20 bg-[#fff5f5] relative overflow-hidden">
      {/* Cành đào trang trí */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-15">
        <div className="absolute top-10 left-10 text-6xl animate-pulse">🏮</div>
        <div className="absolute bottom-20 right-10 text-6xl animate-pulse delay-700">🏮</div>
        <div className="absolute top-1/2 left-1/4 text-4xl animate-bounce">🌸</div>
        <div className="absolute top-1/3 right-1/4 text-5xl animate-bounce delay-300">🍑</div>
      </div>

      <header className="bg-red-600 text-yellow-400 py-12 px-4 shadow-lg text-center relative z-10">
        <div className="container mx-auto">
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-festive mb-4 drop-shadow-md"
          >
            Lộc Xuân Ất Tỵ
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl font-bold tracking-[0.2em] uppercase opacity-90"
          >
            {isPermanentlyOpened ? "Lộc May Mắn Của Bạn" : "Chọn 1 Bao Lì Xì Duy Nhất"}
          </motion.p>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-12 relative z-10 flex flex-col items-center">
        {!isPermanentlyOpened ? (
          <>
            <div className="mb-10 flex items-center gap-3 text-red-700 bg-yellow-400/20 px-6 py-3 rounded-2xl border-2 border-yellow-400 animate-pulse shadow-lg">
              <AlertCircle className="w-6 h-6" />
              <span className="font-black uppercase text-lg tracking-tight">Cơ hội chỉ đến 1 lần! Hãy chọn thật kỹ</span>
            </div>

            {/* Game Area */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6 md:gap-10">
              {envelopes.map((id) => (
                <Envelope 
                  key={id} 
                  id={id} 
                  onClick={handleOpenEnvelope} 
                  isOpened={false}
                  disabled={false}
                />
              ))}
            </div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center p-8 bg-white rounded-[3rem] shadow-2xl border-4 border-red-600 max-w-lg w-full"
          >
            <div className="text-6xl mb-4">🧧</div>
            <h2 className="text-3xl font-bold text-red-600 mb-2">Bạn đã nhận lộc!</h2>
            <p className="text-gray-500 mb-8 text-center italic">Chúc bạn một năm mới an khang thịnh vượng, vạn sự như ý.</p>
            
            <div className="w-full space-y-4">
              {history.length > 0 && (
                <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-100 flex flex-col items-center">
                  <span className="text-gray-400 text-sm uppercase font-bold tracking-widest mb-1">Mệnh giá đã nhận</span>
                  <span className="text-4xl font-black text-red-600">{formatCurrency(history[0].amount)}</span>
                </div>
              )}
              
              <button 
                onClick={() => setShowHistory(true)}
                className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-yellow-400 font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95"
              >
                <History className="w-6 h-6" />
                Xem lịch sử nhận lộc
              </button>

              <button 
                onClick={() => alert("Chụp màn hình để khoe lộc với bạn bè nhé!")}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-2xl transition-all shadow-md border border-gray-200 active:scale-95"
              >
                <Share2 className="w-6 h-6" />
                Chia sẻ niềm vui
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Result Modal - Chỉ hiện lần đầu khi vừa bốc xong */}
      <ResultModal result={currentResult} onClose={() => setCurrentResult(null)} />

      {/* History Slide-over */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-[60] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowHistory(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="bg-red-600 p-6 text-white flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3">
                  <Gift className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-bold">Lịch sử Lộc Xuân</h3>
                </div>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-red-700 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {history.map((item) => (
                    <div key={item.id} className={`flex justify-between items-center p-4 rounded-xl border ${item.amount >= 500000 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-100'}`}>
                      <div>
                        <p className={`font-bold text-lg ${item.amount >= 500000 ? 'text-yellow-700' : 'text-gray-800'}`}>
                          {formatCurrency(item.amount)}
                          {item.amount >= 500000 && <span className="ml-2 text-sm bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">ĐẶC BIỆT</span>}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(item.timestamp).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                        🧧
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium text-lg">Tổng tích lộc:</span>
                  <span className="text-3xl font-black text-red-600">{formatCurrency(totalLuck)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-200 py-4 text-center text-gray-500 font-bold text-sm z-40">
        🧧 Xuân Ất Tỵ 2025 - Chúc mừng năm mới 🧧
      </footer>
    </div>
  );
};

export default App;
