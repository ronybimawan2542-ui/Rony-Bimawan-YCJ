import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  CheckCircle, 
  ExternalLink, 
  X, 
  Terminal, 
  Sparkles, 
  HelpCircle,
  Copy,
  Check,
  Layers,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkInstallModal: React.FC<ApkInstallModalProps> = ({ isOpen, onClose }) => {
  const { canInstall, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'netlify' | 'apk' | 'quick' | 'capacitor'>('netlify');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [installStatus, setInstallStatus] = useState<string | null>(null);
  const [customNetlifyUrl, setCustomNetlifyUrl] = useState('');

  if (!isOpen) return null;

  // Compute live application URL
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-ifnid2pzxyspf52fanutgf-483845653569.asia-southeast1.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com/?url=${encodeURIComponent(currentOrigin)}`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleInstallClick = async () => {
    try {
      const outcome = await install();
      if (outcome === 'accepted') {
        setInstallStatus('Aplikasi berhasil dipasang di layar utama HP Anda!');
      } else if (outcome === 'manual') {
        setInstallStatus('Gunakan menu titik tiga (⋮) pada browser Chrome HP Anda untuk memasang.');
      }
    } catch {
      setInstallStatus('Silakan gunakan menu browser Chrome untuk memasang.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="bg-white rounded-3xl border-2 border-slate-900 shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 text-white p-5 sm:p-6 flex items-start justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-teal-100 text-xs font-semibold backdrop-blur-md">
              <Sparkles size={12} className="text-amber-300" />
              <span>Instalasi & Konversi APK Android</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <Smartphone className="text-amber-400" size={24} />
              Jadikan File APK / Pasang di HP
            </h3>
            <p className="text-teal-100 text-xs sm:text-sm">
              Aplikasi ini mendukung instalasi langsung di Android (WebAPK) maupun konversi menjadi file <strong>.APK</strong> native.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white relative z-10"
            title="Tutup"
          >
            <X size={20} />
          </button>

          {/* Decorative badge blur */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 pt-2 gap-1 overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('netlify')}
            className={`px-3 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'netlify'
                ? 'bg-white text-teal-800 border-teal-600 shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <ExternalLink size={15} />
            <span>1. Deploy ke Netlify (Solusi Utama)</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`px-3 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'apk'
                ? 'bg-white text-teal-800 border-teal-600 shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Download size={15} />
            <span>2. PWABuilder (Bikin .APK)</span>
          </button>

          <button
            onClick={() => setActiveTab('quick')}
            className={`px-3 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'quick'
                ? 'bg-white text-teal-800 border-teal-600 shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Smartphone size={15} />
            <span>3. Pasang di HP (WebAPK)</span>
          </button>

          <button
            onClick={() => setActiveTab('capacitor')}
            className={`px-3 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'capacitor'
                ? 'bg-white text-teal-800 border-teal-600 shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Terminal size={15} />
            <span>4. Android Studio / CLI</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {installStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600 shrink-0" />
              <span>{installStatus}</span>
            </div>
          )}

          {/* TAB: Netlify Deployment Solution */}
          {activeTab === 'netlify' && (
            <div className="space-y-4">
              {/* Problem Explanation & Solution Banner */}
              <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-amber-950 text-base">
                      Kenapa PWABuilder Gagal di Link AI Studio?
                    </h4>
                    <p className="text-amber-900 text-xs mt-1 leading-relaxed">
                      URL preview AI Studio (<code>ais-dev-...</code>) diproteksi oleh autentikasi Google (<code>__cookie_check.html</code>). Bot PWABuilder dari Microsoft tidak memiliki cookie login Anda, sehingga di-redirect dan tidak dapat membaca manifest secara publik.
                    </p>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-amber-200 text-xs text-amber-950 font-bold flex items-center gap-1.5">
                  <span className="text-emerald-700">✓ Solusi Terbaik:</span>
                  <span>Deploy ke <strong>Netlify</strong> (Gratis, Publik 100%, &amp; Langsung Dikenali PWABuilder)!</span>
                </div>
              </div>

              {/* Status File Siap Deploy */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-300 text-xs text-emerald-950 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle size={15} className="text-emerald-600" />
                  <span>Semua File Konfigurasi Netlify Sudah Dipersiapkan:</span>
                </div>
                <ul className="list-disc list-inside text-[11px] text-emerald-800 space-y-0.5 pl-1">
                  <li><code>netlify.toml</code> sudah aktif dengan routing SPA (200 OK) &amp; header manifest.</li>
                  <li><code>public/_redirects</code> sudah disalin ke folder <code>dist/</code>.</li>
                  <li>Folder <code>dist/</code> dan arsip <code>dist.zip</code> sudah selesai di-build.</li>
                </ul>
              </div>

              {/* Langkah-langkah Deploy Netlify */}
              <div className="space-y-3">
                <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  Cara Deploy ke Netlify (Paling Mudah 1 Menit):
                </h5>

                {/* Metode A: Netlify Drop */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">A</span>
                      Metode Instan: Netlify Drop (Tarik Folder dist)
                    </span>
                    <a
                      href="https://app.netlify.com/drop"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:underline"
                    >
                      Buka Netlify Drop
                      <ExternalLink size={11} />
                    </a>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed">
                    1. Buka <strong>app.netlify.com/drop</strong> (login/daftar akun gratis Netlify).<br />
                    2. Tarik dan lepas (drag & drop) folder <strong>dist/</strong> (atau file <code>dist.zip</code>) ke kotak unggah Netlify.<br />
                    3. Dalam hitungan detik, aplikasi Anda langsung online dan mendapatkan URL publik seperti <code>https://yuru-camp-jkt.netlify.app</code>!
                  </p>
                </div>

                {/* Metode B: Git Repository */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center">B</span>
                    Metode Hubungkan GitHub (Otomatis Update)
                  </span>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    1. Buka dashboard Netlify &gt; <strong>"Add new site"</strong> &gt; <strong>"Import an existing project"</strong>.<br />
                    2. Hubungkan akun GitHub dan pilih repositori proyek ini.<br />
                    3. Netlify otomatis membaca <code>netlify.toml</code> (Build: <code>npm run build</code>, Directory: <code>dist</code>).
                  </p>
                </div>

                {/* Input URL Netlify & Launcher ke PWABuilder */}
                <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-300 space-y-2.5">
                  <div className="space-y-1">
                    <strong className="text-xs font-bold text-sky-950">
                      Sudah Punya URL Netlify? Buka PWABuilder Sekarang:
                    </strong>
                    <p className="text-[11px] text-slate-600">
                      Ketikkan URL Netlify Anda di bawah ini, lalu klik tombol untuk langsung membuka PWABuilder:
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      placeholder="https://yuru-camp-jkt.netlify.app"
                      value={customNetlifyUrl}
                      onChange={e => setCustomNetlifyUrl(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-sky-500"
                    />
                    <a
                      href={customNetlifyUrl ? `https://www.pwabuilder.com/?url=${encodeURIComponent(customNetlifyUrl.trim())}` : 'https://www.pwabuilder.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm ${
                        customNetlifyUrl.trim()
                          ? 'bg-sky-600 hover:bg-sky-700 text-white'
                          : 'bg-slate-200 text-slate-500 pointer-events-none'
                      }`}
                    >
                      <span>Scan di PWABuilder</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: Quick Install (WebAPK) */}
          {activeTab === 'quick' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50/80 rounded-2xl border border-teal-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-teal-950 text-base">
                      Instalasi Langsung ke Layar HP (WebAPK)
                    </h4>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                      Android secara otomatis mengubah aplikasi ini menjadi <strong>WebAPK</strong> resmi di sistem ponsel Anda dengan ikon kemping Yuru Camp, layar penuh tanpa address bar browser, serta akses kamera dan galeri HP.
                    </p>
                  </div>
                </div>

                {canInstall && (
                  <div className="mt-4 pt-3 border-t border-teal-200/70">
                    <button
                      onClick={handleInstallClick}
                      className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={16} />
                      Pasang Aplikasi Sekarang ke HP Ini
                    </button>
                  </div>
                )}
              </div>

              {/* Step by Step Manual Guide */}
              <div className="space-y-3">
                <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  Cara Pasang Manual di HP Android (Google Chrome / Browser Lain):
                </h5>

                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                    <div className="text-xs">
                      <strong>Buka Aplikasi di Browser HP</strong>: Buka tautan web Yuru Camp Jabodetabek ini melalui browser Google Chrome di ponsel Android Anda.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                    <div className="text-xs">
                      <strong>Ketuk Titik Tiga (⋮)</strong>: Di sudut kanan atas Google Chrome, ketuk ikon menu titik tiga.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
                    <div className="text-xs">
                      <strong>Pilih "Instal Aplikasi" / "Tambahkan ke Layar Utama"</strong>: Ketuk tombol tersebut, lalu konfirmasi.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">✓</span>
                    <div className="text-xs text-emerald-900">
                      <strong>Selesai!</strong> Ikon <strong>"Yuru Camp JKT"</strong> akan langsung muncul di daftar aplikasi HP Android Anda dan dapat dibuka kapan saja.
                    </div>
                  </div>
                </div>
              </div>

              {isIOS && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                  <HelpCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Pengguna iPhone / iOS Safari:</strong> Ketuk tombol <strong>Share (Bagikan)</strong> di bawah browser Safari, lalu gulir dan pilih <strong>"Add to Home Screen" (Tambahkan ke Layar Utama)</strong>.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PWABuilder (Generate .APK File) */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-300">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Download size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sky-950 text-base">
                      Konversi Otomatis Menjadi File .APK (PWABuilder)
                    </h4>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Semua aset dan konfigurasi (<strong>Manifest Web, Ikon Android Multi-Resolusi, Maskable Icon, Screenshots Store, dan Offline Service Worker</strong>) sudah 100% dipersiapkan dan aktif. Anda bisa langsung mengunduh file <code>.apk</code> siap pasang!
                    </p>
                  </div>
                </div>

                {/* Direct One-Click PWABuilder Button */}
                <div className="mt-4 pt-3 border-t border-sky-200 flex flex-col sm:flex-row gap-2">
                  <a
                    href={pwaBuilderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    <span>🚀 Buka PWABuilder (URL Sudah Terisi Otomatis)</span>
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>

              {/* Status Kesiapan Aset PWA */}
              <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-300 space-y-2">
                <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-emerald-600" />
                  <span>Kesiapan Aplikasi untuk PWABuilder (Status: Siap 100%):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-emerald-900">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Manifest PWA (<code>/manifest.webmanifest</code> & <code>.json</code>)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Ikon Android Lengkap (96px s/d 512px)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Android Maskable Icon (Safe Zone)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Service Worker Cache Offline (<code>sw.js</code>)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Store Screenshots (Wide & Mobile)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Shortcuts Cepat (Agenda & Galeri)</span>
                  </div>
                </div>
              </div>

              {/* Panduan Langkah demi Langkah */}
              <div className="space-y-3">
                <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  Panduan 4 Langkah Mendapatkan File .APK:
                </h5>

                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                    <div className="space-y-1 text-xs flex-1">
                      <strong>URL Aplikasi Anda:</strong>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          readOnly
                          value={currentOrigin}
                          className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono w-full select-all text-slate-700"
                        />
                        <button
                          onClick={() => handleCopy(currentOrigin, 'url')}
                          className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors flex items-center gap-1 shrink-0"
                        >
                          {copiedText === 'url' ? <Check size={12} /> : <Copy size={12} />}
                          {copiedText === 'url' ? 'Tersalin' : 'Salin URL'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                    <div className="space-y-1 text-xs">
                      <strong>Buka PWABuilder:</strong>
                      <p className="text-slate-600">
                        Klik tombol biru di atas atau buka <a href={pwaBuilderUrl} target="_blank" rel="noopener noreferrer" className="text-sky-700 font-bold underline">PWABuilder.com</a>. Sistem PWABuilder akan memindai URL Anda dan memberikan centang hijau pada semua aspek (Manifest, Service Worker, Security).
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
                    <div className="space-y-1 text-xs">
                      <strong>Pilih Android & Generate Package:</strong>
                      <p className="text-slate-600">
                        Di halaman PWABuilder, gulir ke opsi platform <strong>Android</strong> &gt; Klik tombol <strong>"Package"</strong> atau <strong>"Generate"</strong>. Anda bisa memilih opsi <em>Debug APK</em> (langsung pasang) atau <em>Signed APK</em>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">4</span>
                    <div className="space-y-1 text-xs text-emerald-950">
                      <strong>Unduh & Pasang File .APK di HP:</strong>
                      <p className="text-emerald-800">
                        Unduh file <code>.apk</code> (atau ekstrak dari file <code>.zip</code> yang diunduh). Kirimkan file tersebut ke smartphone Android Anda (via WhatsApp, Google Drive, atau kabel data), lalu ketuk file untuk memasang!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Developer / Capacitor & CLI */}
          {activeTab === 'capacitor' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-950 text-base">
                      Build APK Offline lewat Capacitor / Android Studio
                    </h4>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                      Untuk developer yang ingin mem-build APK secara mandiri di laptop/komputer menggunakan Android Studio atau Google Bubblewrap CLI.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Perintah Konversi Capacitor ke Android:</span>
                    <button
                      onClick={() => handleCopy(`npm run build\nnpx cap init "Yuru Camp" "com.yurucamp.jkt" --web-dir=dist\nnpx cap add android\nnpx cap open android`, 'cap_cmd')}
                      className="text-teal-700 hover:text-teal-900 flex items-center gap-1 font-semibold"
                    >
                      {copiedText === 'cap_cmd' ? <Check size={12} /> : <Copy size={12} />}
                      {copiedText === 'cap_cmd' ? 'Tersalin' : 'Salin Semua'}
                    </button>
                  </div>

                  <pre className="p-3 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
{`# 1. Build bundle web aplikasi
npm run build

# 2. Inisialisasi Capacitor Android
npx @capacitor/cli init "Yuru Camp" "com.yurucamp.jkt" --web-dir=dist
npm install @capacitor/core @capacitor/android

# 3. Tambahkan platform Android
npx cap add android

# 4. Buka di Android Studio & build APK
npx cap open android`}
                  </pre>
                  <p className="text-[11px] text-slate-500 italic">
                    Di dalam Android Studio, pilih menu <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong> untuk menghasilkan file <code>app-debug.apk</code>.
                  </p>
                </div>

                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-teal-600" />
                    Kesiapan Konfigurasi Proyek Ini:
                  </div>
                  <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1">
                    <li>Manifest PWA resmi (<code>manifest.webmanifest</code>) sudah aktif.</li>
                    <li>Ikon Android 192x192, 512x512, dan maskable icon sudah terpasang.</li>
                    <li>Offline caching (Service Worker) sudah terintegrasi via <code>vite-plugin-pwa</code>.</li>
                    <li>Fitur upload foto galeri & kamera HP sudah kompatibel penuh.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">
            Aplikasi Yuru Camp Jabodetabek siap dipasang di Android & iOS.
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {activeTab !== 'apk' && (
              <button
                onClick={() => setActiveTab('apk')}
                className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Lihat Cara Bikin .APK</span>
                <ArrowRight size={14} />
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
