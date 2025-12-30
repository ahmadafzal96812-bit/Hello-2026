import React from 'react';
import { motion } from 'framer-motion';
import { useCountdown } from '../hooks/useCountdown';

const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center mx-2 sm:mx-4">
    <div className="relative bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 w-20 h-24 sm:w-28 sm:h-32 flex items-center justify-center border border-white/20 shadow-[0_0_20px_rgba(255,215,0,0.15)]">
        <motion.span
            key={value}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-yellow-200 to-yellow-500 font-serif"
        >
            {value.toString().padStart(2, '0')}
        </motion.span>
    </div>
    <span className="mt-3 text-xs sm:text-sm font-medium uppercase tracking-widest text-gray-400">{label}</span>
  </div>
);

const Countdown: React.FC = () => {
  const { days, hours, minutes, seconds } = useCountdown();

  return (
    <div className="flex flex-wrap justify-center items-center py-12">
      <TimeUnit value={days} label="Days" />
      <TimeUnit value={hours} label="Hours" />
      <TimeUnit value={minutes} label="Minutes" />
      <TimeUnit value={seconds} label="Seconds" />
    </div>
  );
};

export default Countdown;