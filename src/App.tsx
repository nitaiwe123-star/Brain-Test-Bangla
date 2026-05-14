import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Settings, 
  Coins, 
  Play, 
  RotateCcw, 
  ChevronLeft, 
  LifeBuoy, 
  FastForward,
  Share2,
  X,
  Volume2,
  VolumeX,
  Smartphone,
  SmartphoneNfc,
  Music,
  User,
  Clock,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { ACHIEVEMENTS } from './data/achievements';
import { useGameProgress } from './hooks/useGameProgress';
import { INITIAL_PUZZLES, Puzzle } from './data/puzzles';
import { generatePuzzle } from './services/geminiService';
import { soundService } from './services/soundService';
import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { cn } from './lib/utils';

// --- Shared Components ---

function Header({ coins, onBack }: { coins: number; onBack?: () => void }) {
  return (
    <div className="flex items-center justify-between p-3 w-full max-w-md mx-auto sticky top-0 z-30">
      {onBack && (
        <button 
          onClick={() => {
            soundService.play('click');
            onBack();
          }}
          className="glass-button p-1.5"
        >
          <ChevronLeft className="w-5 h-5 text-secondary" />
        </button>
      )}
      <div className="flex-1" />
      <div className="glass-panel px-4 py-1.5 rounded-full flex items-center gap-2 shadow-md bg-white/60">
        <Coins className="w-5 h-5 text-primary" />
        <span className="text-lg font-black text-secondary">{coins}</span>
      </div>
    </div>
  );
}

// --- Screens ---

function Home() {
  const navigate = useNavigate();
  const { coins, currentLevel, dailyCheckIn, checkInStreak, playSound } = useGameProgress();
  const [showDaily, setShowDaily] = useState(false);
  const [lastReward, setLastReward] = useState<{ reward: number; streak: number } | null>(null);

  const handleNavigate = (path: string) => {
    playSound('click');
    navigate(path);
  };

  useEffect(() => {
    // Only call checkIn once on mount
    const reward = dailyCheckIn();
    if (reward) {
      setLastReward(reward);
      setShowDaily(true);
    }
  }, []); // Empty dependency array to run only once

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-6 pb-24 px-6 relative overflow-y-auto bg-white">
      {/* Decorative background elements */}
      <div className="absolute top-[-5%] left-[-5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-5%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6 z-10"
      >
        <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-2xl border-4 border-slate-50 transform -rotate-6 mx-auto mb-3 relative">
          <span className="text-4xl">🧠</span>
          <div className="absolute -top-1.5 -right-1.5 bg-accent text-secondary px-1.5 py-0.5 rounded-lg text-xs font-black shadow-lg">PRO</div>
        </div>
        <h1 className="text-3xl font-black text-secondary mb-0.5 tracking-tight">
          ব্রেইন টেস্ট<br />
          <span className="text-primary">বাংলা</span>
        </h1>
        <p className="font-bold text-secondary opacity-60 text-[11px]">
          “মাথা খাটান, বন্ধুদের হারান!”
        </p>
      </motion.div>

      <div className="flex flex-col gap-3 w-full max-w-xs z-10">
        <button 
          onClick={() => handleNavigate('/game')}
          className="primary-button p-5 flex flex-col items-center justify-center gap-0.5 shadow-2xl relative overflow-hidden group"
        >
          <div className="flex items-center gap-2 text-xl font-black">
            <Play className="fill-current w-6 h-6" />
            শুরু করুন
          </div>
          <span className="text-[10px] font-bold opacity-60">লেভেল {currentLevel} থেকে এগিয়ে যান</span>
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleNavigate('/spin')}
            className="glass-button p-4 flex flex-col items-center gap-1 font-black text-secondary text-sm"
          >
            <RotateCcw className="w-5 h-5 text-orange-400" />
            লাকি স্পিন
          </button>
          <button 
            onClick={() => handleNavigate('/leaderboard')}
            className="glass-button p-4 flex flex-col items-center gap-1 font-black text-secondary text-sm"
          >
            <Trophy className="w-5 h-5 text-accent" />
            লীডারবোর্ড
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleNavigate('/achievements')}
            className="glass-button p-3 flex items-center justify-center gap-2 font-black text-secondary/80 text-xs"
          >
            <Clock className="w-4 h-4 text-primary" />
            অর্জনসমূহ
          </button>
          <button 
            onClick={() => handleNavigate('/profile')}
            className="glass-button p-3 flex items-center justify-center gap-2 font-black text-secondary/80 text-xs"
          >
            <User className="w-4 h-4" />
            প্রোফাইল
          </button>
        </div>

        <button 
          onClick={() => handleNavigate('/settings')}
          className="glass-button p-3 flex items-center justify-center gap-2 font-black text-secondary/40 text-[10px] opacity-60 mt-2"
        >
          <Settings className="w-3.5 h-3.5" />
          সেটিংস
        </button>
      </div>

      <div className="mt-8 glass-panel px-5 py-1.5 rounded-full flex items-center gap-2 font-black text-secondary/70 text-sm">
        <Coins className="w-4 h-4 text-primary" />
        <span>{coins} কয়েন</span>
      </div>

      <AnimatePresence>
        {showDaily && lastReward && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-secondary/80 backdrop-blur-md flex items-center justify-center p-6 z-50 px-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card p-8 max-w-sm w-full text-center relative bg-white/90 border-white/50"
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                <span className="text-5xl">🎁</span>
              </div>
              <h2 className="text-3xl font-black mt-8 mb-2 text-secondary">দৈনিক পুরস্কার!</h2>
              <div className="flex gap-2 justify-center mb-6">
                {[1, 2, 3, 4, 5].map((d) => (
                  <div key={d} className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black",
                    d <= lastReward.streak ? "bg-primary text-white" : "bg-slate-100 text-slate-300"
                  )}>
                    {lastReward.streak === d && lastReward.streak < 6 ? "🎁" : d}
                  </div>
                ))}
              </div>
              <p className="font-bold text-secondary/60 mb-6 uppercase tracking-wider text-sm">দিন {lastReward.streak} স্ট্রাইক</p>
              
              <div className="bg-yellow-50 rounded-2xl p-6 mb-8 border border-yellow-100 flex items-center justify-center gap-3 shadow-inner">
                <Coins className="text-primary w-8 h-8" />
                <span className="text-yellow-600 font-black text-4xl">+{lastReward.reward}</span>
              </div>

              <button 
                onClick={() => {
                  playSound('click');
                  setShowDaily(false);
                }}
                className="dark-button w-full p-5 text-xl font-black shadow-xl"
              >
                সংগ্রহ করুন
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Game() {
  const navigate = useNavigate();
  const { 
    coins, 
    currentLevel, 
    completeLevel, 
    spendCoins, 
    startLevel, 
    penaltyWrong, 
    combo, 
    resetCombo,
    rewardCorrect,
    toast,
    showToast,
    playSound
  } = useGameProgress();
  
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const paymentProcessed = useRef(false);

  useEffect(() => {
    const fetchPuzzle = async () => {
      setLoading(true);
      try {
        const newPuzzle = await generatePuzzle(currentLevel);
        setPuzzle(newPuzzle);
      } catch (error) {
        console.error("Failed to fetch puzzle:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPuzzle();
  }, [currentLevel]);

  useEffect(() => {
    // Initial start level logic - ensure it only runs once per level mount
    if (!loading && puzzle && !gameStarted && !paymentProcessed.current) {
      if (spendCoins(20)) {
        paymentProcessed.current = true;
        setGameStarted(true);
      } else {
        showToast("খেলতে ২০ কয়েন প্রয়োজন!", "error");
        navigate('/');
      }
    }
  }, [loading, puzzle, gameStarted, navigate, spendCoins, showToast]);

  useEffect(() => {
    if (!gameStarted || isComplete || showTimeUp || showHint) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, isComplete, showTimeUp, showHint]);

  if (loading || !puzzle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white relative overflow-hidden">
        {/* Floating brain decorative background */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute text-[200px] pointer-events-none select-none"
        >
          🧠
        </motion.div>

        <div className="z-10 flex flex-col items-center gap-8 w-full max-w-xs text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 rounded-[2rem] flex items-center justify-center bg-white shadow-xl">
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-4xl"
              >
                💡
              </motion.span>
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-8px] border-t-4 border-l-4 border-primary rounded-[2.5rem]"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-secondary">ধাপ {currentLevel} তৈরি হচ্ছে</h3>
            <div className="flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  className="w-2.5 h-2.5 bg-primary rounded-full"
                />
              ))}
            </div>
            <p className="text-xs font-bold text-secondary/40 uppercase tracking-widest pt-2">Gemini AI চিন্তা করছে...</p>
          </div>

          {/* Skeleton like placeholder */}
          <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2 mt-4">
            <div className="h-4 bg-slate-200 rounded-full w-3/4 animate-pulse mx-auto" />
            <div className="h-4 bg-slate-200 rounded-full w-1/2 animate-pulse mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  const handleTimeUp = () => {
    setShowTimeUp(true);
    penaltyWrong();
    resetCombo();
  };

  const handleAnswer = (index: number) => {
    if (isComplete || showTimeUp) return;
    playSound('click');
    setSelected(index);
    if (index === puzzle.answerIndex) {
      setIsCorrect(true);
      rewardCorrect();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FF8C00', '#FFD700', '#2D3436']
      });
      setTimeout(() => {
        playSound('win');
        setIsComplete(true);
      }, 500);
    } else {
      setIsCorrect(false);
      penaltyWrong();
      resetCombo();
      setTimeout(() => {
        setSelected(null);
        setIsCorrect(null);
      }, 1000);
    }
  };

  const handleHint = () => {
    playSound('click');
    if (spendCoins(30)) {
      setShowHint(true);
    } else {
      showToast("আপনার যথেষ্ট কয়েন নেই!", "error");
    }
  };

  const handleSkip = () => {
    playSound('click');
    if (spendCoins(100)) {
       completeLevel();
       resetGameState();
    } else {
       showToast("স্কিপ করতে ১০০ কয়েন লাগবে!", "error");
    }
  };

  const resetGameState = () => {
    setSelected(null);
    setIsCorrect(null);
    setShowHint(false);
    setIsComplete(false);
    setTimeLeft(30);
    setShowTimeUp(false);
    setGameStarted(false); // Refreshes game state for next level
  };

  const handleNext = () => {
    playSound('click');
    completeLevel();
    resetGameState();
  };

  const handleRetry = () => {
    playSound('click');
    resetGameState();
  };

  const handleShare = () => {
    playSound('click');
    // Basic share functionality
    if (navigator.share) {
      navigator.share({
        title: 'ব্রেইন টেস্ট বাংলা',
        text: `আমি লেভেল ${currentLevel} সম্পন্ন করেছি! আপনি কি পারবেন?`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-y-auto pb-24 bg-slate-50">
      <Header coins={coins} onBack={() => navigate('/')} />
      
      <div className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col relative z-20">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="bg-accent text-secondary px-3 py-1 rounded-full font-black text-[11px] shadow-md flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-current" />
              ধাপ {currentLevel}
            </div>
            <div className={cn(
              "flex items-center gap-1.5 font-black text-lg px-3 py-0.5 rounded-full bg-white/40 shadow-sm transition-colors",
              timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-secondary"
            )}>
              <Clock className="w-4 h-4" />
              {timeLeft}স
            </div>
          </div>
          
          <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden border border-white/30 p-[1px] relative">
            <motion.div 
              className={cn(
                "h-full rounded-full transition-colors",
                timeLeft <= 5 ? "bg-red-500" : "bg-white"
              )}
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / 30) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
            {combo > 1 && (
              <div className="absolute right-0 top-[-22px] flex items-center gap-1 text-accent font-black italic text-[11px]">
                COMBO x{combo} 🔥
              </div>
            )}
          </div>
        </div>

        <div className="glass-card bg-white/90 p-5 min-h-[160px] flex flex-col items-center justify-center text-xl font-black text-secondary leading-tight mb-6 border-t-[6px] border-primary shadow-2xl relative">
          <div className="absolute -top-3 left-4 bg-secondary text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
            {puzzle.category}
          </div>
          {puzzle.image && (
            <div className="mb-3 w-full h-28 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-slate-200">
               <img src={puzzle.image} alt="Puzzle" className="w-full h-full object-contain" />
            </div>
          )}
          “{puzzle.question}”
        </div>

        <div className="grid grid-cols-1 gap-3 mb-6">
          {puzzle.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={cn(
                "p-4 text-left font-black transition-all rounded-xl shadow-lg border-b-4 text-sm",
                selected === idx 
                  ? isCorrect 
                    ? "bg-green-500 border-green-700 text-white scale-[1.01]" 
                    : "bg-red-500 border-red-700 text-white"
                  : "bg-white/80 hover:bg-orange-50 border-slate-200 text-slate-700 glass-button border-white/50"
              )}
            >
              <div className="flex justify-between items-center">
                <span>{option}</span>
                {selected === idx && isCorrect && <CheckCircle2 className="w-5 h-5" />}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3 pb-4">
          <button 
            onClick={handleHint}
            className="glass-button p-3 font-black flex items-center justify-center gap-2 text-secondary bg-white/40 text-[13px]"
          >
            <LifeBuoy className="w-4 h-4 text-primary" />
            হিন্ট (৩০)
          </button>
          <button 
            onClick={handleSkip}
            className="glass-button p-3 font-black flex items-center justify-center gap-2 text-secondary bg-white/40 text-[13px]"
          >
            <FastForward className="w-4 h-4 text-accent" />
            স্কিপ (১০০)
          </button>
        </div>
      </div>

      {toast && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className={cn(
            "fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full font-black text-white z-[100] shadow-2xl",
            toast.type === 'error' ? "bg-red-500" : "bg-green-500"
          )}
        >
          {toast.message}
        </motion.div>
      )}

      <AnimatePresence>
        {showHint && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-secondary/80 backdrop-blur-xl flex items-center justify-center p-6 z-50"
          >
            <div className="glass-card p-10 max-w-sm w-full text-center relative bg-white/90 border-white/50 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
              <button 
                onClick={() => setShowHint(false)}
                className="absolute -top-3 -right-3 h-[50px] w-[50px] bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-100 cartoon-button"
              >
                <X className="text-secondary w-6 h-6 font-bold" />
              </button>
              <h3 className="text-2xl font-black mb-6 flex items-center justify-center gap-2 text-secondary">
                <LifeBuoy className="text-primary w-10 h-10 animate-bounce" />
                আপনার জন্য হিন্ট
              </h3>
              <p className="text-xl font-bold text-secondary bg-slate-50 p-8 rounded-[2.5rem] border-4 border-dashed border-primary/30 shadow-inner">
                {puzzle.hint}
              </p>
            </div>
          </motion.div>
        )}

        {showTimeUp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-red-500/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 z-50 text-white"
          >
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8 animate-bounce">
              <Clock className="w-12 h-12" />
            </div>
            <h2 className="text-6xl font-black mb-4 tracking-tight">সময় শেষ!</h2>
            <p className="text-xl font-black mb-12 opacity-80">-১০ কয়েন খরচ হলো</p>
            
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button 
                onClick={handleRetry}
                className="bg-white text-red-500 p-6 rounded-2xl font-black text-2xl shadow-2xl active:scale-95"
              >
                পুনরায় চেষ্টা করুন
              </button>
              <button 
                onClick={() => navigate('/')}
                className="font-bold opacity-60 mt-4 text-white"
              >
                হোম পেজে ফিরে যান
              </button>
            </div>
          </motion.div>
        )}

        {isComplete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-secondary/80 backdrop-blur-md flex flex-col items-center justify-center p-6 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white p-7 rounded-[2rem] shadow-2xl border-4 border-green-400 relative overflow-hidden w-full max-w-sm max-h-[85vh] flex flex-col"
            >
              <div className="absolute -right-6 -top-6 text-7xl opacity-10 transform rotate-12">⭐</div>
              
              <div className="flex-1 overflow-y-auto text-center relative z-10 pr-1 custom-scrollbar pb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg animate-pulse">
                  <span className="text-3xl">✅</span>
                </div>
                <h4 className="text-3xl font-black text-green-600 mb-1.5">চমৎকার!</h4>
                <p className="text-gray-500 font-bold mb-4 text-sm">ধাপ {currentLevel} জয় করেছেন!</p>
                
                <div className="bg-yellow-50 rounded-[1.5rem] p-3 mb-6 border border-yellow-100 flex flex-col items-center justify-center gap-0.5 shadow-inner group">
                  <div className="flex items-center gap-2">
                    <Coins className="text-primary w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span className="text-yellow-600 font-black text-2xl">+২০</span>
                  </div>
                  {combo > 2 && <span className="text-accent text-[9px] font-black uppercase tracking-widest">কম্বো বোনাস! 🔥</span>}
                </div>

                <div className="bg-green-50/50 p-3.5 rounded-xl mb-2 text-[13px] font-bold text-green-700 border border-green-100 text-left">
                  <div className="text-green-600 text-[10px] uppercase tracking-widest mb-0.5 font-black">সমাধান:</div>
                  {puzzle.explanation}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 mt-auto bg-white relative z-20">
                <button 
                  onClick={handleNext}
                  className="w-full bg-secondary text-white py-4 rounded-[1.5rem] font-black text-lg shadow-xl hover:scale-[1.01] active:scale-95 transition-all"
                >
                  পরবর্তী ধাপ
                </button>
                <button 
                  onClick={handleShare}
                  className="w-full bg-white text-gray-400 py-3 rounded-[1.5rem] font-bold border border-gray-200 text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5" /> শেয়ার করুন
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpinWheel() {
  const navigate = useNavigate();
  const { coins, spendCoins, addCoins, loopSound, stopSound, playSound } = useGameProgress();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  const prizes = [20, 80, 5, 50, 20, 100, 10, 60, 20, 90, 30, 70];
  // More common prizes: smaller numbers. Rare: 90, 100.
  // Probability mapping by index
  const probability = [0.15, 0.05, 0.10, 0.10, 0.15, 0.02, 0.10, 0.08, 0.10, 0.03, 0.07, 0.05]; 

  const spin = () => {
    if (spinning) return;
    if (spendCoins(50)) {
      setSpinning(true);
      setResult(null);
      loopSound('spin');
      
      // Calculate winner index based on probability
      const rand = Math.random();
      let cumulative = 0;
      let winnerIdx = 0;
      for (let i = 0; i < probability.length; i++) {
        cumulative += probability[i];
        if (rand <= cumulative) {
          winnerIdx = i;
          break;
        }
      }

      const extraRotations = 10 * 360; // 10 rounds
      const segmentAngle = 360 / prizes.length;
      const prizeCenter = (winnerIdx * segmentAngle) + (segmentAngle / 2); 
      // We want prizeCenter + finalRotation to be 0 (or 360)
      // So finalRotation % 360 = (360 - prizeCenter)
      const currentRotationMod = rotation % 360;
      const distanceToZero = 360 - currentRotationMod;
      const distanceToPrize = (360 - prizeCenter);
      
      // Randomize position within the segment (±10 degrees)
      const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.6);
      
      const targetRotation = rotation + extraRotations + distanceToZero + distanceToPrize + randomOffset;
      
      setRotation(targetRotation);

      setTimeout(() => {
        setSpinning(false);
        stopSound('spin');
        playSound('coin');
        setResult(prizes[winnerIdx]);
        addCoins(prizes[winnerIdx]);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5 }
        });
      }, 5000);
    } else {
      alert("স্পিন করতে ৫০ কয়েন লাগবে!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <Header coins={coins} onBack={() => navigate('/')} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 w-full max-w-md relative z-10">
        <h2 className="text-3xl font-black mb-10 text-secondary tracking-tight">লাকি স্পিন</h2>
        
        <div className="relative mb-20 scale-95 sm:scale-100">
          {/* Outer Ring with border and lights */}
          <div className="absolute inset-[-15px] rounded-full border-[10px] border-secondary bg-white shadow-2xl z-0" />
          
          {/* Decorative Lights */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)] z-20"
              style={{
                top: `${50 - 55 * Math.cos(i * 30 * Math.PI / 180)}%`,
                left: `${50 + 55 * Math.sin(i * 30 * Math.PI / 180)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}

          {/* The Spinning Wheel */}
          <div 
            className="w-72 h-72 rounded-full border-4 border-secondary overflow-hidden relative shadow-inner transition-transform duration-[5000ms] cubic-bezier(0.15, 0, 0.15, 1) z-10"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(
                #ff4d4d 0deg 30deg,
                #ffcc00 30deg 60deg,
                #4CAF50 60deg 90deg,
                #2196F3 90deg 120deg,
                #9c27b0 120deg 150deg,
                #ff8c00 150deg 180deg,
                #e91e63 180deg 210deg,
                #00bcd4 210deg 240deg,
                #ff5722 240deg 270deg,
                #795548 270deg 300deg,
                #607d8b 300deg 330deg,
                #3f51b5 330deg 360deg
              )`
            }}
          >
            {/* Prize Labels */}
            {prizes.map((prize, i) => {
              const segmentAngle = 360 / prizes.length;
              return (
                <div 
                  key={i}
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 origin-bottom flex flex-col items-center pt-6 font-black text-white text-lg drop-shadow-md"
                  style={{ transform: `rotate(${i * segmentAngle + (segmentAngle / 2)}deg) translateX(-50%)` }}
                >
                  {prize}
                </div>
              );
            })}
          </div>
          
          {/* Center Hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full z-30 shadow-xl border-4 border-secondary flex flex-col items-center justify-center">
            <Coins className="w-10 h-10 text-primary" />
          </div>

          {/* Selection Pointer */}
          <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 w-10 h-12 z-40 animate-bounce">
             <div className="text-4xl drop-shadow-lg">👇</div>
          </div>
        </div>

        <button 
          onClick={spin}
          disabled={spinning}
          className={cn(
            "primary-button p-5 w-full max-w-xs font-black text-xl shadow-2xl disabled:opacity-50",
            spinning && "animate-pulse"
          )}
        >
          {spinning ? "ঘুরছে..." : "স্পিন ৫০ কয়েন"}
        </button>
      </div>

      <AnimatePresence>
        {result !== null && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed bottom-20 bg-white/90 backdrop-blur-md px-8 py-4 rounded-full cartoon-border border-accent shadow-2xl font-black text-2xl text-secondary flex items-center gap-3 z-50"
          >
            আপনার পুরস্কার: <span className="text-primary">+{result} কয়েন!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingsScreen() {
  const navigate = useNavigate();
  const { coins, settings, toggleSetting, playSound } = useGameProgress();

  return (
    <div className="min-h-screen flex flex-col items-center p-4 overflow-y-auto pb-24 bg-white">
      <Header coins={coins} onBack={() => navigate('/')} />
      <div className="flex-1 w-full max-w-md px-4 py-6">
        <h2 className="text-3xl font-black mb-8 text-center text-secondary">সেটিংস</h2>
        
        <div className="glass-card p-4 flex flex-col gap-3 bg-white/40">
          <button 
            onClick={() => {
              playSound('click');
              toggleSetting('music');
            }}
            className="glass-panel p-4 rounded-xl flex items-center justify-between font-black text-secondary group active:scale-[0.98] transition-transform text-sm"
          >
            <div className="flex items-center gap-3">
              <Music className={cn("w-5 h-5", !settings.music && "opacity-30")} />
              <span>ব্যাকগ্রাউন্ড মিউজিক</span>
            </div>
            <div className={cn("w-10 h-5 rounded-full relative transition-colors", settings.music ? "bg-green-400" : "bg-slate-300")}>
              <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all", settings.music ? "left-5.5" : "left-0.5")} />
            </div>
          </button>

          <button 
            onClick={() => {
              // Note: toggleSetting already plays click if sound is turned on
              toggleSetting('sound');
            }}
            className="glass-panel p-4 rounded-xl flex items-center justify-between font-black text-secondary group active:scale-[0.98] transition-transform text-sm"
          >
            <div className="flex items-center gap-3">
              {settings.sound ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 opacity-30" />}
              <span>সাউন্ড এফেক্টস</span>
            </div>
            <div className={cn("w-10 h-5 rounded-full relative transition-colors", settings.sound ? "bg-green-400" : "bg-slate-300")}>
              <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all", settings.sound ? "left-5.5" : "left-0.5")} />
            </div>
          </button>

          <button 
            onClick={() => {
              playSound('click');
              toggleSetting('vibration');
            }}
            className="glass-panel p-4 rounded-xl flex items-center justify-between font-black text-secondary group active:scale-[0.98] transition-transform text-sm"
          >
            <div className="flex items-center gap-3">
              {settings.vibration ? <SmartphoneNfc className="w-5 h-5" /> : <Smartphone className="w-5 h-5 opacity-30" />}
              <span>ভাইব্রেশন</span>
            </div>
            <div className={cn("w-10 h-5 rounded-full relative transition-colors", settings.vibration ? "bg-green-400" : "bg-slate-300")}>
              <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all", settings.vibration ? "left-5.5" : "left-0.5")} />
            </div>
          </button>
        </div>

        <div className="mt-12 text-center text-white/60 font-black text-xs uppercase tracking-[0.3em]">
          Version 1.0.4 PRO
        </div>
      </div>
    </div>
  );
}

function ProfileScreen() {
  const navigate = useNavigate();
  const { coins, currentLevel, checkInStreak, unlockedAchievements, playSound } = useGameProgress();

  const achievements = ACHIEVEMENTS.map(ach => ({
    ...ach,
    isUnlocked: unlockedAchievements.includes(ach.id)
  }));

  const [userId] = useState(() => {
    const saved = localStorage.getItem('btb_player_id');
    if (saved) return saved;
    const newId = (Math.floor(Math.random() * 90000) + 10000).toString();
    localStorage.setItem('btb_player_id', newId);
    return newId;
  });

  return (
    <div className="min-h-screen flex flex-col items-center p-4 overflow-y-auto pb-24 bg-white">
      <Header coins={coins} onBack={() => navigate('/')} />
      <div className="flex-1 w-full max-w-md px-4 py-6">
        <div className="glass-card p-6 flex flex-col items-center text-center bg-white relative overflow-hidden">
           <div className="absolute top-[-40px] right-[-40px] w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
           
           <div className="w-24 h-24 bg-white rounded-[2rem] p-1 shadow-2xl mb-4 relative border-4 border-white">
              <div className="w-full h-full bg-slate-100 rounded-[1.8rem] flex items-center justify-center text-4xl">
                👤
              </div>
           </div>
 
           <h2 className="text-2xl font-black text-secondary mb-0.5">প্রোফাইল</h2>
           <p className="text-secondary/40 font-bold mb-6 text-xs">আইডি: #{userId}</p>

           <div className="grid grid-cols-2 gap-3 w-full">
              <div className="bg-white/60 p-4 rounded-[1.5rem] border border-white/80 shadow-inner">
                <div className="text-[10px] font-black text-secondary/40 uppercase mb-0.5">বর্তমান লেভেল</div>
                <div className="text-2xl font-black text-secondary">{currentLevel}</div>
              </div>
              <div className="bg-white/60 p-4 rounded-[1.5rem] border border-white/80 shadow-inner">
                <div className="text-[10px] font-black text-secondary/40 uppercase mb-0.5">ডেইলি স্ট্রাইক</div>
                <div className="text-2xl font-black text-secondary">{checkInStreak}</div>
              </div>
           </div>

           <div className="w-full h-[1px] bg-white/40 my-6" />

           <div className="space-y-3 w-full text-left">
              <div className="flex justify-between items-center px-1 mb-2">
                <h3 className="font-black text-secondary/60 text-[10px] uppercase">অর্জনসমূহ</h3>
                <button 
                  onClick={() => {
                    playSound('click');
                    navigate('/achievements');
                  }}
                  className="text-[9px] font-black text-primary uppercase"
                >
                  সব দেখুন
                </button>
              </div>
              {achievements.slice(0, 3).map((ach, i) => (
                <div key={i} className={cn(
                  "bg-white/40 p-3 rounded-xl border flex items-center gap-3",
                  ach.isUnlocked ? "border-green-200 bg-green-50/30" : "border-white/40 opacity-60"
                )}>
                  <span className="text-xl">{ach.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5 font-bold text-xs">
                      <span>{ach.title}</span>
                      {ach.isUnlocked ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <span className="text-[9px]">🔒</span>}
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

function Leaderboard() {
  const navigate = useNavigate();
  const { coins, currentLevel } = useGameProgress();
  
  // Generate 100 mock players for a realistic leaderboard
  const bengaliNames = [
    "নিশাত", "রাহাত", "সুমন", "আরিফ", "সায়ম", "জান্নাত", "নাবিলা", "রাফি", 
    "মিতু", "তানভীর", "সাদিয়া", "শাকিল", "হাবিবা", "নিশান", "অনিক", "সুমাইয়া", 
    "ফাহিম", "তাসলিমা", "ইমরান", "ফারহানা", "জাহিদ", "রেশমা", "আজিজ", "নুসরাত",
    "সালাম", "বারাকাত", "তামিম", "মুশফিক", "সাকিব", "রিয়াদ", "শান্ত", "মিরাজ",
    "নাহিদ", "রাকিভ", "সায়েম", "তানজিম", "হৃদয়", "আফিফ", "তাসকিন", "শরিফুল",
    "মস্তাফিজ", "এবাদত", "খালেদ", "তাইজুল", "মিরাজ", "মেহেদী", "লিটন", "বিজয়",
    "সৌম্য", "সাব্বির", "নাসির", "আরাফাত", "রুবেল", "শাহাদাত", "রাজ্জাক", "মাশরাফি",
    "আশরাফুল", "শাহরিয়ার", "নাফিস", "জুনায়েদ", "ইমরুল", "রকিবুল", "জুয়েল", "মু রাজ",
    "তুষার", "অলক", "তাপস", "মঞ্জুরুল", "এনামুল", "তালহা", "নাজমুল", "সাহাদাত",
    "শুভাগত", "জহুরুল", "শফিউল", "ইলিয়াশ", "সানি", "আবুল", "রনি", "সোহাগ",
    "আলামিন", "জিয়াউর", "মুক্তার", "তাইবুর", "শামসুর", "মার্শাল", "সৈকত", "জুবায়ের",
    "সাকলাইন", "সানজামুল", "নাসুম", "শরিফুল", "শামিম", "পারভেজ", "তৌহিদ", "জাকের"
  ];

  const allPlayers = Array.from({ length: 99 }, (_, i) => {
    const name = bengaliNames[i % bengaliNames.length] + (i > bengaliNames.length ? ` ${Math.floor(i/bengaliNames.length)}` : "");
    // Generate scores that are generally higher for top ranks but somewhat random
    const baseScore = Math.max(5000 - i * 45, 100);
    const score = baseScore + Math.floor(Math.random() * 50);
    const level = Math.max(150 - Math.floor(i / 1.5), 1);
    
    return { name, score, level, isUser: false };
  });

  // Add real user
  allPlayers.push({ name: "আপনি", score: coins, level: currentLevel, isUser: true });

  // Sort by score
  const sortedPlayers = allPlayers.sort((a, b) => b.score - a.score);

  // Mark ranks after sorting
  const finalPlayers = sortedPlayers.map((p, idx) => ({ ...p, rank: idx + 1 }));

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-slate-50 relative">
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-50/80 backdrop-blur-md">
        <Header coins={coins} onBack={() => navigate('/')} />
      </div>

      <div className="flex-1 w-full max-w-md px-4 pt-20 pb-24">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-secondary tracking-tight">লীডারবোর্ড</h2>
          <p className="text-secondary/40 font-bold text-xs uppercase tracking-widest mt-1">সবচেয়ে মেধাবী ১০০ জন</p>
        </div>
        
        <div className="flex flex-col gap-3">
          {finalPlayers.map((user, idx) => (
            <motion.div 
              key={`${user.name}-${idx}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: Math.min(idx * 0.03, 0.5) }} // Cap delay for long lists
              className={cn(
                "p-3.5 rounded-2xl flex items-center justify-between transition-all border",
                user.isUser 
                  ? "bg-accent/40 border-accent scale-[1.02] shadow-xl z-10 sticky top-[80px] bottom-4" 
                  : "bg-white border-slate-100 shadow-sm"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border-2",
                  user.rank === 1 ? "bg-yellow-100 border-yellow-400 text-yellow-700" :
                  user.rank === 2 ? "bg-slate-100 border-slate-300 text-slate-600" :
                  user.rank === 3 ? "bg-orange-100 border-orange-300 text-orange-700" :
                  "bg-slate-50 border-transparent text-slate-400"
                )}>
                  {user.rank}
                </div>
                <div>
                  <div className="font-black text-base text-secondary leading-none flex items-center gap-2">
                    {user.name}
                    {user.isUser && <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
                  </div>
                  <div className="text-[10px] font-bold text-secondary/40 mt-1 uppercase tracking-wider">লেভেল {user.level}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl font-black text-secondary border border-slate-100">
                <Coins className="text-primary w-4 h-4" />
                <span className="text-sm">{user.score}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-10 py-10 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <p className="text-secondary/30 font-bold text-xs uppercase tracking-[0.2em]">আপনি তালিকার শেষ প্রান্তে পৌঁছেছেন</p>
        </div>
      </div>
    </div>
  );
}

function AchievementsScreen() {
  const navigate = useNavigate();
  const { coins, unlockedAchievements, currentLevel, bestCombo } = useGameProgress();

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-slate-50 overflow-y-auto pb-24">
      <Header coins={coins} onBack={() => navigate('/')} />
      <div className="flex-1 w-full max-w-md px-4 py-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-secondary tracking-tight">অর্জনসমূহ</h2>
          <p className="text-secondary/40 font-bold text-xs uppercase tracking-widest mt-1">আপনার সব অ্যাচিভমেন্ট</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {ACHIEVEMENTS.map((achievement, idx) => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            let progress = 0;
            if (achievement.criteria.type === 'level') progress = currentLevel;
            if (achievement.criteria.type === 'combo') progress = bestCombo;
            if (achievement.criteria.type === 'coins') progress = coins;
            
            const percent = Math.min((progress / achievement.criteria.value) * 100, 100);

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "p-5 rounded-3xl border-2 transition-all relative overflow-hidden",
                  isUnlocked 
                    ? "bg-white border-green-400 shadow-xl" 
                    : "bg-white border-slate-100 opacity-70"
                )}
              >
                {isUnlocked && (
                  <div className="absolute top-0 right-0 p-2 text-green-500">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
                <div className="flex items-start gap-5">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner",
                    isUnlocked ? "bg-green-50" : "bg-slate-100 grayscale"
                  )}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-secondary text-lg leading-tight mb-1">{achievement.title}</h4>
                    <p className="text-secondary/50 font-bold text-xs mb-4">{achievement.description}</p>
                    
                    {!isUnlocked && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-black text-secondary/40 uppercase">
                          <span>প্রগতি</span>
                          <span>{Math.floor(progress)} / {achievement.criteria.value}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>
                    )}
                    
                    {isUnlocked && (
                      <div className="bg-green-50 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black text-green-600 border border-green-100">
                        <Coins className="w-3 h-3" />
                        সংগৃহীত: {achievement.reward}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/spin" element={<SpinWheel />} />
          <Route path="/achievements" element={<AchievementsScreen />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}
