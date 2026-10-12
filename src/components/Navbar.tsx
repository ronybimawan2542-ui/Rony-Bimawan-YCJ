import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCamp, ActiveTab } from '../context/CampContext';
import { CommunityLogo } from './CampIllustration';
import { ApkInstallModal } from './ApkInstallModal';
import { 
  Flame, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  UserCheck, 
  User as UserIcon, 
  LogOut, 
  Settings, 
  Menu, 
  X,
  ChevronDown,
  Mail,
  Smartphone
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isLoggedIn, role, isAdmin, setLoginWithGoogleModal, quickSwitchRole, logout, prepareWelcomeEmail } = useAuth();
  const { activeTab, setActiveTab, isCampfirePlaying, toggleCampfireSound, settings } = useCamp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [apkModalOpen, setApkModalOpen] = useState(false);

  const navLinks: { id: ActiveTab; label: string }[] = [
    { id: 'dashboard', label: 'Beranda' },
    { id: 'events', label: 'Agenda Event' },
    { id: 'gallery', label: 'Galeri' },
    { id: 'guide', label: 'Panduan & Gear' },
    { id: 'community', label: 'Komunitas' },
    { id: 'about', label: 'Tentang' }
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Zone 1: Single text element Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <CommunityLogo size={36} logoUrl={settings.logoUrl} />
              <div>
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 block leading-tight whitespace-nowrap">
                  Yuru Camp Jabodetabek
                </span>
                <span className="text-[10px] font-semibold text-amber-700 tracking-wider block">
                  ゆるキャン△ KOMUNITAS BERKEMAH
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Clean single-line text links) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
            {navLinks.map(link => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1.5 transition-colors whitespace-nowrap shrink-0 ${
                    isActive ? 'text-amber-600 font-bold' : 'hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Admin Settings Tab (Visible if Admin) */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('settings')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg border-2 border-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'settings'
                    ? 'bg-sky-500 text-white'
                    : 'bg-sky-100 text-sky-900 hover:bg-sky-200'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Pengaturan Admin</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Auth & Quick Controls */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            
            {/* Campfire Ambience Audio Button */}
            <button
              onClick={toggleCampfireSound}
              title={isCampfirePlaying ? 'Matikan Suara Api Unggun' : 'Nyalakan Suara Api Unggun (Web Audio)'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 border-slate-900 text-xs font-bold transition-transform active:translate-y-0.5 ${
                isCampfirePlaying
                  ? 'bg-amber-500 text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                  : 'bg-neutral-100 text-slate-700 hover:bg-neutral-200'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${isCampfirePlaying ? 'text-slate-900' : 'text-amber-600'}`} />
              <span className="hidden xl:inline">{isCampfirePlaying ? 'Api Unggun Aktif' : 'Suara Camp'}</span>
              {isCampfirePlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Role Simulation Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 border-slate-900 bg-white hover:bg-neutral-50 text-xs font-bold text-slate-800 shadow-[2px_2px_0px_0px_#0f172a]"
              >
                <span className="text-slate-500 font-normal">Role:</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-extrabold ${
                  role === 'admin' ? 'bg-sky-200 text-sky-900' :
                  role === 'anggota' ? 'bg-amber-200 text-amber-900' :
                  role === 'tamu' ? 'bg-slate-200 text-slate-800' : 'bg-red-100 text-red-700'
                }`}>
                  {role === 'none' ? 'Belum Login' : role === 'admin' ? 'Admin' : role === 'anggota' ? 'Anggota' : 'Tamu'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-52 bg-white rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] p-1.5 z-50 text-xs"
                  onClick={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Simulasi Cepat Peran:
                  </div>
                  <button
                    onClick={() => quickSwitchRole('tamu')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 font-medium text-slate-800 flex items-center justify-between"
                  >
                    <span>Login sbg Tamu (Guest)</span>
                    {role === 'tamu' && <span className="text-sky-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => quickSwitchRole('anggota')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 font-medium text-slate-800 flex items-center justify-between"
                  >
                    <span>Login sbg Anggota Resmi</span>
                    {role === 'anggota' && <span className="text-amber-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => quickSwitchRole('admin')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 font-medium text-slate-800 flex items-center justify-between"
                  >
                    <span>Login sbg Admin & Lead Dev</span>
                    {role === 'admin' && <span className="text-sky-600 font-bold">✓</span>}
                  </button>
                  <div className="border-t border-slate-200 my-1" />
                  <button
                    onClick={() => quickSwitchRole('none')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-50 font-medium text-red-600 flex items-center justify-between"
                  >
                    <span>Status: Belum Login</span>
                    {role === 'none' && <span className="text-red-600 font-bold">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Install / APK button */}
            <button
              onClick={() => setApkModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-teal-800 bg-teal-50 hover:bg-teal-100 text-xs font-bold text-teal-900 shadow-[2px_2px_0px_0px_#115e59] transition-transform active:translate-y-0.5"
              title="Pasang Aplikasi di HP / Buat File APK"
            >
              <Smartphone className="w-3.5 h-3.5 text-teal-700" />
              <span>Pasang / APK</span>
            </button>

            {/* Auth Action */}
            {isLoggedIn && user ? (
              <div className="flex items-center gap-2 pl-1">
                <div className="flex items-center gap-2 bg-neutral-100 pl-2 pr-3 py-1 rounded-xl border border-slate-300">
                  <div className="w-6 h-6 rounded-lg overflow-hidden border border-slate-900 shrink-0">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 leading-tight max-w-[100px] truncate">
                      {user.name}
                    </div>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Keluar / Logout"
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl border-2 border-slate-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setLoginWithGoogleModal(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-transform active:translate-y-0.5"
              >
                {/* Google icon */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                <span>Login Google</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-800 rounded-xl border-2 border-slate-900 bg-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t-2 border-slate-900 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 rounded-xl text-sm font-bold ${
                  activeTab === link.id
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'text-slate-700 hover:bg-neutral-100'
                }`}
              >
                {link.label}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => handleNavClick('settings')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-sky-100 text-sky-900 border border-sky-300"
              >
                ⚙️ Pengaturan Admin
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-3">
            {/* Install / APK button in mobile menu */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setApkModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow-md border-2 border-slate-900"
            >
              <Smartphone className="w-4 h-4 text-amber-300" />
              <span>📱 Pasang di HP / Buat File APK</span>
            </button>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Simulasi Role:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => quickSwitchRole('tamu')}
                  className={`px-2 py-1 text-[11px] rounded font-bold ${role === 'tamu' ? 'bg-sky-500 text-white' : 'bg-neutral-200'}`}
                >
                  Tamu
                </button>
                <button
                  onClick={() => quickSwitchRole('anggota')}
                  className={`px-2 py-1 text-[11px] rounded font-bold ${role === 'anggota' ? 'bg-amber-500 text-slate-900' : 'bg-neutral-200'}`}
                >
                  Anggota
                </button>
                <button
                  onClick={() => quickSwitchRole('admin')}
                  className={`px-2 py-1 text-[11px] rounded font-bold ${role === 'admin' ? 'bg-slate-900 text-white' : 'bg-neutral-200'}`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              {isLoggedIn && user ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg border border-slate-900" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{user.name}</div>
                      <div className="text-[10px] text-slate-500">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setLoginWithGoogleModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-amber-500 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900"
                >
                  Login with Google
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* APK / Mobile Install Modal */}
      <ApkInstallModal
        isOpen={apkModalOpen}
        onClose={() => setApkModalOpen(false)}
      />
    </header>
  );
};
