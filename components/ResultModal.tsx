
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Denomination } from '../types';
import { formatCurrency } from '../utils';
import { TETS_WISHES } from '../constants';
import Fireworks from './Fireworks';
import { Trophy, CheckCircle } from 'lucide-react';

interface ResultModalProps {
  result: Denomination | null;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  if (!result) return null;

  const randomWish = TETS_WISHES[Math.floor(Math.random() * TETS_WISHES.length)];
  const isGrandPrize = result.value >= 500000;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">
        {result.value >= 100000 && <Fireworks />}
        
        <motion.div
          initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className={`bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl max-w-sm w-full overflow-hidden border-[8px] md:border-[12px] relative my-auto ${isGrandPrize ? 'border-yellow-400' : 'border-red-600'}`}
        >
          <div className={`${isGrandPrize ? 'bg-yellow-400' : 'bg-red-600'} py-6 md:py-8 text-center px-4`}>
            {isGrandPrize ? (
              <Trophy className="w-10 h-10 md:w-14 md:h-14 text-red-600 mx-auto mb-2 md:mb-3 animate-bounce" />
            ) : (
              <CheckCircle className="w-10 h-10 md:w-14 md:h-14 text-yellow-400 mx-auto mb-2 md:mb-3 animate-pulse" />
            )}
            <h2 className={`${isGrandPrize ? 'text-red-700' : 'text-yellow-400'} text-3xl md:text-4xl font-festive`}>
              {isGrandPrize ? 'Đại Cát Đại Lợi!' : 'Lộc Xuân Đã Đến!'}
            </h2>
          </div>
          
          <div className="p-6 md:p-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-2xl border-2 mb-6 md:mb-8 w-full flex flex-col items-center relative overflow-hidden ${result.color}`}
            >
              {isGrandPrize && <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none"></div>}
              
              <img 
                src={result.imageUrl} 
                alt={result.label} 
                className="w-full h-auto rounded-xl shadow-lg border border-gray-100 mb-4 md:mb-6 z-10 max-h-[120px] md:max-h-none object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://picsum.photos/400/200?random=' + result.value;
                }}
              />
              <span className={`text-3xl md:text-4xl font-black tracking-tighter z-10 ${isGrandPrize ? 'scale-110 md:scale-125 text-red-700' : ''}`}>
                {formatCurrency(result.value)}
              </span>
            </motion.div>
            
            <p className="text-gray-800 italic font-black text-lg md:text-xl leading-relaxed mb-6 md:mb-10 px-2">
              "{randomWish}"
            </p>
            
            <button
              onClick={onClose}
              className={`w-full font-black py-4 md:py-5 rounded-2xl transition-all shadow-xl active:scale-95 text-lg md:text-xl tracking-widest uppercase ${
                isGrandPrize 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-yellow-400'
              }`}
            >
              Nhận Lộc
            </button>
            <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-50">Cơ hội chỉ đến một lần duy nhất</p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 text-2xl opacity-20">💮</div>
          <div className="absolute top-4 right-4 text-2xl opacity-20">💮</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ResultModal;
