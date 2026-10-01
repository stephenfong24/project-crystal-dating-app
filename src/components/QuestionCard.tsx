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
  const [isExploding, setIsExploding] = useState(false);
  const [isBlownUp, setIsBlownUp] = useState(false);
  const [explosionCoords, setExplosionCoords] = useState<{ x: number; y: number } | null>(null);
  const [showBlastEffect, setShowBlastEffect] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  // Trigger the dramatic blow-up explosion sequence
  const triggerBlowUp = useCallback(() => {
    if (isExploding || isBlownUp) return;

    // Get current button coordinates for the explosion center
    let blastX = window.innerWidth / 2;
    let blastY = window.innerHeight / 2;
    if (noBtnRef.current) {
      const rect = noBtnRef.current.getBoundingClientRect();
      blastX = rect.left + rect.width / 2;
      blastY = rect.top + rect.height / 2;
    } else if (noPosition) {
      blastX = noPosition.x + 55;
      blastY = noPosition.y + 24;
    }

    setExplosionCoords({ x: blastX, y: blastY });
    setIsExploding(true);
    setCurrentMessage('⚠️ OVERHEATING! 💥');

    // Stage 1: Shaking and ticking warning for 350ms, then KABOOM!
    setTimeout(() => {
      sounds.playExplosion();
      setIsExploding(false);
      setIsBlownUp(true);
      setShowBlastEffect(true);

      // Canvas confetti fire/smoke explosion at exact button coordinates
      const originX = Math.max(0.05, Math.min(0.95, blastX / window.innerWidth));
      const originY = Math.max(0.05, Math.min(0.95, blastY / window.innerHeight));

      confetti({
        particleCount: 80,
        spread: 90,
        startVelocity: 38,
        origin: { x: originX, y: originY },
        colors: ['#ff1744', '#ff5722', '#ff9800', '#ffeb3b', '#263238', '#f8bbd0'],
      });

      // Extra secondary shockwave
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 120,
          startVelocity: 22,
          origin: { x: originX, y: originY },
          colors: ['#f43f5e', '#fb7185', '#cbd5e1'],
        });
      }, 120);

      // Hide temporary blast particle elements after animation finishes
      setTimeout(() => {
        setShowBlastEffect(false);
      }, 2500);
    }, 400);
  }, [isExploding, isBlownUp, noPosition]);

  // Main interaction handler: if user tries to click/interact more than 2 times, BLOW IT UP!
  const handleNoInteraction = useCallback(() => {
    if (isBlownUp || isExploding) return;

    // If user has already tried 2 times, this attempt is "more than 2 times" -> BLOW UP!
    if (evadeCount >= 2) {
      triggerBlowUp();
      return;
    }

    // Otherwise fly away normally
    sounds.playWhoosh();

    const padding = 60;
    const btnWidth = noBtnRef.current?.offsetWidth || 110;
    const btnHeight = noBtnRef.current?.offsetHeight || 48;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const maxX = Math.max(10, vw - btnWidth - padding);
    const maxY = Math.max(10, vh - btnHeight - padding);

    let randomX = Math.floor(Math.random() * (maxX - padding)) + padding;
    let randomY = Math.floor(Math.random() * (maxY - padding)) + padding;

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
  }, [evadeCount, isBlownUp, isExploding, triggerBlowUp]);

  // Proximity evasion / explosion trigger
  useEffect(() => {
    if (isBlownUp || isExploding) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!noBtnRef.current || isBlownUp || isExploding) return;
      const rect = noBtnRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

      if (distance < 80) {
        handleNoInteraction();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleNoInteraction, isBlownUp, isExploding]);

  const handleYesClick = () => {
    sounds.playYesChime();

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#f472b6', '#ffd1dc'],
    });

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

  const handleReviveButton = () => {
    sounds.playPop();
    setIsBlownUp(false);
    setIsExploding(false);
    setShowBlastEffect(false);
    setNoPosition(null);
    setEvadeCount(0);
    setCurrentMessage('');
  };

  const yesScale = isBlownUp ? 1.25 : Math.min(1 + evadeCount * 0.07, 1.35);

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

        {/* Dynamic status feedback */}
        <div className="min-h-[48px] flex items-center justify-center mb-8">
          {isBlownUp ? (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm font-medium flex items-center gap-2 shadow-xs"
            >
              <span className="text-xl">💥</span>
              <span>
                <strong>BOOM!</strong> The &quot;No&quot; button literally blew up! There is only one choice left in the universe! 💕
              </span>
            </motion.div>
          ) : (
            <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              {evadeCount > 0 ? (
                <span className="text-rose-600 font-medium">
                  Attempt {evadeCount} of 2... Careful! Trying to click &apos;No&apos; more than 2 times might cause it to blow up! 💣
                </span>
              ) : (
                'Choose carefully... there is truly only one right answer waiting for you. ✨'
              )}
            </p>
          )}
        </div>

        {/* The Buttons Area */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 min-h-[56px] relative">
          {/* YES Button */}
          <motion.button
            animate={{
              scale: yesScale,
              boxShadow: isBlownUp
                ? '0 20px 30px -10px rgba(244, 63, 94, 0.45)'
                : '0 10px 20px -5px rgba(244, 63, 94, 0.3)',
            }}
            whileHover={{ scale: yesScale * 1.05 }}
            whileTap={{ scale: yesScale * 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={handleYesClick}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold rounded-2xl shadow-lg shadow-rose-300/50 hover:shadow-xl hover:shadow-rose-400/50 transition-all flex items-center justify-center gap-2 cursor-pointer z-10 whitespace-nowrap"
          >
            <Sparkles className="w-5 h-5 text-rose-100" />
            <span className="text-base sm:text-lg">
              {isBlownUp ? 'YES! (Only Option Left)' : 'Yes, I’d love to!'}
            </span>
            <Heart className="w-5 h-5 fill-white text-white" />
          </motion.button>

          {/* Initial Static Placement Placeholder for NO button (if not flying and not blown up) */}
          {!noPosition && !isBlownUp && (
            <button
              ref={noBtnRef}
              onMouseEnter={handleNoInteraction}
              onTouchStart={(e) => {
                e.preventDefault();
                handleNoInteraction();
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                handleNoInteraction();
              }}
              onClick={(e) => {
                e.preventDefault();
                handleNoInteraction();
              }}
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-2xl border border-slate-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              No
            </button>
          )}
        </div>

        {/* Evasion Counter / Status Footer */}
        <div className="mt-8 pt-4 border-t border-rose-50 flex items-center justify-center gap-2 text-xs text-slate-500">
          {isBlownUp ? (
            <button
              type="button"
              onClick={handleReviveButton}
              className="text-rose-600 hover:text-rose-700 font-medium underline underline-offset-4 cursor-pointer"
            >
              Want to blow it up again? Reset No button 🔄
            </button>
          ) : (
            <>
              <span>
                Dodges: <strong className="text-rose-600 font-semibold">{evadeCount}</strong> / 2
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Destiny: <strong className="text-slate-700">Inevitable</strong>
              </span>
            </>
          )}
        </div>
      </motion.div>

      {/* FLYING NO BUTTON (When activated & not yet blown up) */}
      {noPosition && !isBlownUp && (
        <motion.div
          style={{
            position: 'fixed',
            left: `${noPosition.x}px`,
            top: `${noPosition.y}px`,
            zIndex: 50,
          }}
          initial={false}
          animate={
            isExploding
              ? {
                  x: [0, -6, 6, -8, 8, -4, 4, 0],
                  y: [0, 4, -4, 6, -6, 3, -3, 0],
                  scale: [1, 1.15, 1.25, 1.35],
                  rotate: [0, -12, 12, -18, 18, 0],
                }
              : {
                  x: 0,
                  y: 0,
                  rotate: isDodging ? (Math.random() > 0.5 ? 12 : -12) : 0,
                }
          }
          transition={
            isExploding
              ? { duration: 0.38, repeat: Infinity }
              : { type: 'spring', stiffness: 450, damping: 26, mass: 0.8 }
          }
          className="relative inline-block pointer-events-auto"
        >
          {/* Reaction message speech bubble above the No button */}
          <AnimatePresence mode="wait">
            {currentMessage && (
              <motion.div
                key={isExploding ? 'exploding' : evadeCount}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -8, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap shadow-md pointer-events-none ${
                  isExploding ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-900 text-white'
                }`}
              >
                {currentMessage}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${
                    isExploding ? 'border-t-red-600' : 'border-t-slate-900'
                  }`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            ref={noBtnRef}
            onMouseEnter={handleNoInteraction}
            onTouchStart={(e) => {
              e.preventDefault();
              handleNoInteraction();
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              handleNoInteraction();
            }}
            onClick={(e) => {
              e.preventDefault();
              handleNoInteraction();
            }}
            className={`px-6 py-3 font-medium rounded-2xl shadow-xl transition-all cursor-pointer whitespace-nowrap text-sm flex items-center gap-1.5 ${
              isExploding
                ? 'bg-red-500 text-white border-2 border-yellow-300 ring-4 ring-red-400 shadow-red-500/50'
                : 'bg-white text-slate-700 border border-rose-200 hover:border-rose-400'
            }`}
          >
            <span>{isExploding ? '💥 BOOM! 💥' : 'No 🏃💨'}</span>
          </button>
        </motion.div>
      )}

      {/* EPIC EXPLOSION SHOCKWAVE & DEBRIS PARTICLES EFFECT */}
      {showBlastEffect && explosionCoords && (
        <div
          style={{
            position: 'fixed',
            left: `${explosionCoords.x}px`,
            top: `${explosionCoords.y}px`,
            zIndex: 60,
            pointerEvents: 'none',
          }}
        >
          {/* Expanding shockwave ring 1 */}
          <motion.div
            initial={{ scale: 0.2, opacity: 1, borderWidth: '8px' }}
            animate={{ scale: 3.5, opacity: 0, borderWidth: '1px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute -top-12 -left-12 w-24 h-24 rounded-full border-red-500 bg-orange-400/20"
          />

          {/* Expanding shockwave ring 2 */}
          <motion.div
            initial={{ scale: 0.1, opacity: 1, borderWidth: '12px' }}
            animate={{ scale: 2.8, opacity: 0, borderWidth: '2px' }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute -top-10 -left-10 w-20 h-20 rounded-full border-yellow-400 bg-yellow-300/30"
          />

          {/* Central Comic "💥 KABOOM!" badge */}
          <motion.div
            initial={{ scale: 0, rotate: -25, opacity: 1 }}
            animate={{ scale: [0, 1.4, 1.1], rotate: [0, 10, -5], opacity: [1, 1, 0] }}
            transition={{ duration: 0.9, times: [0, 0.4, 1] }}
            className="absolute -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white font-extrabold text-2xl tracking-wider rounded-2xl shadow-2xl border-2 border-yellow-200 whitespace-nowrap"
          >
            💥 KABOOM!
          </motion.div>

          {/* Radial explosive debris particles */}
          {[
            { angle: 0, dist: 110, icon: '💥' },
            { angle: 25, dist: 140, icon: '🔥' },
            { angle: 50, dist: 95, icon: '💨' },
            { angle: 75, dist: 130, icon: '✨' },
            { angle: 100, dist: 105, icon: '💔' },
            { angle: 130, dist: 150, icon: '💥' },
            { angle: 160, dist: 120, icon: '🔥' },
            { angle: 190, dist: 135, icon: '💨' },
            { angle: 220, dist: 115, icon: '⚡' },
            { angle: 250, dist: 145, icon: '💥' },
            { angle: 280, dist: 100, icon: '🔥' },
            { angle: 310, dist: 130, icon: '💨' },
            { angle: 335, dist: 125, icon: '✨' },
          ].map((part, i) => {
            const rad = (part.angle * Math.PI) / 180;
            const targetX = Math.cos(rad) * part.dist;
            const targetY = Math.sin(rad) * part.dist;
            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 0.6, opacity: 1 }}
                animate={{
                  x: targetX,
                  y: targetY,
                  scale: [0.6, 1.3, 0.4],
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
                className="absolute text-xl sm:text-2xl select-none"
              >
                {part.icon}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
