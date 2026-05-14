export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  criteria: {
    type: 'level' | 'combo' | 'coins';
    value: number;
  };
  reward: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'beginner_solver',
    title: 'শুরুয়াতি সমাধানকারী',
    description: '৫টি ধাপ সম্পন্ন করুন',
    icon: '🎯',
    criteria: { type: 'level', value: 5 },
    reward: 100
  },
  {
    id: 'puzzle_master',
    title: 'ধাঁধা মাস্টার',
    description: '২০টি ধাপ সম্পন্ন করুন',
    icon: '👑',
    criteria: { type: 'level', value: 20 },
    reward: 500
  },
  {
    id: 'combo_king',
    title: 'কম্বো কিং',
    description: '৫টি প্রশ্নের সঠিক উত্তর দিন একনাগাড়ে',
    icon: '🔥',
    criteria: { type: 'combo', value: 5 },
    reward: 200
  },
  {
    id: 'coin_collector',
    title: 'কয়েন সংগ্রাহক',
    description: '১০০০ কয়েন জমা করুন',
    icon: '💰',
    criteria: { type: 'coins', value: 1000 },
    reward: 150
  },
  {
    id: 'grand_master',
    title: 'গ্র্যান্ড মাস্টার',
    description: '৫০টি ধাপ সম্পন্ন করুন',
    icon: '🏆',
    criteria: { type: 'level', value: 50 },
    reward: 1000
  },
  {
    id: 'combo_legend',
    title: 'কম্বো লিজেন্ড',
    description: '১০টি প্রশ্নের সঠিক উত্তর দিন একনাগাড়ে',
    icon: '⚡',
    criteria: { type: 'combo', value: 10 },
    reward: 500
  }
];
