
import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface FortuneContainerProps {
  onShakeComplete: () => void;
  disabled: boolean;
}

const FortuneContainer: React.FC<FortuneContainerProps> = ({ onShakeComplete, disabled }) => {
  const controls = useAnimation();
  const [isShaking, setIsShaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload sound - Using a sound that sounds more like objects in a container
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1110/1110-preview.mp3');
    audioRef.current.loop = true;
    audioRef.current.playbackRate = 1.2; // Speed up for more "vigorous" feel
  }, []);

  const handleShake = async () => {
    if (disabled || isShaking) return;

    setIsShaking(true);
    
    // Play sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.8;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }

    // Shaking animation - more intense and chaotic
    await controls.start({
      rotate: [0, -12, 12, -12, 12, -8, 8, -5, 5, 0],
      x: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0],
      y: [0, 8, -8, 8, -8, 4, -4, 0],
      transition: { duration: 0.4, repeat: 4, ease: "linear" }
    });

    // Stop sound
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setIsShaking(false);
    onShakeComplete();
  };

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        animate={controls}
        className="relative w-48 h-64 md:w-64 md:h-80 cursor-pointer group"
        onClick={handleShake}
      >
        {/* The Container (Hủ Quẻ) */}
        <div className="absolute inset-x-0 bottom-0 h-4/5 bg-red-700 rounded-b-3xl rounded-t-lg border-4 border-yellow-500 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
          {/* Decorative patterns */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-4 left-4 text-4xl">🧧</div>
            <div className="absolute bottom-4 right-4 text-4xl">🏮</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-20">🐎</div>
          </div>

          {/* Label */}
          <div className="z-10 bg-yellow-500 text-red-800 px-4 py-2 rounded-lg font-black text-xl md:text-2xl border-2 border-red-900 shadow-lg transform -rotate-3">
            QUẺ LỘC
          </div>
          <div className="z-10 mt-2 text-yellow-400 font-festive text-2xl md:text-3xl">
            Bính Ngọ 2026
          </div>
        </div>

        {/* The Sticks (Quẻ) inside */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-1/2 flex justify-center gap-1 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={isShaking ? { 
                y: [0, -40, 0, -20, 0],
                rotate: [i * 4 - 22, i * 4 - 10, i * 4 - 30, i * 4 - 15, i * 4 - 22],
                x: [0, (i - 6) * 3, 0, (i - 6) * -3, 0]
              } : {}}
              transition={{ 
                duration: 0.25, 
                repeat: isShaking ? Infinity : 0,
                delay: i * 0.02,
                ease: "easeInOut"
              }}
              className="w-1.5 md:w-2.5 h-full bg-yellow-600 rounded-t-full border-x border-yellow-700 shadow-sm origin-bottom"
              style={{ rotate: `${i * 4 - 22}deg` }}
            />
          ))}
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleShake}
        disabled={disabled || isShaking}
        className={`mt-8 px-8 py-4 bg-red-600 text-yellow-400 font-black rounded-2xl shadow-[0_6px_0_0_#b91c1c] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xl ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
      >
        {isShaking ? 'Đang lắc quẻ...' : 'Lắc Quẻ Nhận Lộc'}
      </motion.button>

      {!disabled && !isShaking && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-red-800 font-bold italic text-sm animate-bounce"
        >
          👆 Nhấn vào hủ hoặc nút để gieo quẻ
        </motion.p>
      )}
    </div>
  );
};

export default FortuneContainer;
