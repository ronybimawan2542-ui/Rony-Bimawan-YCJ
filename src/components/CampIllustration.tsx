import React from 'react';

interface IllustrationProps {
  type: 'campfire' | 'pine' | 'mountain' | 'lake' | 'night' | 'cooking';
  className?: string;
}

export const CampIllustration: React.FC<IllustrationProps> = ({ type, className = 'w-full h-48' }) => {
  if (type === 'campfire' || type === 'night') {
    return (
      <div className={`relative overflow-hidden bg-slate-900 flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 600 340" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Deep flat night sky */}
          <rect width="600" height="340" fill="#0f172a" />
          
          {/* Flat Stars */}
          <circle cx="80" cy="50" r="2" fill="#bae6fd" />
          <circle cx="150" cy="80" r="1.5" fill="#f8fafc" />
          <circle cx="220" cy="40" r="2" fill="#bae6fd" />
          <circle cx="340" cy="65" r="2.5" fill="#f8fafc" />
          <circle cx="450" cy="45" r="1.5" fill="#fde68a" />
          <circle cx="520" cy="90" r="2" fill="#f8fafc" />
          <circle cx="560" cy="35" r="1.5" fill="#bae6fd" />

          {/* Crescent Moon */}
          <path d="M490 50 A 24 24 0 1 0 490 98 A 20 20 0 1 1 490 50 Z" fill="#fef08a" />

          {/* Mountain Silhouettes (Mt Salak & Gede - Flat layers) */}
          <polygon points="40,240 180,110 320,240" fill="#1e293b" />
          <polygon points="220,240 380,85 540,240" fill="#334155" />
          <polygon points="360,240 480,130 600,240" fill="#1e293b" />

          {/* Pine Trees Flat */}
          <polygon points="50,260 70,200 90,260" fill="#064e3b" />
          <polygon points="55,230 70,180 85,230" fill="#047857" />
          <polygon points="100,270 125,190 150,270" fill="#064e3b" />
          <polygon points="108,230 125,170 142,230" fill="#059669" />
          <polygon points="480,270 505,190 530,270" fill="#064e3b" />
          <polygon points="520,265 545,195 570,265" fill="#047857" />

          {/* Grass Floor */}
          <rect x="0" y="240" width="600" height="100" fill="#065f46" />
          <rect x="0" y="270" width="600" height="70" fill="#022c22" />

          {/* Cozy Dome Tent */}
          <path d="M130 290 Q 200 170 270 290 Z" fill="#38bdf8" />
          <polygon points="160,290 200,210 240,290" fill="#0284c7" />
          {/* Tent Door / Warm Light Interior */}
          <polygon points="180,290 200,240 220,290" fill="#f59e0b" />
          <line x1="200" y1="240" x2="200" y2="290" stroke="#b45309" strokeWidth="2" />

          {/* Campfire Pit with Flat Stones */}
          <ellipse cx="370" cy="295" rx="36" ry="12" fill="#475569" />
          <circle cx="340" cy="295" r="7" fill="#64748b" />
          <circle cx="355" cy="301" r="8" fill="#475569" />
          <circle cx="375" cy="302" r="9" fill="#64748b" />
          <circle cx="395" cy="298" r="8" fill="#475569" />
          <circle cx="390" cy="290" r="7" fill="#64748b" />
          <circle cx="350" cy="289" r="7" fill="#475569" />

          {/* Wood Logs Flat */}
          <line x1="345" y1="298" x2="395" y2="288" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
          <line x1="395" y1="298" x2="345" y2="288" stroke="#92400e" strokeWidth="8" strokeLinecap="round" />

          {/* Flat Campfire Flames (No gradients!) */}
          <path d="M370 240 Q 388 275 378 290 Q 362 290 352 275 Q 360 255 370 240 Z" fill="#ea580c" />
          <path d="M370 252 Q 382 278 375 290 Q 365 290 358 278 Q 364 262 370 252 Z" fill="#f97316" />
          <path d="M370 264 Q 378 280 373 290 Q 367 290 362 280 Q 366 270 370 264 Z" fill="#fbbf24" />

          {/* Portable Camp Kettle on small stand */}
          <rect x="420" y="275" width="28" height="22" rx="4" fill="#94a3b8" />
          <rect x="424" y="269" width="20" height="6" rx="2" fill="#64748b" />
          <path d="M422 280 Q 412 283 416 273" stroke="#64748b" strokeWidth="3" fill="none" />
          <path d="M428 269 Q 434 258 440 269" stroke="#334155" strokeWidth="3" fill="none" />
          {/* Steam Flat */}
          <path d="M414 268 Q 411 260 415 254" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    );
  }

  if (type === 'pine') {
    return (
      <div className={`relative overflow-hidden bg-sky-100 flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 600 340" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Flat Day Sky */}
          <rect width="600" height="340" fill="#e0f2fe" />
          <circle cx="480" cy="80" r="32" fill="#fbbf24" />

          {/* Distant Hills */}
          <polygon points="0,220 180,140 380,230" fill="#94a3b8" />
          <polygon points="160,230 360,110 560,230" fill="#cbd5e1" />
          <polygon points="320,230 480,150 600,230" fill="#94a3b8" />

          {/* Midground Pine Forest */}
          <polygon points="30,250 60,150 90,250" fill="#047857" />
          <polygon points="70,250 100,130 130,250" fill="#065f46" />
          <polygon points="110,250 140,160 170,250" fill="#059669" />
          <polygon points="430,250 460,130 490,250" fill="#047857" />
          <polygon points="470,250 500,150 530,250" fill="#065f46" />

          {/* Grass Floor */}
          <rect x="0" y="240" width="600" height="100" fill="#15803d" />
          <rect x="0" y="280" width="600" height="60" fill="#166534" />

          {/* A-Frame Tent */}
          <polygon points="200,290 270,180 340,290" fill="#f97316" />
          <polygon points="270,180 340,290 390,270 320,170" fill="#ea580c" />
          {/* Guyline ropes */}
          <line x1="270" y1="180" x2="160" y2="295" stroke="#78350f" strokeWidth="2" />
          <line x1="320" y1="170" x2="430" y2="280" stroke="#78350f" strokeWidth="2" />

          {/* Camping Folding Chair */}
          <rect x="420" y="260" width="35" height="6" rx="2" fill="#0284c7" />
          <rect x="423" y="235" width="28" height="25" rx="3" fill="#38bdf8" />
          <line x1="422" y1="265" x2="415" y2="295" stroke="#334155" strokeWidth="3" />
          <line x1="452" y1="265" x2="460" y2="295" stroke="#334155" strokeWidth="3" />
          <line x1="418" y1="265" x2="456" y2="295" stroke="#64748b" strokeWidth="2" />
          <line x1="452" y1="265" x2="418" y2="295" stroke="#64748b" strokeWidth="2" />

          {/* Camp Table & Tin Mug */}
          <rect x="360" y="275" width="40" height="6" rx="2" fill="#d97706" />
          <line x1="365" y1="281" x2="363" y2="296" stroke="#78350f" strokeWidth="3" />
          <line x1="395" y1="281" x2="397" y2="296" stroke="#78350f" strokeWidth="3" />
          <rect x="375" y="267" width="12" height="9" rx="1" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
          <path d="M387 269 Q 391 271 387 274" stroke="#64748b" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    );
  }

  if (type === 'cooking') {
    return (
      <div className={`relative overflow-hidden bg-amber-50 flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 600 340" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wooden Camp Table Background */}
          <rect width="600" height="340" fill="#fef3c7" />
          {/* Wood Planks */}
          <line x1="0" y1="70" x2="600" y2="70" stroke="#fde68a" strokeWidth="3" />
          <line x1="0" y1="150" x2="600" y2="150" stroke="#fde68a" strokeWidth="3" />
          <line x1="0" y1="230" x2="600" y2="230" stroke="#fde68a" strokeWidth="3" />
          <line x1="0" y1="310" x2="600" y2="310" stroke="#fde68a" strokeWidth="3" />

          {/* Gas Canister (Green Primus/Alpine canister) */}
          <ellipse cx="300" cy="275" rx="55" ry="20" fill="#15803d" />
          <rect x="245" y="225" width="110" height="50" rx="6" fill="#16a34a" />
          <ellipse cx="300" cy="225" rx="55" ry="18" fill="#22c55e" />
          <rect x="290" y="205" width="20" height="20" rx="3" fill="#64748b" />

          {/* Burner Head & Flat Flame */}
          <polygon points="275,190 325,190 310,205 290,205" fill="#475569" />
          {/* Flat Blue Camp Flame */}
          <polygon points="280,186 288,172 295,186" fill="#38bdf8" />
          <polygon points="293,186 300,168 307,186" fill="#0284c7" />
          <polygon points="305,186 312,172 320,186" fill="#38bdf8" />

          {/* Camping Titanium Pot */}
          <rect x="240" y="115" width="120" height="70" rx="8" fill="#94a3b8" />
          <line x1="240" y1="130" x2="360" y2="130" stroke="#64748b" strokeWidth="2" />
          {/* Pot Handles */}
          <path d="M240 135 L 215 135 L 215 165 L 240 165" stroke="#f97316" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M360 135 L 385 135 L 385 165 L 360 165" stroke="#f97316" strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* Ramen Broth & Toppings */}
          <ellipse cx="300" cy="120" rx="54" ry="14" fill="#d97706" />
          {/* Yellow Noodles */}
          <path d="M265 120 Q 280 115 295 122 Q 310 118 335 120" stroke="#fbbf24" strokeWidth="4" fill="none" />
          <path d="M270 123 Q 290 126 315 122 Q 330 125 340 122" stroke="#fef08a" strokeWidth="3" fill="none" />
          {/* Soft Boiled Egg Half */}
          <ellipse cx="280" cy="119" rx="12" ry="8" fill="#ffffff" />
          <circle cx="280" cy="119" r="5" fill="#f97316" />
          {/* Green Scallion Bits */}
          <rect x="315" y="116" width="6" height="4" rx="1" fill="#16a34a" />
          <rect x="325" y="119" width="5" height="5" rx="1" fill="#15803d" />
          <rect x="305" y="122" width="6" height="4" rx="1" fill="#16a34a" />

          {/* Steam Wiggles */}
          <path d="M280 100 Q 275 85 285 70" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M305 95 Q 315 80 305 65" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M325 102 Q 320 88 328 72" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Wooden Chopsticks */}
          <line x1="390" y1="120" x2="480" y2="70" stroke="#b45309" strokeWidth="5" strokeLinecap="round" />
          <line x1="395" y1="128" x2="485" y2="78" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />

          {/* Camping Mug */}
          <rect x="130" y="195" width="60" height="70" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
          <path d="M130 210 Q 110 215 110 235 Q 110 255 130 255" stroke="#cbd5e1" strokeWidth="4" fill="none" />
          <ellipse cx="160" cy="200" rx="25" ry="8" fill="#78350f" />
        </svg>
      </div>
    );
  }

  // Mountain / Lake scene default
  return (
    <div className={`relative overflow-hidden bg-sky-200 flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 600 340" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Soft Sky */}
        <rect width="600" height="340" fill="#bae6fd" />
        <circle cx="120" cy="90" r="40" fill="#fef08a" />

        {/* Mountain Majestic Layers */}
        <polygon points="80,240 260,80 440,240" fill="#3b82f6" />
        <polygon points="240,80 260,80 280,110 260,115 250,110" fill="#ffffff" />
        <polygon points="260,240 420,110 580,240" fill="#1d4ed8" />
        <polygon points="410,110 420,110 435,130 425,135 415,130" fill="#ffffff" />

        {/* Lake / Water Flat */}
        <rect x="0" y="220" width="600" height="80" fill="#38bdf8" />
        <line x1="60" y1="240" x2="160" y2="240" stroke="#bae6fd" strokeWidth="3" />
        <line x1="280" y1="250" x2="380" y2="250" stroke="#bae6fd" strokeWidth="3" />
        <line x1="420" y1="260" x2="520" y2="260" stroke="#bae6fd" strokeWidth="3" />

        {/* Green Shore */}
        <rect x="0" y="280" width="600" height="60" fill="#15803d" />

        {/* Tent Near Lake */}
        <polygon points="120,310 170,240 220,310" fill="#f97316" />
        <polygon points="150,310 170,265 190,310" fill="#fbbf24" />

        {/* Campfire */}
        <polygon points="280,305 285,285 290,305" fill="#f97316" />
        <polygon points="287,305 292,290 297,305" fill="#ea580c" />
        <line x1="275" y1="307" x2="302" y2="307" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export const CommunityLogo: React.FC<{ size?: number; logoUrl?: string }> = ({ size = 36, logoUrl }) => {
  if (logoUrl && logoUrl.trim().length > 0) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className="rounded-xl overflow-hidden border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] shrink-0 bg-white flex items-center justify-center"
      >
        <img 
          src={logoUrl} 
          alt="Logo Yuru Camp Jabodetabek" 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div 
      style={{ width: size, height: size }} 
      className="bg-amber-500 rounded-xl flex items-center justify-center text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] shrink-0"
    >
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {/* Tent outline */}
        <path d="M3 21h18" />
        <path d="M12 3L2 21h20L12 3z" />
        <path d="M12 3v18" />
        <path d="M8 21l4-8 4 8" />
      </svg>
    </div>
  );
};
