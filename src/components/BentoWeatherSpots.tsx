import React, { useState } from 'react';
import { useCamp } from '../context/CampContext';
import { Cloud, Sun, Wind, MapPin, Signal, Mountain, Compass, ChevronRight } from 'lucide-react';

export const BentoWeatherSpots: React.FC = () => {
  const { spots } = useCamp();
  const [selectedSpotId, setSelectedSpotId] = useState(spots[0]?.id || 'spot-mandalawangi');

  const currentSpot = spots.find(s => s.id === selectedSpotId) || spots[0];

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
              <Compass className="w-4 h-4" />
              <span>Spot & Cuaca Jabodetabek</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              Info Suhu & Medan Camp
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-neutral-100 px-2 py-1 rounded-lg border border-slate-200">
            Live Field Info
          </span>
        </div>

        {/* Spot Selector Tabs (Horizontal segmented control) */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-4">
          {spots.map(s => {
            const isSelected = s.id === currentSpot.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSpotId(s.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors border-2 ${
                  isSelected
                    ? 'bg-sky-500 text-white border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                    : 'bg-neutral-100 text-slate-700 border-transparent hover:bg-neutral-200'
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>

        {/* Selected Spot Card Details */}
        <div className="p-4 rounded-2xl bg-neutral-50 border-2 border-slate-200 space-y-3.5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-amber-700">{currentSpot.region}</span>
              <h4 className="text-base font-extrabold text-slate-900">{currentSpot.name}</h4>
              <p className="text-xs text-slate-600 mt-0.5">{currentSpot.weatherCondition}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-black font-mono text-slate-900">{currentSpot.tempNight}</div>
              <div className="text-[10px] text-slate-500">Malam / Fajar</div>
            </div>
          </div>

          {/* Grid stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500">Ketinggian</div>
              <div className="text-xs font-bold font-mono text-slate-900 flex items-center gap-1 mt-0.5">
                <Mountain className="w-3.5 h-3.5 text-sky-600" />
                <span>{currentSpot.altitude}</span>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500">Suhu Siang</div>
              <div className="text-xs font-bold font-mono text-slate-900 flex items-center gap-1 mt-0.5">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span>{currentSpot.tempDay}</span>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-500">Sinyal HP</div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                <Signal className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentSpot.signalQuality}</span>
              </div>
            </div>
          </div>

          {/* Vibe Quote */}
          <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-950 italic">
            "{currentSpot.vibe}"
          </div>

          {/* Road & Ground */}
          <div className="text-[11px] text-slate-600 space-y-1">
            <div>
              <strong className="text-slate-800">Akses Jalan:</strong> {currentSpot.roadAccess}
            </div>
            <div>
              <strong className="text-slate-800">Karakter Tanah:</strong> {currentSpot.groundType}
            </div>
          </div>
        </div>
      </div>

      {/* Facilities bottom tags */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-600">
        <span className="font-bold text-slate-800 shrink-0">Fasilitas:</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {currentSpot.facilities.map((fac, idx) => (
            <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap">
              {fac}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
