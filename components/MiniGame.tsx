import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Play, RotateCcw, Trophy, Sparkles, Clock, Share2, Zap } from 'lucide-react';

type TargetType = 'firework' | 'sparkle' | 'clock' | '2026';

interface Target {
  id: number;
  x: number;
  y: number;
  type: TargetType;
  content: string;
  scale: number;
}

const MiniGame: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'ended'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Target[]>([]);
  const [showFlash, setShowFlash] = useState(false);
  
  const tickAudioRef = useRef<HTMLAudioElement | null>(null);
  const cheerAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload sounds
    tickAudioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=clock-ticking-60-second-countdown-111804.mp3');
    tickAudioRef.current.volume = 0.5;
    
    cheerAudioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c153e2.mp3?filename=success-1-6297.mp3');
    cheerAudioRef.current.volume = 0.4;
  }, []);

  const spawnTarget = useCallback(() => {
    const id = Date.now() + Math.random();
    const x = Math.random() * 80 + 10; 
    const y = Math.random() * 60 + 20;
    
    const types: TargetType[] = ['firework', 'sparkle', 'clock', '2026'];
    // Weighted random to make 2026 rare
    const rand = Math.random();
    let type: TargetType = 'sparkle';
    
    if (rand > 0.9) type = '2026';
    else if (rand > 0.7) type = 'clock';
    else if (rand > 0.4) type = 'firework';
    
    let content = '✨';
    if (type === 'firework') content = '🎆';
    if (type === 'clock') content = '⏰';
    if (type === '2026') content = '2026';

    const scale = type === '2026' ? 1.5 : 1;

    setTargets(prev => [...prev, { id, x, y, type, content, scale }]);

    // Auto remove
    const duration = type === '2026' ? 1500 : 2500;
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 5 && prev > 0) {
            // Play tick sound
            tickAudioRef.current?.play().catch(() => {});
        }
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spawnInterval = setInterval(spawnTarget, 500);

    return () => {
      clearInterval(timerInterval);
      clearInterval(spawnInterval);
    };
  }, [gameState, spawnTarget]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    setGameState('playing');
    setShowFlash(false);
  };

  const endGame = () => {
      setGameState('ended');
      setShowFlash(true);
      // Trigger massive fireworks on screen
      window.dispatchEvent(new CustomEvent('trigger-fireworks', { detail: { count: 20 } }));
      cheerAudioRef.current?.play().catch(() => {});
      setTimeout(() => setShowFlash(false), 2000);
  };

  const handleTargetClick = (id: number, type: TargetType) => {
    let points = 1;
    let fireworkCount = 2;

    if (type === 'firework') { points = 5; fireworkCount = 5; }
    if (type === 'clock') { points = 3; fireworkCount = 3; }
    if (type === '2026') { points = 20; fireworkCount = 10; } // Big bonus

    setScore(prev => prev + points);
    setTargets(prev => prev.filter(t => t.id !== id));
    
    // Trigger visual effect
    window.dispatchEvent(new CustomEvent('trigger-fireworks', { detail: { count: fireworkCount } }));
  };

  const scrollToWishes = () => {
      document.getElementById('wishes')?.scrollIntoView({ behavior: 'smooth' });
  };

  const shareScore = () => {
      const text = `I helped welcome 2026! 🎆 My Celebration Score: ${score}. Join me on Hello2026!`;
      if (navigator.share) {
          navigator.share({ title: 'Hello2026 Celebration', text }).catch(() => {});
      } else {
          navigator.clipboard.writeText(text);
          alert('Score copied to clipboard!');
      }
  };

  return (
    <section id="game" className="relative min-h-screen pt-12 pb-24 px-4 flex flex-col items-center justify-center">
      
      {/* Celebration Flash */}
      <AnimatePresence>
        {showFlash && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-white flex items-center justify-center pointer-events-none"
            >
                <motion.h1 
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 2 }}
                    className="text-9xl font-black text-yellow-500 tracking-tighter"
                >
                    2026
                </motion.h1>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 min-h-[600px] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header HUD */}
        <div className="flex justify-between items-center mb-6 p-4 bg-white/5 rounded-2xl border border-white/5 relative z-20">
            <div className="flex items-center space-x-3">
                <Trophy className="text-yellow-400" />
                <span className="text-2xl font-bold font-mono text-white">{score}</span>
            </div>
            
            <div className="flex items-center space-x-4">
                 {/* Visual indicator of "Adding light" */}
                 <div className="hidden sm:flex items-center space-x-1">
                    <span className="text-xs text-gray-400 uppercase tracking-widest">Sky Brightness</span>
                    <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-yellow-500 to-red-500"
                            animate={{ width: `${Math.min(score, 100)}%` }}
                        />
                    </div>
                 </div>

                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${timeLeft <= 5 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/10 text-white'}`}>
                    <Clock size={20} />
                    <span className="text-2xl font-bold font-mono w-16 text-center">
                        00:{timeLeft.toString().padStart(2, '0')}
                    </span>
                </div>
            </div>
        </div>

        {/* Game Area */}
        <div className="flex-grow relative bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-700 cursor-crosshair">
            
            {/* START SCREEN */}
            {gameState === 'start' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30 text-center p-6">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="mb-8 relative"
                    >
                        <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full" />
                        <Sparkles size={80} className="text-yellow-400 relative z-10" />
                    </motion.div>
                    
                    <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Welcome 2026</h3>
                    <p className="text-xl text-gray-300 mb-8 max-w-lg">
                        Tap the fireworks 🎆, clocks ⏰, and 2026 badges to light up the sky for the New Year!
                    </p>
                    
                    <button 
                        onClick={startGame}
                        className="group relative px-8 py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-full text-xl flex items-center shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:shadow-[0_0_50px_rgba(234,179,8,0.6)] transition-all transform hover:-translate-y-1"
                    >
                        <Play className="mr-3 fill-black" /> Start Celebration
                        <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping opacity-50" />
                    </button>
                </div>
            )}

            {/* END SCREEN */}
            {gameState === 'ended' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-30 text-center p-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mb-6"
                    >
                         <div className="text-6xl mb-4">🎆 🥂 ✨</div>
                    </motion.div>

                    <h3 className="text-3xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 mb-2">
                        You helped welcome 2026!
                    </h3>
                    <p className="text-gray-400 text-lg mb-6">Main New Year ka hissa bana hoon</p>
                    
                    <div className="bg-white/10 px-8 py-4 rounded-2xl border border-white/10 mb-8 backdrop-blur-md">
                        <span className="text-sm text-gray-400 uppercase tracking-widest block mb-1">Your Celebration Score</span>
                        <span className="text-5xl font-mono font-bold text-white text-shadow">{score}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <button 
                            onClick={shareScore}
                            className="flex-1 px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl flex items-center justify-center transition-colors border border-white/10"
                        >
                            <Share2 className="mr-2" size={20} /> Share Score
                        </button>
                        <button 
                            onClick={scrollToWishes}
                            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl flex items-center justify-center transition-colors shadow-lg"
                        >
                            <Zap className="mr-2" size={20} /> Generate Wish
                        </button>
                    </div>

                    <button 
                        onClick={startGame}
                        className="mt-6 text-gray-500 hover:text-white flex items-center text-sm font-bold uppercase tracking-wider transition-colors"
                    >
                        <RotateCcw className="mr-2" size={16} /> Play Again
                    </button>
                </div>
            )}

            {/* TARGETS */}
            <AnimatePresence>
                {targets.map(target => (
                    <motion.button
                        key={target.id}
                        initial={{ scale: 0, opacity: 0, rotate: -45 }}
                        animate={{ scale: target.scale, opacity: 1, rotate: 0 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        style={{ 
                            left: `${target.x}%`, 
                            top: `${target.y}%`,
                        }}
                        className={`absolute flex items-center justify-center focus:outline-none ${target.type === '2026' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-black px-3 py-1 rounded-full shadow-lg border-2 border-white' : 'text-4xl filter drop-shadow-lg'}`}
                        onClick={() => handleTargetClick(target.id, target.type)}
                    >
                        {target.content}
                        {/* Ripple Effect Container */}
                        <span className="absolute inset-0 rounded-full animate-ping bg-white/30 pointer-events-none" />
                    </motion.button>
                ))}
            </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default MiniGame;