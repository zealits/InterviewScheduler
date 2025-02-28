import React from 'react';

const PremiumGrayLoader = () => {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Outer container with subtle shadow */}
      <div className="relative w-40 h-40 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
        {/* Spinning circles with premium gray palette */}
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-gray-800 animate-spin"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-r-gray-600 animate-spin" style={{ animationDelay: '-0.5s' }}></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-b-gray-400 animate-spin" style={{ animationDelay: '-1s' }}></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-l-gray-300 animate-spin" style={{ animationDelay: '-1.5s' }}></div>
        
        {/* Inner ring with shimmer effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-gray-200 bg-gradient-to-tr from-gray-100 to-gray-50 shadow-inner"></div>
        
        {/* Pulsing center with subtle gradient */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full animate-pulse shadow-md"></div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-100 rounded-full z-10"></div>
      </div>
      
      {/* Loading text with enhanced styling */}
      <div className="text-gray-700 text-lg font-medium tracking-widest uppercase text-center">
        <span className="inline-block animate-pulse">Loading</span>
        <span className="inline-block animate-bounce delay-100">.</span>
        <span className="inline-block animate-bounce delay-200">.</span>
        <span className="inline-block animate-bounce delay-300">.</span>
      </div>
      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default PremiumGrayLoader;