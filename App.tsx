
import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Share2, Trophy, Loader2, History, RotateCcw, Calendar } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Denomination, LuckHistory } from './types.ts';
import { generateLixiDeck, formatCurrency } from './utils.ts';
import { DENOMINATIONS, TETS_WISHES } from './constants.ts';
import Envelope from './components/Envelope.tsx';
import FortuneContainer from './components/FortuneContainer.tsx';
import ResultModal from './components/ResultModal.tsx';

const App = () => {
  const [deck, setDeck] = useState<Denomination[]>([]);
  const [openedId, setOpenedId] = useState<number | null>(null);
  const [currentResult, setCurrentResult] = useState<Denomination | null>(null);
  const [currentWish, setCurrentWish] = useState<string>("");
  const [showResultCard, setShowResultCard] = useState(false);
  const [wonAmount, setWonAmount] = useState<number | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [history, setHistory] = useState<LuckHistory[]>([]);
  
  const cardRef = useRef<HTMLDivElement>(null);

  // Khởi tạo deck và lấy lịch sử từ localStorage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('lixi_2026_history') || '[]');
    setHistory(savedHistory);

    const savedDeck = JSON.parse(localStorage.getItem('lixi_2026_deck') || 'null');
    if (savedDeck && savedDeck.length > 0) {
      setDeck(savedDeck);
    } else {
      const newDeck = generateLixiDeck();
      setDeck(newDeck);
      localStorage.setItem('lixi_2026_deck', JSON.stringify(newDeck));
    }
  }, []);

  const wonDenomination = wonAmount ? DENOMINATIONS.find(d => d.value === wonAmount) : null;

  const handleShakeComplete = useCallback(() => {
    if (openedId !== null || deck.length === 0) return;

    // Lấy một quẻ ngẫu nhiên từ deck (hoặc lấy cái đầu tiên vì deck đã được xáo trộn)
    const index = 0; 
    const result = deck[index];
    
    // Chọn một câu chúc ngẫu nhiên
    const randomWish = TETS_WISHES[Math.floor(Math.random() * TETS_WISHES.length)];
    setCurrentWish(randomWish);

    // Cập nhật deck mới (xóa quẻ vừa bốc)
    const newDeck = deck.filter((_, i) => i !== index);
    setDeck(newDeck);
    localStorage.setItem('lixi_2026_deck', JSON.stringify(newDeck));

    setOpenedId(index);
    setCurrentResult(result);
    setWonAmount(result.value);
    
    // Lưu vào lịch sử ngay khi bốc
    const newHistoryItem: LuckHistory = {
      id: Date.now().toString(),
      amount: result.value,
      timestamp: Date.now()
    };
    
    const updatedHistory = [newHistoryItem, ...history].slice(0, 50); // Tăng giới hạn lịch sử
    setHistory(updatedHistory);
    localStorage.setItem('lixi_2026_history', JSON.stringify(updatedHistory));

    // Sau khi bốc xong 500ms thì hiện thẻ kết quả chia sẻ
    setTimeout(() => {
      setShowResultCard(true);
    }, 500);
  }, [openedId, deck, history]);

  const handleReset = () => {
    setOpenedId(null);
    setCurrentResult(null);
    setCurrentWish("");
    setShowResultCard(false);
    setWonAmount(null);
    
    // Nếu hết quẻ thì tự động hồi phục pool mới
    if (deck.length === 0) {
      const newDeck = generateLixiDeck();
      setDeck(newDeck);
      localStorage.setItem('lixi_2026_deck', JSON.stringify(newDeck));
    }
  };

  const resetPool = () => {
    if (window.confirm("Bạn có muốn làm mới toàn bộ hủ quẻ (36 quẻ mới)?")) {
      const newDeck = generateLixiDeck();
      setDeck(newDeck);
      localStorage.setItem('lixi_2026_deck', JSON.stringify(newDeck));
      handleReset();
    }
  };

  const clearHistory = () => {
    if (window.confirm("Bạn có chắc muốn xóa lịch sử nhận lộc không?")) {
      setHistory([]);
      localStorage.removeItem('lixi_2026_history');
    }
  };

  const handleShare = async () => {
    if (!cardRef.current || isSharing) return;
    
    setIsSharing(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, 
        backgroundColor: '#fffcf5',
        useCORS: true,
        logging: false,
        allowTaint: true,
        y: -40 
      });

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png', 1.0));
      if (!blob) throw new Error('Không thể tạo ảnh');

      const file = new File([blob], `lixi-2026-${wonAmount}.png`, { type: 'image/png' });
      const shareData = {
        files: [file],
        title: 'Gieo Quẻ Bính Ngọ 2026',
        text: `🧧 Tớ vừa gieo được quẻ ${formatCurrency(wonAmount || 0)} lộc may mắn năm Bính Ngọ 2026! Mã Đáo Thành Công!`,
      };

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share(shareData);
      } else {
        throw new Error('Trình duyệt không hỗ trợ chia sẻ tệp trực tiếp');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        if (cardRef.current) {
          try {
            const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
            const link = document.createElement('a');
            link.download = `lixi-2026-${wonAmount}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            alert("Ảnh lộc đã được tải về máy. Hãy khoe với bạn bè nhé! 🧧");
          } catch (fallbackErr) {
            alert("Hãy chụp màn hình để khoe lộc nhé!");
          }
        }
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen pb-40 bg-[#fffcf5] relative overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed top-12 left-0 w-full pointer-events-none z-0 opacity-5 select-none overflow-hidden">
        <div className="text-6xl md:text-9xl animate-horse">🐎</div>
      </div>

      <header className="bg-red-700 text-yellow-400 py-6 md:py-10 px-4 shadow-2xl text-center relative z-10 border-b-[8px] border-yellow-500">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block mb-2 p-2 border-2 border-yellow-400 rounded-full bg-red-800"
          >
            <Trophy className="w-6 h-6 md:w-8 md:h-8" />
          </motion.div>
          <motion.h1 
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl sm:text-4xl md:text-6xl font-festive mb-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]"
          >
            Gieo Quẻ Bính Ngọ
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-block bg-yellow-400 text-red-800 px-4 py-0.5 rounded-full font-black text-xs md:text-lg uppercase tracking-[0.2em] shadow-lg"
          >
            Xuân 2026
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-6 md:mt-10 relative z-10 flex flex-col items-center">
        {!showResultCard ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center w-full max-w-4xl"
          >
            <div className="mb-16">
              <FortuneContainer 
                onShakeComplete={handleShakeComplete}
                disabled={openedId !== null || deck.length === 0}
              />
              <div className="mt-4 text-center">
                <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-xs font-bold border border-red-200">
                  Còn lại: {deck.length} quẻ trong hủ
                </span>
                {deck.length === 0 && (
                  <button 
                    onClick={resetPool}
                    className="ml-2 text-xs text-blue-600 font-bold underline"
                  >
                    Làm mới hủ
                  </button>
                )}
              </div>
            </div>
            
            {/* Lịch sử nhận lộc Section */}
            {history.length > 0 && (
              <div className="w-full max-w-2xl bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border-2 border-red-100 shadow-sm mb-12">
                <div className="flex items-center justify-between mb-6 border-b border-red-100 pb-4">
                  <div className="flex items-center gap-2 text-red-700 font-black uppercase tracking-wider text-sm md:text-base">
                    <History className="w-5 h-5" />
                    Lịch sử nhận lộc
                  </div>
                  <button 
                    onClick={clearHistory}
                    className="text-[10px] text-gray-400 font-bold hover:text-red-500 transition-colors uppercase"
                  >
                    Xóa tất cả
                  </button>
                </div>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {history.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-red-50/50 group hover:border-red-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-red-600 font-black text-lg">{formatCurrency(item.amount)}</span>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.timestamp).toLocaleTimeString('vi-VN')} - {new Date(item.timestamp).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-red-300">
                        🐎
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-red-800 font-bold italic text-xs md:text-sm animate-pulse text-center">
              🧧 Chúc mừng năm mới - Vạn sự hanh thông 🧧
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center max-w-md w-full px-2">
            <div ref={cardRef} className="w-full pt-10 pb-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center p-6 md:p-8 bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_25px_60px_-15px_rgba(185,28,28,0.4)] border-[6px] md:border-[8px] border-red-600 w-full text-center relative"
              >
                <div className="absolute top-4 right-4 opacity-10 text-2xl">🏮</div>
                <div className="absolute bottom-4 left-4 opacity-10 text-2xl">🏮</div>

                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-400 border-4 border-red-600 p-3 rounded-full shadow-lg z-20">
                  <span className="text-3xl block">🐎</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-festive text-red-600 mb-1 mt-6">Quẻ Lộc Đại Cát!</h2>
                <p className="text-gray-500 text-[10px] md:text-xs mb-6 font-semibold uppercase tracking-widest">Lộc Xuân Bính Ngọ 2026</p>
                
                {wonDenomination && (
                  <div className={`relative w-full mb-8 px-6 flex justify-center items-center h-32 md:h-40`}>
                    <div className="absolute inset-0 bg-black/5 blur-xl rounded-full scale-75"></div>
                    {wonAmount === 1000000 ? (
                      <div className="relative w-full h-full flex justify-center items-center">
                         <img 
                          src={wonDenomination.imageUrl} 
                          alt="Tờ 1"
                          crossOrigin="anonymous"
                          className="absolute w-4/5 h-auto rounded shadow-lg border border-white/50 z-10 -rotate-12 -translate-x-6 object-contain"
                        />
                         <img 
                          src={wonDenomination.imageUrl} 
                          alt="Tờ 2"
                          crossOrigin="anonymous"
                          className="absolute w-4/5 h-auto rounded shadow-xl border border-white/50 z-20 rotate-6 translate-x-6 object-contain"
                        />
                      </div>
                    ) : (
                      <motion.img 
                        initial={{ rotate: -1, y: 5, opacity: 0 }}
                        animate={{ rotate: 1, y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        src={wonDenomination.imageUrl} 
                        alt="Tiền lộc"
                        crossOrigin="anonymous"
                        className="relative w-full max-w-[280px] max-h-[120px] md:max-h-[150px] object-contain rounded-lg shadow-xl border-2 border-white/80 z-10 transform"
                      />
                    )}
                  </div>
                )}

                <div className="w-full bg-yellow-50 p-4 md:p-6 rounded-[2rem] border-2 border-yellow-200 flex flex-col items-center shadow-inner mb-6 relative group">
                  <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <motion.span 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-3xl md:text-5xl font-black text-red-600 drop-shadow-lg z-10"
                  >
                    {wonAmount ? formatCurrency(wonAmount) : "---"}
                  </motion.span>
                  <div className="mt-2 flex gap-2 z-10">
                    <Sparkles className="text-yellow-500 w-4 h-4 animate-spin-slow" />
                    <Sparkles className="text-yellow-500 w-4 h-4 animate-pulse" />
                  </div>
                </div>
                
                <p className="text-gray-400 text-[8px] md:text-[10px] font-black tracking-widest uppercase italic mb-2">🧧 Tấn Tài Tấn Lộc 🧧</p>
              </motion.div>
            </div>
            
            <div className="w-full mt-4 flex flex-col gap-3">
              <button 
                onClick={handleShare}
                disabled={isSharing}
                className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-yellow-400 font-black py-4 rounded-2xl transition-all shadow-[0_6px_0_0_#b91c1c] active:translate-y-1 active:shadow-none text-lg uppercase tracking-wider disabled:opacity-70 group"
              >
                {isSharing ? <Loader2 className="animate-spin w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                Khoe Lộc Ảnh May Mắn
              </button>
              
              <button 
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-red-800 font-black py-4 rounded-2xl transition-all shadow-[0_6px_0_0_#ca8a04] active:translate-y-1 active:shadow-none text-lg uppercase tracking-wider group"
              >
                <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                Gieo Quẻ Tiếp
              </button>

              <p className="text-gray-400 text-[10px] font-bold italic text-center px-4 mt-2">
                🧧 Mỗi bao lì xì là một niềm vui bất ngờ! 🧧
              </p>
            </div>
          </div>
        )}
      </main>

      <ResultModal 
        result={currentResult} 
        wish={currentWish}
        onClose={() => setCurrentResult(null)} 
      />

      <footer className="fixed bottom-0 left-0 w-full bg-red-700/95 backdrop-blur-md border-t-4 border-yellow-500 py-3 text-center text-yellow-400 font-black text-xs md:text-sm z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
        🧧 GIEO QUẺ BÍNH NGỌ 2026 - MÃ ĐÁO THÀNH CÔNG 🧧
      </footer>
    </div>
  );
};

export default App;
