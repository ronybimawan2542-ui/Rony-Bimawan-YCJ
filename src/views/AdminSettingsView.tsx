import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCamp } from '../context/CampContext';
import { CampEvent, PastEvent, EventTestimonial, CampRegion } from '../types';
import { CommunityLogo } from '../components/CampIllustration';
import { ImageUploadPicker } from '../components/ImageUploadPicker';
import { 
  ShieldCheck, 
  Shield,
  Lock, 
  UserPlus, 
  Trash2, 
  PlusCircle, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Settings, 
  Bell, 
  Save, 
  Image as ImageIcon,
  Sparkles,
  RotateCcw,
  Eye,
  Type,
  Users,
  Edit3,
  Check,
  X,
  MessageSquare,
  Star,
  FileText,
  Archive,
  BookOpen
} from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { user, isAdmin, isLeadDeveloper, adminEmails, addAdminEmail, removeAdminEmail } = useAuth();
  const { 
    events, 
    addNewEvent, 
    updateEvent,
    updateEventStatus, 
    deleteEvent, 
    pastEvents,
    addNewPastEvent,
    updatePastEvent,
    deletePastEvent,
    deleteTestimonialFromPastEvent,
    updateTestimonialInPastEvent,
    applications, 
    approveApplication, 
    rejectApplication, 
    settings, 
    updateSettings,
    memberSpotlights,
    updateMemberRole,
    removeMember,
    showToast
  } = useCamp();

  const [newAdminInput, setNewAdminInput] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'auth' | 'media' | 'events' | 'verify' | 'content'>('media');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingRoleTitle, setEditingRoleTitle] = useState<string>('');

  // Media Settings State (Logo, Beranda Photo, Highlight Photo)
  const [logoInput, setLogoInput] = useState(settings.logoUrl || '');
  const [heroImgInput, setHeroImgInput] = useState(settings.heroImageUrl || '');
  const [highlightImgInput, setHighlightImgInput] = useState(settings.highlightEventImageUrl || '');

  // Content Settings State (Footer about text, announcement, tagline, contact)
  const [footerAboutInput, setFooterAboutInput] = useState(settings.footerAboutText || '');
  const [announcementText, setAnnouncementText] = useState(settings.announcement);
  const [announcementActive, setAnnouncementActive] = useState(settings.announcementActive);
  const [taglineText, setTaglineText] = useState(settings.tagline);
  const [whatsappContact, setWhatsappContact] = useState(settings.contactWhatsApp);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    subtitle: '',
    date: '12 - 13 Desember 2026',
    duration: '2 Hari 1 Malam (Weekend)',
    location: '',
    region: 'Bogor' as CampRegion,
    altitude: '1.000 mdpl',
    fee: 'Rp 50.000 / orang',
    illustrationType: 'campfire' as const,
    imageUrl: '',
    description: '',
    highlightsText: 'Masak nabe bersama\nStargazing malam\nWorkshop pasak tenda',
    requiredGearText: 'Tenda double-layer (disarankan water column min 2000mm)\nSleeping bag rating nyaman 15°C\nMatras aluminium foil atau busa\nHeadlamp / senter dengan baterai cadangan\nPeralatan makan & mug pribadi',
    rulesText: 'Etika Leave No Trace: Bawa pulang semua sampah tanpa terkecuali.\nBatas Waktu Hening (Quiet Hours): Mulai pukul 22.00 WIB dilarang musik kencang.\nKeamanan Api: Dilarang membuat api langsung di atas rumput tanpa fire pit.\nSaling menjaga privasi, toleransi, dan ketenangan sesama peserta kemping.',
    equipmentNotes: 'Suhu malam hari cukup dingin. Disarankan membawa jaket fleece/windbreaker dan matras berinsulasi.',
    meetingPoint: 'Simpang Ciawi Bogor pukul 09.00 WIB'
  });

  // Edit Event Modal State
  const [editingEvent, setEditingEvent] = useState<{
    id: string;
    title: string;
    subtitle: string;
    date: string;
    duration: string;
    location: string;
    region: CampRegion;
    altitude: string;
    fee: string;
    status: 'upcoming' | 'open' | 'closed' | 'completed';
    illustrationType: 'campfire' | 'pine' | 'mountain' | 'lake' | 'night';
    imageUrl: string;
    description: string;
    highlightsText: string;
    requiredGearText: string;
    rulesText: string;
    equipmentNotes: string;
    meetingPoint: string;
  } | null>(null);

  // State for individual event image edits
  const [eventImageEdits, setEventImageEdits] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    events.forEach(e => {
      init[e.id] = e.imageUrl || '';
    });
    return init;
  });

  // Sub-tab under Kelola Event (Upcoming vs Past Archive)
  const [eventSubTab, setEventSubTab] = useState<'upcoming' | 'past'>('upcoming');

  // Edit Past Event Modal State
  const [editingPastEvent, setEditingPastEvent] = useState<{
    id: string;
    title: string;
    date: string;
    location: string;
    region: CampRegion;
    participantsCount: number;
    summary: string;
    story: string;
    highlightsText: string;
    imageUrl: string;
  } | null>(null);

  // Testimonials management modal/drawer state
  const [managingTestimonialsEventId, setManagingTestimonialsEventId] = useState<string | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<{
    eventId: string;
    id: string;
    comment: string;
    rating: number;
  } | null>(null);

  // New Past Event Form State
  const [newPastEvent, setNewPastEvent] = useState({
    title: '',
    date: '10 - 11 Mei 2026',
    location: '',
    region: 'Bogor' as CampRegion,
    participantsCount: 18,
    summary: 'Kemping Selesai & Sukses Digelar',
    story: 'Event kemping bersama komunitas Yuru Camp Jabodetabek telah selesai diselenggarakan dengan lancar.',
    highlightsText: 'Masak nabe bersama\nStargazing malam\nSilaturahmi sesama camper',
    imageUrl: ''
  });

  const handleOpenEditPastEvent = (pastEvt: PastEvent) => {
    setEditingPastEvent({
      id: pastEvt.id,
      title: pastEvt.title,
      date: pastEvt.date,
      location: pastEvt.location,
      region: pastEvt.region,
      participantsCount: pastEvt.participantsCount || 15,
      summary: pastEvt.summary || '',
      story: pastEvt.story || '',
      highlightsText: (pastEvt.highlights || []).join('\n'),
      imageUrl: pastEvt.imageUrl || ''
    });
  };

  const handleSaveEditPastEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPastEvent) return;

    updatePastEvent(editingPastEvent.id, {
      title: editingPastEvent.title.trim(),
      date: editingPastEvent.date.trim(),
      location: editingPastEvent.location.trim(),
      region: editingPastEvent.region,
      participantsCount: Number(editingPastEvent.participantsCount) || 15,
      summary: editingPastEvent.summary.trim(),
      story: editingPastEvent.story.trim(),
      highlights: editingPastEvent.highlightsText.split('\n').map(s => s.trim()).filter(Boolean),
      imageUrl: editingPastEvent.imageUrl.trim() || undefined
    });

    setEditingPastEvent(null);
  };

  const handleCreatePastEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPastEvent.title.trim() || !newPastEvent.location.trim()) return;

    addNewPastEvent({
      title: newPastEvent.title.trim(),
      date: newPastEvent.date.trim(),
      location: newPastEvent.location.trim(),
      region: newPastEvent.region,
      participantsCount: Number(newPastEvent.participantsCount) || 15,
      summary: newPastEvent.summary.trim() || 'Kemping Selesai & Sukses Digelar',
      story: newPastEvent.story.trim() || 'Event kemping telah selesai diselenggarakan dengan sukses.',
      highlights: newPastEvent.highlightsText.split('\n').map(s => s.trim()).filter(Boolean),
      illustrationType: 'campfire',
      imageUrl: newPastEvent.imageUrl.trim() || undefined
    });

    setNewPastEvent({
      title: '',
      date: '10 - 11 Mei 2026',
      location: '',
      region: 'Bogor',
      participantsCount: 18,
      summary: 'Kemping Selesai & Sukses Digelar',
      story: 'Event kemping bersama komunitas Yuru Camp Jabodetabek telah selesai diselenggarakan dengan lancar.',
      highlightsText: 'Masak nabe bersama\nStargazing malam\nSilaturahmi sesama camper',
      imageUrl: ''
    });
  };

  const handleSaveEditTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    updateTestimonialInPastEvent(
      editingTestimonial.eventId,
      editingTestimonial.id,
      editingTestimonial.comment.trim(),
      editingTestimonial.rating
    );

    setEditingTestimonial(null);
  };

  // Access guard: Anggota resmi tidak bisa atau tidak memiliki akses untuk mengedit bagian pengaturan admin (Hanya lead developer dan admin yang bisa)
  if (!isAdmin) {
    return (
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-10 text-center max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-100 border-2 border-slate-900 flex items-center justify-center mx-auto text-red-600">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Akses Pengaturan Ditolak</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Anggota resmi tidak memiliki akses untuk mengedit bagian pengaturan admin. 
          Halaman Pengaturan ini <strong>hanya dapat diedit oleh Lead Developer dan Admin Resmi Komunitas</strong> (<code className="font-mono text-sky-700">ronybimawan2542@gmail.com</code>).
        </p>
        <p className="text-[11px] text-slate-500 bg-neutral-100 p-3 rounded-xl border border-slate-200">
          Status pengguna saat ini: <strong>{user ? `${user.name} (${user.role === 'anggota' ? 'Anggota Resmi' : user.role === 'tamu' ? 'Tamu' : user.role})` : 'Belum Login'}</strong>.
        </p>
      </div>
    );
  }

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminInput.trim()) return;
    addAdminEmail(newAdminInput.trim());
    setNewAdminInput('');
  };

  const handleSaveMediaSettings = () => {
    updateSettings({
      logoUrl: logoInput.trim(),
      heroImageUrl: heroImgInput.trim(),
      highlightEventImageUrl: highlightImgInput.trim()
    });
    showToast('📸 Foto tampilan & logo berhasil diperbarui oleh Admin!');
  };

  const handleResetLogo = () => {
    setLogoInput('');
    updateSettings({ logoUrl: '' });
    showToast('Logo dikembalikan ke lambang vektor default Yuru Camp.');
  };

  const handleResetHeroImg = () => {
    setHeroImgInput('');
    updateSettings({ heroImageUrl: '' });
    showToast('Foto beranda dikembalikan ke ilustrasi campfire default.');
  };

  const handleResetHighlightImg = () => {
    setHighlightImgInput('');
    updateSettings({ highlightEventImageUrl: '' });
    showToast('Foto highlight dikembalikan ke ilustrasi default.');
  };

  const handleSaveIndividualEventImage = (eventId: string) => {
    const imgUrl = (eventImageEdits[eventId] || '').trim();
    updateEvent(eventId, { imageUrl: imgUrl });
    showToast('Foto banner event berhasil disimpan!');
  };

  const handleSaveContentSettings = () => {
    updateSettings({
      footerAboutText: footerAboutInput.trim() || 'Wadah perkumpulan pencinta kemping santai, alam bebas, dan hangatnya api unggun di Bogor, Sentul, Cibodas, Sukabumi, dan Puncak. Mengutamakan etika Leave No Trace dan kebersamaan ramah pemula.',
      announcement: announcementText,
      announcementActive,
      tagline: taglineText,
      contactWhatsApp: whatsappContact
    });
    showToast(' Teks tentang komunitas di atas footer & pengumuman berhasil disimpan!');
  };

  const handleOpenEditEvent = (evt: CampEvent) => {
    setEditingEvent({
      id: evt.id,
      title: evt.title,
      subtitle: evt.subtitle || '',
      date: evt.date,
      duration: evt.duration || '2 Hari 1 Malam (Weekend)',
      location: evt.location,
      region: evt.region,
      altitude: evt.altitude || '1.000 mdpl',
      fee: evt.fee,
      status: evt.status,
      illustrationType: evt.illustrationType || 'campfire',
      imageUrl: evt.imageUrl || '',
      description: evt.description || '',
      highlightsText: (evt.highlights || []).join('\n'),
      requiredGearText: (evt.requiredGear || []).join('\n'),
      rulesText: (evt.rules || []).join('\n'),
      equipmentNotes: evt.equipmentNotes || '',
      meetingPoint: evt.meetingPoint || ''
    });
  };

  const handleSaveEditEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    updateEvent(editingEvent.id, {
      title: editingEvent.title.trim(),
      subtitle: editingEvent.subtitle.trim(),
      date: editingEvent.date.trim(),
      duration: editingEvent.duration.trim(),
      location: editingEvent.location.trim(),
      region: editingEvent.region,
      altitude: editingEvent.altitude.trim(),
      fee: editingEvent.fee.trim(),
      status: editingEvent.status,
      imageUrl: editingEvent.imageUrl.trim() || undefined,
      description: editingEvent.description.trim(),
      highlights: editingEvent.highlightsText.split('\n').map(s => s.trim()).filter(Boolean),
      requiredGear: editingEvent.requiredGearText.split('\n').map(s => s.trim()).filter(Boolean),
      rules: editingEvent.rulesText.split('\n').map(s => s.trim()).filter(Boolean),
      equipmentNotes: editingEvent.equipmentNotes.trim(),
      meetingPoint: editingEvent.meetingPoint.trim()
    });

    setEditingEvent(null);
    showToast(`✅ Detail Agenda Event "${editingEvent.title}" berhasil diperbarui oleh Admin / Lead Dev!`);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.location.trim()) return;

    addNewEvent({
      title: newEvent.title.trim(),
      subtitle: newEvent.subtitle.trim() || 'Kemping santai bersama sahabat Yuru Camp Jabodetabek',
      date: newEvent.date.trim(),
      targetTimestamp: Date.now() + 1000 * 60 * 60 * 24 * 30,
      duration: newEvent.duration.trim() || '2 Hari 1 Malam (Weekend)',
      location: newEvent.location.trim(),
      region: newEvent.region,
      altitude: newEvent.altitude.trim() || '1.000 mdpl',
      fee: newEvent.fee.trim(),
      status: 'open',
      illustrationType: newEvent.illustrationType,
      imageUrl: newEvent.imageUrl.trim() || undefined,
      description: newEvent.description.trim() || 'Agenda berkemah santai ramah pemula.',
      highlights: newEvent.highlightsText.split('\n').map(s => s.trim()).filter(Boolean),
      requiredGear: newEvent.requiredGearText.split('\n').map(s => s.trim()).filter(Boolean),
      rules: newEvent.rulesText.split('\n').map(s => s.trim()).filter(Boolean),
      equipmentNotes: newEvent.equipmentNotes.trim(),
      meetingPoint: newEvent.meetingPoint.trim()
    });

    setNewEvent({
      ...newEvent,
      title: '',
      subtitle: '',
      location: '',
      imageUrl: '',
      description: ''
    });
  };

  // Sample curated camping photos presets for 1-click convenience
  const samplePhotoPresets = [
    { label: 'Campfire Malam', url: 'https://images.unsplash.com/photo-1508873696983-2df5293cbdaf?w=800&auto=format&fit=crop&q=80' },
    { label: 'Tenda Hutan Pinus', url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80' },
    { label: 'Kabut Danau Pagi', url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop&q=80' },
    { label: 'Masak Camp Cast Iron', url: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=800&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="bg-sky-50 rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 sm:p-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Pusat Kendali Pengurus & Pengembang</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pengaturan & Kuasa Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Hanya Admin Resmi yang memiliki kuasa mengedit foto tampilan (logo, beranda, event), teks tentang komunitas di atas footer, jadwal kemping, serta otorisasi admin.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mt-6 pt-5 border-t border-sky-200 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveAdminTab('media')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap border-2 flex items-center gap-1.5 ${
              activeAdminTab === 'media'
                ? 'bg-amber-500 text-slate-900 border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-neutral-50'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Foto Tampilan & Logo</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('content')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap border-2 flex items-center gap-1.5 ${
              activeAdminTab === 'content'
                ? 'bg-amber-500 text-slate-900 border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-neutral-50'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Teks Footer & Pengumuman</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('events')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap border-2 flex items-center gap-1.5 ${
              activeAdminTab === 'events'
                ? 'bg-amber-500 text-slate-900 border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-neutral-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Kelola Event ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('verify')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap border-2 flex items-center gap-1.5 ${
              activeAdminTab === 'verify'
                ? 'bg-amber-500 text-slate-900 border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-neutral-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Kelola Jabatan Anggota ({memberSpotlights.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('auth')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap border-2 flex items-center gap-1.5 ${
              activeAdminTab === 'auth'
                ? 'bg-amber-500 text-slate-900 border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-neutral-50'
            }`}
          >
            <span>Otoritas Admin ({adminEmails.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MEDIA (LOGO, BERANDA PHOTO, HIGHLIGHT PHOTO & EVENT PHOTOS) */}
      {activeAdminTab === 'media' && (
        <div className="space-y-6">
          
          {/* Section: Logo Komunitas & Beranda Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 1. EDIT LOGO */}
            <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase">Identitas Visual</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Edit Logo Yuru Camp Jabodetabek
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Logo ini akan tampil di sudut kiri bilah navigasi atas (Navbar) dan di bagian footer. Masukkan link URL gambar logo kustom atau gunakan logo lambang tenda default.
                </p>
              </div>

              {/* Preview Box */}
              <div className="p-4 bg-neutral-100 rounded-2xl border-2 border-slate-200 flex items-center gap-4">
                <div className="text-center shrink-0">
                  <div className="text-[10px] text-slate-500 mb-1">Preview Logo</div>
                  <CommunityLogo size={52} logoUrl={logoInput} />
                </div>
                <div className="flex-1 text-xs text-slate-600">
                  <strong className="text-slate-900 block">Status Logo Saat Ini:</strong>
                  <span>{logoInput ? 'Menggunakan Foto / Gambar Kustom' : 'Menggunakan Vektor Tenda Default (Flat Amber)'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <ImageUploadPicker
                  value={logoInput}
                  onChange={url => setLogoInput(url)}
                  label="Upload Foto / Gambar Logo Komunitas (Galeri HP / Kamera)"
                  placeholder="https://... atau pilih dari galeri ponsel"
                  helperText="Format gambar PNG transparan atau JPG bulat dari galeri ponsel Anda"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveMediaSettings}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-transform active:translate-y-0.5 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Logo</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetLogo}
                  className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300"
                >
                  Reset ke Logo Asli
                </button>
              </div>
            </div>

            {/* 2. EDIT FOTO BANNER BERANDA (HERO BANNER) */}
            <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-sky-700 uppercase">Banner Utama</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Edit Foto Tampilan Beranda (Hero Banner)
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Foto ini akan menggantikan ilustrasi sisi kanan kartu Hero Beranda. Anda bisa mengunggah foto nyata bumi perkemahan langsung dari galeri ponsel.
                </p>
              </div>

              <ImageUploadPicker
                value={heroImgInput}
                onChange={url => setHeroImgInput(url)}
                label="Foto Banner Beranda (Galeri HP / Kamera)"
                placeholder="https://... atau pilih dari galeri ponsel"
                presets={samplePhotoPresets}
                helperText="Mendukung upload langsung dari galeri ponsel atau kamera HP Anda"
              />

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveMediaSettings}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-transform active:translate-y-0.5 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Foto Beranda</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetHeroImg}
                  className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300"
                >
                  Gunakan Ilustrasi Bawaan
                </button>
              </div>
            </div>
          </div>

          {/* 3. EDIT FOTO HIGHLIGHT EVENT & FOTO SETIAP EVENT */}
          <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase">Banner Acara & Agenda</span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Edit Foto Banner untuk Setiap Event Kemping
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Admin dapat menentukan foto dokumentasi atau banner lanskap spesifik untuk masing-masing agenda kemping, menggantikan ilustrasi standar.
              </p>
            </div>

            {/* Banner Event Terdekat (Highlight) */}
            <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-300 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs">
                  Foto Banner Khusus: Event Terdekat (Highlight Banner)
                </h4>
                {highlightImgInput && (
                  <button
                    type="button"
                    onClick={handleResetHighlightImg}
                    className="text-[11px] text-red-600 hover:underline font-bold"
                  >
                    Hapus Foto Highlight
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <ImageUploadPicker
                  value={highlightImgInput}
                  onChange={url => setHighlightImgInput(url)}
                  label="Foto Banner Event Terdekat (Galeri HP / Kamera)"
                  placeholder="https://... atau pilih dari galeri ponsel"
                  presets={samplePhotoPresets}
                  helperText="Upload langsung dari galeri HP untuk menggantikan ilustrasi kartu event utama"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveMediaSettings}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl border border-slate-900 shadow-xs flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Foto Highlight</span>
                  </button>
                </div>
              </div>
            </div>

            {/* List of each event with dedicated photo URL editor */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Foto Masing-Masing Event ({events.length} Event Terdaftar):
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map(evt => {
                  const currentEditUrl = eventImageEdits[evt.id] ?? (evt.imageUrl || '');
                  return (
                    <div
                      key={evt.id}
                      className="p-4 rounded-2xl border-2 border-slate-200 bg-neutral-50 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-sky-800">{evt.region}</span>
                          <span className="text-[10px] font-mono text-slate-500">{evt.date}</span>
                        </div>
                        <h5 className="font-extrabold text-slate-900 text-sm mt-0.5">{evt.title}</h5>
                        <p className="text-xs text-slate-500 truncate">{evt.location}</p>
                      </div>

                      <ImageUploadPicker
                        value={currentEditUrl}
                        onChange={url => setEventImageEdits({ ...eventImageEdits, [evt.id]: url })}
                        label={`Foto Event: ${evt.title}`}
                        placeholder="Pilih dari galeri ponsel atau URL"
                        presets={samplePhotoPresets}
                        helperText="Upload langsung dari galeri HP atau kamera Anda"
                      />

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => handleSaveIndividualEventImage(evt.id)}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border border-slate-900 shadow-xs flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Simpan Foto</span>
                        </button>

                        {currentEditUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setEventImageEdits({ ...eventImageEdits, [evt.id]: '' });
                              updateEvent(evt.id, { imageUrl: '' });
                              showToast(`Foto event "${evt.title}" dihapus, kembali ke ilustrasi.`);
                            }}
                            className="text-[11px] text-red-600 hover:underline font-bold"
                          >
                            Hapus Foto
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTENT & FOOTER ABOUT TEXT */}
      {activeAdminTab === 'content' && (
        <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 sm:p-8 space-y-6 max-w-3xl">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase">Konten Teks & Informasi</span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              Edit Teks Komunitas & Pengumuman
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Semua teks di bawah ini hanya dapat diubah oleh Admin Resmi. Perubahan akan langsung tampil di antarmuka halaman website.
            </p>
          </div>

          <div className="space-y-5">
            {/* 1. TEKS TENTANG YURU CAMP JABODETABEK (DI ATAS FOOTER) */}
            <div className="p-5 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-amber-700" />
                  <span>Teks Tentang Yuru Camp Jabodetabek (Di Bagian Atas Footer) *</span>
                </label>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                  Khusus Admin
                </span>
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Teks ini menjelaskan profil singkat komunitas dan ditampilkan secara permanen pada kolom kiri di atas footer website.
              </p>
              <textarea
                rows={4}
                required
                value={footerAboutInput}
                onChange={e => setFooterAboutInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border-2 border-slate-900 rounded-xl focus:outline-hidden leading-relaxed"
                placeholder="Tuliskan deskripsi ringkas tentang Yuru Camp Jabodetabek..."
              />
            </div>

            {/* 2. TEKS PENGUMUMAN BERJALAN DI BERANDA */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Teks Pengumuman Cuaca / Beranda Atas</label>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={announcementActive}
                    onChange={e => setAnnouncementActive(e.target.checked)}
                    className="accent-amber-500"
                  />
                  <span className="font-bold">Tampilkan Banner Pengumuman</span>
                </label>
              </div>
              <textarea
                rows={3}
                value={announcementText}
                onChange={e => setAnnouncementText(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
              />
            </div>

            {/* 3. TAGLINE KOMUNITAS */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tagline Resmi Komunitas</label>
              <input
                type="text"
                value={taglineText}
                onChange={e => setTaglineText(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
              />
            </div>

            {/* 4. KONTAK WHATSAPP */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Kontak WhatsApp Resmi</label>
              <input
                type="text"
                value={whatsappContact}
                onChange={e => setWhatsappContact(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden font-mono"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveContentSettings}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center gap-2 transition-transform active:translate-y-0.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Teks Footer & Pengumuman</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KELOLA & EDIT AGENDA EVENT (MENDATANG & ARSIP SELESAI / TESTIMONI) */}
      {activeAdminTab === 'events' && (
        <div className="space-y-6">
          {/* Header Info & Sub-tab switcher */}
          <div className="bg-amber-50 rounded-2xl border-2 border-amber-300 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Otoritas Khusus Lead Developer & Admin</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                Pusat Pengeditan Agenda & Arsip Event Selesai
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Pantau dan edit agenda event mendatang maupun arsip event selesai beserta testimoni & rating dari para anggota komunitas.
              </p>
            </div>

            {/* Sub-tab Toggle */}
            <div className="flex p-1 bg-white rounded-2xl border-2 border-slate-900 shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setEventSubTab('upcoming')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
                  eventSubTab === 'upcoming'
                    ? 'bg-amber-500 text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Event Mendatang ({events.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setEventSubTab('past')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
                  eventSubTab === 'past'
                    ? 'bg-amber-500 text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Arsip Selesai & Testimoni ({pastEvents.length})</span>
              </button>
            </div>
          </div>

          {/* SUB-TAB 1: AGENDA EVENT MENDATANG / AKTIF */}
          {eventSubTab === 'upcoming' && (
            <div className="space-y-6">
              {/* List of existing events with dedicated Edit, Status, and Delete */}
              <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-700 uppercase">Daftar Agenda Mendatang</span>
                    <h3 className="text-xl font-black text-slate-900">
                      Event Aktif Komunitas ({events.length})
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    Klik "Edit Detail Event" untuk mengubah informasi lokasi, harga, peralatan & peraturan.
                  </span>
                </div>

                <div className="space-y-3">
                  {events.map(e => (
                    <div
                      key={e.id}
                      className="p-4 rounded-2xl border-2 border-slate-200 bg-neutral-50 hover:bg-white transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-20 h-16 rounded-xl border border-slate-900 overflow-hidden bg-slate-200 shrink-0 relative">
                          {e.imageUrl ? (
                            <img
                              src={e.imageUrl}
                              alt={e.title}
                              className="w-full h-full object-cover"
                              onError={(evt) => {
                                (evt.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500 font-bold bg-amber-100">
                              Ilustrasi
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-slate-900 text-sm">{e.title}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300">
                              {e.region}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                              {e.duration}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 mt-1 flex items-center gap-2 flex-wrap">
                            <span><strong>Tanggal:</strong> {e.date}</span>
                            <span>•</span>
                            <span><strong>Lokasi:</strong> {e.location}</span>
                            <span>•</span>
                            <span><strong>Harga:</strong> {e.fee}</span>
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            👥 {e.registeredUserEmails.length} Peserta Terdaftar · {e.rules ? `${e.rules.length} Peraturan Ditetapkan` : 'Peraturan Standar'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleOpenEditEvent(e)}
                          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1.5 transition-transform active:translate-y-0.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Detail Event</span>
                        </button>

                        <select
                          value={e.status}
                          onChange={val => updateEventStatus(e.id, val.target.value as any)}
                          className="px-2.5 py-2 text-xs font-bold bg-white border-2 border-slate-300 rounded-xl focus:border-slate-900"
                        >
                          <option value="open">Buka (Open)</option>
                          <option value="closed">Ditutup (Closed)</option>
                          <option value="completed">Selesai (Completed)</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => deleteEvent(e.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-colors"
                          title="Hapus Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Event Form */}
              <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 space-y-4">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase">Tambah Agenda Baru</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    Formulir Pembuatan Event Baru
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Isi rincian lengkap termasuk lokasi, harga, tanggal, durasi kemping, serta teks peralatan dan peraturan event.
                  </p>
                </div>

                <form onSubmit={handleCreateEvent} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Judul Event *</label>
                      <input
                        type="text"
                        required
                        value={newEvent.title}
                        onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="contoh: Sukamantri Starry Night & Citylight"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Subjudul / Tagline Singkat</label>
                      <input
                        type="text"
                        value={newEvent.subtitle}
                        onChange={e => setNewEvent({ ...newEvent, subtitle: e.target.value })}
                        placeholder="contoh: Menikmati heningnya kaki Gunung Salak dengan pemandangan kerlap-kerlip kota"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Camping Ground *</label>
                      <input
                        type="text"
                        required
                        value={newEvent.location}
                        onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                        placeholder="contoh: Buper Sukamantri, TN Gunung Halimun Salak"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Harga / Biaya Patungan *</label>
                      <input
                        type="text"
                        required
                        value={newEvent.fee}
                        onChange={e => setNewEvent({ ...newEvent, fee: e.target.value })}
                        placeholder="contoh: Rp 50.000 / orang (Kavling + Kayu Bakar)"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Event *</label>
                      <input
                        type="text"
                        required
                        value={newEvent.date}
                        onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                        placeholder="contoh: 12 - 13 Desember 2026"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Durasi Event Berlangsung *</label>
                      <input
                        type="text"
                        required
                        value={newEvent.duration}
                        onChange={e => setNewEvent({ ...newEvent, duration: e.target.value })}
                        placeholder="contoh: 2 Hari 1 Malam (Weekend)"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Wilayah *</label>
                      <select
                        value={newEvent.region}
                        onChange={e => setNewEvent({ ...newEvent, region: e.target.value as CampRegion })}
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      >
                        <option value="Bogor">Bogor</option>
                        <option value="Cibodas">Cibodas</option>
                        <option value="Sukabumi">Sukabumi</option>
                        <option value="Sentul">Sentul</option>
                        <option value="Puncak">Puncak</option>
                        <option value="Kepulauan Seribu">Kepulauan Seribu</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Ketinggian Tempat</label>
                      <input
                        type="text"
                        value={newEvent.altitude}
                        onChange={e => setNewEvent({ ...newEvent, altitude: e.target.value })}
                        placeholder="contoh: 1.000 mdpl"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Titik Kumpul (Meeting Point)</label>
                      <input
                        type="text"
                        value={newEvent.meetingPoint}
                        onChange={e => setNewEvent({ ...newEvent, meetingPoint: e.target.value })}
                        placeholder="contoh: Simpang Ciawi Bogor pukul 09.00 WIB"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <ImageUploadPicker
                    value={newEvent.imageUrl}
                    onChange={url => setNewEvent({ ...newEvent, imageUrl: url })}
                    label="Foto Banner Event (Galeri HP / Kamera)"
                    placeholder="https://images.unsplash.com/... atau pilih dari galeri ponsel"
                    presets={samplePhotoPresets}
                    helperText="Mendukung upload foto dari galeri HP atau kamera (jika kosong menggunakan ilustrasi flat)"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Kalimat Deskripsi Lengkap Acara</label>
                      <textarea
                        rows={3}
                        value={newEvent.description}
                        onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                        placeholder="Ceritakan rencana kemping, suasana lokasi, dan agenda santai..."
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sorotan Aktivitas (1 baris per poin)</label>
                      <textarea
                        rows={3}
                        value={newEvent.highlightsText}
                        onChange={e => setNewEvent({ ...newEvent, highlightsText: e.target.value })}
                        placeholder="Masak ramen nabe bersama&#10;Stargazing malam&#10;Workshop pasang flysheet"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
                    <div className="p-4 bg-amber-50/60 rounded-2xl border-2 border-amber-300 space-y-2">
                      <label className="block text-xs font-bold text-amber-950">
                        🎒 Teks Peralatan Wajib & Rekomendasi (1 baris per alat) *
                      </label>
                      <textarea
                        rows={4}
                        value={newEvent.requiredGearText}
                        onChange={e => setNewEvent({ ...newEvent, requiredGearText: e.target.value })}
                        placeholder="Tenda double layer&#10;Sleeping bag rating 15°C&#10;Matras aluminium foil&#10;Headlamp cadangan"
                        className="w-full px-3.5 py-2.5 text-xs bg-white border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                      <div>
                        <label className="block text-[11px] font-bold text-amber-900 mb-1">
                          Catatan Tambahan Peralatan (Opsional)
                        </label>
                        <input
                          type="text"
                          value={newEvent.equipmentNotes}
                          onChange={e => setNewEvent({ ...newEvent, equipmentNotes: e.target.value })}
                          placeholder="contoh: Suhu malam bisa 13°C, siapkan jaket fleece tebal."
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-400 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-sky-50/60 rounded-2xl border-2 border-sky-300 space-y-2">
                      <label className="block text-xs font-bold text-sky-950">
                        🛡️ Teks Peraturan Event (1 baris per aturan) *
                      </label>
                      <textarea
                        rows={6}
                        value={newEvent.rulesText}
                        onChange={e => setNewEvent({ ...newEvent, rulesText: e.target.value })}
                        placeholder="Etika Leave No Trace: Bawa pulang semua sampah tanpa terkecuali&#10;Batas Waktu Hening (Quiet Hours) mulai pukul 22.00 WIB&#10;Dilarang membuat api langsung di atas rumput tanpa fire pit&#10;Saling menjaga toleransi dan ketenangan sesama camper"
                        className="w-full px-3.5 py-2.5 text-xs bg-white border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-transform active:translate-y-0.5 flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publikasikan Agenda Event Baru</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: ARSIP EVENT SELESAI & TESTIMONI */}
          {eventSubTab === 'past' && (
            <div className="space-y-6">
              {/* List of Archived Events */}
              <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-700 uppercase">Dokumentasi Event Selesai</span>
                    <h3 className="text-xl font-black text-slate-900">
                      Kelola Arsip Selesai & Testimoni ({pastEvents.length} Event)
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    Admin dapat mengedit cerita, foto cover, serta memantau & mengedit testimoni dari para anggota.
                  </span>
                </div>

                <div className="space-y-3">
                  {pastEvents.map(p => {
                    const testCount = p.testimonials?.length || 0;
                    return (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl border-2 border-slate-200 bg-neutral-50 hover:bg-white transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div className="w-20 h-16 rounded-xl border border-slate-900 overflow-hidden bg-slate-200 shrink-0 relative">
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.title}
                                className="w-full h-full object-cover"
                                onError={(evt) => {
                                  (evt.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500 font-bold bg-amber-100">
                                Arsip
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-extrabold text-slate-900 text-sm">{p.title}</h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Selesai
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300">
                                {p.region}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 mt-1 flex items-center gap-2 flex-wrap">
                              <span><strong>Tanggal:</strong> {p.date}</span>
                              <span>•</span>
                              <span><strong>Lokasi:</strong> {p.location}</span>
                              <span>•</span>
                              <span><strong>Peserta:</strong> {p.participantsCount} orang</span>
                            </p>
                            <p className="text-[11px] text-slate-500 mt-1 truncate max-w-xl">
                              💬 <strong>{testCount} Testimoni Masuk</strong> — {p.summary}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto flex-wrap">
                          {/* Edit Past Event Detail */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditPastEvent(p)}
                            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1.5 transition-transform active:translate-y-0.5"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Detail Arsip</span>
                          </button>

                          {/* Manage Testimonials */}
                          <button
                            type="button"
                            onClick={() => setManagingTestimonialsEventId(p.id)}
                            className="px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1.5 transition-transform active:translate-y-0.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Pantau Testimoni ({testCount})</span>
                          </button>

                          {/* Delete Past Event */}
                          <button
                            type="button"
                            onClick={() => deletePastEvent(p.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-colors"
                            title="Hapus Arsip Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Manual Tambah Arsip Event Selesai */}
              <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 space-y-4">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase">Selesai & Historis</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    Formulir Tambah Arsip Event Selesai Manual
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Gunakan formulir ini untuk menambahkan rekam jejak event kemping terdahulu agar bisa dipantau dan diberi testimoni oleh anggota.
                  </p>
                </div>

                <form onSubmit={handleCreatePastEvent} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Judul Event Selesai *</label>
                      <input
                        type="text"
                        required
                        value={newPastEvent.title}
                        onChange={e => setNewPastEvent({ ...newPastEvent, title: e.target.value })}
                        placeholder="contoh: Cibodas Autumn Stargazing Camp"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Diselenggarakan *</label>
                      <input
                        type="text"
                        required
                        value={newPastEvent.date}
                        onChange={e => setNewPastEvent({ ...newPastEvent, date: e.target.value })}
                        placeholder="contoh: 10 - 11 Mei 2026"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Camping Ground *</label>
                      <input
                        type="text"
                        required
                        value={newPastEvent.location}
                        onChange={e => setNewPastEvent({ ...newPastEvent, location: e.target.value })}
                        placeholder="contoh: Bukit Golf Cibodas"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Wilayah *</label>
                      <select
                        value={newPastEvent.region}
                        onChange={e => setNewPastEvent({ ...newPastEvent, region: e.target.value as CampRegion })}
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      >
                        <option value="Bogor">Bogor</option>
                        <option value="Cibodas">Cibodas</option>
                        <option value="Sukabumi">Sukabumi</option>
                        <option value="Sentul">Sentul</option>
                        <option value="Puncak">Puncak</option>
                        <option value="Kepulauan Seribu">Kepulauan Seribu</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Peserta Hadir</label>
                      <input
                        type="number"
                        value={newPastEvent.participantsCount}
                        onChange={e => setNewPastEvent({ ...newPastEvent, participantsCount: Number(e.target.value) })}
                        placeholder="18"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <ImageUploadPicker
                    value={newPastEvent.imageUrl}
                    onChange={url => setNewPastEvent({ ...newPastEvent, imageUrl: url })}
                    label="Foto Cover Dokumentasi Event (Galeri HP / Kamera)"
                    placeholder="https://... atau pilih dari galeri ponsel"
                    presets={samplePhotoPresets}
                    helperText="Foto utama dokumentasi yang akan tampil di halaman Arsip Selesai"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan Singkat Kesuksesan Event</label>
                      <input
                        type="text"
                        value={newPastEvent.summary}
                        onChange={e => setNewPastEvent({ ...newPastEvent, summary: e.target.value })}
                        placeholder="contoh: Diikuti 18 peserta dengan kehangatan api unggun dan nabe malam"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sorotan Kegiatan (1 baris per poin)</label>
                      <textarea
                        rows={2}
                        value={newPastEvent.highlightsText}
                        onChange={e => setNewPastEvent({ ...newPastEvent, highlightsText: e.target.value })}
                        placeholder="Masak nabe bersama&#10;Stargazing malam&#10;Kopi Pagi"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ulasan / Cerita Lengkap Dokumentasi Event</label>
                    <textarea
                      rows={3}
                      value={newPastEvent.story}
                      onChange={e => setNewPastEvent({ ...newPastEvent, story: e.target.value })}
                      placeholder="Ceritakan momen seru selama kemping berlangsung..."
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-transform active:translate-y-0.5 flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Tambahkan ke Arsip Event Selesai</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* EDIT ACTIVE EVENT MODAL */}
          {editingEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
              <div className="relative w-full max-w-3xl bg-white rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] max-h-[92vh] overflow-y-auto">
                <div className="sticky top-0 z-10 p-5 bg-sky-100 border-b-2 border-slate-900 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-600 text-white">
                        Mode Pengeditan Admin / Lead Dev
                      </span>
                      <span className="text-xs font-bold text-sky-900">{editingEvent.region}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-1">
                      Edit Detail Agenda: {editingEvent.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setEditingEvent(null)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 bg-white rounded-xl border border-slate-300"
                    title="Tutup Modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditEvent} className="p-6 space-y-6">
                  <div className="p-4 bg-neutral-50 rounded-2xl border-2 border-slate-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-sky-600" />
                        <span>a. Foto Banner / Dokumentasi Event</span>
                      </label>
                      {editingEvent.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setEditingEvent({ ...editingEvent, imageUrl: '' })}
                          className="text-[11px] text-red-600 hover:underline font-bold"
                        >
                          Hapus Foto (Gunakan Ilustrasi Standar)
                        </button>
                      )}
                    </div>

                    <ImageUploadPicker
                      value={editingEvent.imageUrl}
                      onChange={url => setEditingEvent({ ...editingEvent, imageUrl: url })}
                      label="Foto Banner Event (Galeri HP / Kamera)"
                      placeholder="https://... atau pilih dari galeri ponsel"
                      presets={samplePhotoPresets}
                      helperText="Pilih foto langsung dari galeri HP atau gunakan kamera ponsel"
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Type className="w-4 h-4 text-amber-600" />
                      <span>b. Kalimat Detail Event (Lokasi, Harga, Tanggal, Durasi)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Judul Event *</label>
                        <input
                          type="text"
                          required
                          value={editingEvent.title}
                          onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Subjudul / Deskripsi Pendek</label>
                        <input
                          type="text"
                          value={editingEvent.subtitle}
                          onChange={e => setEditingEvent({ ...editingEvent, subtitle: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Camping Ground *</label>
                        <input
                          type="text"
                          required
                          value={editingEvent.location}
                          onChange={e => setEditingEvent({ ...editingEvent, location: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Harga / Biaya Patungan *</label>
                        <input
                          type="text"
                          required
                          value={editingEvent.fee}
                          onChange={e => setEditingEvent({ ...editingEvent, fee: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Event *</label>
                        <input
                          type="text"
                          required
                          value={editingEvent.date}
                          onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Durasi Event Berlangsung *</label>
                        <input
                          type="text"
                          required
                          value={editingEvent.duration}
                          onChange={e => setEditingEvent({ ...editingEvent, duration: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Wilayah *</label>
                        <select
                          value={editingEvent.region}
                          onChange={e => setEditingEvent({ ...editingEvent, region: e.target.value as CampRegion })}
                          className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                        >
                          <option value="Bogor">Bogor</option>
                          <option value="Cibodas">Cibodas</option>
                          <option value="Sukabumi">Sukabumi</option>
                          <option value="Sentul">Sentul</option>
                          <option value="Puncak">Puncak</option>
                          <option value="Kepulauan Seribu">Kepulauan Seribu</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Ketinggian Tempat</label>
                        <input
                          type="text"
                          value={editingEvent.altitude}
                          onChange={e => setEditingEvent({ ...editingEvent, altitude: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Titik Kumpul (Meeting Point)</label>
                        <input
                          type="text"
                          value={editingEvent.meetingPoint}
                          onChange={e => setEditingEvent({ ...editingEvent, meetingPoint: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Kalimat Deskripsi Lengkap</label>
                        <textarea
                          rows={3}
                          value={editingEvent.description}
                          onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Sorotan Aktivitas (1 baris per poin)</label>
                        <textarea
                          rows={3}
                          value={editingEvent.highlightsText}
                          onChange={e => setEditingEvent({ ...editingEvent, highlightsText: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2 border-t-2 border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>c. Teks Peralatan & Peraturan Event (Hanya Bisa Diedit oleh Lead Dev & Admin)</span>
                    </h4>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-2">
                        <label className="block text-xs font-bold text-amber-950">
                          🎒 Teks Peralatan Wajib & Rekomendasi (1 baris per alat)
                        </label>
                        <textarea
                          rows={4}
                          value={editingEvent.requiredGearText}
                          onChange={e => setEditingEvent({ ...editingEvent, requiredGearText: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs bg-white border-2 border-slate-900 rounded-xl focus:outline-hidden"
                        />
                        <div>
                          <label className="block text-[11px] font-bold text-amber-900 mb-0.5">
                            Catatan Panduan Peralatan
                          </label>
                          <input
                            type="text"
                            value={editingEvent.equipmentNotes}
                            onChange={e => setEditingEvent({ ...editingEvent, equipmentNotes: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-400 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-300 space-y-2">
                        <label className="block text-xs font-bold text-sky-950">
                          🛡️ Teks Peraturan Event (1 baris per peraturan)
                        </label>
                        <textarea
                          rows={6}
                          value={editingEvent.rulesText}
                          onChange={e => setEditingEvent({ ...editingEvent, rulesText: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs bg-white border-2 border-slate-900 rounded-xl focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t-2 border-slate-200 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingEvent(null)}
                      className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300"
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan Event</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* EDIT PAST EVENT MODAL */}
          {editingPastEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
              <div className="relative w-full max-w-2xl bg-white rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] max-h-[92vh] overflow-y-auto">
                <div className="sticky top-0 z-10 p-5 bg-amber-100 border-b-2 border-slate-900 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-600 text-white">
                      Edit Arsip Event Selesai
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-1">
                      {editingPastEvent.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setEditingPastEvent(null)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 bg-white rounded-xl border border-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditPastEvent} className="p-6 space-y-4">
                  <ImageUploadPicker
                    value={editingPastEvent.imageUrl}
                    onChange={url => setEditingPastEvent({ ...editingPastEvent, imageUrl: url })}
                    label="Foto Cover Dokumentasi Event (Galeri HP / Kamera)"
                    placeholder="https://... atau pilih dari galeri ponsel"
                    presets={samplePhotoPresets}
                    helperText="Mendukung upload langsung dari galeri HP"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Judul Event *</label>
                      <input
                        type="text"
                        required
                        value={editingPastEvent.title}
                        onChange={e => setEditingPastEvent({ ...editingPastEvent, title: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Diselenggarakan *</label>
                      <input
                        type="text"
                        required
                        value={editingPastEvent.date}
                        onChange={e => setEditingPastEvent({ ...editingPastEvent, date: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Camping Ground *</label>
                      <input
                        type="text"
                        required
                        value={editingPastEvent.location}
                        onChange={e => setEditingPastEvent({ ...editingPastEvent, location: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Wilayah *</label>
                      <select
                        value={editingPastEvent.region}
                        onChange={e => setEditingPastEvent({ ...editingPastEvent, region: e.target.value as CampRegion })}
                        className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl"
                      >
                        <option value="Bogor">Bogor</option>
                        <option value="Cibodas">Cibodas</option>
                        <option value="Sukabumi">Sukabumi</option>
                        <option value="Sentul">Sentul</option>
                        <option value="Puncak">Puncak</option>
                        <option value="Kepulauan Seribu">Kepulauan Seribu</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Peserta Hadir</label>
                      <input
                        type="number"
                        value={editingPastEvent.participantsCount}
                        onChange={e => setEditingPastEvent({ ...editingPastEvent, participantsCount: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan Singkat Kesuksesan Event</label>
                    <input
                      type="text"
                      value={editingPastEvent.summary}
                      onChange={e => setEditingPastEvent({ ...editingPastEvent, summary: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ulasan / Cerita Lengkap Dokumentasi Event</label>
                    <textarea
                      rows={3}
                      value={editingPastEvent.story}
                      onChange={e => setEditingPastEvent({ ...editingPastEvent, story: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sorotan Aktivitas (1 baris per poin)</label>
                    <textarea
                      rows={2}
                      value={editingPastEvent.highlightsText}
                      onChange={e => setEditingPastEvent({ ...editingPastEvent, highlightsText: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingPastEvent(null)}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-xs flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan Arsip</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MANAGE TESTIMONIALS MODAL / DRAWER */}
          {managingTestimonialsEventId && (() => {
            const pastObj = pastEvents.find(p => p.id === managingTestimonialsEventId);
            if (!pastObj) return null;
            const testimonialsList = pastObj.testimonials || [];

            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
                <div className="relative w-full max-w-3xl bg-white rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] max-h-[92vh] overflow-y-auto">
                  <div className="sticky top-0 z-10 p-5 bg-sky-100 border-b-2 border-slate-900 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-600 text-white">
                          Pemantauan & Pengeditan Testimoni
                        </span>
                        <span className="text-xs font-bold text-sky-900">{pastObj.region}</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 mt-1">
                        Testimoni Event: {pastObj.title} ({testimonialsList.length} Testimoni)
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        setManagingTestimonialsEventId(null);
                        setEditingTestimonial(null);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-900 bg-white rounded-xl border border-slate-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    {testimonialsList.length === 0 ? (
                      <div className="p-8 text-center bg-neutral-50 rounded-2xl border-2 border-dashed border-slate-300 space-y-2">
                        <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
                        <h4 className="font-bold text-slate-700 text-sm">Belum Ada Testimoni dari Anggota</h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                          Event ini sudah ditandai selesai. Anggota komunitas yang mengikuti event dapat memberikan testimoni langsung melalui halaman Agenda - Arsip Selesai.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {testimonialsList.map(t => {
                          const isEditingThis = editingTestimonial?.id === t.id;

                          return (
                            <div
                              key={t.id}
                              className="p-4 rounded-2xl border-2 border-slate-200 bg-neutral-50 space-y-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full border border-slate-900 overflow-hidden bg-amber-100 shrink-0">
                                    <img
                                      src={t.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(t.memberName)}`}
                                      alt={t.memberName}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-extrabold text-slate-900 text-xs">{t.memberName}</h5>
                                      <span className="text-[10px] text-slate-500 font-bold">({t.memberRole || 'Anggota'})</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                                      <div className="flex text-amber-500">
                                        {Array.from({ length: 5 }).map((_, idx) => (
                                          <Star
                                            key={idx}
                                            className={`w-3 h-3 ${idx < (t.rating || 5) ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`}
                                          />
                                        ))}
                                      </div>
                                      <span>•</span>
                                      <span>{t.date || 'Hari ini'}</span>
                                      {t.memberEmail && (
                                        <>
                                          <span>•</span>
                                          <span className="font-mono text-slate-600">{t.memberEmail}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {!isEditingThis && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => setEditingTestimonial({
                                          eventId: pastObj.id,
                                          id: t.id,
                                          comment: t.comment,
                                          rating: t.rating || 5
                                        })}
                                        className="px-2.5 py-1 text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg border border-amber-300 flex items-center gap-1"
                                      >
                                        <Edit3 className="w-3 h-3" />
                                        <span>Edit</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => deleteTestimonialFromPastEvent(pastObj.id, t.id)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Hapus Testimoni"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Testimonial Photo if uploaded */}
                              {t.photoUrl && (
                                <div className="w-24 h-20 rounded-xl border border-slate-300 overflow-hidden bg-slate-200">
                                  <img src={t.photoUrl} alt="Foto Momen Testimoni" className="w-full h-full object-cover" />
                                </div>
                              )}

                              {/* Comment Body / Edit Form */}
                              {isEditingThis ? (
                                <form onSubmit={handleSaveEditTestimonial} className="space-y-3 pt-2 border-t border-slate-300">
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Ubah Rating Bintang:</label>
                                    <div className="flex items-center gap-1">
                                      {[1, 2, 3, 4, 5].map(num => (
                                        <button
                                          key={num}
                                          type="button"
                                          onClick={() => setEditingTestimonial({ ...editingTestimonial, rating: num })}
                                          className="p-1"
                                        >
                                          <Star
                                            className={`w-4 h-4 ${num <= editingTestimonial.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`}
                                          />
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Teks Testimoni:</label>
                                    <textarea
                                      rows={3}
                                      required
                                      value={editingTestimonial.comment}
                                      onChange={e => setEditingTestimonial({ ...editingTestimonial, comment: e.target.value })}
                                      className="w-full px-3 py-2 text-xs bg-white border-2 border-slate-900 rounded-xl"
                                    />
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="submit"
                                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Simpan Testimoni</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingTestimonial(null)}
                                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                                    >
                                      Batal
                                    </button>
                                  </div>
                                </form>
                              ) : (
                                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 italic">
                                  "{t.comment}"
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="pt-2 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setManagingTestimonialsEventId(null);
                          setEditingTestimonial(null);
                        }}
                        className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
                      >
                        Selesai Memantau
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 4: KELOLA JABATAN ANGGOTA OLEH ADMIN & LEAD DEVELOPER */}
      {activeAdminTab === 'verify' && (
        <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 space-y-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase">Otoritas Kepengurusan</span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              Kelola Jabatan & Peran Anggota Komunitas
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Member yang login dengan akun Google otomatis tercatat sebagai anggota komunitas. Tentukan jabatan mereka (misal: <em>Koordinator Wilayah, Pemandu Jalur, Tim Logistik, atau Admin Komunitas</em>) melalui panel ini.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {memberSpotlights.map(member => {
              const isMasterDev = member.email?.toLowerCase() === 'ronybimawan2542@gmail.com' || member.jabatanCategory === 'lead_dev';
              const isEditing = editingMemberId === member.id;

              return (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl border-2 border-slate-200 bg-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-full border-2 border-slate-900 overflow-hidden bg-amber-100 shrink-0">
                      <img
                        src={member.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(member.name)}`}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{member.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isMasterDev 
                            ? 'bg-sky-100 text-sky-800 border-sky-300' 
                            : member.jabatanCategory === 'admin'
                            ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {member.roleTitle || 'Anggota Komunitas'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                        <span>ID: <strong className="font-mono text-slate-700">{member.memberId}</strong></span>
                        {member.email && <span>Email: <strong className="font-mono text-slate-700">{member.email}</strong></span>}
                        <span>Domisili: <strong className="text-slate-700">{member.domisili}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions to change roleTitle */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingRoleTitle}
                          onChange={e => setEditingRoleTitle(e.target.value)}
                          placeholder="Ketik nama jabatan..."
                          className="px-3 py-1.5 text-xs bg-white border-2 border-slate-900 rounded-xl font-bold"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            if (editingRoleTitle.trim()) {
                              updateMemberRole(member.id, editingRoleTitle.trim());
                            }
                            setEditingMemberId(null);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Simpan</span>
                        </button>
                        <button
                          onClick={() => setEditingMemberId(null)}
                          className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingMemberId(member.id);
                            setEditingRoleTitle(member.roleTitle || 'Anggota Komunitas');
                          }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border border-slate-900 flex items-center gap-1.5 transition-transform active:translate-y-0.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Tentukan Jabatan</span>
                        </button>

                        {!isMasterDev && (
                          <button
                            onClick={() => removeMember(member.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-colors"
                            title="Hapus Anggota"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: KUASA ADMIN & DEVELOPER */}
      {activeAdminTab === 'auth' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Admin Form */}
          <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 space-y-4">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase">Otorisasi Akun Google</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Beri Kuasa Admin ke Email Tertentu
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Hanya email yang tercatat di daftar ini yang memiliki kuasa mengedit isi web saat login menggunakan akun Google mereka sendiri.
              </p>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Akun Google Calon Admin:
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={newAdminInput}
                    onChange={e => setNewAdminInput(e.target.value)}
                    placeholder="contoh: kolega.admin@gmail.com"
                    className="flex-1 px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-transform active:translate-y-0.5 whitespace-nowrap"
                  >
                    Tambah Admin
                  </button>
                </div>
              </div>
            </form>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-900 leading-relaxed">
              <strong>Catatan Hak Cipta & Developer:</strong> Email utama Anda (<code className="font-mono font-bold">ronybimawan2542@gmail.com</code>) bertindak sebagai Pemegang Kuasa Master (Lead Developer) yang tidak dapat dihapus oleh admin lain.
            </div>
          </div>

          {/* Admin Email Whitelist */}
          <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 space-y-4">
            <div>
              <span className="text-xs font-bold text-sky-700 uppercase">Daftar Admin Aktif</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Email yang Diberi Otoritas ({adminEmails.length})
              </h3>
            </div>

            <div className="space-y-2">
              {adminEmails.map(email => {
                const isMasterDev = email.toLowerCase() === 'ronybimawan2542@gmail.com';
                return (
                  <div
                    key={email}
                    className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 border-2 border-slate-200"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 border border-slate-900 flex items-center justify-center text-sky-800 shrink-0 font-bold text-xs">
                        {email.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 font-mono truncate">{email}</div>
                        <div className="text-[10px] text-slate-500">
                          {isMasterDev ? 'Pembuat Aplikasi (Master Developer)' : 'Admin Resmi Komunitas'}
                        </div>
                      </div>
                    </div>

                    {isMasterDev ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-200 text-sky-900 border border-sky-300 shrink-0">
                        Owner / Master
                      </span>
                    ) : (
                      <button
                        onClick={() => removeAdminEmail(email)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                        title="Hapus Hak Admin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
