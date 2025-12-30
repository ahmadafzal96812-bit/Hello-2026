import { useState, useEffect } from 'react';
import { TimeLeft } from '../types';

export const useCountdown = () => {
  const calculateTimeLeft = (): TimeLeft => {
    const year = new Date().getFullYear();
    // Target next year
    const nextYear = new Date(`January 1, ${year + 1} 00:00:00`).getTime();
    const now = new Date().getTime();
    const difference = nextYear - now;

    let timeLeft: TimeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return timeLeft;
};