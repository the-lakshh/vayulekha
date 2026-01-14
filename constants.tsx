
import React from 'react';
import { ColorOption } from './types';

export const COLORS: ColorOption[] = [
  { name: 'Vayu Blue', value: '#50C2F7' },
  { name: 'Lekha Purple', value: '#7D3E98' },
  { name: 'Classic Black', value: '#1E293B' },
  { name: 'Ruby Red', value: '#E11D48' },
  { name: 'Deep Blue', value: '#2563EB' },
  { name: 'Emerald Green', value: '#10B981' },
  { name: 'Vibrant Orange', value: '#F59E0B' },
  { name: 'Coral Pink', value: '#FF6B9D' },
  { name: 'Teal', value: '#4ECDC4' },
  { name: 'Golden Sun', value: '#FACC15' },
];

export const Logo: React.FC<{ className?: string, showText?: boolean }> = ({ className = "w-48 h-48", showText = true }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer Circle Rings */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-30">
        <circle cx="100" cy="100" r="90" fill="none" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="100" cy="100" r="85" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
      </svg>
      
      {/* Main Stylized V */}
      <svg viewBox="0 0 200 200" className="w-[80%] h-[80%] z-10">
        <defs>
          <linearGradient id="vGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#50C2F7" />
            <stop offset="100%" stopColor="#7D3E98" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path 
          d="M50,80 C60,60 80,140 100,140 C120,140 150,50 170,40" 
          fill="none" 
          stroke="url(#vGradient)" 
          strokeWidth="12" 
          strokeLinecap="round"
          className="drop-shadow-sm"
        />
        {/* The Sparkle/Dot */}
        <circle cx="170" cy="40" r="8" fill="white" stroke="#7D3E98" strokeWidth="2" filter="url(#glow)" />
      </svg>
    </div>
    {showText && (
      <div className="mt-2 flex font-bold text-4xl tracking-tight">
        <span className="text-[#50C2F7]">Vayu</span>
        <span className="text-[#7D3E98]">Lekha</span>
      </div>
    )}
  </div>
);

export const ICONS = {
  Back: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  ),
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  ),
  Eraser: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
       <path strokeLinecap="round" strokeLinejoin="round" d="M6.143 7.143L16.857 17.857M5.143 14.143l1.5-1.5a1.5 1.5 0 012.122 0l7.5 7.5a1.5 1.5 0 010 2.122l-1.5 1.5a1.5 1.5 0 01-2.122 0l-7.5-7.5a1.5 1.5 0 010-2.122z" />
    </svg>
  ),
  Sun: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 21v-2.25m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  Moon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  )
};
