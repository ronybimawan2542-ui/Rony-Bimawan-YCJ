import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCamp } from '../context/CampContext';
import { X, ShieldCheck, UserCheck, Check, Sparkles, Mail, Loader2 } from 'lucide-react';

export const GoogleLoginModal: React.FC = () => {
  const {
    loginWithGoogleModal,
    setLoginWithGoogleModal,
    loginWithCustomGoogle,
    signInWithGoogle,
    adminEmails
  } = useAuth();
  const { registerGoogleUserAsMember } = useCamp();

  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [activeTab, setActiveTab] = useState<'official' | 'quick' | 'custom'>('official');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!loginWithGoogleModal) return null;

  const handleOfficialSignIn = async () => {
    try {
      setIsAuthenticating(true);
      setAuthError(null);
      await signInWithGoogle();
    } catch (err: any) {
      setAuthError(err.message || 'Gagal masuk dengan Google. Anda juga dapat memilih opsi simulasi akun cepat di bawah.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const isCustomEmailAdmin = customEmail.trim().toLowerCase() === 'ronybimawan2542@gmail.com' ||
    adminEmails.some(a => a.toLowerCase() === customEmail.trim().toLowerCase());

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const trimmedEmail = customEmail.trim().toLowerCase();
    const finalName = customName.trim() || trimmedEmail.split('@')[0];
    
    // Auto register into community members
    registerGoogleUserAsMember({
      name: finalName,
      email: trimmedEmail
    });

    loginWithCustomGoogle(trimmedEmail, finalName);
  };

  const handleQuickLogin = (email: string, name: string) => {
    // Auto register into community members
    registerGoogleUserAsMember({
      name,
      email
    });
    loginWithCustomGoogle(email, name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-amber-100 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            {/* Google Icon Flat */}
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center shadow-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Masuk dengan Akun Google</h3>
              <p className="text-xs text-slate-600">Otomatis Terdaftar Sebagai Anggota Komunitas</p>
            </div>
          </div>
          <button
            onClick={() => setLoginWithGoogleModal(false)}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b-2 border-slate-900 bg-neutral-100 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('official')}
            className={`flex-1 min-w-[140px] py-2.5 text-xs font-bold text-center transition-colors ${
              activeTab === 'official'
                ? 'bg-white text-sky-950 border-b-2 border-sky-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Google & Gmail Resmi
          </button>
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 min-w-[130px] py-2.5 text-xs font-semibold text-center transition-colors ${
              activeTab === 'quick'
                ? 'bg-white text-slate-900 border-b-2 border-amber-500 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pilihan Cepat (1-Klik)
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 min-w-[130px] py-2.5 text-xs font-semibold text-center transition-colors ${
              activeTab === 'custom'
                ? 'bg-white text-slate-900 border-b-2 border-amber-500 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Manual Email
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'official' ? (
            <div className="space-y-4">
              <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-300 space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-sky-950">
                  <Mail className="w-4 h-4 text-sky-700 shrink-0" />
                  <span>Integrasi Gmail & Akun Komunitas Aktif</span>
                </div>
                <p className="text-xs text-sky-900 leading-relaxed">
                  Masuk menggunakan akun Google Anda. Setelah bergabung, sistem akan otomatis menyiapkan <strong>Email Sambutan Resmi & Kartu Anggota Digital</strong> yang dapat langsung dikirim ke Gmail Anda dengan persetujuan Anda.
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-300 text-xs text-rose-800">
                  ⚠️ {authError}
                </div>
              )}

              {/* Official Google Button per guidelines */}
              <button
                type="button"
                onClick={handleOfficialSignIn}
                disabled={isAuthenticating}
                className="w-full py-3.5 px-4 bg-white hover:bg-neutral-50 text-slate-800 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] font-extrabold text-sm flex items-center justify-center gap-3 transition-transform active:translate-y-0.5 disabled:opacity-60 cursor-pointer"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
                    <span>Menghubungkan Akun Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    <span>Sign in with Google (Resmi Google & Gmail)</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-slate-500">
                  Atau coba cepat tanpa popup Google via tab <strong>Pilihan Cepat (1-Klik)</strong> di atas.
                </span>
              </div>
            </div>
          ) : activeTab === 'quick' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Cukup klik salah satu akun di bawah untuk masuk. Akun otomatis menjadi anggota dan tampil di halaman Komunitas:
              </p>

              {/* Developer / Master Admin Account */}
              <button
                onClick={() => handleQuickLogin('ronybimawan2542@gmail.com', 'Rony Bimawan')}
                className="w-full text-left p-3.5 rounded-2xl bg-sky-50 border-2 border-sky-400 hover:bg-sky-100 transition-colors flex items-center gap-3.5 group"
              >
                <div className="w-11 h-11 rounded-xl bg-sky-500 border border-slate-900 flex items-center justify-center text-white shrink-0 shadow-xs font-bold text-sm">
                  RB
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm truncate">Rony Bimawan</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-200 text-sky-800 border border-sky-300">
                      Lead Developer & Admin
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate">ronybimawan2542@gmail.com</p>
                  <p className="text-[11px] text-sky-700 font-medium mt-0.5">
                    Otoritas penuh konfigurasi web, edit konten & tentukan jabatan anggota
                  </p>
                </div>
              </button>

              {/* Member Nadeshiko */}
              <button
                onClick={() => handleQuickLogin('nadeshiko.k@yurucamp.id', 'Nadeshiko Kagamihara')}
                className="w-full text-left p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-400 hover:bg-amber-100 transition-colors flex items-center gap-3.5 group"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-500 border border-slate-900 flex items-center justify-center text-slate-900 shrink-0 shadow-xs font-bold text-sm">
                  NK
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm truncate">Nadeshiko Kagamihara</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200 text-amber-800 border border-amber-300">
                      Anggota Komunitas
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate">nadeshiko.k@yurucamp.id</p>
                  <p className="text-[11px] text-amber-800 font-medium mt-0.5">
                    Otomatis tercatat di daftar anggota komunitas & bisa daftar event
                  </p>
                </div>
              </button>

              {/* Camper Rin Shima */}
              <button
                onClick={() => handleQuickLogin('rin.shima.camper@gmail.com', 'Rin Shima')}
                className="w-full text-left p-3.5 rounded-2xl bg-neutral-50 border-2 border-slate-300 hover:bg-neutral-100 transition-colors flex items-center gap-3.5 group"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-900 flex items-center justify-center text-white shrink-0 shadow-xs font-bold text-sm">
                  RS
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm truncate">Rin Shima</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 border border-slate-300">
                      Anggota Komunitas
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate">rin.shima.camper@gmail.com</p>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                    Otomatis masuk ke daftar anggota komunitas & berbagi cerita solo camping
                  </p>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Akun Google Anda
                </label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={e => setCustomEmail(e.target.value)}
                  placeholder="contoh: nama.anda@gmail.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden focus:bg-white focus:border-amber-500"
                />
                {isCustomEmailAdmin && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-sky-700 font-bold bg-sky-100 p-2 rounded-lg border border-sky-300">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>Email ini terdaftar sebagai ADMIN RESMI / LEAD DEVELOPER!</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap / Panggilan
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  placeholder="contoh: Budi Setiawan"
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden focus:bg-white focus:border-amber-500"
                />
              </div>

              <div className="bg-amber-50 p-3.5 rounded-2xl border-2 border-amber-300 text-xs text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Otomatis Masuk Sebagai Anggota Komunitas</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Tidak perlu lagi mengisi formulir pendaftaran terpisah. Setelah login dengan Google, profil Anda akan langsung tertera di daftar anggota komunitas. Penentuan jabatan khusus (*seperti Koordinator, Admin, Pemandu*) ditentukan oleh Admin dan Lead Developer.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-transform active:translate-x-0.5 active:translate-y-0.5"
              >
                Masuk & Gabung Komunitas Sekarang
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 text-center">
          <p className="text-[11px] text-slate-500">
            Yuru Camp Jabodetabek · Otentikasi akun Google & otomatis masuk anggota
          </p>
        </div>
      </div>
    </div>
  );
};
