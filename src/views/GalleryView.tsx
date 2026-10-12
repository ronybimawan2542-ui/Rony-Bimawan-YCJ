import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCamp } from '../context/CampContext';
import { CommunityEventPhoto, SoloCampStory, CampRegion } from '../types';
import { ImageUploadPicker } from '../components/ImageUploadPicker';
import { 
  Camera, 
  PlusCircle, 
  Heart, 
  Trash2, 
  Edit3, 
  MapPin, 
  Calendar, 
  User, 
  Tent, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Check, 
  MessageSquare,
  BookOpen,
  Filter,
  Send,
  Eye,
  Search
} from 'lucide-react';

export const GalleryView: React.FC = () => {
  const { user, isLoggedIn, role, isAdmin, setLoginWithGoogleModal } = useAuth();
  const { 
    eventPhotos, 
    addCommunityEventPhoto, 
    editCommunityEventPhoto, 
    removeCommunityEventPhoto, 
    likeEventPhoto,
    soloCampStories, 
    addSoloCampStory, 
    removeSoloCampStory, 
    likeSoloStory,
    events
  } = useCamp();

  const [galleryTab, setGalleryTab] = useState<'community' | 'solo'>('community');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal States
  const [showAdminUploadModal, setShowAdminUploadModal] = useState(false);
  const [showMemberSoloModal, setShowMemberSoloModal] = useState(false);
  const [activePhotoModal, setActivePhotoModal] = useState<CommunityEventPhoto | null>(null);
  const [activeSoloStoryModal, setActiveSoloStoryModal] = useState<SoloCampStory | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<CommunityEventPhoto | null>(null);

  // Form State for Admin Upload Community Event Photo
  const [adminPhotoForm, setAdminPhotoForm] = useState({
    eventTitle: events[0]?.title || 'Mandalawangi Autumn Chill Camp 2026',
    imageUrl: '',
    caption: '',
    location: 'Bumi Perkemahan Mandalawangi, Cibodas',
    region: 'Cibodas' as CampRegion,
    date: '24 Oktober 2026',
    photographer: user?.name || 'Dokumentasi Yuru Camp'
  });

  // Form State for Member Solo Camp Story
  const [soloStoryForm, setSoloStoryForm] = useState({
    title: '',
    location: '',
    region: 'Bogor' as CampRegion,
    altitude: '1.000 mdpl',
    tentGear: '',
    date: 'Oktober 2026',
    imageUrl: '',
    story: '',
    soloTips: ''
  });

  const regions = ['all', 'Cibodas', 'Sukabumi', 'Bogor', 'Sentul', 'Puncak'];

  const q = searchQuery.toLowerCase().trim();

  // Filter Community Photos
  const filteredEventPhotos = eventPhotos.filter(p => {
    const matchRegion = selectedRegion === 'all' || p.region === selectedRegion;
    const matchEvent = selectedEventFilter === 'all' || p.eventTitle === selectedEventFilter;
    const matchSearch = !q || 
      p.eventTitle.toLowerCase().includes(q) || 
      p.caption.toLowerCase().includes(q) || 
      p.location.toLowerCase().includes(q) || 
      p.photographer.toLowerCase().includes(q) || 
      p.region.toLowerCase().includes(q);
    return matchRegion && matchEvent && matchSearch;
  });

  // Filter Solo Stories
  const filteredSoloStories = soloCampStories.filter(s => {
    const matchRegion = selectedRegion === 'all' || s.region === selectedRegion;
    const matchSearch = !q || 
      s.title.toLowerCase().includes(q) || 
      s.memberName.toLowerCase().includes(q) || 
      s.location.toLowerCase().includes(q) || 
      s.story.toLowerCase().includes(q) || 
      s.tentGear.toLowerCase().includes(q) || 
      s.region.toLowerCase().includes(q);
    return matchRegion && matchSearch;
  });

  // Unique event titles for filter dropdown
  const uniqueEventTitles = Array.from(new Set(eventPhotos.map(p => p.eventTitle)));

  const handleAdminUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPhotoForm.imageUrl.trim()) return;

    if (editingPhoto) {
      editCommunityEventPhoto(editingPhoto.id, {
        eventTitle: adminPhotoForm.eventTitle,
        imageUrl: adminPhotoForm.imageUrl,
        caption: adminPhotoForm.caption,
        location: adminPhotoForm.location,
        region: adminPhotoForm.region,
        date: adminPhotoForm.date,
        photographer: adminPhotoForm.photographer
      });
      setEditingPhoto(null);
    } else {
      addCommunityEventPhoto({
        eventTitle: adminPhotoForm.eventTitle,
        imageUrl: adminPhotoForm.imageUrl,
        caption: adminPhotoForm.caption,
        location: adminPhotoForm.location,
        region: adminPhotoForm.region,
        date: adminPhotoForm.date,
        photographer: adminPhotoForm.photographer,
        uploadedByAdminEmail: user?.email
      });
    }

    setAdminPhotoForm({
      eventTitle: events[0]?.title || 'Mandalawangi Autumn Chill Camp 2026',
      imageUrl: '',
      caption: '',
      location: 'Bumi Perkemahan Mandalawangi, Cibodas',
      region: 'Cibodas',
      date: '24 Oktober 2026',
      photographer: user?.name || 'Dokumentasi Yuru Camp'
    });
    setShowAdminUploadModal(false);
  };

  const handleMemberSoloSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!soloStoryForm.imageUrl.trim() || !soloStoryForm.title.trim()) return;

    addSoloCampStory({
      title: soloStoryForm.title,
      memberName: user?.name || 'Sahabat Camper',
      memberEmail: user?.email || 'member@yurucamp.id',
      memberId: user?.memberId || '#YCJ-042',
      memberAvatar: user?.avatar,
      location: soloStoryForm.location,
      region: soloStoryForm.region,
      altitude: soloStoryForm.altitude,
      tentGear: soloStoryForm.tentGear || 'Tenda Dome Ultralight',
      date: soloStoryForm.date,
      imageUrl: soloStoryForm.imageUrl,
      story: soloStoryForm.story,
      soloTips: soloStoryForm.soloTips || 'Bawa sleeping bag hangat dan nikmati heningnya alam bebas.'
    });

    setSoloStoryForm({
      title: '',
      location: '',
      region: 'Bogor',
      altitude: '1.000 mdpl',
      tentGear: '',
      date: 'Oktober 2026',
      imageUrl: '',
      story: '',
      soloTips: ''
    });
    setShowMemberSoloModal(false);
  };

  const openEditAdminPhoto = (photo: CommunityEventPhoto) => {
    setEditingPhoto(photo);
    setAdminPhotoForm({
      eventTitle: photo.eventTitle,
      imageUrl: photo.imageUrl,
      caption: photo.caption,
      location: photo.location,
      region: photo.region,
      date: photo.date,
      photographer: photo.photographer
    });
    setShowAdminUploadModal(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Camera className="w-4 h-4" />
              <span>Dokumentasi Visual & Cerita Berkemah</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Galeri
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Arsip dokumentasi resmi setiap event kemping komunitas (dikelola oleh Admin) dan wadah berbagi cerita pengalaman solo camping para member.
            </p>
          </div>

          {/* 2 Baris Tombol Navigasi Galeri Sesuai Permintaan */}
          <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto min-w-[260px]">
            {/* Baris 1: Galeri Event Komunitas */}
            <button
              onClick={() => setGalleryTab('community')}
              className={`w-full px-4 py-2.5 text-xs font-extrabold rounded-2xl transition-all border-2 flex items-center justify-between gap-3 ${
                galleryTab === 'community'
                  ? 'bg-amber-500 text-slate-900 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-slate-900" />
                <span>Galeri Event Komunitas</span>
              </div>
              <span className="text-[11px] font-mono font-black bg-slate-900 text-white px-2 py-0.5 rounded-lg">
                {eventPhotos.length} Foto
              </span>
            </button>

            {/* Baris 2: Cerita Solo Camping */}
            <button
              onClick={() => setGalleryTab('solo')}
              className={`w-full px-4 py-2.5 text-xs font-extrabold rounded-2xl transition-all border-2 flex items-center justify-between gap-3 ${
                galleryTab === 'solo'
                  ? 'bg-amber-500 text-slate-900 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Tent className="w-4 h-4 text-slate-900" />
                <span>Cerita Solo Camping</span>
              </div>
              <span className="text-[11px] font-mono font-black bg-slate-900 text-white px-2 py-0.5 rounded-lg">
                {soloCampStories.length} Cerita
              </span>
            </button>
          </div>
        </div>

        {/* Toolbar: Search, Filters & Upload Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={
                  galleryTab === 'community'
                    ? 'Cari foto event, lokasi (Cibodas, Puncak), fotografer...'
                    : 'Cari cerita solo camp, member, lokasi, gear tenda...'
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

            {/* Action Upload Buttons based on tab and role */}
            <div className="flex items-center gap-2 shrink-0">
              {galleryTab === 'community' ? (
                isAdmin ? (
                  <button
                    onClick={() => {
                      setEditingPhoto(null);
                      setShowAdminUploadModal(true);
                    }}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1.5 transition-transform active:translate-y-0.5 whitespace-nowrap"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Upload Foto Event (Khusus Admin)</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500 bg-neutral-100 px-3 py-1.5 rounded-xl border border-slate-200">
                    🔒 Upload & edit galeri event dikelola Admin
                  </span>
                )
              ) : (
                /* Solo Camping Member Upload Button */
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      setLoginWithGoogleModal(true);
                    } else {
                      setShowMemberSoloModal(true);
                    }
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1.5 transition-transform active:translate-y-0.5 whitespace-nowrap"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Bagikan Cerita Solo Camp Kamu</span>
                </button>
              )}
            </div>
          </div>

          {/* Region Filters and Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                Wilayah:
              </span>
              {regions.map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors border whitespace-nowrap ${
                    selectedRegion === r
                      ? 'bg-sky-500 text-white border-slate-900 shadow-xs'
                      : 'bg-neutral-50 text-slate-600 border-slate-200 hover:bg-neutral-100'
                  }`}
                >
                  {r === 'all' ? 'Semua Wilayah' : r}
                </button>
              ))}

              {/* Event Specific Filter if on community tab */}
              {galleryTab === 'community' && uniqueEventTitles.length > 1 && (
                <select
                  value={selectedEventFilter}
                  onChange={e => setSelectedEventFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-xl text-slate-700 shrink-0 ml-2"
                >
                  <option value="all">Semua Agenda Event</option>
                  {uniqueEventTitles.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="text-xs font-semibold text-slate-500">
              {galleryTab === 'community' ? (
                <span>
                  Menampilkan <strong className="text-slate-900">{filteredEventPhotos.length}</strong> dari {eventPhotos.length} Foto
                </span>
              ) : (
                <span>
                  Menampilkan <strong className="text-slate-900">{filteredSoloStories.length}</strong> dari {soloCampStories.length} Cerita
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: GALERI EVENT KOMUNITAS (HANYA BISA DIUPLOAD & DIHAPUS OLEH ADMIN) */}
      {/* ========================================================================= */}
      {galleryTab === 'community' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Dokumentasi Kegiatan Setiap Event Komunitas
              </h2>
              <p className="text-xs text-slate-500">
                Setiap foto diunggah resmi oleh pengurus dan terhubung dengan agenda kemping bersama.
              </p>
            </div>
            {isAdmin && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-sky-100 text-sky-900 border border-sky-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
                <span>Mode Admin Aktif (Bisa Edit & Hapus)</span>
              </span>
            )}
          </div>

          {filteredEventPhotos.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-slate-900 p-12 text-center">
              <Camera className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Belum ada foto untuk filter ini.</p>
              {isAdmin && (
                <button
                  onClick={() => setShowAdminUploadModal(true)}
                  className="mt-3 px-4 py-2 bg-amber-500 text-slate-900 text-xs font-bold rounded-xl border-2 border-slate-900"
                >
                  Upload Foto Pertama
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEventPhotos.map(photo => {
                const currentEmailKey = (user?.email || 'tamu-pengunjung').toLowerCase();
                const isPhotoLiked = (photo.likedByUserEmails || []).some(e => e.toLowerCase() === currentEmailKey);

                return (
                  <div
                    key={photo.id}
                    className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      {/* Photo Container */}
                      <div 
                        onClick={() => setActivePhotoModal(photo)}
                        className="relative h-56 bg-slate-900 cursor-pointer overflow-hidden"
                      >
                        <img
                          src={photo.imageUrl}
                          alt={photo.caption}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            // Styled fallback
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        {/* Overlay badges */}
                        <div className="absolute top-3 left-3 bg-amber-500 text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border-2 border-slate-900 shadow-xs">
                          {photo.region}
                        </div>
                        <div className="absolute top-3 right-3 bg-slate-950/80 text-white text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
                          {photo.date}
                        </div>

                        <div className="absolute bottom-2 right-2 bg-white/90 text-slate-900 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3 h-3" />
                          <span>Lihat Zoom</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2.5">
                        <div className="text-[11px] font-bold text-sky-800 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Event: {photo.eventTitle}</span>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {photo.caption}
                        </p>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate">{photo.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Photographer & Likes & Admin Controls */}
                    <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="text-[11px] text-slate-500 truncate max-w-[130px]">
                        Foto: <strong className="text-slate-800">{photo.photographer}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => likeEventPhoto(photo.id, user?.email)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all font-extrabold text-[11px] ${
                            isPhotoLiked
                              ? 'bg-rose-100 text-rose-700 border-rose-300 shadow-xs'
                              : 'bg-neutral-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200'
                          }`}
                          title={isPhotoLiked ? 'Batalkan Apresiasi (Unlove)' : 'Beri Apresiasi (Love)'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isPhotoLiked ? 'text-rose-600 fill-rose-500' : 'text-slate-500'}`} />
                          <span>{photo.likesCount}</span>
                        </button>

                        {/* EXCLUSIVE ADMIN CONTROLS: EDIT & REMOVE */}
                        {isAdmin && (
                          <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
                            <button
                              onClick={() => openEditAdminPhoto(photo)}
                              className="p-1.5 text-sky-700 hover:bg-sky-100 rounded-lg transition-colors border border-transparent hover:border-sky-300"
                              title="Edit Foto Event"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => removeCommunityEventPhoto(photo.id)}
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-300"
                              title="Hapus Foto Event (Khusus Admin)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: GALERI & CERITA SOLO CAMPING MEMBER (DENGAN PENGALAMAN MEREKA) */}
      {/* ========================================================================= */}
      {galleryTab === 'solo' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Kisah & Pengalaman Solo Camping Sahabat Yuru Camp
              </h2>
              <p className="text-xs text-slate-500">
                Cerita otentik member menikmati heningnya alam bebas sendirian: tips mengatasi dingin, kopi pagi, dan ketenangan batin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredSoloStories.map(story => {
              const currentEmailKey = (user?.email || 'tamu-pengunjung').toLowerCase();
              const isStoryLiked = (story.likedByUserEmails || []).some(e => e.toLowerCase() === currentEmailKey);

              return (
                <div
                  key={story.id}
                  className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Photo Banner with Zoom trigger */}
                    <div 
                      onClick={() => setActiveSoloStoryModal(story)}
                      className="relative h-56 bg-slate-900 cursor-pointer overflow-hidden group"
                    >
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-amber-500 text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border-2 border-slate-900 shadow-xs">
                        Solo Camp · {story.region}
                      </div>
                      {story.altitude && (
                        <div className="absolute top-3 right-3 bg-slate-950/80 text-white text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
                          {story.altitude}
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-white/90 text-slate-900 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        <BookOpen className="w-3 h-3" />
                        <span>Baca Cerita Penuh</span>
                      </div>
                    </div>

                    {/* Member Lockup */}
                    <div className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl border border-slate-900 overflow-hidden bg-sky-100 shrink-0">
                          <img 
                            src={story.memberAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(story.memberName)}`} 
                            alt={story.memberName} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{story.memberName}</h4>
                          <span className="text-[10px] font-mono text-amber-700">{story.memberId || '#Member'}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{story.date}</span>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 space-y-3">
                      <h3 
                        onClick={() => setActiveSoloStoryModal(story)}
                        className="text-base font-extrabold text-slate-900 leading-snug cursor-pointer hover:text-amber-700 transition-colors"
                      >
                        {story.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-neutral-50 p-2 rounded-xl border border-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{story.location}</span>
                      </div>

                      <div className="text-[11px] text-slate-600">
                        <strong className="text-slate-800">Gear Tenda:</strong> {story.tentGear}
                      </div>

                      {/* Excerpt of Story */}
                      <div className="text-xs text-slate-700 leading-relaxed line-clamp-3 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200 italic">
                        "{story.story}"
                      </div>

                      {/* Member Solo Tips */}
                      <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-200 text-[11px] text-sky-950">
                        <strong className="text-sky-900 block mb-0.5">💡 Tips Solo Camp Member:</strong>
                        <span className="line-clamp-2">{story.soloTips}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setActiveSoloStoryModal(story)}
                      className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1"
                    >
                      <span>Baca Cerita Lengkap</span>
                      <span>→</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => likeSoloStory(story.id, user?.email)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all font-extrabold text-[11px] ${
                          isStoryLiked
                            ? 'bg-rose-100 text-rose-700 border-rose-300 shadow-xs'
                            : 'bg-neutral-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200'
                        }`}
                        title={isStoryLiked ? 'Batalkan Suka (Unlove)' : 'Sukai Cerita Ini (Love)'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isStoryLiked ? 'text-rose-600 fill-rose-500' : 'text-slate-500'}`} />
                        <span>{story.likesCount}</span>
                      </button>

                      {/* If Admin or author, allow delete */}
                      {(isAdmin || (user && user.email === story.memberEmail)) && (
                        <button
                          onClick={() => removeSoloCampStory(story.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Cerita Ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADMIN UPLOAD / EDIT FOTO EVENT KOMUNITAS (EXCLUSIVE ADMIN)       */}
      {/* ========================================================================= */}
      {showAdminUploadModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-sky-100 border-b-2 border-slate-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-sky-800 uppercase tracking-wider">
                  Admin Control Panel
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {editingPhoto ? 'Edit Foto Galeri Event' : 'Upload Foto Galeri Event Komunitas'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAdminUploadModal(false);
                  setEditingPhoto(null);
                }}
                className="p-1.5 text-slate-500 hover:text-slate-900 bg-white rounded-lg border border-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdminUploadSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Agenda / Event Terkait *
                </label>
                <input
                  type="text"
                  required
                  value={adminPhotoForm.eventTitle}
                  onChange={e => setAdminPhotoForm({ ...adminPhotoForm, eventTitle: e.target.value })}
                  placeholder="contoh: Mandalawangi Autumn Chill Camp 2026"
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                />
              </div>

              {/* Foto Dokumentasi Event: Upload dari Galeri HP atau URL */}
              <ImageUploadPicker
                value={adminPhotoForm.imageUrl}
                onChange={url => setAdminPhotoForm({ ...adminPhotoForm, imageUrl: url })}
                label="Foto Dokumentasi Event (Galeri HP / Kamera) *"
                placeholder="https://... atau pilih langsung dari galeri ponsel"
                helperText="Mendukung upload langsung dari galeri HP / Kamera ponsel (JPG, PNG, WebP)"
              />

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Caption / Keterangan Foto *
                </label>
                <textarea
                  rows={2}
                  required
                  value={adminPhotoForm.caption}
                  onChange={e => setAdminPhotoForm({ ...adminPhotoForm, caption: e.target.value })}
                  placeholder="Ceritakan momen di foto ini..."
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wilayah *</label>
                  <select
                    value={adminPhotoForm.region}
                    onChange={e => setAdminPhotoForm({ ...adminPhotoForm, region: e.target.value as CampRegion })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                  >
                    <option value="Cibodas">Cibodas</option>
                    <option value="Sukabumi">Sukabumi</option>
                    <option value="Bogor">Bogor</option>
                    <option value="Sentul">Sentul</option>
                    <option value="Puncak">Puncak</option>
                    <option value="Kepulauan Seribu">Kepulauan Seribu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Pelaksanaan *</label>
                  <input
                    type="text"
                    required
                    value={adminPhotoForm.date}
                    onChange={e => setAdminPhotoForm({ ...adminPhotoForm, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lokasi Detail *</label>
                  <input
                    type="text"
                    required
                    value={adminPhotoForm.location}
                    onChange={e => setAdminPhotoForm({ ...adminPhotoForm, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Fotografer</label>
                  <input
                    type="text"
                    value={adminPhotoForm.photographer}
                    onChange={e => setAdminPhotoForm({ ...adminPhotoForm, photographer: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-transform active:translate-y-0.5"
                >
                  {editingPhoto ? 'Simpan Perubahan Foto' : 'Unggah Foto ke Galeri Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MEMBER UPLOAD CERITA & FOTO SOLO CAMPING                         */}
      {/* ========================================================================= */}
      {showMemberSoloModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-amber-100 border-b-2 border-slate-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-wider">
                  Ruang Berbagi Member
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  Bagikan Foto & Cerita Solo Camp Kamu
                </h3>
              </div>
              <button
                onClick={() => setShowMemberSoloModal(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 bg-white rounded-lg border border-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleMemberSoloSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Judul Cerita Pengalaman Solo Camp Kamu *
                </label>
                <input
                  type="text"
                  required
                  value={soloStoryForm.title}
                  onChange={e => setSoloStoryForm({ ...soloStoryForm, title: e.target.value })}
                  placeholder="contoh: Menikmati Hening & Hangatnya Mi Kari Fajar di Telaga Saat"
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                />
              </div>

              {/* Foto Solo Camp: Upload dari Galeri HP atau URL */}
              <ImageUploadPicker
                value={soloStoryForm.imageUrl}
                onChange={url => setSoloStoryForm({ ...soloStoryForm, imageUrl: url })}
                label="Foto Solo Camp Kamu (Galeri HP / Kamera) *"
                placeholder="https://... atau pilih langsung dari galeri ponsel"
                helperText="Mendukung upload foto dari galeri HP ponsel Anda (JPG, PNG, WebP)"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lokasi Camping Ground *</label>
                  <input
                    type="text"
                    required
                    value={soloStoryForm.location}
                    onChange={e => setSoloStoryForm({ ...soloStoryForm, location: e.target.value })}
                    placeholder="contoh: Pondok Halimun, Sukabumi"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wilayah *</label>
                  <select
                    value={soloStoryForm.region}
                    onChange={e => setSoloStoryForm({ ...soloStoryForm, region: e.target.value as CampRegion })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                  >
                    <option value="Bogor">Bogor</option>
                    <option value="Cibodas">Cibodas</option>
                    <option value="Sukabumi">Sukabumi</option>
                    <option value="Sentul">Sentul</option>
                    <option value="Puncak">Puncak</option>
                    <option value="Kepulauan Seribu">Kepulauan Seribu</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gear Tenda & Alat Masak</label>
                  <input
                    type="text"
                    value={soloStoryForm.tentGear}
                    onChange={e => setSoloStoryForm({ ...soloStoryForm, tentGear: e.target.value })}
                    placeholder="contoh: Cloud Up 1 + Kompor Canister Mini"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ketinggian / Suhu Malam</label>
                  <input
                    type="text"
                    value={soloStoryForm.altitude}
                    onChange={e => setSoloStoryForm({ ...soloStoryForm, altitude: e.target.value })}
                    placeholder="contoh: 1.200 mdpl (15°C)"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Cerita Pengalaman Lengkap (Gimana Rasanya Solo Camp?) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={soloStoryForm.story}
                  onChange={e => setSoloStoryForm({ ...soloStoryForm, story: e.target.value })}
                  placeholder="Ceritakan pengalamanmu: awalnya sempat takut atau tidak, bagaimana saat memasak sendirian, suasana malam di dalam tenda, sampai rasa damai yang didapat..."
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tips Solo Camp untuk Pemula dari Kamu
                </label>
                <textarea
                  rows={2}
                  value={soloStoryForm.soloTips}
                  onChange={e => setSoloStoryForm({ ...soloStoryForm, soloTips: e.target.value })}
                  placeholder="Tips penting (misal: jangan lupa matras foil, cara pasang pasak, atau pilihan makanan praktis)..."
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-transform active:translate-y-0.5 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Publikasikan Cerita Solo Camp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ZOOM FOTO EVENT KOMUNITAS                                        */}
      {/* ========================================================================= */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] overflow-hidden max-h-[90vh] flex flex-col">
            <div className="relative flex-1 bg-slate-950 min-h-[300px] flex items-center justify-center overflow-hidden">
              <img
                src={activePhotoModal.imageUrl}
                alt={activePhotoModal.caption}
                className="w-full h-full max-h-[500px] object-contain"
              />
              <button
                onClick={() => setActivePhotoModal(null)}
                className="absolute top-4 right-4 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">{activePhotoModal.region}</span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">{activePhotoModal.eventTitle}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-500 block">{activePhotoModal.date}</span>
                  <span className="text-xs text-slate-700 font-medium">{activePhotoModal.location}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-slate-200">
                "{activePhotoModal.caption}"
              </p>

              <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                <span>Fotografer: <strong className="text-slate-900">{activePhotoModal.photographer}</strong></span>
                {(() => {
                  const currentEmailKey = (user?.email || 'tamu-pengunjung').toLowerCase();
                  const isModalPhotoLiked = (activePhotoModal.likedByUserEmails || []).some(e => e.toLowerCase() === currentEmailKey);
                  return (
                    <button
                      onClick={() => {
                        likeEventPhoto(activePhotoModal.id, user?.email);
                        // Sync active modal state
                        setActivePhotoModal(prev => {
                          if (!prev) return null;
                          const currentLiked = prev.likedByUserEmails || [];
                          const already = currentLiked.some(e => e.toLowerCase() === currentEmailKey);
                          return {
                            ...prev,
                            likesCount: already ? Math.max(0, prev.likesCount - 1) : prev.likesCount + 1,
                            likedByUserEmails: already ? currentLiked.filter(e => e.toLowerCase() !== currentEmailKey) : [...currentLiked, currentEmailKey]
                          };
                        });
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold border transition-colors ${
                        isModalPhotoLiked
                          ? 'bg-rose-100 text-rose-700 border-rose-300'
                          : 'bg-neutral-100 hover:bg-rose-50 text-slate-700 border-slate-200'
                      }`}
                      title={isModalPhotoLiked ? 'Batalkan Apresiasi (Unlove)' : 'Beri Apresiasi (Love)'}
                    >
                      <Heart className={`w-4 h-4 ${isModalPhotoLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
                      <span>{activePhotoModal.likesCount} {isModalPhotoLiked ? 'Disukai (Klik utk Unlove)' : 'Suka'}</span>
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DETAIL CERITA SOLO CAMPING MEMBER LENGKAP                        */}
      {/* ========================================================================= */}
      {activeSoloStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] max-h-[90vh] overflow-y-auto">
            {/* Header image */}
            <div className="relative h-64 bg-slate-950 overflow-hidden">
              <img
                src={activeSoloStoryModal.imageUrl}
                alt={activeSoloStoryModal.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveSoloStoryModal(null)}
                className="absolute top-4 right-4 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4 bg-amber-500 text-slate-950 font-extrabold text-xs px-3 py-1 rounded-lg border-2 border-slate-900">
                Solo Camp Experience · {activeSoloStoryModal.region}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              {/* Member Author Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl border-2 border-slate-900 overflow-hidden bg-sky-100">
                    <img 
                      src={activeSoloStoryModal.memberAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(activeSoloStoryModal.memberName)}`} 
                      alt={activeSoloStoryModal.memberName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{activeSoloStoryModal.memberName}</h4>
                    <span className="text-xs font-mono text-amber-700">{activeSoloStoryModal.memberId || '#Member'}</span>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-500 font-mono">
                  <span>{activeSoloStoryModal.date}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {activeSoloStoryModal.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{activeSoloStoryModal.location} ({activeSoloStoryModal.altitude || '1.000 mdpl'})</span>
                </div>
              </div>

              {/* Gear Box */}
              <div className="p-3 bg-neutral-100 rounded-xl border border-slate-200 text-xs text-slate-700">
                <strong className="text-slate-900">Gear yang Dipakai:</strong> {activeSoloStoryModal.tentGear}
              </div>

              {/* Full Story Content */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong className="block text-slate-900 font-bold text-sm">Pengalaman Selama Solo Camp:</strong>
                <p className="whitespace-pre-line bg-amber-50/40 p-4 rounded-2xl border border-amber-200 leading-relaxed">
                  {activeSoloStoryModal.story}
                </p>
              </div>

              {/* Tips for Beginners */}
              <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-300 space-y-1.5">
                <strong className="text-sky-950 font-bold text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-700" />
                  <span>Tips Solo Camping untuk Pemula:</span>
                </strong>
                <p className="text-xs text-sky-900 leading-relaxed">
                  {activeSoloStoryModal.soloTips}
                </p>
              </div>

              {/* Bottom Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">Dipublikasikan di Yuru Camp Jabodetabek</span>
                {(() => {
                  const currentEmailKey = (user?.email || 'tamu-pengunjung').toLowerCase();
                  const isModalStoryLiked = (activeSoloStoryModal.likedByUserEmails || []).some(e => e.toLowerCase() === currentEmailKey);
                  return (
                    <button
                      onClick={() => {
                        likeSoloStory(activeSoloStoryModal.id, user?.email);
                        // Sync active modal state
                        setActiveSoloStoryModal(prev => {
                          if (!prev) return null;
                          const currentLiked = prev.likedByUserEmails || [];
                          const already = currentLiked.some(e => e.toLowerCase() === currentEmailKey);
                          return {
                            ...prev,
                            likesCount: already ? Math.max(0, prev.likesCount - 1) : prev.likesCount + 1,
                            likedByUserEmails: already ? currentLiked.filter(e => e.toLowerCase() !== currentEmailKey) : [...currentLiked, currentEmailKey]
                          };
                        });
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs border transition-colors ${
                        isModalStoryLiked
                          ? 'bg-rose-100 text-rose-700 border-rose-300'
                          : 'bg-neutral-100 hover:bg-rose-50 text-slate-700 border-slate-200'
                      }`}
                      title={isModalStoryLiked ? 'Batalkan Apresiasi (Unlove)' : 'Beri Apresiasi (Love)'}
                    >
                      <Heart className={`w-4 h-4 ${isModalStoryLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
                      <span>{activeSoloStoryModal.likesCount} {isModalStoryLiked ? 'Disukai (Klik utk Unlove)' : 'Apresiasi'}</span>
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
