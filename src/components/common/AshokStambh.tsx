import React from 'react';

interface AshokStambhProps {
  className?: string;
  size?: number;
}

export const AshokStambh: React.FC<AshokStambhProps> = ({ className = 'text-amber-500', size = 38 }) => {
  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 100 125"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="National Emblem of India"
    >
      {/* Ashok Stambh stylized vector */}
      <g>
        {/* Crown / Top capital */}
        <circle cx="50" cy="14" r="5" fill="currentColor" opacity="0.9" />
        <path
          d="M38 22 C38 18, 62 18, 62 22 L66 32 C66 36, 34 36, 34 32 Z"
          fill="currentColor"
        />
        {/* Triple Lions Profile */}
        <path
          d="M28 32 C24 30, 20 38, 26 44 C28 46, 32 44, 34 40 Z"
          fill="currentColor"
          opacity="0.85"
        />
        <path
          d="M72 32 C76 30, 80 38, 74 44 C72 46, 68 44, 66 40 Z"
          fill="currentColor"
          opacity="0.85"
        />
        {/* Center Lion Head */}
        <path
          d="M40 32 C40 26, 60 26, 60 32 C62 38, 58 48, 50 49 C42 48, 38 38, 40 32 Z"
          fill="currentColor"
        />
        {/* Mane / Throat */}
        <path
          d="M36 46 C42 54, 58 54, 64 46 C60 58, 40 58, 36 46 Z"
          fill="currentColor"
          opacity="0.9"
        />
        {/* Abacus platform */}
        <rect x="22" y="58" width="56" height="6" rx="2" fill="currentColor" />
        {/* Ashoka Chakra in Center */}
        <circle cx="50" cy="72" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="72" r="2" fill="currentColor" />
        {/* 8 representative spokes */}
        <line x1="50" y1="64" x2="50" y2="80" stroke="currentColor" strokeWidth="1.5" />
        <line x1="42" y1="72" x2="58" y2="72" stroke="currentColor" strokeWidth="1.5" />
        <line x1="44.3" y1="66.3" x2="55.7" y2="77.7" stroke="currentColor" strokeWidth="1.2" />
        <line x1="44.3" y1="77.7" x2="55.7" y2="66.3" stroke="currentColor" strokeWidth="1.2" />

        {/* Bull on right, Horse on left (stylized glyphs) */}
        <ellipse cx="32" cy="72" rx="4" ry="3" fill="currentColor" opacity="0.75" />
        <ellipse cx="68" cy="72" rx="4" ry="3" fill="currentColor" opacity="0.75" />

        {/* Inverted Lotus Pedestal */}
        <path
          d="M20 82 C25 80, 75 80, 80 82 L76 92 C60 97, 40 97, 24 92 Z"
          fill="currentColor"
          opacity="0.95"
        />
        <rect x="18" y="93" width="64" height="4" rx="1.5" fill="currentColor" />

        {/* Satyameva Jayate Banner text representation */}
        <path
          d="M24 103 Q50 106 76 103 L74 107 Q50 110 26 107 Z"
          fill="currentColor"
          opacity="0.8"
        />
        <text
          x="50"
          y="118"
          fontSize="9"
          fontWeight="bold"
          textAnchor="middle"
          fill="currentColor"
          fontFamily="serif"
          letterSpacing="1"
        >
          सत्यमेव जयते
        </text>
      </g>
    </svg>
  );
};
