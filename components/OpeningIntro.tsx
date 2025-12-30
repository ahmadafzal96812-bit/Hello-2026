import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OpeningIntro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          // Allow "0" (Celebrate) to show for a moment before finishing
          setTimeout(onComplete, 1200); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050510]"
      exit={{ 
        y: "-100%", 
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } 
      }}
    >
      <div className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden">
         {/* Background Glow */}
         <div className="absolute w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[100px] animate-pulse" />

         {/* Decorative Circles */}
        <motion.div
            className="absolute border border-yellow-500/20 rounded-full"
            initial={{ width: 300, height: 300, opacity: 0 }}
            animate={{ 
                width: [300, 350, 300], 
                height: [300, 350, 300], 
                opacity: [0.2, 0.5, 0.2],
                rotate: 90 
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        
        <AnimatePresence mode="wait">
            {count > 0 ? (
                 <motion.div
                    key={count}
                    initial={{ y: 50, opacity: 0, scale: 0.5 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -50, opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10"
                >
                     <span className="text-[120px] md:text-[180px] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 drop-shadow-lg">
                        {count}
                    </span>
                </motion.div>
            ) : (
                <motion.div
                    key="ready"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center relative z-10"
                >
                    <h2 className="text-4xl md:text-7xl font-serif font-bold text-white uppercase tracking-[0.2em] mb-4">
                        Hello2026
                    </h2>
                    <p className="text-yellow-400 font-medium tracking-widest text-lg">
                        New Year Celebration
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default OpeningIntro;