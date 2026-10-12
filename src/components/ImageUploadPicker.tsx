import React, { useRef, useState } from 'react';
import { readFileAsCompressedDataUrl } from '../utils/imageUtils';
import { Camera, Image as ImageIcon, Link as LinkIcon, Trash2, Check, RefreshCw } from 'lucide-react';

export interface ImageUploadPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  presets?: { label: string; url: string }[];
  helperText?: string;
}

export const ImageUploadPicker: React.FC<ImageUploadPickerProps> = ({
  value,
  onChange,
  label = 'Foto Dokumentasi',
  placeholder = 'https://... atau pilih dari galeri HP',
  presets,
  helperText
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'gallery' | 'url'>('gallery');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const dataUrl = await readFileAsCompressedDataUrl(file);
      onChange(dataUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengunggah foto dari galeri HP.');
    } finally {
      setIsLoading(false);
      // Reset input agar bisa memilih file yang sama lagi jika perlu
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleTriggerPicker = () => {
    setErrorMsg(null);
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    onChange('');
    setErrorMsg(null);
  };

  return (
    <div className="space-y-2">
      {/* Label & Mode Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="block font-bold text-slate-800 text-xs">
          {label}
        </label>
        
        <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-slate-300 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setMode('gallery')}
            className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
              mode === 'gallery'
                ? 'bg-amber-500 text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span>Galeri HP</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
              mode === 'url'
                ? 'bg-amber-500 text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>URL Web</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input khusus Galeri HP / Kamera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Mode 1: Galeri HP Langsung */}
      {mode === 'gallery' ? (
        <div className="space-y-2">
          {value ? (
            /* Pratinjau Foto Terpilih */
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-900 bg-slate-900 shadow-xs">
              <div className="h-44 w-full flex items-center justify-center overflow-hidden">
                <img
                  src={value}
                  alt="Pratinjau Foto"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Action Overlay */}
              <div className="p-2.5 bg-slate-900/90 text-white flex items-center justify-between gap-2 border-t border-slate-700">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold truncate">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Foto siap dari galeri perangkat</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleTriggerPicker}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-transform active:translate-y-0.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Ganti Foto</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-transform active:translate-y-0.5"
                    title="Hapus Foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Tombol / Area Tap Galeri HP */
            <div
              onClick={handleTriggerPicker}
              className="group cursor-pointer p-5 rounded-2xl border-2 border-dashed border-slate-400 hover:border-amber-500 bg-neutral-50 hover:bg-amber-50/50 transition-all text-center flex flex-col items-center justify-center gap-2 select-none"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-slate-900 group-hover:scale-105 transition-transform flex items-center justify-center text-amber-900 shadow-xs">
                {isLoading ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-700" />
                ) : (
                  <Camera className="w-6 h-6 text-amber-700" />
                )}
              </div>

              <div>
                <span className="text-xs font-black text-slate-900 block group-hover:text-amber-800">
                  {isLoading ? 'Sedang Memproses Foto...' : 'Pilih Foto Langsung dari Galeri HP'}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Ketuk di sini untuk membuka galeri foto atau kamera ponsel Anda (JPG, PNG, WebP)
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Mode 2: Input URL Manual */
        <div className="space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden font-mono"
          />

          {value && (
            <div className="relative h-32 w-full rounded-xl overflow-hidden border border-slate-300 bg-slate-900">
              <img
                src={value}
                alt="Pratinjau URL"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Preset Cepat (Jika disediakan) */}
      {presets && presets.length > 0 && (
        <div className="pt-1">
          <span className="text-[10px] text-slate-500 font-semibold block mb-1">
            Atau pilih foto preset cepat:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(preset.url)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-colors ${
                  value === preset.url
                    ? 'bg-amber-500 text-slate-900 border-slate-900 shadow-xs'
                    : 'bg-neutral-100 hover:bg-amber-100 text-slate-700 border-slate-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <p className="text-[11px] text-rose-600 font-bold bg-rose-50 p-2 rounded-lg border border-rose-200">
          ⚠️ {errorMsg}
        </p>
      )}

      {/* Helper text */}
      {helperText && !errorMsg && (
        <p className="text-[10px] text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
};
