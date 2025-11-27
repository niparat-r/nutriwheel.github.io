import React, { useEffect, useState } from 'react';

interface SpinWheelProps {
  onSpin: () => void;
  isSpinning: boolean;
  label: string;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ onSpin, isSpinning, label }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isSpinning) {
      // Add a large amount of rotation (5 full spins + random)
      const newRotation = rotation + 1800 + Math.random() * 360;
      setRotation(newRotation);
    }
  }, [isSpinning]);

  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#a78bfa'];
  
  return (
    <div className="relative w-64 h-64 mx-auto my-6">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-slate-800 drop-shadow-md"></div>
      </div>

      {/* Wheel Container */}
      <div 
        className="w-full h-full rounded-full border-4 border-white shadow-xl overflow-hidden transition-transform duration-[3000ms] cubic-bezier(0.25, 0.1, 0.25, 1)"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {colors.map((color, i) => {
            const angle = 360 / colors.length;
            const startAngle = (i * angle * Math.PI) / 180;
            const endAngle = ((i + 1) * angle * Math.PI) / 180;
            const x1 = 50 + 50 * Math.cos(startAngle);
            const y1 = 50 + 50 * Math.sin(startAngle);
            const x2 = 50 + 50 * Math.cos(endAngle);
            const y2 = 50 + 50 * Math.sin(endAngle);

            return (
              <path
                key={i}
                d={`M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`}
                fill={color}
              />
            );
          })}
        </svg>
      </div>

      {/* Center Button */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <button
          onClick={onSpin}
          disabled={isSpinning}
          className="bg-white text-slate-800 font-bold rounded-full w-20 h-20 shadow-lg border-4 border-slate-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-80"
        >
          {isSpinning ? "..." : "SPIN"}
        </button>
      </div>
    </div>
  );
};

export default SpinWheel;