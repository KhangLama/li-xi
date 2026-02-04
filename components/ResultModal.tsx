
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
        {result.value >= 100000 && <Fireworks />}
        
        <motion.div
          initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className={`bg-white rounded-[3rem] shadow-2xl max-w-sm w-full overflow-hidden border-[12px] relative ${isGrandPrize ? 'border-yellow-400' : 'border-red-600'}`}
        >
          <div className={`${isGrandPrize ? 'bg-yellow-400' : 'bg-red-600'} py-8 text-center px-4`}>
            {isGrandPrize ? (
              <Trophy className="w-14 h-14 text-red-600 mx-auto mb-3 animate-bounce" />
            ) : (
              <CheckCircle className="w-14 h-14 text-yellow-400 mx-auto mb-3 animate-pulse" />
            )}
            <h2 className={`${isGrandPrize ? 'text-red-700' : 'text-yellow-400'} text-4xl font-festive`}>
              {isGrandPrize ? 'Đại Cát Đại Lợi!' : 'Lộc Xuân Đã Đến!'}
            </h2>
          </div>
          
          <div className="p-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-3xl shadow-2xl border-2 mb-8 w-full flex flex-col items-center relative overflow-hidden ${result.color}`}
            >
              {isGrandPrize && <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none"></div>}
              
              <img 
                src={result.imageUrl} 
                alt={result.label} 
                className="w-full h-auto rounded-xl shadow-lg border border-gray-100 mb-6 z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://picsum.photos/400/200?random=' + result.value;
                }}
              />
              <span className={`text-4xl font-black tracking-tighter z-10 ${isGrandPrize ? 'scale-125 text-red-700' : ''}`}>
                {formatCurrency(result.value)}
              </span>
            </motion.div>
            
            <p className="text-gray-800 italic font-black text-xl leading-relaxed mb-10 px-2">
              "{randomWish}"
            </p>
            
            <button
              onClick={onClose}
              className={`w-full font-black py-5 rounded-2xl transition-all shadow-xl active:scale-95 text-xl tracking-widest uppercase ${
                isGrandPrize 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-yellow-400'
              }`}
            >
              Nhận Lộc
            </button>
            <p className="mt-4 text-xs text-gray-400 font-bold uppercase tracking-widest opacity-50">Cơ hội chỉ đến một lần duy nhất</p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-6 left-6 text-3xl opacity-30">💮</div>
          <div className="absolute top-6 right-6 text-3xl opacity-30">💮</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ResultModal;
