import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCamp, ActiveTab } from '../context/CampContext';
import { CommunityLogo } from './CampIllustration';
import { EditProfileModal } from './EditProfileModal';
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
  Edit3
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    user, 
    isLoggedIn, 
    isGoogleLoggedIn,
    role, 
    isAdmin, 
    isLeadDeveloper,
    setLoginWithGoogleModal, 
    editProfileModalOpen,
    setEditProfileModalOpen,
    quickSwitchRole, 
    logout, 
    prepareWelcomeEmail 
  } = useAuth();
  const { activeTab, setActiveTab, isCampfirePlaying, toggleCampfireSound, settings } = useCamp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

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

            {/* Role Display: Only Lead Dev sees dropdown, regular users see clean static badge */}
            {isLeadDeveloper ? (
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 border-slate-900 bg-sky-50 hover:bg-sky-100 text-xs font-bold text-slate-800 shadow-[2px_2px_0px_0px_#0f172a]"
                  title="Panel Khusus Lead Developer"
                >
                  <span className="text-slate-500 font-normal">Role:</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-extrabold bg-sky-200 text-sky-900">
                    Lead Dev
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {roleDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-1.5 w-52 bg-white rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] p-1.5 z-50 text-xs"
                    onClick={() => setRoleDropdownOpen(false)}
                  >
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Simulasi Pengujian:
                    </div>
                    <button
                      onClick={() => quickSwitchRole('admin')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 font-medium text-slate-800 flex items-center justify-between"
                    >
                      <span>Akun Saya (Lead Dev)</span>
                      {role === 'admin' && <span className="text-sky-600 font-bold">✓</span>}
                    </button>
                    <button
                      onClick={() => quickSwitchRole('anggota')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 font-medium text-slate-800 flex items-center justify-between"
                    >
                      <span>Simulasi sbg Anggota</span>
                      {role === 'anggota' && <span className="text-amber-600 font-bold">✓</span>}
                    </button>
                    <button
                      onClick={() => quickSwitchRole('tamu')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 font-medium text-slate-800 flex items-center justify-between"
                    >
                      <span>Simulasi sbg Tamu</span>
                      {role === 'tamu' && <span className="text-slate-600 font-bold">✓</span>}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 border-slate-900 bg-white text-xs font-bold shadow-[2px_2px_0px_0px_#0f172a]">
                <span className="text-slate-500 font-normal">Role:</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-extrabold ${
                  role === 'anggota' ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-800'
                }`}>
                  {role === 'anggota' ? 'Anggota' : 'Tamu'}
                </span>
              </div>
            )}

            {/* Auth Action */}
            {isGoogleLoggedIn && user ? (
              <div className="flex items-center gap-2 pl-1">
                <button
                  type="button"
                  onClick={() => setEditProfileModalOpen(true)}
                  className="flex items-center gap-2 bg-neutral-100 hover:bg-amber-50 pl-2 pr-3 py-1 rounded-xl border border-slate-300 transition-colors cursor-pointer text-left group"
                  title="Klik untuk Edit Nama & Foto Profil (Galeri HP)"
                >
                  <div className="w-6 h-6 rounded-lg overflow-hidden border border-slate-900 shrink-0">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 leading-tight max-w-[100px] truncate group-hover:text-amber-800">
                      {user.name}
                    </div>
                  </div>
                  <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-amber-700" />
                </button>

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
                className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-transform active:translate-y-0.5"
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
                <span>Login Google (Member)</span>
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

            {isLeadDeveloper && (
              <button
                onClick={() => handleNavClick('settings')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-sky-100 text-sky-900 border border-sky-300"
              >
                ⚙️ Pengaturan Admin &amp; Dev
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-3">
            {/* If lead dev, show role testing tools */}
            {isLeadDeveloper && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Simulasi Role (Lead Dev):</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => quickSwitchRole('admin')}
                    className={`px-2 py-1 text-[11px] rounded font-bold ${role === 'admin' ? 'bg-sky-600 text-white' : 'bg-neutral-200'}`}
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => quickSwitchRole('anggota')}
                    className={`px-2 py-1 text-[11px] rounded font-bold ${role === 'anggota' ? 'bg-amber-500 text-slate-900' : 'bg-neutral-200'}`}
                  >
                    Anggota
                  </button>
                  <button
                    onClick={() => quickSwitchRole('tamu')}
                    className={`px-2 py-1 text-[11px] rounded font-bold ${role === 'tamu' ? 'bg-slate-700 text-white' : 'bg-neutral-200'}`}
                  >
                    Tamu
                  </button>
                </div>
              </div>
            )}

            <div className="pt-1">
              {isGoogleLoggedIn && user ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 bg-neutral-100 rounded-2xl border border-slate-300">
                    <div className="flex items-center gap-2">
                      <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl border border-slate-900 object-cover" />
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">{user.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{user.email}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-amber-200 text-amber-950 border border-amber-300">
                      {role === 'admin' ? 'Lead Dev' : 'Anggota'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setEditProfileModalOpen(true);
                      }}
                      className="flex-1 py-2 px-3 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 border-2 border-slate-900 rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Profil &amp; Foto Galeri</span>
                    </button>
                    <button
                      onClick={logout}
                      className="px-3.5 py-2 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-slate-600">Status Anda:</span>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-extrabold rounded-md uppercase">
                      Tamu (Shima Rin)
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setLoginWithGoogleModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl border-2 border-slate-900 flex items-center justify-center gap-2 shadow-xs"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    <span>Login Google sebagai Member</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile & Photo Modal */}
      <EditProfileModal
        isOpen={editProfileModalOpen}
        onClose={() => setEditProfileModalOpen(false)}
      />
    </header>
  );
};
