import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, ListMusic, Play, Pause, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tracks = [
    {
        id: 'celebration',
        title: 'Celebration Vibe',
        // Pixabay: "Happy New Year"
        url: 'https://cdn.pixabay.com/audio/2022/12/16/audio_0cb3982822.mp3' 
    },
    {
        id: 'dance',
        title: 'Dance Party',
        // Pixabay: "Party"
        url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_145e54952e.mp3'
    },
    {
        id: 'chill',
        title: 'Chill Lounge',
        // Pixabay: "Lounge"
        url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d2166e5b23.mp3'
    }
];

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [showList, setShowList] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = 0.5;
    }
  }, []);

  useEffect(() => {
      if(audioRef.current) {
          if(isPlaying) {
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                  playPromise.catch(e => {
                      console.error("Playback error:", e);
                      // Auto-pause if playback failed (e.g. no user interaction yet)
                      setIsPlaying(false); 
                      // Only show error if it wasn't an abort/pause
                      if(e.name !== 'AbortError') {
                        setError(true);
                      }
                  });
              }
          } else {
              audioRef.current.pause();
          }
      }
  }, [isPlaying, currentTrack]);

  const changeTrack = (track: typeof tracks[0]) => {
      setError(false);
      setCurrentTrack(track);
      // When track changes, if we were playing, we want to keep playing (handled by useEffect dependency on currentTrack? No, need to wait for load)
      // Actually, changing the src on the audio element (via state change) triggers load.
      // We set isPlaying to true if we want it to auto-play after switch.
      setIsPlaying(true);
  };

  const togglePlay = () => {
    setError(false);
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end flex-col gap-2">
        {/* Hidden Audio Element */}
        <audio 
            ref={audioRef}
            src={currentTrack.url}
            loop
            onEnded={() => setIsPlaying(false)}
            onError={() => {
                console.error("Audio load error");
                setError(true);
                setIsPlaying(false);
            }}
            onPlay={() => setError(false)}
        />

        <AnimatePresence>
            {showList && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="bg-black/90 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-2 w-64 shadow-2xl"
                >
                    <h3 className="text-white font-bold mb-3 flex items-center text-sm uppercase tracking-wider">
                        <ListMusic size={16} className="mr-2 text-yellow-500" /> Select Tune
                    </h3>
                    <div className="space-y-2">
                        {tracks.map(track => (
                            <button
                                key={track.id}
                                onClick={() => changeTrack(track)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group ${currentTrack.id === track.id ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'hover:bg-white/10 text-gray-300'}`}
                            >
                                <span>{track.title}</span>
                                {currentTrack.id === track.id && isPlaying && (
                                    <span className="flex space-x-0.5 h-3 items-end">
                                        <span className="w-0.5 bg-yellow-400 animate-[bounce_1s_infinite] h-2"></span>
                                        <span className="w-0.5 bg-yellow-400 animate-[bounce_1.2s_infinite] h-3"></span>
                                        <span className="w-0.5 bg-yellow-400 animate-[bounce_0.8s_infinite] h-1"></span>
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
            <button
                onClick={() => setShowList(!showList)}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur text-white border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
                <ListMusic size={18} />
            </button>
            
            <div className="relative">
                {!isPlaying && !error && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3 z-10">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                    </span>
                )}
                <button
                    onClick={togglePlay}
                    className={`flex items-center justify-center w-14 h-14 rounded-full text-black shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all transform hover:scale-105 ${error ? 'bg-red-500 hover:bg-red-400' : 'bg-yellow-500 hover:bg-yellow-400'}`}
                    aria-label={isPlaying ? "Pause Music" : "Play Music"}
                >
                    {error ? (
                        <AlertCircle size={24} className="text-white" />
                    ) : isPlaying ? (
                        <div className="relative">
                            <Volume2 size={24} />
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                        </div>
                    ) : (
                        <Music size={24} />
                    )}
                </button>
            </div>
        </div>
    </div>
  );
};

export default MusicPlayer;