import React from 'react';

interface CrosshairProps {
  x: number;
  y: number;
  visible: boolean;
  isFiring?: boolean;
}

export const Crosshair: React.FC<CrosshairProps> = ({ x, y, visible, isFiring }) => {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 transition-opacity duration-150"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Outer pulsing neon ring */}
      <div
        className={`relative flex items-center justify-center rounded-full border-[3px] border-[#00ff66] transition-transform duration-75 ${
          isFiring ? 'scale-125 border-[#ff0033]' : 'anim-pulso-mira'
        }`}
        style={{
          width: '58px',
          height: '58px',
          boxShadow: isFiring
            ? '0 0 25px #ff0033, 0 0 40px #ff0033, inset 0 0 15px #ff0033'
            : '0 0 15px #00ff66, 0 0 25px #00ff66, inset 0 0 10px #00ff66',
        }}
      >
        {/* Dashed outer magenta ring */}
        <div
          className="absolute -inset-[6px] rounded-full border border-dashed border-[#ff007f]"
          style={{ boxShadow: '0 0 8px #ff007f' }}
        />

        {/* Horizontal crosshair */}
        <div
          className="absolute top-1/2 left-1/2 h-[3px] w-[70px] -translate-x-1/2 -translate-y-1/2 bg-[#00ff66]"
          style={{ boxShadow: '0 0 10px #00ff66' }}
        />

        {/* Vertical crosshair */}
        <div
          className="absolute top-1/2 left-1/2 h-[70px] w-[3px] -translate-x-1/2 -translate-y-1/2 bg-[#00ff66]"
          style={{ boxShadow: '0 0 10px #00ff66' }}
        />

        {/* Glowing red laser core */}
        <div
          className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff0033]"
          style={{
            boxShadow: '0 0 12px #ff0033, 0 0 20px #ff0033, 0 0 30px #ff0033',
          }}
        >
          {/* Super bright center pin */}
          <div className="absolute inset-[3px] rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
};
