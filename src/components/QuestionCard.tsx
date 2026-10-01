import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

interface QuestionCardProps {
  recipientName: string;
  senderName: string;
  customQuestion: string;
  onSelectYes: () => void;
}

const EVADE_MESSAGES = [
  'Nice try! 😜',
  'Too slow! 🏃‍♂️💨',
  'Are you sure? Look at YES! 🥺',
  'Error 404: "No" not found! 🚫',
  'Nice reflexes, but I am faster! ⚡',
  'My heart won\'t let you! ❤️',
  'Resistance is futile! ✨',
  'Just click Yes already! 🚀',
  'Why are you running?! 😂',
  'I can do this all day! 🪽',
  'Destiny says YES! 💫',
];

export const QuestionCard: React.FC<QuestionCardProps> = ({
  recipientName,
  senderName,
  customQuestion,
  onSelectYes,
}) => {
  const [evadeCount, setEvadeCount] = useState(0);
  const [noPosition, setNoPosition] = useState<{ x: number; y: number } | null>(null);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isDodging, setIsDodging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  // Function to move the "No" button to a random spot across the screen/viewport
  const moveNoButton = useCallback(() => {
    sounds.playWhoosh();

    const padding = 60;
    const btnWidth = noBtnRef.current?.offsetWidth || 110;
    const btnHeight = noBtnRef.current?.offsetHeight || 48;

    // Viewport dimensions
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Calculate maximum available coordinates
    const maxX = Math.max(10, vw - btnWidth - padding);
    const maxY = Math.max(10, vh - btnHeight - padding);

    // Generate random coordinates within bounds
    let randomX = Math.floor(Math.random() * (maxX - padding)) + padding;
    let randomY = Math.floor(Math.random() * (maxY - padding)) + padding;

    // Keep it away from the top navigation bar (64px)
    if (randomY < 80) randomY = 90;

    setNoPosition({ x: randomX, y: randomY });
    setEvadeCount((prev) => {
      const nextCount = prev + 1;
      const msgIndex = (nextCount - 1) % EVADE_MESSAGES.length;
      setCurrentMessage(EVADE_MESSAGES[msgIndex]);
      return nextCount;
    });

    setIsDodging(true);
    setTimeout(() => setIsDodging(false), 200);
  }, []);

  // Proximity evasion: if mouse cursor gets within 85px of the No button, evade automatically!
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!noBtnRef.current) return;
      const rect = noBtnRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

      // If user comes dangerously close (< 85px) and isn't currently moving, dodge!
      if (distance < 85) {
        moveNoButton();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [moveNoButton]);

  const handleYesClick = () => {
    sounds.playYesChime();

    // Trigger full screen celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#f472b6', '#ffd1dc'],
    });

    // Second wave confetti
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#e11d48', '#be185d', '#f43f5e'],
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#e11d48', '#be185d', '#f43f5e'],
      });
    }, 250);

    onSelectYes();
  };

  const yesScale = Math.min(1 + evadeCount * 0.05, 1.35);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 select-none"
    >
      {/* Decorative aura behind card */}
      <div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-rose-200/40 blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Proposal Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg bg-white/90 backdrop-blur-xl border border-rose-100 shadow-xl shadow-rose-100/60 rounded-3xl p-6 sm:p-10 text-center relative"
      >
        {/* Subtle Greeting */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-rose-500 font-medium mb-3">
          <span>{senderName ? `From ${senderName}` : 'A special question'}</span>
          <span aria-hidden="true">·</span>
          <span>{recipientName ? `For ${recipientName}` : 'Just for you'}</span>
        </div>

        {/* Floating Heart Mascot / Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 mb-5 shadow-xs">
          <Heart className="w-8 h-8 fill-rose-500 text-rose-500 animate-pulse-subtle" />
        </div>

        {/* The Question */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight text-balance mb-4">
          {customQuestion || 'Do you want to date with me?'}
        </h1>

        <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
          {evadeCount > 0 ? (
            <span className="text-rose-600 font-medium">
              You tried to click &apos;No&apos; {evadeCount} {evadeCount === 1 ? 'time' : 'times'}! But fate has other plans... 💕
            </span>
          ) : (
            'Choose carefully... there is truly only one right answer waiting for you. ✨'
          )}
        </p>

        {/* The Buttons Area */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 min-h-[56px] relative">
          {/* YES Button */}
          <motion.button
            animate={{ scale: yesScale }}
            whileHover={{ scale: yesScale * 1.05 }}
            whileTap={{ scale: yesScale * 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={handleYesClick}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold rounded-2xl shadow-lg shadow-rose-300/50 hover:shadow-xl hover:shadow-rose-400/50 transition-all flex items-center justify-center gap-2 cursor-pointer z-10 whitespace-nowrap"
          >
            <Sparkles className="w-5 h-5 text-rose-100" />
            <span className="text-base sm:text-lg">Yes, I’d love to!</span>
            <Heart className="w-5 h-5 fill-white text-white" />
          </motion.button>

          {/* Initial Static Placement Placeholder for NO button */}
          {!noPosition && (
            <button
              ref={noBtnRef}
              onMouseEnter={moveNoButton}
              onTouchStart={(e) => {
                e.preventDefault();
                moveNoButton();
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                moveNoButton();
              }}
              onClick={(e) => {
                e.preventDefault();
                moveNoButton();
              }}
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-2xl border border-slate-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              No
            </button>
          )}
        </div>

        {/* Evasion Counter Pill / Status */}
        {evadeCount > 0 && (
          <div className="mt-8 pt-4 border-t border-rose-50 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>Dodges: <strong className="text-rose-600 font-semibold">{evadeCount}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Speed: <strong className="text-slate-700">Untouchable</strong></span>
          </div>
        )}
      </motion.div>

      {/* FLYING NO BUTTON (When activated, positioned fixed across the whole screen) */}
      {noPosition && (
        <motion.div
          style={{
            position: 'fixed',
            left: `${noPosition.x}px`,
            top: `${noPosition.y}px`,
            zIndex: 50,
          }}
          initial={false}
          animate={{
            x: 0,
            y: 0,
            rotate: isDodging ? (Math.random() > 0.5 ? 12 : -12) : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 450,
            damping: 26,
            mass: 0.8,
          }}
          className="relative inline-block pointer-events-auto"
        >
          {/* Speech bubble / Reaction badge above the evasive No button */}
          <AnimatePresence mode="wait">
            {currentMessage && (
              <motion.div
                key={evadeCount}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -8, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-lg whitespace-nowrap shadow-md pointer-events-none"
              >
                {currentMessage}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            ref={noBtnRef}
            onMouseEnter={moveNoButton}
            onTouchStart={(e) => {
              e.preventDefault();
              moveNoButton();
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              moveNoButton();
            }}
            onClick={(e) => {
              e.preventDefault();
              moveNoButton();
            }}
            className="px-6 py-3 bg-white text-slate-700 font-medium rounded-2xl shadow-xl border border-rose-200 hover:border-rose-400 transition-all cursor-pointer whitespace-nowrap text-sm flex items-center gap-1.5"
          >
            <span>No 🏃💨</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
