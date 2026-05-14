import { useState, useEffect, useCallback, useRef } from 'react';
import { ACHIEVEMENTS, Achievement } from '../data/achievements';
import { soundService, SoundName } from '../services/soundService';
import confetti from 'canvas-confetti';

export const useGameProgress = () => {
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('btb_coins');
    const val = saved ? parseInt(saved) : 500;
    return isNaN(val) ? 500 : val;
  });

  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    const saved = localStorage.getItem('btb_level');
    const val = saved ? parseInt(saved) : 1;
    return isNaN(val) ? 1 : val;
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => {
    const saved = localStorage.getItem('btb_achievements');
    return saved ? JSON.parse(saved) : [];
  });

  const [bestCombo, setBestCombo] = useState<number>(() => {
    const saved = localStorage.getItem('btb_best_combo');
    return saved ? parseInt(saved) : 0;
  });

  const [lastCheckIn, setLastCheckIn] = useState<string | null>(() => {
    return localStorage.getItem('btb_last_checkin');
  });

  const [checkInStreak, setCheckInStreak] = useState<number>(() => {
    const saved = localStorage.getItem('btb_streak');
    return saved ? parseInt(saved) : 0;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('btb_settings');
    return saved ? JSON.parse(saved) : { music: true, sound: true, vibration: true };
  });

  const [combo, setCombo] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const playSound = useCallback((name: SoundName) => {
    if (settings.sound) {
      soundService.play(name);
    }
  }, [settings.sound]);

  const loopSound = useCallback((name: SoundName) => {
    if (settings.sound) {
      soundService.loop(name);
    }
  }, [settings.sound]);

  const stopSound = useCallback((name: SoundName) => {
    soundService.stop(name);
  }, []);

  useEffect(() => {
    soundService.setEnabled(settings.sound);
  }, [settings.sound]);

  useEffect(() => {
    localStorage.setItem('btb_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('btb_level', currentLevel.toString());
  }, [currentLevel]);

  useEffect(() => {
    localStorage.setItem('btb_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('btb_streak', checkInStreak.toString());
  }, [checkInStreak]);

  useEffect(() => {
    localStorage.setItem('btb_achievements', JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  useEffect(() => {
    localStorage.setItem('btb_best_combo', bestCombo.toString());
  }, [bestCombo]);

  const coinsRef = useRef(coins);
  useEffect(() => {
    coinsRef.current = coins;
  }, [coins]);

  const addCoins = useCallback((amount: number) => setCoins(prev => prev + amount), []);
  
  const spendCoins = useCallback((amount: number) => {
    const current = coinsRef.current;
    const newTotal = Math.max(0, current - amount);
    coinsRef.current = newTotal;
    setCoins(newTotal);
    if (amount > 0) playSound('click');
    return true; // Always allow spending to let the user play even with 0 coins
  }, [playSound]);

  const startLevel = useCallback(() => spendCoins(20), [spendCoins]);

  const penaltyWrong = useCallback(() => {
    playSound('fail');
    return spendCoins(10);
  }, [spendCoins, playSound]);

  const checkAchievements = useCallback((stats: { level: number; combo: number; coins: number }) => {
    ACHIEVEMENTS.forEach(achievement => {
      if (unlockedAchievements.includes(achievement.id)) return;

      let achieved = false;
      if (achievement.criteria.type === 'level' && stats.level >= achievement.criteria.value) achieved = true;
      if (achievement.criteria.type === 'combo' && stats.combo >= achievement.criteria.value) achieved = true;
      if (achievement.criteria.type === 'coins' && stats.coins >= achievement.criteria.value) achieved = true;

      if (achieved) {
        setUnlockedAchievements(prev => [...prev, achievement.id]);
        addCoins(achievement.reward);
        showToast(`অ্যাচিভমেন্ট আনলক: ${achievement.title}! +${achievement.reward} কয়েন`, 'success');
        playSound('achievement');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    });
  }, [unlockedAchievements, addCoins, showToast, playSound]);

  const rewardCorrect = useCallback(() => {
    playSound('success');
    setCombo(prevCombo => {
      const newCombo = prevCombo + 1;
      if (newCombo > bestCombo) {
        setBestCombo(newCombo);
      }
      const bonus = newCombo > 2 ? 10 : 0;
      addCoins(20 + bonus);
      
      // Check achievements after a delay to ensure state updates if needed
      setTimeout(() => {
        checkAchievements({ level: currentLevel, combo: newCombo, coins: coinsRef.current });
      }, 500);

      return newCombo;
    });
  }, [addCoins, bestCombo, currentLevel, checkAchievements]);

  const resetCombo = useCallback(() => setCombo(0), []);

  const completeLevel = useCallback(() => {
    const nextLevel = currentLevel + 1;
    setCurrentLevel(nextLevel);
    // Check level-based achievements
    setTimeout(() => {
      checkAchievements({ level: nextLevel, combo: combo, coins: coinsRef.current });
    }, 500);
  }, [currentLevel, combo, checkAchievements]);

  const dailyCheckIn = useCallback(() => {
    const today = new Date();
    const todayStr = today.toDateString();
    
    // Check if already claimed today
    const savedLast = localStorage.getItem('btb_last_checkin');
    if (savedLast === todayStr) return null;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let newStreak = 1;
    if (savedLast === yesterdayStr) {
      newStreak = checkInStreak + 1;
    }

    // Reward: Day 1 = 500, Day 2 = 700, Day 3 = 1000, then repeats or caps
    let reward = 500;
    if (newStreak === 2) reward = 700;
    if (newStreak >= 3) reward = 1000;

    addCoins(reward);
    setCheckInStreak(newStreak);
    setLastCheckIn(todayStr);
    localStorage.setItem('btb_last_checkin', todayStr);
    playSound('coin');
    
    return { reward, streak: newStreak };
  }, [checkInStreak, addCoins, playSound]);

  const toggleSetting = (key: 'music' | 'sound' | 'vibration') => {
    setSettings(prev => {
      const newVal = !prev[key];
      if (key === 'sound' && newVal) {
        soundService.play('click');
      }
      if (key === 'vibration' && newVal && window.navigator.vibrate) {
        window.navigator.vibrate(100);
      }
      return { ...prev, [key]: newVal };
    });
  };

  return {
    coins,
    currentLevel,
    checkInStreak,
    settings,
    combo,
    bestCombo,
    unlockedAchievements,
    addCoins,
    spendCoins,
    startLevel,
    penaltyWrong,
    completeLevel,
    dailyCheckIn,
    toggleSetting,
    resetCombo,
    rewardCorrect,
    toast,
    showToast,
    checkAchievements,
    playSound,
    loopSound,
    stopSound
  };
};
