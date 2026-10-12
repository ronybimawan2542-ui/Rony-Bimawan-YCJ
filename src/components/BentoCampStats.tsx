import React from 'react';
import { Users, Tent, TreePine, Award } from 'lucide-react';

export const BentoCampStats: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 flex flex-col justify-between h-full">
      <div>
        <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
          Statistik Komunitas
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          Perjalanan Yuru Camp Jabodetabek
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Tumbuh bersama sejak awal 2024 dengan prinsip santai dan saling menghargai.
        </p>

        {/* 4 Quantitative Metrics */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="p-3.5 bg-neutral-50 rounded-2xl border-2 border-slate-200">
            <div className="flex items-center gap-2 text-slate-600 mb-1">
              <Users className="w-4 h-4 text-sky-600" />
              <span className="text-[11px] font-medium">Anggota Terdaftar</span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900">184+</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Se-Jabodetabek</div>
          </div>

          <div className="p-3.5 bg-neutral-50 rounded-2xl border-2 border-slate-200">
            <div className="flex items-center gap-2 text-slate-600 mb-1">
              <Tent className="w-4 h-4 text-amber-600" />
              <span className="text-[11px] font-medium">Event Terlaksana</span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900">16x</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Bogor, Sukabumi, Puncak</div>
          </div>

          <div className="p-3.5 bg-neutral-50 rounded-2xl border-2 border-slate-200">
            <div className="flex items-center gap-2 text-slate-600 mb-1">
              <TreePine className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-medium">Etika No-Trace</span>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-700">100%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Bawa pulang sampah</div>
          </div>

          <div className="p-3.5 bg-neutral-50 rounded-2xl border-2 border-slate-200">
            <div className="flex items-center gap-2 text-slate-600 mb-1">
              <Award className="w-4 h-4 text-indigo-600" />
              <span className="text-[11px] font-medium">Spot Tertinggi</span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900">1.400</div>
            <div className="text-[10px] text-slate-500 mt-0.5">mdpl di Telaga Saat</div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Prinsip Utama:</span>
        <span className="font-bold text-slate-800">"Santai, Aman, & Ramah Pemula"</span>
      </div>
    </div>
  );
};
