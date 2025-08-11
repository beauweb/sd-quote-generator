import React from 'react';

interface AnimatedLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Definition for gradients and filters */}
        <defs>
          {/* Golden gradient */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="1">
              <animate attributeName="stop-opacity" values="1;0.8;1" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#FFA500" stopOpacity="1">
              <animate attributeName="stop-opacity" values="1;0.9;1" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#FF8C00" stopOpacity="1">
              <animate attributeName="stop-opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          
          {/* Shimmer effect */}
          <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            <animate attributeName="x1" values="0%;100%;0%" dur="2s" repeatCount="indefinite" />
            <animate attributeName="x2" values="100%;200%;100%" dur="2s" repeatCount="indefinite" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main flowing logo shape */}
        <g filter="url(#glow)">
          {/* Primary flowing arc */}
          <path
            d="M20 70 Q40 60 60 50 Q80 40 80 30"
            stroke="url(#goldGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            className="animate-flow-1"
          >
            <animate attributeName="stroke-dasharray" values="0,200;100,200;0,200" dur="4s" repeatCount="indefinite" />
            <animate attributeName="stroke-dashoffset" values="0;-100;-200" dur="4s" repeatCount="indefinite" />
          </path>
          
          {/* Secondary flowing arc */}
          <path
            d="M25 65 Q45 55 65 45 Q85 35 85 25"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            className="animate-flow-2"
          >
            <animate attributeName="stroke-dasharray" values="0,200;100,200;0,200" dur="4.5s" repeatCount="indefinite" />
            <animate attributeName="stroke-dashoffset" values="0;-100;-200" dur="4.5s" repeatCount="indefinite" />
          </path>
          
          {/* Tertiary flowing arc */}
          <path
            d="M30 60 Q50 50 70 40 Q90 30 90 20"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            className="animate-flow-3"
          >
            <animate attributeName="stroke-dasharray" values="0,200;100,200;0,200" dur="5s" repeatCount="indefinite" />
            <animate attributeName="stroke-dashoffset" values="0;-100;-200" dur="5s" repeatCount="indefinite" />
          </path>
          
          {/* Swirling vortex effect */}
          <path
            d="M35 55 Q55 45 75 35"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            className="animate-swirl"
          >
            <animate attributeName="stroke-dasharray" values="0,100;50,100;0,100" dur="3s" repeatCount="indefinite" />
            <animate attributeName="stroke-dashoffset" values="0;-50;-100" dur="3s" repeatCount="indefinite" />
          </path>
        </g>
        
        {/* Shimmer overlay */}
        <rect x="0" y="0" width="100" height="100" fill="url(#shimmerGradient)" opacity="0.3" className="animate-shimmer" />
        
        {/* Floating particles */}
        <circle cx="15" cy="75" r="1.5" fill="#FFD700" className="animate-float-1">
          <animate attributeName="cy" values="75;70;75" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="85" cy="15" r="1" fill="#FFA500" className="animate-float-2">
          <animate attributeName="cx" values="85;88;85" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="45" cy="35" r="0.8" fill="#FF8C00" className="animate-float-3">
          <animate attributeName="r" values="0.8;1.2;0.8" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
      
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-700 animate-pulse"></div>
      
      {/* Pulse rings */}
      <div className="absolute inset-0 rounded-full border border-amber-400/30 animate-ping-ring-1"></div>
      <div className="absolute inset-0 rounded-full border border-yellow-400/20 animate-ping-ring-2" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default AnimatedLogo;
