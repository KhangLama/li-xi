
import React from 'react';
import { motion } from 'framer-motion';

interface EnvelopeProps {
  id: number;
  onClick: (id: number) => void;
  isOpened: boolean;
  disabled: boolean;
}

const Envelope: React.FC<EnvelopeProps> = ({ id, onClick, isOpened, disabled }) => {
  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05, rotate: 2, y: -5 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`relative cursor-pointer w-[140px] h-[210px] sm:w-44 sm:h-64 transition-all duration-500 ${isOpened ? 'opacity-50 grayscale scale-90' : 'opacity-100'}`}
      onClick={() => !disabled && onClick(id)}
    >
      <div className="absolute inset-0 bg-red-600 rounded-2xl shadow-2xl border-[3px] md:border-4 border-yellow-400 overflow-hidden flex flex-col items-center justify-center">
        {/* Traditional Patterns */}
        <div className="absolute top-0 left-0 w-full h-10 bg-yellow-500 opacity-10 transform -skew-y-12"></div>
        <div className="absolute bottom-0 right-0 w-full h-10 bg-yellow-500 opacity-10 transform skew-y-12"></div>
        
        {/* Center Decoration */}
        <div className="w-16 h-16 sm:w-24 sm:h-24 border-[3px] md:border-4 border-yellow-400 rounded-full flex flex-col items-center justify-center bg-red-700 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
          <span className="text-yellow-400 text-2xl sm:text-4xl font-festive leading-none">Lộc</span>
          <span className="text-yellow-500 text-[8px] sm:text-[10px] font-bold uppercase mt-1">Bính Ngọ</span>
        </div>
        
        <p className="mt-3 sm:mt-4 text-yellow-300 font-black text-[10px] sm:text-sm uppercase tracking-tighter text-center px-2 leading-tight">
          Chúc Mừng<br/>Năm Mới<br/>2026
        </p>

        {/* Horse Silhouette Mini */}
        <div className="absolute bottom-2 right-2 text-base sm:text-xl opacity-20">🐎</div>
      </div>
      
      {/* Sealed flap look */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4/5 h-6 sm:h-8 bg-red-700 rounded-b-[1.5rem] sm:rounded-b-[2rem] border-b-2 border-yellow-500 shadow-md"></div>
    </motion.div>
  );
};

export default Envelope;
