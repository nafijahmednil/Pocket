import React from 'react';

interface PocketLogoProps {
  size?: number;
  className?: string;
}

export const PocketLogo: React.FC<PocketLogoProps> = ({ size = 34, className = '' }) => {
  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-sm ${className}`}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #FF6D00 0%, #E65100 100%)',
      }}
    >
      <svg
        viewBox="0 0 48 48"
        width={size * 0.72}
        height={size * 0.72}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 10H26C31.5228 10 36 14.4772 36 20C36 25.5228 31.5228 30 26 30H20V38H14V10Z"
          fill="white"
        />
        <circle cx="25" cy="20" r="4.5" fill="#FF6D00" />
      </svg>
    </div>
  );
};
