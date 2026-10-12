import React from 'react';
import { useCamp } from '../context/CampContext';
import { useAuth } from '../context/AuthContext';
import { CampIllustration } from './CampIllustration';
import { ArrowRight, Sparkles } from 'lucide-react';

export const BentoHero: React.FC = () => {
  const { setActiveTab, settings } = useCamp();
  const { user, isLoggedIn, role, setLoginWithGoogleModal } = useAuth();

  return (
    <div className="relative bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] overflow-hidden flex flex-col lg:flex-row">
      {/* Left Text & CTA Section */}
      <div className="p-6 sm:p-8 lg:p-10 flex-1 flex flex-col justify-between">
        <div>
          {/* Natural human editorial kicker */}
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-3 flex-wrap">
            <span>Komunitas Berkemah Jabodetabek</span>
            <span aria-hidden="true">·</span>
            <span>Est. 2024</span>
            <span aria-hidden="true">·</span>
            <span>Bogor · Sukabumi · Puncak · Sentul</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
            Kemping Santai Tanpa Beban, Menikmati Hutan Pinus Bersama
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
            {settings.tagline}. Terinspirasi dari semangat <em>Yuru Camp</em>: tidak ada adu gengsi gear, ramah solo camper maupun pemula, dan mengedepankan etika kelestarian alam bebas.
          </p>
        </div>

        {/* Dynamic CTA & status bar (Clean single action, tanpa tombol lihat anggota yang terpotong) */}
        <div className="mt-8 pt-6 border-t-2 border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  setLoginWithGoogleModal(true);
                } else {
                  setActiveTab('events');
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-transform active:translate-y-0.5 whitespace-nowrap"
            >
              <span>{isLoggedIn ? 'Jelajahi Agenda Event' : 'Masuk dengan Akun Google'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* User state snippet */}
          <div className="text-xs text-slate-500">
            {role === 'admin' ? (
              <span className="font-bold text-sky-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span>Masuk sebagai Admin & Lead Developer</span>
              </span>
            ) : role === 'anggota' || isLoggedIn ? (
              <span className="font-bold text-amber-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Anggota Resmi: {user?.name}</span>
              </span>
            ) : (
              <button 
                onClick={() => setLoginWithGoogleModal(true)} 
                className="text-amber-700 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Login dengan Google untuk otomatis gabung anggota</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Flat Illustration / Custom Admin Photo Card */}
      <div className="lg:w-2/5 border-t-2 lg:border-t-0 lg:border-l-2 border-slate-900 bg-slate-900 flex flex-col justify-between overflow-hidden">
        {settings.heroImageUrl ? (
          <div className="w-full h-64 sm:h-72 lg:h-full min-h-[260px] relative bg-slate-900">
            <img 
              src={settings.heroImageUrl} 
              alt="Foto Beranda Yuru Camp Jabodetabek" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        ) : (
          <CampIllustration type="campfire" className="w-full h-64 sm:h-72 lg:h-full min-h-[260px]" />
        )}
        
        {/* Caption bar */}
        <div className="p-3 bg-slate-950 border-t-2 border-slate-900 flex items-center justify-between text-[11px] text-slate-300">
          <span className="font-medium">Mandalawangi & Mt. Gede Silhouette</span>
          <span className="text-amber-400 font-mono">16°C · Malam Cerah</span>
        </div>
      </div>
    </div>
  );
};
