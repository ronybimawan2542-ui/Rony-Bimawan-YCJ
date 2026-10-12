import React, { useState } from 'react';
import { useCamp } from '../context/CampContext';
import { useAuth } from '../context/AuthContext';
import { ImageUploadPicker } from '../components/ImageUploadPicker';
import { 
  Users, 
  Shield, 
  MapPin, 
  Search, 
  X, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Check, 
  ShieldCheck,
  Mail,
  Camera,
  CheckCircle2,
  UserPlus,
  ArrowRight,
  Send,
  RefreshCw
} from 'lucide-react';

export const CommunityView: React.FC = () => {
  const { teamMembers, memberSpotlights, updateMemberRole, updateMemberAvatar, removeMember } = useCamp();
  const { 
    user, 
    isLoggedIn, 
    isAdmin, 
    isLeadDeveloper, 
    setLoginWithGoogleModal, 
    prepareWelcomeEmail, 
    updateUserProfile 
  } = useAuth();
  const [activeCommTab, setActiveCommTab] = useState<'members' | 'team'>('members');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Avatar Modal State
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatarInputUrl, setAvatarInputUrl] = useState('');

  // Editing state for Admin / Lead Dev
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingRoleTitle, setEditingRoleTitle] = useState<string>('');

  const q = searchQuery.toLowerCase().trim();

  // Filter Members (Daftar Anggota)
  const filteredMembers = memberSpotlights.filter(m => {
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.domisili.toLowerCase().includes(q) ||
      m.memberId.toLowerCase().includes(q) ||
      (m.roleTitle && m.roleTitle.toLowerCase().includes(q))
    );
  });

  // Filter Team (Tim Pengurus)
  const filteredTeam = teamMembers.filter(t => {
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.domisili.toLowerCase().includes(q) ||
      t.role.toLowerCase().includes(q) ||
      t.division.toLowerCase().includes(q)
    );
  });

  const handleStartEdit = (id: string, currentRole: string) => {
    setEditingMemberId(id);
    setEditingRoleTitle(currentRole);
  };

  const handleSaveEdit = (id: string) => {
    if (editingRoleTitle.trim()) {
      updateMemberRole(id, editingRoleTitle.trim());
    }
    setEditingMemberId(null);
  };

  const handleOpenAvatarModal = () => {
    setAvatarInputUrl(user?.avatar || '');
    setAvatarModalOpen(true);
  };

  const handleSaveAvatar = () => {
    if (!avatarInputUrl.trim() || !user) return;
    updateUserProfile({ avatar: avatarInputUrl.trim() });
    if (user.email) {
      updateMemberAvatar(user.email, avatarInputUrl.trim());
    }
    setAvatarModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>Persahabatan & Kebersamaan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Komunitas Yuru Camp Jabodetabek
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Setiap kawan yang login dengan akun Google otomatis tercatat sebagai anggota komunitas. Jabatan khusus (*Koordinator, Pemandu, Tim Pengurus*) ditentukan langsung oleh Admin dan Lead Developer.
            </p>
          </div>

          <div className="flex p-1.5 bg-neutral-100 rounded-2xl border-2 border-slate-900 overflow-x-auto scrollbar-none shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveCommTab('members')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
                activeCommTab === 'members'
                  ? 'bg-amber-500 text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Anggota ({memberSpotlights.length})
            </button>
            <button
              onClick={() => setActiveCommTab('team')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
                activeCommTab === 'team'
                  ? 'bg-amber-500 text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tim Pengurus ({teamMembers.length})
            </button>
          </div>
        </div>

        {/* Search Bar Komunitas */}
        <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                activeCommTab === 'members'
                  ? 'Cari anggota berdasarkan nama, domisili, atau jabatan...'
                  : 'Cari tim pengurus berdasarkan nama, divisi, atau domisili...'
              }
              className="w-full pl-9 pr-8 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs font-semibold text-slate-500">
            {activeCommTab === 'members' ? (
              <span>
                Menampilkan <strong className="text-slate-900">{filteredMembers.length}</strong> dari {memberSpotlights.length} Anggota Komunitas
              </span>
            ) : (
              <span>
                Menampilkan <strong className="text-slate-900">{filteredTeam.length}</strong> dari {teamMembers.length} Pengurus
              </span>
            )}
          </div>
        </div>

        {/* Admin info badge */}
        {(isAdmin || isLeadDeveloper) && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Kuasa Admin & Lead Dev Aktif:</strong> Anda dapat mengedit jabatan setiap anggota langsung pada baris daftar anggota di bawah.
            </span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* INTEGRASI GMAIL: GABUNG MEMBER & KARTU ANGGOTA DIGITAL                    */}
      {/* ========================================================================= */}
      {!isLoggedIn || !user || user.role === 'tamu' ? (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-sky-400 p-0.5 rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a]">
          <div className="bg-white rounded-[22px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-100 text-sky-900 border border-sky-300 text-[11px] font-extrabold uppercase tracking-wide">
                  <Mail className="w-3.5 h-3.5 text-sky-700" />
                  <span>Integrasi Gmail & Akun Komunitas</span>
                </span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
                  Resmi & Otomatis
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Bergabung Menjadi Anggota Komunitas Yuru Camp dengan Gmail
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Cukup masuk dengan akun Google / Gmail Anda untuk otomatis mendapatkan <strong>ID Anggota Resmi</strong>, tercatat di direktori komunitas, serta menerima <strong>Surat Sambutan Resmi & Kartu Anggota Digital</strong> langsung di kotak masuk Gmail Anda.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="text-sky-950 font-bold">Email Sambutan ke Gmail</span>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-amber-950 font-bold">Kartu Member Digital (#YCJ)</span>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-950 font-bold">Upload Foto dari Galeri HP</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
              <button
                type="button"
                onClick={() => setLoginWithGoogleModal(true)}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] font-extrabold text-sm flex items-center justify-center gap-2.5 transition-transform active:translate-y-0.5 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Gabung via Gmail / Google</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* KARTU ANGGOTA AKTIF */
        <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 border border-slate-900 flex items-center justify-center text-amber-800 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Kartu Anggota Resmi Yuru Camp Jabodetabek
                </h3>
                <p className="text-xs text-slate-500">
                  Akun Anda telah terhubung dan terdaftar sebagai anggota komunitas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Gmail Terhubung: {user.email}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
            {/* Profil Info & Foto */}
            <div className="flex items-center gap-4 sm:gap-5 min-w-0">
              <div className="relative group shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-slate-900 overflow-hidden bg-amber-100 shadow-[3px_3px_0px_0px_#0f172a]">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleOpenAvatarModal}
                  title="Ganti Foto Profil dari Galeri Ponsel"
                  className="absolute -bottom-1 -right-1 p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl border-2 border-slate-900 shadow-xs transition-transform active:translate-y-0.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-lg sm:text-xl font-black text-slate-900 truncate">
                    {user.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold border bg-amber-100 text-amber-900 border-amber-300">
                    {user.role === 'admin' ? 'Lead Dev & Admin' : 'Anggota Resmi'}
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  ID: <strong className="text-slate-800">{user.memberId || '#YCJ-MEMBER'}</strong> · {user.email}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 mt-2 flex-wrap">
                  <div className="flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Domisili: {user.domisili || 'Jabodetabek'}</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={handleOpenAvatarModal}
                    className="text-xs font-bold text-sky-700 hover:text-sky-900 underline flex items-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Upload Foto dari Galeri HP</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Aksi Gmail: Kirim Kartu ke Kotak Masuk Gmail */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <button
                type="button"
                onClick={() => prepareWelcomeEmail(user)}
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] font-bold text-xs flex items-center justify-center gap-2 transition-transform active:translate-y-0.5 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Kirim Kartu Member ke Gmail Saya</span>
              </button>
              <span className="text-[11px] text-slate-500 text-center md:text-right">
                Pesan resmi dan sertifikat keanggotaan terkirim ke kotak masuk Gmail Anda
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: DAFTAR ANGGOTA (MINIMALIS 1 BARIS: FOTO PROFIL, NAMA, DOMISILI)    */}
      {/* ========================================================================= */}
      {activeCommTab === 'members' && (
        <div className="space-y-4">
          {filteredMembers.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-slate-900 p-12 text-center shadow-[6px_6px_0px_0px_#0f172a]">
              <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">
                Tidak ada anggota yang cocok dengan kata kunci "{searchQuery}".
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 px-4 py-2 bg-amber-500 text-slate-900 text-xs font-bold rounded-xl border-2 border-slate-900"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] overflow-hidden divide-y-2 divide-slate-100">
              {filteredMembers.map(member => {
                const isMasterDev = member.email?.toLowerCase() === 'ronybimawan2542@gmail.com' || member.jabatanCategory === 'lead_dev';
                const isEditing = editingMemberId === member.id || editingMemberId === member.memberId;

                return (
                  <div
                    key={member.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3.5 hover:bg-neutral-50 transition-colors gap-3"
                  >
                    {/* Bagian Kiri: Foto Profil, Nama & Jabatan */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="relative group shrink-0">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-slate-900 overflow-hidden bg-amber-100 shadow-xs">
                          <img
                            src={member.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(member.name)}`}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {user && member.email && member.email.toLowerCase() === user.email.toLowerCase() && (
                          <button
                            type="button"
                            onClick={handleOpenAvatarModal}
                            title="Ganti Foto Profil dari Galeri Ponsel"
                            className="absolute -bottom-1 -right-1 p-0.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-full border border-slate-900 shadow-xs transition-transform active:translate-y-0.5 cursor-pointer"
                          >
                            <Camera className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                            {member.name}
                          </span>
                          {user && member.email && member.email.toLowerCase() === user.email.toLowerCase() && (
                            <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded-md">
                              Akun Anda
                            </span>
                          )}
                          
                          {/* Jabatan Badge */}
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editingRoleTitle}
                                onChange={e => setEditingRoleTitle(e.target.value)}
                                className="px-2 py-0.5 text-xs bg-white border border-slate-900 rounded font-bold"
                                placeholder="Jabatan anggota..."
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveEdit(member.id)}
                                className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                                title="Simpan Jabatan"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setEditingMemberId(null)}
                                className="p-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                                title="Batal"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                              isMasterDev
                                ? 'bg-sky-100 text-sky-900 border-sky-300 font-black'
                                : member.jabatanCategory === 'admin'
                                ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                                : member.jabatanCategory === 'pengurus'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}>
                              {isMasterDev && <Sparkles className="w-3 h-3 text-sky-600" />}
                              <span>{member.roleTitle || 'Anggota Komunitas'}</span>
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                          ID: {member.memberId} {member.email ? `· ${member.email}` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Bagian Kanan: Domisili & Aksi Kuasa Admin */}
                    <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto shrink-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-neutral-100 px-3 py-1.5 rounded-xl border border-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{member.domisili}</span>
                      </div>

                      {/* Tombol Atur Jabatan untuk Admin / Lead Developer */}
                      {(isAdmin || isLeadDeveloper) && !isEditing && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStartEdit(member.id, member.roleTitle || 'Anggota Komunitas')}
                            className="p-1.5 text-slate-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                            title="Tentukan / Edit Jabatan Anggota"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {!isMasterDev && (
                            <button
                              onClick={() => removeMember(member.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                              title="Hapus dari Anggota"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TIM PENGURUS                                                       */}
      {/* ========================================================================= */}
      {activeCommTab === 'team' && (
        <div className="space-y-6">
          {filteredTeam.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-slate-900 p-12 text-center shadow-[6px_6px_0px_0px_#0f172a]">
              <Shield className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">
                Tidak ada pengurus yang cocok dengan kata kunci "{searchQuery}".
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 px-4 py-2 bg-amber-500 text-slate-900 text-xs font-bold rounded-xl border-2 border-slate-900"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTeam.map(member => (
                <div
                  key={member.id}
                  className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-16 h-16 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-center font-black text-xl text-white mb-4 overflow-hidden bg-slate-900">
                      <img
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(member.name)}`}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">
                      {member.division}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">
                      {member.name}
                    </h3>
                    <div className="text-xs font-bold text-sky-700 mt-0.5">
                      {member.role}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Domisili: {member.domisili}</span>
                    </div>

                    <div className="p-3 bg-neutral-50 rounded-2xl border border-slate-200 text-xs text-slate-700 italic mt-4 leading-relaxed">
                      "{member.yuruMotto}"
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Kontak:</span>
                    <span className="font-mono text-slate-800">{member.social}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL GANTI FOTO PROFIL DARI GALERI HP */}
      {avatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] overflow-hidden">
            <div className="p-5 bg-amber-100 border-b-2 border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-900 flex items-center justify-center text-amber-800 shadow-xs">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Ganti Foto Profil Anggota
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    Upload langsung dari galeri HP atau kamera Anda
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAvatarModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 bg-white rounded-xl border border-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <ImageUploadPicker
                value={avatarInputUrl}
                onChange={url => setAvatarInputUrl(url)}
                label="Foto Profil Baru (Galeri HP / Kamera)"
                placeholder="Pilih foto dari galeri HP atau URL..."
                helperText="Foto profil ini akan tampil pada kartu anggota dan daftar komunitas"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAvatarModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveAvatar}
                  disabled={!avatarInputUrl.trim()}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Foto Profil</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
