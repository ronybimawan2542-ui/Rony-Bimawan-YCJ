import React, { useState } from 'react';
import { useCamp } from '../context/CampContext';
import { useAuth } from '../context/AuthContext';
import { CampEvent, PastEvent, CampRegion } from '../types';
import { CampIllustration } from '../components/CampIllustration';
import { ImageUploadPicker } from '../components/ImageUploadPicker';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Filter, 
  ShieldCheck, 
  Shield,
  Star,
  MessageSquare,
  Plus,
  Search,
  X,
  AlertCircle
} from 'lucide-react';

export const EventsView: React.FC = () => {
  const { events, pastEvents, registerForEvent, cancelEventRegistration, addTestimonialToPastEvent } = useCamp();
  const { user, isLoggedIn, setLoginWithGoogleModal } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedEventModal, setSelectedEventModal] = useState<CampEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Testimonial modal state
  const [testimonialModalEvent, setTestimonialModalEvent] = useState<PastEvent | null>(null);
  const [testimonialComment, setTestimonialComment] = useState('');
  const [testimonialRating, setTestimonialRating] = useState(5);
  const [testimonialPhotoUrl, setTestimonialPhotoUrl] = useState('');

  const regions = ['all', 'Cibodas', 'Sukabumi', 'Sentul', 'Bogor', 'Puncak'];

  const q = searchQuery.toLowerCase().trim();

  const filteredUpcoming = events.filter(e => {
    if (e.status === 'completed') return false;
    const matchRegion = selectedRegion === 'all' || e.region === selectedRegion;
    const matchSearch = !q || 
      e.title.toLowerCase().includes(q) || 
      e.location.toLowerCase().includes(q) || 
      e.subtitle.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.region.toLowerCase().includes(q);
    return matchRegion && matchSearch;
  });

  const filteredPast = pastEvents.filter(p => {
    const matchRegion = selectedRegion === 'all' || p.region === selectedRegion;
    const matchSearch = !q || 
      p.title.toLowerCase().includes(q) || 
      p.location.toLowerCase().includes(q) || 
      p.summary.toLowerCase().includes(q) ||
      p.story.toLowerCase().includes(q) ||
      p.region.toLowerCase().includes(q);
    return matchRegion && matchSearch;
  });

  const handleRegisterAction = (eventId: string) => {
    if (!isLoggedIn || !user) {
      setLoginWithGoogleModal(true);
      return;
    }
    registerForEvent(eventId, user.email);
  };

  const handleCancelAction = (eventId: string) => {
    if (!user) return;
    cancelEventRegistration(eventId, user.email);
  };

  const handleOpenTestimonialModal = (pastEvt: PastEvent) => {
    if (!isLoggedIn || !user) {
      setLoginWithGoogleModal(true);
      return;
    }
    setTestimonialModalEvent(pastEvt);
    setTestimonialComment('');
    setTestimonialRating(5);
    setTestimonialPhotoUrl('');
  };

  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialModalEvent || !testimonialComment.trim()) return;

    if (!isLoggedIn || !user) {
      setLoginWithGoogleModal(true);
      return;
    }

    addTestimonialToPastEvent(testimonialModalEvent.id, {
      memberName: user.name,
      memberEmail: user.email,
      memberRole: user.role === 'admin' ? 'Lead Dev / Admin' : `Anggota Resmi ${user.memberId || '#YCJ-MEMBER'}`,
      avatarUrl: user.avatar,
      photoUrl: testimonialPhotoUrl.trim() || undefined,
      rating: testimonialRating,
      comment: testimonialComment.trim(),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    });

    setTestimonialComment('');
    setTestimonialPhotoUrl('');
    setTestimonialModalEvent(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner & Tab Controls */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              Agenda & Dokumentasi Komunitas
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Jadwal Kemping Yuru Camp Jabodetabek
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Pilih agenda kemping akhir pekan yang sesuai dengan waktumu, atau jelajahi arsip dokumentasi & testimoni anggota yang telah mengikuti event sebelumnya.
            </p>
          </div>

          {/* Sub-tab segmented toggle */}
          <div className="flex p-1.5 bg-neutral-100 rounded-2xl border-2 border-slate-900 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab('upcoming')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
                activeSubTab === 'upcoming'
                  ? 'bg-amber-500 text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Event Mendatang ({events.length})
            </button>
            <button
              onClick={() => setActiveSubTab('past')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
                activeSubTab === 'past'
                  ? 'bg-amber-500 text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Arsip Selesai & Testimoni ({pastEvents.length})
            </button>
          </div>
        </div>

        {/* Search & Region Filter Bar */}
        <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari event, lokasi camp (Cibodas, Sukamantri, Puncak...)"
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

          {/* Region Filter Buttons & Result Count */}
          <div className="flex items-center gap-3 justify-between md:justify-end flex-wrap">
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
            </div>

            <div className="text-xs font-semibold text-slate-500 shrink-0">
              {activeSubTab === 'upcoming' ? (
                <span>
                  Menampilkan <strong className="text-slate-900">{filteredUpcoming.length}</strong> Agenda
                </span>
              ) : (
                <span>
                  Menampilkan <strong className="text-slate-900">{filteredPast.length}</strong> Arsip
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeSubTab === 'upcoming' ? (
        <div className="space-y-6">
          {filteredUpcoming.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-slate-900 p-12 text-center shadow-[6px_6px_0px_0px_#0f172a]">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">
                {searchQuery
                  ? `Tidak ada agenda event yang cocok dengan "${searchQuery}".`
                  : 'Tidak ada event untuk filter wilayah ini.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 px-4 py-2 bg-amber-500 text-slate-900 text-xs font-bold rounded-xl border-2 border-slate-900"
                >
                  Reset Pencarian
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUpcoming.map(evt => {
                const isRegistered = user ? evt.registeredUserEmails.includes(user.email) : false;

                return (
                  <div
                    key={evt.id}
                    className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Graphic / Photo Banner */}
                      <div className="relative border-b-2 border-slate-900 bg-neutral-100 h-44 overflow-hidden">
                        {evt.imageUrl ? (
                          <img 
                            src={evt.imageUrl} 
                            alt={evt.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <CampIllustration type={evt.illustrationType} className="w-full h-44" />
                        )}
                        <div className="absolute top-3 left-3 bg-white text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border-2 border-slate-900">
                          {evt.region} · {evt.altitude}
                        </div>
                        <div className="absolute top-3 right-3 bg-amber-500 text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border-2 border-slate-900 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{evt.duration}</span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-3">
                        <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-600" />
                            <span>{evt.date}</span>
                          </div>
                          <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                            {evt.duration}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 leading-snug">
                          {evt.title}
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-2">
                          {evt.subtitle}
                        </p>

                        {/* Location */}
                        <div className="text-xs text-slate-700 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                          <span className="truncate font-medium">{evt.location}</span>
                        </div>

                        {/* Fee info */}
                        <div className="text-xs text-slate-800 flex items-center justify-between bg-amber-50/50 p-2 rounded-xl border border-amber-200">
                          <span className="font-bold text-amber-950">Biaya Patungan:</span>
                          <span className="font-bold text-slate-900">{evt.fee}</span>
                        </div>

                        {/* Ringkasan Peraturan & Peralatan pada Event */}
                        <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Shield className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span className="font-semibold">
                              Peraturan: {evt.rules ? `${evt.rules.length} Aturan (Leave No Trace, dll)` : 'Standar Etika Camp'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>
                              Peralatan: {evt.requiredGear ? `${evt.requiredGear.length} Item Gear Wajib` : 'Lengkap'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions (TANPA kuota terisi) */}
                    <div className="p-5 pt-0 border-t border-slate-100 mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        {isRegistered ? (
                          <button
                            onClick={() => handleCancelAction(evt.id)}
                            className="flex-1 py-2.5 px-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-xs rounded-xl border-2 border-emerald-600 flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            <span>Terdaftar (Batalkan)</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRegisterAction(evt.id)}
                            className="flex-1 py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-transform active:translate-y-0.5"
                          >
                            Daftar Ikut
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedEventModal(evt)}
                          className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-slate-800 font-bold text-xs rounded-xl border-2 border-slate-900 transition-colors"
                        >
                          Detail
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Past Events Archive with Member Testimonials */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPast.map(past => {
              const testimonials = past.testimonials || [];

              return (
                <div
                  key={past.id}
                  className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Header Graphic */}
                    <div className="relative border-b-2 border-slate-900 bg-neutral-100 h-44 overflow-hidden">
                      {past.imageUrl ? (
                        <img 
                          src={past.imageUrl} 
                          alt={past.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <CampIllustration type={past.illustrationType} className="w-full h-44" />
                      )}
                      <div className="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700">
                        SELESAI DIGELAR
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border-2 border-slate-900">
                        {past.participantsCount} Peserta Ikut
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="text-xs text-slate-500 flex items-center justify-between font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>{past.date}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300">
                          {past.region}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 leading-snug">
                        {past.title}
                      </h3>

                      <div className="text-xs text-slate-700 bg-neutral-50 p-2 rounded-xl border border-neutral-200 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{past.location}</span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {past.summary}
                      </p>

                      <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-xs text-slate-700 leading-relaxed italic">
                        "{past.story}"
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Sorotan Momen:</div>
                        <div className="flex flex-wrap gap-1">
                          {past.highlights.map((h, i) => (
                            <span key={i} className="text-[11px] bg-sky-50 text-sky-900 px-2 py-0.5 rounded border border-sky-200">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* BAGIAN TESTIMONI ANGGOTA YANG TELAH MENGIKUTI EVENT */}
                      <div className="mt-4 pt-4 border-t-2 border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-amber-600" />
                            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                              Testimoni Anggota Peserta ({testimonials.length})
                            </h4>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenTestimonialModal(past)}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-[11px] rounded-lg border border-slate-900 flex items-center gap-1 shadow-xs"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tulis Testimoni</span>
                          </button>
                        </div>

                        {testimonials.length === 0 ? (
                          <div className="p-3 bg-neutral-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                            Belum ada testimoni. Jadilah anggota pertama yang menuliskan kesanmu!
                          </div>
                        ) : (
                          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                            {testimonials.map(t => (
                              <div
                                key={t.id}
                                className="p-3 rounded-xl border border-slate-300 bg-neutral-50/80 space-y-1.5 text-xs"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    {t.avatarUrl ? (
                                      <img
                                        src={t.avatarUrl}
                                        alt={t.memberName}
                                        className="w-6 h-6 rounded-full border border-slate-900 object-cover"
                                      />
                                    ) : (
                                      <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center font-bold text-[10px]">
                                        {t.memberName.charAt(0)}
                                      </div>
                                    )}
                                    <div>
                                      <span className="font-bold text-slate-900 block leading-tight">
                                        {t.memberName}
                                      </span>
                                      {t.memberRole && (
                                        <span className="text-[10px] text-sky-800 font-semibold block">
                                          {t.memberRole}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-500" />
                                    ))}
                                    {t.date && (
                                      <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                                        {t.date}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <p className="text-slate-700 text-xs italic pl-8">
                                  "{t.comment}"
                                </p>

                                {t.photoUrl && (
                                  <div className="pl-8 pt-1">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl border-2 border-slate-900 overflow-hidden bg-slate-100 shadow-xs">
                                      <img
                                        src={t.photoUrl}
                                        alt="Foto momen testimoni"
                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EVENT DETAIL MODAL (DENGAN DETAIL, PERALATAN & PERATURAN LENGKAP) */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 bg-sky-100 border-b-2 border-slate-900 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">
                    {selectedEventModal.region} · {selectedEventModal.altitude}
                  </span>
                  <span className="text-[10px] font-extrabold bg-amber-500 text-slate-900 px-2 py-0.5 rounded-md border border-slate-900">
                    {selectedEventModal.duration}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {selectedEventModal.title}
                </h3>
                <p className="text-xs text-slate-700 mt-1 flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>{selectedEventModal.date}</span>
                  <span>•</span>
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Durasi: {selectedEventModal.duration}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedEventModal(null)}
                className="p-1.5 text-slate-500 hover:text-slate-900 bg-white rounded-xl border border-slate-300 transition-colors"
                title="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs text-slate-700 leading-relaxed">
              {/* Lokasi & Biaya */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Lokasi Camp:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{selectedEventModal.location}</span>
                  </span>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block mb-0.5">Biaya Patungan:</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {selectedEventModal.fee}
                  </span>
                </div>
              </div>

              {/* Deskripsi Lengkap */}
              <div>
                <strong className="block text-slate-900 text-sm mb-1">Deskripsi Kalimat Detail Event:</strong>
                <p className="bg-neutral-50 p-3.5 rounded-2xl border border-slate-200 leading-relaxed">
                  {selectedEventModal.description}
                </p>
              </div>

              {/* Sorotan Momen */}
              <div>
                <strong className="block text-slate-900 text-sm mb-1.5">Sorotan Aktivitas:</strong>
                <ul className="list-disc list-inside space-y-1 bg-neutral-50 p-3 rounded-2xl border border-slate-200">
                  {selectedEventModal.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              {/* BAGIAN TEKS PERALATAN EVENT */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border-2 border-amber-300 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <strong className="text-slate-900 text-sm">
                    Peralatan Wajib & Rekomendasi Kemping:
                  </strong>
                </div>
                <ul className="list-disc list-inside space-y-1 text-amber-950 font-medium">
                  {selectedEventModal.requiredGear.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
                {selectedEventModal.equipmentNotes && (
                  <div className="mt-2 pt-2 border-t border-amber-200 text-[11px] text-amber-900 font-semibold">
                    💡 Catatan Gear: {selectedEventModal.equipmentNotes}
                  </div>
                )}
              </div>

              {/* BAGIAN TEKS PERATURAN EVENT (LEAD DEV & ADMIN SETTING) */}
              <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-300 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-sky-700" />
                    <strong className="text-slate-900 text-sm">
                      Peraturan & Tata Tertib Event
                    </strong>
                  </div>
                  <span className="text-[10px] font-bold text-sky-800 bg-white px-2 py-0.5 rounded border border-sky-300">
                    Resmi Admin & Lead Dev
                  </span>
                </div>

                <ul className="space-y-1.5 text-slate-800">
                  {(selectedEventModal.rules && selectedEventModal.rules.length > 0
                    ? selectedEventModal.rules
                    : [
                        'Etika Leave No Trace: Bawa pulang semua sampah tanpa terkecuali.',
                        'Batas Waktu Hening (Quiet Hours): Mulai pukul 22.00 WIB dilarang membunyikan musik atau bersuara keras.',
                        'Keamanan Api: Dilarang menyalakan api langsung di atas rumput tanpa fire pit / alas pelindung.',
                        'Saling menghargai privasi dan ketenangan sesama camper.',
                        'Dilarang membawa senjata tajam berlebih di luar kebutuhan alat masak.'
                      ]
                  ).map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-[10px] text-sky-800 pt-1.5 border-t border-sky-200">
                  *Peraturan ini hanya dapat diedit dan ditetapkan oleh Lead Developer dan Admin Komunitas demi kenyamanan bersama.
                </p>
              </div>

              {/* Titik Kumpul */}
              <div className="p-3 bg-neutral-100 rounded-xl border border-slate-300 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-slate-900 mb-0.5">Titik Kumpul (Meeting Point):</strong>
                  <span>{selectedEventModal.meetingPoint}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer with Register button (HAPUS kuota terisi) */}
            <div className="p-6 bg-neutral-50 border-t-2 border-slate-900 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Biaya Patungan:</span>
                <span className="text-sm font-extrabold text-slate-900">{selectedEventModal.fee}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedEventModal(null)}
                  className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300"
                >
                  Tutup
                </button>

                {user && selectedEventModal.registeredUserEmails.includes(user.email) ? (
                  <button
                    onClick={() => {
                      handleCancelAction(selectedEventModal.id);
                      setSelectedEventModal(null);
                    }}
                    className="px-5 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-xs rounded-xl border-2 border-emerald-600 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Terdaftar (Batalkan)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleRegisterAction(selectedEventModal.id);
                      setSelectedEventModal(null);
                    }}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-transform active:translate-y-0.5"
                  >
                    Daftar Ikut Sekarang
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TULIS TESTIMONI ANGGOTA UNTUK PAST EVENT */}
      {testimonialModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] overflow-hidden">
            <div className="p-5 bg-amber-100 border-b-2 border-slate-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                  Testimoni Peserta Event
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  {testimonialModalEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setTestimonialModalEvent(null)}
                className="p-1 text-slate-500 hover:text-slate-900 bg-white rounded-lg border border-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitTestimonial} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Rating Pengalaman Kamu:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTestimonialRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= testimonialRating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {testimonialRating} dari 5 Bintang
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Testimoni / Kesan Cerita Kempingmu: *
                </label>
                <textarea
                  required
                  rows={4}
                  value={testimonialComment}
                  onChange={e => setTestimonialComment(e.target.value)}
                  placeholder="Ceritakan suasana malam, kebersamaan masak sup ramen, pemandangan bintang, atau bantuan sesama kawan camper..."
                  className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                />
              </div>

              {/* Upload Foto Momen Kemping dari Galeri HP */}
              <ImageUploadPicker
                value={testimonialPhotoUrl}
                onChange={url => setTestimonialPhotoUrl(url)}
                label="Foto Momen Kemping Kamu (Galeri HP / Kamera)"
                placeholder="Pilih foto dari galeri HP atau URL..."
                helperText="Upload langsung foto dokumentasi dari galeri HP untuk melengkapi testimoni Anda"
              />

              {user && (
                <div className="p-2.5 bg-neutral-100 rounded-xl border border-slate-200 flex items-center gap-2">
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full border border-slate-900" />
                  <div className="text-[11px]">
                    <span className="font-bold text-slate-900 block">{user.name}</span>
                    <span className="text-slate-500 text-[10px]">{user.email}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTestimonialModalEvent(null)}
                  className="px-4 py-2 bg-neutral-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                >
                  Kirim Testimoni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
