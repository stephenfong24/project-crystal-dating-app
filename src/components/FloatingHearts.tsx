import React, { useMemo } from 'react';

interface Particle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  symbol: string;
}

export const FloatingHearts: React.FC = () => {
  const particles: Particle[] = useMemo(() => {
    const symbols = ['♥', '💖', '🌸', '✨', '💕', '🌷', '💘'];
    return Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: Math.floor(Math.random() * 96) + 2, // 2% to 98%
      size: Math.floor(Math.random() * 14) + 12, // 12px to 26px
      duration: Math.floor(Math.random() * 10) + 12, // 12s to 22s
      delay: Math.floor(Math.random() * 15), // 0s to 15s
      opacity: (Math.random() * 0.35 + 0.2), // 0.2 to 0.55
      symbol: symbols[i % symbols.length],
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute select-none font-serif text-rose-300"
          style={{
            left: `${p.left}%`,
            bottom: '-40px',
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animation: `float-heart ${p.duration}s infinite linear`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.symbol}
        </div>
      ))}
    </div>
  );
};
