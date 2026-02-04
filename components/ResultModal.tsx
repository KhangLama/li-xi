
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Denomination } from '../types';
import { formatCurrency } from '../utils';
import { TETS_WISHES } from '../constants';
import Fireworks from './Fireworks';
import { Trophy, CheckCircle, X, ImageOff, Sparkles } from 'lucide-react';

interface ResultModalProps {
  result: Denomination | null;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  const [imgError, setImgError] = useState(false);
  
  if (!result) return null;

  const randomWish = TETS_WISHES[Math.floor(Math.random() * TETS_WISHES.length)];
  const isGrandPrize = result.value >= 500000;
  const isOneMillion = result.value === 1000000;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        {result.value >= 100000 && <Fireworks />}
        
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 100 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          className={`bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] max-w-sm w-full overflow-hidden border-[6px] md:border-[10px] relative my-auto ${isGrandPrize ? 'border-yellow-400' : 'border-red-600'}`}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors z-20 text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className={`${isGrandPrize ? 'bg-yellow-400' : 'bg-red-600'} py-6 md:py-8 text-center px-4 relative`}>
            {isGrandPrize ? (
              <Trophy className="w-12 h-12 md:w-16 md:h-16 text-red-600 mx-auto mb-2 animate-bounce" />
            ) : (
              <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-yellow-400 mx-auto mb-2 animate-pulse" />
            )}
            <h2 className={`${isGrandPrize ? 'text-red-700' : 'text-yellow-400'} text-3xl md:text-4xl font-festive leading-tight`}>
              {isGrandPrize ? 'Đại Cát Đại Lợi!' : 'Lộc Xuân Đã Đến!'}
            </h2>
          </div>
          
          <div className="p-6 md:p-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ rotate: -5, y: 20, opacity: 0 }}
              animate={{ rotate: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="relative mb-8 w-full min-h-[140px] flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden shadow-inner"
            >
              {!imgError ? (
                <div className={`relative w-full h-full flex items-center justify-center p-4 ${isOneMillion ? 'pt-8' : ''}`}>
                  {isOneMillion ? (
                    // Hiệu ứng 2 tờ 500k xoè ra
                    <div className="relative w-full h-32 flex justify-center items-center">
                      <img 
                        src={result.imageUrl} 
                        className="absolute w-4/5 h-auto rounded shadow-lg border border-white/50 z-10 -rotate-12 -translate-x-4 translate-y-2 object-contain"
                        crossOrigin="anonymous"
                        onError={() => setImgError(true)}
                      />
                      <img 
                        src={result.imageUrl} 
                        className="absolute w-4/5 h-auto rounded shadow-xl border border-white/50 z-20 rotate-6 translate-x-4 object-contain"
                        crossOrigin="anonymous"
                      />
                    </div>
                  ) : (
                    <img 
                      src={result.imageUrl} 
                      alt={result.label} 
                      crossOrigin="anonymous"
                      className="relative w-full h-auto rounded-lg shadow-xl border border-white/50 z-10 object-contain max-h-[160px]"
                      onError={() => setImgError(true)}
                    />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-300 py-10">
                  <ImageOff className="w-12 h-12 mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Không tải được ảnh tiền</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 z-20 pointer-events-none rounded-lg"></div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6 md:mb-8"
            >
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Bạn đã nhận được</p>
              <span className={`text-4xl md:text-5xl font-black tracking-tighter ${isGrandPrize ? 'text-red-700' : 'text-red-600'}`}>
                {formatCurrency(result.value)}
              </span>
            </motion.div>
            
            <p className="text-gray-700 italic font-medium text-base md:text-lg leading-relaxed mb-8 px-4 border-l-2 border-red-200">
              "{randomWish}"
            </p>
            
            <button
              onClick={onClose}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 md:py-5 rounded-2xl transition-all shadow-xl active:translate-y-1 active:shadow-none text-lg md:text-xl tracking-widest uppercase flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Nhận Lộc
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ResultModal;
