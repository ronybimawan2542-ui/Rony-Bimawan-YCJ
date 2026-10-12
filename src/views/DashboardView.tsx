import React from 'react';
import { useCamp } from '../context/CampContext';
import { BentoHero } from '../components/BentoHero';
import { BentoHighlightEvent } from '../components/BentoHighlightEvent';
import { BentoWeatherSpots } from '../components/BentoWeatherSpots';
import { BentoCampStats } from '../components/BentoCampStats';
import { BentoCampfirePlayer } from '../components/BentoCampfirePlayer';
import { Bell, ArrowRight, BookOpen, Camera, Sparkles, MapPin } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { settings, setActiveTab, eventPhotos, soloCampStories } = useCamp();

  // Combine event photos and solo stories for the continuous marquee
  const marqueeItems = [
    ...eventPhotos.map(p => ({
      id: p.id,
      imageUrl: p.imageUrl,
      title: p.eventTitle,
      subtitle: p.caption,
      location: p.location,
      badge: p.region,
      author: p.photographer,
      isSolo: false
    })),
    ...soloCampStories.map(s => ({
      id: s.id,
      imageUrl: s.imageUrl,
      title: s.title,
      subtitle: s.location,
      location: s.location,
      badge: `Solo · ${s.region}`,
      author: s.memberName,
      isSolo: true
    }))
  ];

  // Duplicate for seamless infinite marquee loop
  const duplicatedMarquee = [...marqueeItems, ...marqueeItems];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Official Community Announcement Strip (if active) */}
      {settings.announcementActive && settings.announcement && (
        <div className="bg-amber-100 border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#0f172a] flex items-start sm:items-center gap-3">
          <div className="p-2 bg-amber-500 rounded-xl border border-slate-900 shrink-0 text-slate-900">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
            <strong className="text-amber-900 font-bold mr-1">Pengumuman Terkini:</strong>
            {settings.announcement}
          </div>
        </div>
      )}

      {/* Row 1: Hero Bento (Full Width) */}
      <BentoHero />

      {/* Row 2: Bento Grid 2 Columns (Highlight Event & Weather Spots) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BentoHighlightEvent />
        <BentoWeatherSpots />
      </div>

      {/* Row 3: Bento Grid 2 Columns (Camp Stats & Campfire Ambience Player) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BentoCampStats />
        <BentoCampfirePlayer />
      </div>

      {/* Row 4: Yuru Camp Lifestyle Teaser Strip */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Eksplorasi Lengkap
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Baru Pertama Kali Ingin Mencoba Berkemah?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Kami menyusun buku panduan mulai dari cara memasang pasak di tanah gembur, checklist 19 perlengkapan esensial, hingga 4 resep masakan hangat praktis khas anime Yuru Camp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('gallery')}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-2 transition-transform active:translate-y-0.5 whitespace-nowrap"
            >
              <Camera className="w-4 h-4" />
              <span>Buka Galeri</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className="px-5 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-2 transition-transform active:translate-y-0.5 whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" />
              <span>Buka Panduan & Checklist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 5: AUTO-SCROLLING CONTINUOUS GALLERY SECTION (Tepat di atas Footer Beranda) */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 sm:p-8 overflow-hidden space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <Camera className="w-4 h-4" />
              <span>Dokumentasi Berjalan Otomatis</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Sorotan Galeri Komunitas
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Geser kursor ke foto untuk berhenti sejenak. Klik foto mana saja untuk menjelajahi cerita penuh di Galeri.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('gallery')}
            className="px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-950 font-bold text-xs rounded-xl border-2 border-slate-900 transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-xs"
          >
            <span>Buka Halaman Galeri</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Continuous Marquee Ticker */}
        <div className="relative overflow-hidden py-2 -mx-6 sm:-mx-8">
          <div className="animate-marquee flex gap-4 pl-4">
            {duplicatedMarquee.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => setActiveTab('gallery')}
                className="w-72 sm:w-80 bg-neutral-50 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] overflow-hidden shrink-0 cursor-pointer hover:bg-amber-50 transition-colors flex flex-col justify-between group"
              >
                {/* Photo thumbnail */}
                <div className="h-44 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-600">
                    <Camera className="w-8 h-8 opacity-40" />
                  </div>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 relative z-1"
                    onError={(e) => {
                      (e.target as HTMLElement).style.opacity = '0';
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded border border-slate-900 z-10">
                    {item.badge}
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-600">
                    <span className="flex items-center gap-1 truncate max-w-[140px]">
                      <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </span>
                    <span className="font-bold text-slate-800 shrink-0">
                      {item.author}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
