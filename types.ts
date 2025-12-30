export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Wish {
  id: string;
  name: string;
  message: string;
  color: string;
  likes: number;
  lang?: 'en' | 'ur';
}

export enum ParticleColor {
  GOLD = '#FFD700',
  SILVER = '#C0C0C0',
  RED = '#FF4500',
  BLUE = '#1E90FF',
  PURPLE = '#9370DB'
}

export type GeneratedWish = {
  text: string;
  lang: 'en' | 'ur';
};