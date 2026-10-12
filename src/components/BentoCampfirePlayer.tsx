import React from 'react';
import { useCamp } from '../context/CampContext';
import { Flame, Volume2, VolumeX, Sparkles } from 'lucide-react';

export const BentoCampfirePlayer: React.FC = () => {
  const { isCampfirePlaying, toggleCampfireSound, campfireVolume, changeCampfireVolume } = useCamp();

  return (
    <div className="bg-slate-900 text-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 flex flex-col justify-between h-full relative overflow-hidden">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Flame className="w-4 h-4" />
            <span>Cozy Ambience</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Web Audio Synth
          </span>
        </div>

        <h3 className="text-xl font-bold mt-2">
          Suara Api Unggun & Angin Pinus
        </h3>

        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Nyalakan suara gemeretak kayu bakar untuk menemani membaca panduan atau merencanakan tenda santai akhir pekanmu.
        </p>

        {/* Ambient controls */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Status Audio:</span>
            <span className={`text-xs font-bold ${isCampfirePlaying ? 'text-amber-400' : 'text-slate-400'}`}>
              {isCampfirePlaying ? '● Memutar Ambience Alami' : '○ Sedang Senyap'}
            </span>
          </div>

          {/* Volume slider */}
          {isCampfirePlaying && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Volume Suara</span>
                <span className="font-mono">{Math.round(campfireVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={campfireVolume}
                onChange={e => changeCampfireVolume(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800">
        <button
          onClick={toggleCampfireSound}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center gap-2 transition-transform active:translate-y-0.5 ${
            isCampfirePlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-900'
              : 'bg-white hover:bg-neutral-100 text-slate-900'
          }`}
        >
          {isCampfirePlaying ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>Matikan Suara Api Unggun</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4 text-amber-600" />
              <span>Nyalakan Suara Api Unggun</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
