
import React from 'react';

const KidBackground: React.FC = () => {
  return (
    <div className="bg-animation">
      {[...Array(8)].map((_, i) => (
        <div 
          key={i} 
          className="bubble" 
          style={{
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 10 + 10}s`,
            background: i % 2 === 0 ? 'rgba(254, 215, 170, 0.4)' : 'rgba(186, 230, 253, 0.4)'
          }}
        />
      ))}
      {/* Cartoon-like clouds */}
      <div className="absolute top-[10%] left-[5%] w-32 h-16 bg-white opacity-60 rounded-full floating blur-md"></div>
      <div className="absolute top-[20%] right-[10%] w-48 h-20 bg-white opacity-50 rounded-full floating blur-lg" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[15%] left-[20%] w-40 h-16 bg-white opacity-40 rounded-full floating blur-md" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default KidBackground;
