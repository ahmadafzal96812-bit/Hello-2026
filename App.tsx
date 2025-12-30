import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WishesSection from './components/WishesSection';
import Events from './components/Events';
import MiniGame from './components/MiniGame';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import FireworksCanvas from './components/FireworksCanvas';
import OpeningIntro from './components/OpeningIntro';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="relative min-h-screen bg-[#050510] text-white selection:bg-yellow-500 selection:text-black">
      <AnimatePresence>
        {showIntro && (
          <OpeningIntro onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Background Animation Layer */}
      <FireworksCanvas />
      
      {/* UI Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
            <Hero />
            <WishesSection />
            <MiniGame />
            <Events />
        </main>
        
        <Footer />
        <MusicPlayer />
      </div>
    </div>
  );
};

export default App;