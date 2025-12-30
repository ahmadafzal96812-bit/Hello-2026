import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Countdown from './Countdown';
import { ChevronDown, Sparkles, Zap } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';

const Hero: React.FC = () => {
  const { days, hours, minutes, seconds } = useCountdown();
  const [isNewYear, setIsNewYear] = useState(false);
  const [celebrationName, setCelebrationName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
        setIsNewYear(true);
    }
  }, [days, hours, minutes, seconds]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerCelebration = (e: React.FormEvent) => {
      e.preventDefault();
      if(!celebrationName.trim()) return;
      
      // Dispatch event for fireworks
      window.dispatchEvent(new CustomEvent('trigger-fireworks', { detail: { count: 10 } }));
      
      setShowNameInput(false);
      setCelebrationName("");
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        layout
        className="relative z-10 max-w-5xl"
      >
        <AnimatePresence mode="wait">
            {!isNewYear ? (
                <motion.div
                    key="countdown-mode"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-yellow-300 text-sm font-semibold tracking-wider mb-6 uppercase"
                    >
                      Let the Celebration Begin
                    </motion.span>
                    
                    <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-6 leading-tight">
                      Welcome the <br />
                      <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-sm">
                        New Year
                      </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                      Join the global countdown to a year of endless possibilities. Reflect, celebrate, and dream big.
                    </p>

                    <Countdown />
                </motion.div>
            ) : (
                <motion.div
                    key="celebration-mode"
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "backOut" }}
                    className="flex flex-col items-center"
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <Sparkles size={64} className="text-yellow-400 mb-6" />
                    </motion.div>
                    <h1 className="text-6xl md:text-9xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-500 mb-8 drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">
                        HAPPY NEW YEAR!
                    </h1>
                    <p className="text-2xl text-white font-light tracking-widest uppercase mb-12">
                        Welcome to a fresh start
                    </p>
                </motion.div>
            )}
        </AnimatePresence>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 flex flex-col items-center justify-center gap-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => scrollToSection('wishes')}
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Make a Wish
              </button>
              <button 
                onClick={() => scrollToSection('game')}
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,165,0,0.4)] flex items-center"
              >
                 <Sparkles size={20} className="mr-2" />
                 Play Game
              </button>
          </div>

          {/* Name Celebration Feature */}
           <div className="mt-8">
              {!showNameInput ? (
                  <button 
                     onClick={() => setShowNameInput(true)}
                     className="text-sm text-yellow-400 hover:text-yellow-200 underline underline-offset-4 flex items-center"
                  >
                     <Zap size={16} className="mr-1" />
                     Celebrate my name in the stars
                  </button>
              ) : (
                  <motion.form 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onSubmit={triggerCelebration}
                    className="flex flex-col sm:flex-row gap-2 items-center bg-white/10 p-2 rounded-xl backdrop-blur-md"
                  >
                      <input 
                         type="text" 
                         value={celebrationName}
                         onChange={(e) => setCelebrationName(e.target.value)}
                         placeholder="Type your name..."
                         className="bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400"
                         autoFocus
                      />
                      <button 
                        type="submit"
                        className="bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
                      >
                          Go!
                      </button>
                  </motion.form>
              )}
           </div>
        </motion.div>
      </motion.div>

      {!isNewYear && (
        <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500"
        >
            <ChevronDown size={32} />
        </motion.div>
      )}
    </section>
  );
};

export default Hero;