
import React from 'react';
import { Home } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo = ({
  className = '',
  showText = true
}: LogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Home className="h-6 w-6 text-care-600" />
        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-secondary rounded-full" />
      </div>
      {showText && (
        <div>
          <h1 className="text-xl font-bold text-care-800 text-lg md:text-xl">Care Home Connect</h1>
        </div>
      )}
    </div>
  );
};

export default Logo;
