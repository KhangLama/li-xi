
import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, Share2, Trophy, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Denomination, LuckHistory } from './types.ts';
import { generateLixiDeck, formatCurrency } from './utils.ts';
import { DENOMINATIONS } from './constants.ts';
import Envelope from './components/Envelope.tsx';
import ResultModal from './components/ResultModal.tsx';

const App = () => {
  const [deck, setDeck] = useState<Denomination[]>([]);
  const [openedId, setOpenedId] = useState<number | null>(null);
  const [currentResult, setCurrentResult] = useState<Denomination | null>(null);
  const [isPermanentlyOpened, setIsPermanentlyOpened] = useState(false);
  const [wonAmount, setWonAmount] = useState<number | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

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

  const wonDenomination = wonAmount ? DENOMINATIONS.find(d => d.value === wonAmount) : null;

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
    if (!cardRef.current || isSharing) return;
    
    setIsSharing(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, 
        backgroundColor: '#fffcf5',
        useCORS: true,
        logging: false,
        allowTaint: true,
        y: -40 // Bù đắp phần âm của logo để chụp trọn vẹn
      });

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png', 1.0));
      if (!blob) throw new Error('Không thể tạo ảnh');

      const file = new File([blob], `lixi-2026-${wonAmount}.png`, { type: 'image/png' });
      const shareData = {
        files: [file],
        title: 'Lì Xì Bính Ngọ 2026',
        text: `🧧 Tớ vừa bốc được ${formatCurrency(wonAmount || 0)} lộc may mắn năm Bính Ngọ 2026! Mã Đáo Thành Công!`,
      };

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share(shareData);
      } else {
        throw new Error('Trình duyệt không hỗ trợ chia sẻ tệp trực tiếp');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Người dùng đã hủy chia sẻ');
      } else {
        console.error('Lỗi chia sẻ:', err);
        if (cardRef.current) {
            try {
                const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
                const link = document.createElement('a');
                link.download = `lixi-2026-${wonAmount}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                alert("Ảnh lộc đã được tải về máy. Hãy đăng lên Facebook/Zalo để khoe với bạn bè nhé! 🧧");
            } catch (fallbackErr) {
                alert("Có lỗi xảy ra khi tạo ảnh chia sẻ. Bạn hãy chụp màn hình để khoe nhé!");
            }
        }
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-[#fffcf5] relative overflow-x-hidden">
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
            Lì Xì Bính Ngọ
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
        {!isPermanentlyOpened ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center w-full max-w-4xl"
          >
            <div className="mb-8 flex items-center gap-3 text-white bg-red-600 px-6 py-3 rounded-2xl border-2 border-yellow-400 shadow-[0_4px_0_0_#b91c1c] transition-all text-center">
              <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
              <span className="font-black uppercase text-sm md:text-lg tracking-tight">Chọn lộc duy nhất 1 lần</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-10 place-items-center">
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
            
            <p className="mt-12 text-red-800 font-bold italic text-xs md:text-sm animate-pulse text-center">
              🧧 Chúc mừng năm mới - Vạn sự hanh thông 🧧
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center max-w-md w-full px-2">
            {/* Wrap card in a container to handle overflow for the top logo and cardRef capture */}
            <div ref={cardRef} className="w-full pt-10 pb-4">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center p-6 md:p-8 bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_25px_60px_-15px_rgba(185,28,28,0.4)] border-[6px] md:border-[8px] border-red-600 w-full text-center relative"
              >
                {/* Decoration items inside, lanterns can overflow slightly without hidden container */}
                <div className="absolute top-4 right-4 opacity-10 text-2xl">🏮</div>
                <div className="absolute bottom-4 left-4 opacity-10 text-2xl">🏮</div>

                {/* Hanging Logo - Ensure it's not cut off by removing overflow-hidden above */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-400 border-4 border-red-600 p-3 rounded-full shadow-lg z-20">
                  <span className="text-3xl block">🐎</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-festive text-red-600 mb-1 mt-6">Mã Đáo Thành Công!</h2>
                <p className="text-gray-500 text-[10px] md:text-xs mb-6 font-semibold uppercase tracking-widest">Lộc Xuân Bính Ngọ 2026</p>
                
                {wonDenomination && (
                  <div className="relative w-full mb-8 px-6 flex justify-center">
                    <div className="absolute inset-0 bg-black/5 blur-xl rounded-full scale-75"></div>
                    <motion.img 
                      initial={{ rotate: -1, y: 5, opacity: 0 }}
                      animate={{ rotate: 1, y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      src={wonDenomination.imageUrl} 
                      alt="Tiền lộc"
                      crossOrigin="anonymous"
                      className="relative w-full max-w-[280px] max-h-[120px] md:max-h-[150px] object-contain rounded-lg shadow-xl border-2 border-white/80 z-10 transform"
                    />
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
            
            <div className="w-full mt-4 flex flex-col items-center gap-4">
              <button 
                onClick={handleShare}
                disabled={isSharing}
                className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-yellow-400 font-black py-4 md:py-5 rounded-2xl transition-all shadow-[0_6px_0_0_#b91c1c] active:translate-y-1 active:shadow-none text-lg md:text-xl uppercase tracking-wider disabled:opacity-70 group"
              >
                {isSharing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Đang tạo ảnh lộc...
                  </>
                ) : (
                  <>
                    <Share2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    Khoe Lộc Ảnh May Mắn
                  </>
                )}
              </button>
              <p className="text-gray-400 text-[10px] font-bold italic text-center px-4 leading-relaxed">
                {isSharing ? "Chúng tôi đang chụp lại kết quả may mắn của bạn." : "Nhấn để tạo ảnh và chia sẻ niềm vui xuân mới!"}
              </p>
            </div>
          </div>
        )}
      </main>

      <ResultModal result={currentResult} onClose={() => setCurrentResult(null)} />

      <footer className="fixed bottom-0 left-0 w-full bg-red-700/95 backdrop-blur-md border-t-4 border-yellow-500 py-3 text-center text-yellow-400 font-black text-xs md:text-sm z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
        🧧 XUÂN BÍNH NGỌ 2026 - MÃ ĐÁO THÀNH CÔNG 🧧
      </footer>
    </div>
  );
};

export default App;
