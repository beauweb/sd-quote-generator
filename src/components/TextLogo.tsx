import React from 'react';

interface TextLogoProps {
  className?: string;
}

export const TextLogo: React.FC<TextLogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent animate-gradient-x">
        Ankahi Baat
      </div>
      <div className="text-xs text-text-secondary font-medium tracking-wider animate-fade-in">
        Express the Unspoken
      </div>
    </div>
  );
};

export default TextLogo;
