import React, { useState, useEffect } from 'react';
import { useCamp } from '../context/CampContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, Clock, AlertCircle, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { CampIllustration } from './CampIllustration';

export const BentoHighlightEvent: React.FC = () => {
  const { events, registerForEvent, setActiveTab, settings } = useCamp();
  const { user, isLoggedIn, setLoginWithGoogleModal } = useAuth();

  const highlight = events[0] || null;

  // Countdown calculations
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!highlight) return;

    const updateTimer = () => {
      const diff = Math.max(0, highlight.targetTimestamp - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [highlight]);

  if (!highlight) return null;

  const isUserRegistered = user ? highlight.registeredUserEmails.includes(user.email) : false;
  const customImg = highlight.imageUrl || settings.highlightEventImageUrl;

  const handleRegister = () => {
    if (!isLoggedIn || !user) {
      setLoginWithGoogleModal(true);
      return;
    }
    registerForEvent(highlight.id, user.email);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] overflow-hidden flex flex-col h-full">
      {/* Top Graphic Banner */}
      <div className="relative border-b-2 border-slate-900 bg-sky-200 h-36 overflow-hidden">
        {customImg ? (
          <img 
            src={customImg} 
            alt={highlight.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <CampIllustration type="mountain" className="w-full h-36" />
        )}
        
        {/* Floating Tag */}
        <div className="absolute top-3 left-3 bg-amber-500 text-slate-900 text-[11px] font-extrabold px-3 py-1 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
          AGENDA UTAMA TERDEKAT
        </div>

        <div className="absolute bottom-3 right-3 bg-white text-slate-900 text-xs font-bold px-2.5 py-1 rounded-lg border-2 border-slate-900 shadow-xs">
          {highlight.altitude}
        </div>
      </div>

      {/* Main Details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>{highlight.date}</span>
            <span aria-hidden="true">·</span>
            <span>{highlight.duration}</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 leading-snug">
            {highlight.title}
          </h3>

          <p className="mt-1 text-xs text-slate-600 line-clamp-2">
            {highlight.subtitle}
          </p>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-700 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium truncate">{highlight.location}</span>
          </div>
        </div>

        {/* Live Countdown Clock */}
        <div className="bg-neutral-900 text-white p-3.5 rounded-2xl border-2 border-slate-900">
          <div className="flex items-center justify-between text-[10px] text-slate-300 font-bold uppercase mb-2">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              Hitung Mundur Pelaksanaan:
            </span>
            <span>WIB</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-slate-800 p-1.5 rounded-lg border border-slate-700">
              <div className="text-lg font-black font-mono text-amber-400">{timeLeft.days}</div>
              <div className="text-[9px] text-slate-400">HARI</div>
            </div>
            <div className="bg-slate-800 p-1.5 rounded-lg border border-slate-700">
              <div className="text-lg font-black font-mono text-white">{timeLeft.hours}</div>
              <div className="text-[9px] text-slate-400">JAM</div>
            </div>
            <div className="bg-slate-800 p-1.5 rounded-lg border border-slate-700">
              <div className="text-lg font-black font-mono text-white">{timeLeft.minutes}</div>
              <div className="text-[9px] text-slate-400">MENIT</div>
            </div>
            <div className="bg-slate-800 p-1.5 rounded-lg border border-slate-700">
              <div className="text-lg font-black font-mono text-sky-400">{timeLeft.seconds}</div>
              <div className="text-[9px] text-slate-400">DETIK</div>
            </div>
          </div>
        </div>

        {/* Fee & Action (Tanpa kuota) */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs bg-amber-50 p-2 rounded-xl border border-amber-200">
            <span className="text-amber-900 font-bold">Biaya Patungan:</span>
            <span className="font-bold text-slate-900">
              {highlight.fee}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            {isUserRegistered ? (
              <div className="flex-1 py-2.5 px-3 bg-emerald-100 text-emerald-900 border-2 border-emerald-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Kamu Sudah Terdaftar</span>
              </div>
            ) : (
              <button
                onClick={handleRegister}
                className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-transform active:translate-y-0.5"
              >
                {isLoggedIn ? 'Daftar Ikut Kemping' : 'Login untuk Ikut Camp'}
              </button>
            )}

            <button
              onClick={() => setActiveTab('events')}
              className="p-2.5 bg-sky-100 hover:bg-sky-200 text-sky-950 rounded-xl border-2 border-slate-900 transition-colors"
              title="Lihat Semua Detail Event"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
