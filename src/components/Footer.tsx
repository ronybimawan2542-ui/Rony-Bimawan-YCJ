import React from 'react';
import { useCamp } from '../context/CampContext';
import { CommunityLogo } from './CampIllustration';
import { Heart, Compass, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, settings } = useCamp();

  return (
    <footer className="mt-16 bg-white border-t-2 border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1: Wordmark & Bio (Diedit oleh Admin melalui Pengaturan) */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <CommunityLogo size={34} logoUrl={settings.logoUrl} />
              <div>
                <span className="text-base font-extrabold text-slate-900 tracking-tight block">
                  Yuru Camp Jabodetabek
                </span>
                <span className="text-[10px] text-amber-700 font-bold tracking-wider block">
                  KOMUNITAS BERKEMAH SANTAI SE-JABODETABEK
                </span>
              </div>
            </div>

            {/* Teks deskripsi tentang komunitas yang dapat diedit oleh admin resmi */}
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
              {settings.footerAboutText}
            </p>

            <div className="text-[11px] text-slate-500 pt-1 flex flex-wrap gap-x-4 gap-y-1">
              <span>WhatsApp: <strong className="font-mono text-slate-800">{settings.contactWhatsApp}</strong></span>
              <span>Instagram: <strong className="font-mono text-slate-800">{settings.instagramHandle}</strong></span>
              <span>Wilayah: <strong className="text-slate-800">Bogor · Cibodas · Sukabumi · Sentul · Puncak</strong></span>
            </div>
          </div>

          {/* Col 2: Navigasi Halaman */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Navigasi Halaman
            </span>
            <ul className="text-xs text-slate-600 space-y-1.5 font-medium">
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-slate-900 transition-colors">
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('events')} className="hover:text-slate-900 transition-colors">
                  Jadwal & Arsip Event
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('gallery')} className="hover:text-slate-900 transition-colors">
                  Galeri
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('guide')} className="hover:text-slate-900 transition-colors">
                  Buku Panduan & Checklist
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('community')} className="hover:text-slate-900 transition-colors">
                  Tim & Member Spotlight
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-slate-900 transition-colors">
                  Tentang Komunitas
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © 2024 - 2026 Yuru Camp Jabodetabek. Dikelola oleh Tim Pengurus Komunitas.
          </div>
          <div className="flex items-center gap-1 text-slate-600">
            <span>Didedikasikan untuk kelestarian hutan pinus & persahabatan sejati.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
