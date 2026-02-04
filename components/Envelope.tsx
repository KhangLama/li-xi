
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
      whileHover={!disabled ? { scale: 1.05, rotate: 2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`relative cursor-pointer w-32 h-48 md:w-40 md:h-60 transition-all duration-500 ${isOpened ? 'opacity-50 grayscale scale-90' : 'opacity-100'}`}
      onClick={() => !disabled && onClick(id)}
    >
      <div className="absolute inset-0 bg-red-600 rounded-lg shadow-xl border-4 border-yellow-500 overflow-hidden flex flex-col items-center justify-center">
        {/* Traditional Patterns */}
        <div className="absolute top-0 left-0 w-full h-8 bg-yellow-500 opacity-20 transform -skew-y-12"></div>
        <div className="absolute bottom-0 right-0 w-full h-8 bg-yellow-500 opacity-20 transform skew-y-12"></div>
        
        {/* Center Decoration */}
        <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-yellow-400 rounded-full flex items-center justify-center bg-red-700 shadow-inner">
          <span className="text-yellow-400 text-3xl md:text-4xl font-festive">Lộc</span>
        </div>
        
        <p className="mt-4 text-yellow-300 font-bold text-xs md:text-sm uppercase tracking-widest text-center px-2">
          Xuân Ất Tỵ<br/>2025
        </p>
      </div>
      
      {/* Sealed flap look */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-6 bg-red-800 rounded-b-full border-b-2 border-yellow-600 shadow-md"></div>
    </motion.div>
  );
};

export default Envelope;
