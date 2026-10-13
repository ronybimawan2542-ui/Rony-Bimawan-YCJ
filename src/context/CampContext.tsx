import React, { createContext, useContext, useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { SHARED_DATA_DOC, saveSharedDataToFirestore } from '../services/firebaseDb';
import {
  CampEvent,
  PastEvent,
  CampSpot,
  GearItem,
  YuruRecipe,
  TeamMember,
  CommunityMember,
  MemberSpotlight,
  MembershipApplication,
  CommunitySettings,
  CommunityEventPhoto,
  SoloCampStory,
  ActiveTab,
  EventTestimonial,
  RecipeComment,
  GearReview,
  GearReviewComment
} from '../types';
export type { ActiveTab } from '../types';
import {
  INITIAL_UPCOMING_EVENTS,
  PAST_EVENTS_ARCHIVE,
  CAMP_SPOTS_JABODETABEK,
  GEAR_CHECKLIST,
  YURU_CAMP_RECIPES,
  INITIAL_GEAR_REVIEWS,
  TEAM_MEMBERS,
  MEMBER_SPOTLIGHTS,
  INITIAL_APPLICATIONS,
  DEFAULT_COMMUNITY_SETTINGS,
  INITIAL_COMMUNITY_EVENT_PHOTOS,
  INITIAL_SOLO_CAMP_STORIES
} from '../data/mockData';
import { startCampfireAmbience, stopCampfireAmbience, setAmbienceVolume } from '../utils/soundEffects';

interface CampContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  events: CampEvent[];
  pastEvents: PastEvent[];
  spots: CampSpot[];
  teamMembers: TeamMember[];
  memberSpotlights: CommunityMember[];
  registerGoogleUserAsMember: (userData: { name: string; email: string; avatar?: string; roleTitle?: string; jabatanCategory?: 'lead_dev' | 'admin' | 'pengurus' | 'anggota' }) => CommunityMember;
  updateMemberRole: (memberId: string, roleTitle: string, jabatanCategory?: 'lead_dev' | 'admin' | 'pengurus' | 'anggota') => void;
  updateMemberAvatar: (emailOrId: string, avatarUrl: string) => void;
  updateMemberDetails: (emailOrId: string, details: Partial<CommunityMember>) => void;
  removeMember: (memberId: string) => void;
  applications: MembershipApplication[];
  settings: CommunitySettings;
  checkedGearIds: Set<string>;
  toggleGearCheck: (id: string) => void;
  resetGearCheck: () => void;
  // Audio controls
  isCampfirePlaying: boolean;
  toggleCampfireSound: () => void;
  campfireVolume: number;
  changeCampfireVolume: (vol: number) => void;
  // Event actions
  registerForEvent: (eventId: string, userEmail: string) => { success: boolean; message: string };
  cancelEventRegistration: (eventId: string, userEmail: string) => void;
  addNewEvent: (event: Omit<CampEvent, 'id' | 'registeredUserEmails' | 'spotsTaken'>) => void;
  updateEvent: (eventId: string, updatedData: Partial<CampEvent>) => void;
  updateEventStatus: (eventId: string, status: CampEvent['status']) => void;
  deleteEvent: (eventId: string) => void;
  // Past events & testimonials
  addTestimonialToPastEvent: (eventId: string, testimonial: Omit<EventTestimonial, 'id'>) => void;
  addNewPastEvent: (pastEvent: Omit<PastEvent, 'id' | 'testimonials'>) => void;
  updatePastEvent: (eventId: string, updatedData: Partial<PastEvent>) => void;
  deletePastEvent: (eventId: string) => void;
  deleteTestimonialFromPastEvent: (eventId: string, testimonialId: string) => void;
  updateTestimonialInPastEvent: (eventId: string, testimonialId: string, comment: string, rating?: number) => void;
  // Member application actions
  submitMembershipApplication: (data: Omit<MembershipApplication, 'id' | 'status' | 'submittedAt'>) => void;
  approveApplication: (appId: string) => void;
  rejectApplication: (appId: string) => void;
  // Settings update
  updateSettings: (newSettings: Partial<CommunitySettings>) => void;
  // Resep outdoor actions
  recipes: YuruRecipe[];
  addRecipe: (recipe: Omit<YuruRecipe, 'id' | 'comments'>) => void;
  addRecipeComment: (recipeId: string, comment: Omit<RecipeComment, 'id' | 'createdAt'>) => void;
  deleteRecipe: (recipeId: string) => void;
  // Gear reviews actions
  gearReviews: GearReview[];
  addGearReview: (review: Omit<GearReview, 'id' | 'comments' | 'createdAt'>) => void;
  addGearReviewComment: (reviewId: string, comment: Omit<GearReviewComment, 'id' | 'createdAt'>) => void;
  deleteGearReview: (reviewId: string) => void;
  // Gallery actions (Event Photos - Admin only upload/edit/remove)
  eventPhotos: CommunityEventPhoto[];
  addCommunityEventPhoto: (photo: Omit<CommunityEventPhoto, 'id' | 'likesCount'>) => void;
  editCommunityEventPhoto: (id: string, updated: Partial<CommunityEventPhoto>) => void;
  removeCommunityEventPhoto: (id: string) => void;
  likeEventPhoto: (id: string, userEmail?: string) => boolean;
  // Solo Camp Stories actions (Members share solo journeys)
  soloCampStories: SoloCampStory[];
  addSoloCampStory: (story: Omit<SoloCampStory, 'id' | 'likesCount' | 'createdAt'>) => void;
  removeSoloCampStory: (id: string) => void;
  likeSoloStory: (id: string, userEmail?: string) => boolean;
  // Notification toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const STORAGE_KEY_EVENTS = 'ycj_events_v2';
const STORAGE_KEY_PAST_EVENTS = 'ycj_past_events_v2';
const STORAGE_KEY_APPS = 'ycj_applications_v2';
const STORAGE_KEY_SETTINGS = 'ycj_settings_v2';
const STORAGE_KEY_GEAR = 'ycj_gear_checked_v2';
const STORAGE_KEY_EVENT_PHOTOS = 'ycj_event_photos_v2';
const STORAGE_KEY_SOLO_STORIES = 'ycj_solo_stories_v2';
const STORAGE_KEY_MEMBERS = 'ycj_community_members_v2';
const STORAGE_KEY_RECIPES = 'ycj_recipes_v2';
const STORAGE_KEY_GEAR_REVIEWS = 'ycj_gear_reviews_v2';

const CampContext = createContext<CampContextType | undefined>(undefined);

export const CampProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [events, setEvents] = useState<CampEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EVENTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_UPCOMING_EVENTS;
  });

  const [pastEvents, setPastEvents] = useState<PastEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PAST_EVENTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return PAST_EVENTS_ARCHIVE;
  });

  const [memberSpotlights, setMemberSpotlights] = useState<CommunityMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEMBERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return MEMBER_SPOTLIGHTS;
  });

  const [applications, setApplications] = useState<MembershipApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_APPLICATIONS;
  });

  const [settings, setSettings] = useState<CommunitySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_COMMUNITY_SETTINGS;
  });

  const [eventPhotos, setEventPhotos] = useState<CommunityEventPhoto[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EVENT_PHOTOS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_COMMUNITY_EVENT_PHOTOS;
  });

  const [soloCampStories, setSoloCampStories] = useState<SoloCampStory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOLO_STORIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_SOLO_CAMP_STORIES;
  });

  const [recipes, setRecipes] = useState<YuruRecipe[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECIPES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return YURU_CAMP_RECIPES;
  });

  const [gearReviews, setGearReviews] = useState<GearReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GEAR_REVIEWS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_GEAR_REVIEWS;
  });

  const [checkedGearIds, setCheckedGearIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GEAR);
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // ignore
    }
    return new Set(['gear-01', 'gear-03', 'gear-05', 'gear-07']);
  });

  // Sound state
  const [isCampfirePlaying, setIsCampfirePlaying] = useState(false);
  const [campfireVolume, setCampfireVolume] = useState(0.35);

  // Firestore Real-time Listener (Synchronize changes made by Lead Dev & Admin to all users/devices)
  useEffect(() => {
    const unsubscribe = onSnapshot(
      SHARED_DATA_DOC,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Array.isArray(data.events)) setEvents(data.events);
          if (Array.isArray(data.pastEvents)) setPastEvents(data.pastEvents);
          if (Array.isArray(data.memberSpotlights)) setMemberSpotlights(data.memberSpotlights);
          if (Array.isArray(data.applications)) setApplications(data.applications);
          if (data.settings) setSettings(data.settings);
          if (Array.isArray(data.eventPhotos)) setEventPhotos(data.eventPhotos);
          if (Array.isArray(data.soloCampStories)) setSoloCampStories(data.soloCampStories);
          if (Array.isArray(data.recipes)) setRecipes(data.recipes);
          if (Array.isArray(data.gearReviews)) setGearReviews(data.gearReviews);
        } else {
          // Initialize Firestore document with default mock data
          saveSharedDataToFirestore({
            events: INITIAL_UPCOMING_EVENTS,
            pastEvents: PAST_EVENTS_ARCHIVE,
            memberSpotlights: MEMBER_SPOTLIGHTS,
            applications: INITIAL_APPLICATIONS,
            settings: DEFAULT_COMMUNITY_SETTINGS,
            eventPhotos: INITIAL_COMMUNITY_EVENT_PHOTOS,
            soloCampStories: INITIAL_SOLO_CAMP_STORIES,
            recipes: YURU_CAMP_RECIPES,
            gearReviews: INITIAL_GEAR_REVIEWS
          });
        }
      },
      (err) => {
        console.warn('Firestore onSnapshot listener fallback:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // Sync to LocalStorage as secondary local cache
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events)); } catch {}
  }, [events]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_PAST_EVENTS, JSON.stringify(pastEvents)); } catch {}
  }, [pastEvents]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(applications)); } catch {}
  }, [applications]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings)); } catch {}
  }, [settings]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_EVENT_PHOTOS, JSON.stringify(eventPhotos)); } catch {}
  }, [eventPhotos]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_SOLO_STORIES, JSON.stringify(soloCampStories)); } catch {}
  }, [soloCampStories]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(memberSpotlights)); } catch {}
  }, [memberSpotlights]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_GEAR, JSON.stringify(Array.from(checkedGearIds))); } catch {}
  }, [checkedGearIds]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(recipes)); } catch {}
  }, [recipes]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_GEAR_REVIEWS, JSON.stringify(gearReviews)); } catch {}
  }, [gearReviews]);

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      stopCampfireAmbience();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleGearCheck = (id: string) => {
    setCheckedGearIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const resetGearCheck = () => {
    setCheckedGearIds(new Set());
    showToast('Checklist peralatan telah direset.');
  };

  const toggleCampfireSound = () => {
    if (isCampfirePlaying) {
      stopCampfireAmbience();
      setIsCampfirePlaying(false);
      showToast('Suara api unggun dimatikan.');
    } else {
      const started = startCampfireAmbience(campfireVolume);
      if (started) {
        setIsCampfirePlaying(true);
        showToast('🔥 Suara gemeretak api unggun & angin pinus diaktifkan!');
      }
    }
  };

  const changeCampfireVolume = (vol: number) => {
    setCampfireVolume(vol);
    setAmbienceVolume(vol);
  };

  const registerForEvent = (eventId: string, userEmail: string): { success: boolean; message: string } => {
    const target = events.find(e => e.id === eventId);
    if (!target) return { success: false, message: 'Event tidak ditemukan.' };

    if (target.registeredUserEmails.includes(userEmail)) {
      return { success: false, message: 'Kamu sudah terdaftar di event ini!' };
    }

    const updatedEvents = events.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          spotsTaken: (evt.spotsTaken || 0) + 1,
          registeredUserEmails: [...evt.registeredUserEmails, userEmail]
        };
      }
      return evt;
    });

    setEvents(updatedEvents);
    saveSharedDataToFirestore({ events: updatedEvents });

    showToast(`🏕️ Berhasil terdaftar di "${target.title}"! Siapkan gear kempingmu.`);
    return { success: true, message: 'Pendaftaran sukses!' };
  };

  const cancelEventRegistration = (eventId: string, userEmail: string) => {
    const updatedEvents = events.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          spotsTaken: Math.max(0, (evt.spotsTaken || 1) - 1),
          registeredUserEmails: evt.registeredUserEmails.filter(e => e !== userEmail)
        };
      }
      return evt;
    });

    setEvents(updatedEvents);
    saveSharedDataToFirestore({ events: updatedEvents });
    showToast('Pendaftaran event berhasil dibatalkan.');
  };

  const addNewEvent = (eventData: Omit<CampEvent, 'id' | 'registeredUserEmails' | 'spotsTaken'>) => {
    const newEvt: CampEvent = {
      ...eventData,
      id: `ycj-evt-${Date.now()}`,
      spotsTaken: 0,
      registeredUserEmails: []
    };
    const updatedEvents = [newEvt, ...events];
    setEvents(updatedEvents);
    saveSharedDataToFirestore({ events: updatedEvents });
    showToast(`✅ Event "${newEvt.title}" berhasil ditambahkan oleh Admin!`);
  };

  const archiveCompletedEventToPastEvents = (evt: CampEvent, currentPastEvents: PastEvent[]): PastEvent[] => {
    const exists = currentPastEvents.some(p => p.id === evt.id);
    if (exists) {
      return currentPastEvents.map(p => {
        if (p.id === evt.id) {
          return {
            ...p,
            title: evt.title,
            date: evt.date,
            location: evt.location,
            region: evt.region,
            summary: evt.subtitle || evt.description || 'Kemping Selesai & Sukses',
            story: evt.description || 'Event kemping komunitas telah berhasil diselenggarakan.',
            imageUrl: evt.imageUrl || p.imageUrl
          };
        }
        return p;
      });
    }

    const newPast: PastEvent = {
      id: evt.id,
      title: evt.title,
      date: evt.date,
      location: evt.location,
      region: evt.region,
      participantsCount: evt.registeredUserEmails?.length || evt.spotsTaken || 15,
      summary: evt.subtitle || 'Kemping Selesai & Sukses Digelar',
      story: evt.description || 'Event kemping bersama komunitas Yuru Camp Jabodetabek telah selesai diselenggarakan dengan lancar dan penuh kehangatan kebersamaan.',
      highlights: (evt.highlights && evt.highlights.length > 0)
        ? evt.highlights
        : ['Kebersamaan & ramah tamah', 'Seduh kopi & masak nabe bersama', 'Menerapkan etika Leave No Trace'],
      illustrationType: evt.illustrationType === 'pine' || evt.illustrationType === 'night' ? 'mountain' : (evt.illustrationType as any) || 'campfire',
      imageUrl: evt.imageUrl,
      testimonials: []
    };

    return [newPast, ...currentPastEvents];
  };

  const updateEvent = (eventId: string, updatedData: Partial<CampEvent>) => {
    let updatedObj: CampEvent | undefined;

    const updatedEvents = events.map(e => {
      if (e.id === eventId) {
        const merged = { ...e, ...updatedData };
        updatedObj = merged;
        return merged;
      }
      return e;
    });

    let updatedPast = pastEvents;
    if (updatedData.status === 'completed' && updatedObj) {
      updatedPast = archiveCompletedEventToPastEvents(updatedObj, pastEvents);
      setPastEvents(updatedPast);
      showToast(`🎉 Event "${updatedObj.title}" ditandai SELESAI dan otomatis masuk Arsip Selesai & Testimoni!`);
    } else {
      showToast('Data & informasi event berhasil diperbarui oleh Admin!');
    }

    setEvents(updatedEvents);
    saveSharedDataToFirestore({ events: updatedEvents, pastEvents: updatedPast });
  };

  const updateEventStatus = (eventId: string, status: CampEvent['status']) => {
    let updatedObj: CampEvent | undefined;

    const updatedEvents = events.map(e => {
      if (e.id === eventId) {
        const merged = { ...e, status };
        updatedObj = merged;
        return merged;
      }
      return e;
    });

    let updatedPast = pastEvents;
    if (status === 'completed' && updatedObj) {
      updatedPast = archiveCompletedEventToPastEvents(updatedObj, pastEvents);
      setPastEvents(updatedPast);
      showToast(`🎉 Event "${updatedObj.title}" ditandai SELESAI dan otomatis masuk Arsip Selesai & Testimoni!`);
    } else {
      showToast(`Status event diperbarui menjadi ${status === 'open' ? 'Buka (Open)' : status === 'closed' ? 'Ditutup (Closed)' : status}.`);
    }

    setEvents(updatedEvents);
    saveSharedDataToFirestore({ events: updatedEvents, pastEvents: updatedPast });
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);
    saveSharedDataToFirestore({ events: updatedEvents });
    showToast('Event telah dihapus.');
  };

  const addTestimonialToPastEvent = (eventId: string, testimonialData: Omit<EventTestimonial, 'id'>) => {
    const newTestimonial: EventTestimonial = {
      ...testimonialData,
      id: `testi-${Date.now()}`
    };
    const updatedPast = pastEvents.map(p => {
      if (p.id === eventId) {
        return {
          ...p,
          testimonials: [newTestimonial, ...(p.testimonials || [])]
        };
      }
      return p;
    });

    setPastEvents(updatedPast);
    saveSharedDataToFirestore({ pastEvents: updatedPast });
    showToast('💬 Terima kasih! Testimoni kempingmu berhasil ditambahkan.');
  };

  const addNewPastEvent = (data: Omit<PastEvent, 'id' | 'testimonials'>) => {
    const newPast: PastEvent = {
      ...data,
      id: `past-manual-${Date.now()}`,
      testimonials: []
    };
    const updatedPast = [newPast, ...pastEvents];
    setPastEvents(updatedPast);
    saveSharedDataToFirestore({ pastEvents: updatedPast });
    showToast(`🎉 Arsip Event Selesai "${newPast.title}" berhasil ditambahkan oleh Admin!`);
  };

  const updatePastEvent = (eventId: string, updatedData: Partial<PastEvent>) => {
    const updatedPast = pastEvents.map(p => (p.id === eventId ? { ...p, ...updatedData } : p));
    setPastEvents(updatedPast);
    saveSharedDataToFirestore({ pastEvents: updatedPast });
    showToast('Data arsip event berhasil diperbarui oleh Admin!');
  };

  const deletePastEvent = (eventId: string) => {
    const updatedPast = pastEvents.filter(p => p.id !== eventId);
    setPastEvents(updatedPast);
    saveSharedDataToFirestore({ pastEvents: updatedPast });
    showToast('Arsip event berhasil dihapus oleh Admin.');
  };

  const deleteTestimonialFromPastEvent = (eventId: string, testimonialId: string) => {
    const updatedPast = pastEvents.map(p => {
      if (p.id === eventId) {
        return {
          ...p,
          testimonials: (p.testimonials || []).filter(t => t.id !== testimonialId)
        };
      }
      return p;
    });
    setPastEvents(updatedPast);
    saveSharedDataToFirestore({ pastEvents: updatedPast });
    showToast('Testimoni berhasil dihapus oleh Admin.');
  };

  const updateTestimonialInPastEvent = (eventId: string, testimonialId: string, comment: string, rating?: number) => {
    const updatedPast = pastEvents.map(p => {
      if (p.id === eventId) {
        return {
          ...p,
          testimonials: (p.testimonials || []).map(t =>
            t.id === testimonialId ? { ...t, comment, rating: rating ?? t.rating } : t
          )
        };
      }
      return p;
    });
    setPastEvents(updatedPast);
    saveSharedDataToFirestore({ pastEvents: updatedPast });
    showToast('Testimoni berhasil diperbarui oleh Admin.');
  };

  const submitMembershipApplication = (data: Omit<MembershipApplication, 'id' | 'status' | 'submittedAt'>) => {
    const newApp: MembershipApplication = {
      ...data,
      id: `app-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    const updatedApps = [newApp, ...applications];
    setApplications(updatedApps);
    saveSharedDataToFirestore({ applications: updatedApps });
    showToast('🎉 Formulir terkirim! Admin Yuru Camp Jabodetabek akan mereview pendaftaranmu.');
  };

  const approveApplication = (appId: string) => {
    const updatedApps = applications.map(app => (app.id === appId ? { ...app, status: 'approved' as const } : app));
    setApplications(updatedApps);
    saveSharedDataToFirestore({ applications: updatedApps });
    showToast('✅ Pendaftaran anggota disetujui sebagai Anggota Resmi!');
  };

  const rejectApplication = (appId: string) => {
    const updatedApps = applications.map(app => (app.id === appId ? { ...app, status: 'rejected' as const } : app));
    setApplications(updatedApps);
    saveSharedDataToFirestore({ applications: updatedApps });
    showToast('Pendaftaran anggota ditolak.');
  };

  const updateSettings = (newSettings: Partial<CommunitySettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    saveSharedDataToFirestore({ settings: updatedSettings });
    showToast('Pengaturan komunitas berhasil disimpan oleh Admin!');
  };

  // Community Event Photo Actions
  const addCommunityEventPhoto = (photoData: Omit<CommunityEventPhoto, 'id' | 'likesCount'>) => {
    const newPhoto: CommunityEventPhoto = {
      ...photoData,
      id: `cep-${Date.now()}`,
      likesCount: 0
    };
    const updatedPhotos = [newPhoto, ...eventPhotos];
    setEventPhotos(updatedPhotos);
    saveSharedDataToFirestore({ eventPhotos: updatedPhotos });
    showToast('📸 Foto galeri event berhasil diunggah oleh Admin!');
  };

  const editCommunityEventPhoto = (id: string, updated: Partial<CommunityEventPhoto>) => {
    const updatedPhotos = eventPhotos.map(p => (p.id === id ? { ...p, ...updated } : p));
    setEventPhotos(updatedPhotos);
    saveSharedDataToFirestore({ eventPhotos: updatedPhotos });
    showToast('Foto galeri event berhasil diperbarui.');
  };

  const removeCommunityEventPhoto = (id: string) => {
    const updatedPhotos = eventPhotos.filter(p => p.id !== id);
    setEventPhotos(updatedPhotos);
    saveSharedDataToFirestore({ eventPhotos: updatedPhotos });
    showToast('Foto galeri event berhasil dihapus oleh Admin.');
  };

  const likeEventPhoto = (id: string, userEmail?: string): boolean => {
    let resultLiked = false;
    const emailKey = (userEmail || 'tamu-pengunjung').trim().toLowerCase();

    const updatedPhotos = eventPhotos.map(p => {
      if (p.id !== id) return p;
      const currentLiked = p.likedByUserEmails || [];
      const isAlreadyLiked = currentLiked.some(e => e.toLowerCase() === emailKey);

      if (isAlreadyLiked) {
        resultLiked = false;
        const updatedLiked = currentLiked.filter(e => e.toLowerCase() !== emailKey);
        return {
          ...p,
          likesCount: Math.max(0, p.likesCount - 1),
          likedByUserEmails: updatedLiked
        };
      } else {
        resultLiked = true;
        return {
          ...p,
          likesCount: p.likesCount + 1,
          likedByUserEmails: [...currentLiked, emailKey]
        };
      }
    });

    setEventPhotos(updatedPhotos);
    saveSharedDataToFirestore({ eventPhotos: updatedPhotos });

    if (resultLiked) {
      showToast('❤️ Disukai! Apresiasi fotomu telah tercatat.');
    } else {
      showToast('🤍 Kamu membatalkan apresiasi (unlove) foto ini.');
    }
    return resultLiked;
  };

  // Member Solo Camp Story Actions
  const addSoloCampStory = (storyData: Omit<SoloCampStory, 'id' | 'likesCount' | 'createdAt'>) => {
    const newStory: SoloCampStory = {
      ...storyData,
      id: `scs-${Date.now()}`,
      likesCount: 1,
      likedByUserEmails: storyData.memberEmail ? [storyData.memberEmail.toLowerCase()] : [],
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    const updatedStories = [newStory, ...soloCampStories];
    setSoloCampStories(updatedStories);
    saveSharedDataToFirestore({ soloCampStories: updatedStories });
    showToast('🏕️ Cerita & foto solo camping berhasil dibagikan ke komunitas!');
  };

  const removeSoloCampStory = (id: string) => {
    const updatedStories = soloCampStories.filter(s => s.id !== id);
    setSoloCampStories(updatedStories);
    saveSharedDataToFirestore({ soloCampStories: updatedStories });
    showToast('Cerita solo camping telah dihapus.');
  };

  const likeSoloStory = (id: string, userEmail?: string): boolean => {
    let resultLiked = false;
    const emailKey = (userEmail || 'tamu-pengunjung').trim().toLowerCase();

    const updatedStories = soloCampStories.map(s => {
      if (s.id !== id) return s;
      const currentLiked = s.likedByUserEmails || [];
      const isAlreadyLiked = currentLiked.some(e => e.toLowerCase() === emailKey);

      if (isAlreadyLiked) {
        resultLiked = false;
        const updatedLiked = currentLiked.filter(e => e.toLowerCase() !== emailKey);
        return {
          ...s,
          likesCount: Math.max(0, s.likesCount - 1),
          likedByUserEmails: updatedLiked
        };
      } else {
        resultLiked = true;
        return {
          ...s,
          likesCount: s.likesCount + 1,
          likedByUserEmails: [...currentLiked, emailKey]
        };
      }
    });

    setSoloCampStories(updatedStories);
    saveSharedDataToFirestore({ soloCampStories: updatedStories });

    if (resultLiked) {
      showToast('❤️ Cerita solo camping berhasil kamu sukai!');
    } else {
      showToast('🤍 Kamu membatalkan suka (unlove) pada cerita ini.');
    }
    return resultLiked;
  };

  // Recipe actions (Members can upload recipes & discuss in chat)
  const addRecipe = (recipeData: Omit<YuruRecipe, 'id' | 'comments'>) => {
    const newRecipe: YuruRecipe = {
      ...recipeData,
      id: `rec-${Date.now()}`,
      comments: []
    };
    const updatedRecipes = [newRecipe, ...recipes];
    setRecipes(updatedRecipes);
    saveSharedDataToFirestore({ recipes: updatedRecipes });
    showToast('🍳 Resep masak outdoor berhasil dibagikan ke komunitas!');
  };

  const addRecipeComment = (recipeId: string, commentData: Omit<RecipeComment, 'id' | 'createdAt'>) => {
    const newComment: RecipeComment = {
      ...commentData,
      id: `rc-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    const updatedRecipes = recipes.map(r => {
      if (r.id === recipeId) {
        return {
          ...r,
          comments: [...(r.comments || []), newComment]
        };
      }
      return r;
    });

    setRecipes(updatedRecipes);
    saveSharedDataToFirestore({ recipes: updatedRecipes });
    showToast('💬 Komentar / chat resep berhasil dikirim!');
  };

  const deleteRecipe = (recipeId: string) => {
    const updatedRecipes = recipes.filter(r => r.id !== recipeId);
    setRecipes(updatedRecipes);
    saveSharedDataToFirestore({ recipes: updatedRecipes });
    showToast('Resep outdoor telah dihapus.');
  };

  // Gear Review actions (Members can upload gear reviews & discuss in chat)
  const addGearReview = (reviewData: Omit<GearReview, 'id' | 'comments' | 'createdAt'>) => {
    const newReview: GearReview = {
      ...reviewData,
      id: `gr-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      comments: []
    };
    const updatedReviews = [newReview, ...gearReviews];
    setGearReviews(updatedReviews);
    saveSharedDataToFirestore({ gearReviews: updatedReviews });
    showToast('⛺ Review gear camping berhasil dibagikan ke komunitas!');
  };

  const addGearReviewComment = (reviewId: string, commentData: Omit<GearReviewComment, 'id' | 'createdAt'>) => {
    const newComment: GearReviewComment = {
      ...commentData,
      id: `grc-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    const updatedReviews = gearReviews.map(gr => {
      if (gr.id === reviewId) {
        return {
          ...gr,
          comments: [...(gr.comments || []), newComment]
        };
      }
      return gr;
    });

    setGearReviews(updatedReviews);
    saveSharedDataToFirestore({ gearReviews: updatedReviews });
    showToast('💬 Komentar / chat review gear berhasil dikirim!');
  };

  const deleteGearReview = (reviewId: string) => {
    const updatedReviews = gearReviews.filter(gr => gr.id !== reviewId);
    setGearReviews(updatedReviews);
    saveSharedDataToFirestore({ gearReviews: updatedReviews });
    showToast('Review gear telah dihapus.');
  };

  // Auto-register Google user into Community Members list
  const registerGoogleUserAsMember = (userData: {
    name: string;
    email: string;
    avatar?: string;
    roleTitle?: string;
    jabatanCategory?: 'lead_dev' | 'admin' | 'pengurus' | 'anggota';
  }): CommunityMember => {
    const trimmedEmail = userData.email.trim().toLowerCase();
    
    // Check if member already exists
    const existing = memberSpotlights.find(
      m => (m.email && m.email.toLowerCase() === trimmedEmail) || m.name.toLowerCase() === userData.name.toLowerCase()
    );

    if (existing) {
      return existing;
    }

    // Determine initial jabatan
    const isDev = trimmedEmail === 'ronybimawan2542@gmail.com';
    const isAdmin = isDev || settings.adminEmails.some(a => a.toLowerCase() === trimmedEmail);

    let defaultRoleTitle = userData.roleTitle || 'Anggota Komunitas';
    let defaultCategory: 'lead_dev' | 'admin' | 'pengurus' | 'anggota' = userData.jabatanCategory || 'anggota';

    if (isDev) {
      defaultRoleTitle = 'Lead Developer & App Creator';
      defaultCategory = 'lead_dev';
    } else if (isAdmin) {
      defaultRoleTitle = 'Admin Komunitas';
      defaultCategory = 'admin';
    }

    const newMember: CommunityMember = {
      id: `usr-mbr-${Date.now()}`,
      memberId: isDev ? '#YCJ-DEV-001' : isAdmin ? `#YCJ-ADM-${Math.floor(100 + Math.random() * 900)}` : `#YCJ-${Math.floor(200 + Math.random() * 700)}`,
      name: userData.name,
      email: trimmedEmail,
      domisili: 'Jabodetabek',
      roleTitle: defaultRoleTitle,
      jabatanCategory: defaultCategory,
      avatarUrl: userData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.name)}`,
      joinedSince: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      isCustomGoogleUser: true
    };

    const updatedMembers = [newMember, ...memberSpotlights];
    setMemberSpotlights(updatedMembers);
    saveSharedDataToFirestore({ memberSpotlights: updatedMembers });
    showToast(`🎉 Selamat datang ${userData.name}! Anda otomatis tergabung di daftar Komunitas.`);
    return newMember;
  };

  const updateMemberRole = (
    memberId: string, 
    roleTitle: string, 
    jabatanCategory?: 'lead_dev' | 'admin' | 'pengurus' | 'anggota'
  ) => {
    const updatedMembers = memberSpotlights.map(m => {
      if (m.memberId === memberId || m.id === memberId) {
        return {
          ...m,
          roleTitle: roleTitle.trim(),
          jabatanCategory: jabatanCategory || m.jabatanCategory
        };
      }
      return m;
    });

    setMemberSpotlights(updatedMembers);
    saveSharedDataToFirestore({ memberSpotlights: updatedMembers });
    showToast(`Jabatan anggota "${roleTitle}" berhasil diperbarui oleh Admin / Lead Dev!`);
  };

  const removeMember = (memberId: string) => {
    // Protect lead dev
    const target = memberSpotlights.find(m => m.memberId === memberId || m.id === memberId);
    if (target?.email?.toLowerCase() === 'ronybimawan2542@gmail.com') {
      showToast('⚠️ Tidak dapat menghapus Lead Developer dari anggota komunitas.');
      return;
    }
    const updatedMembers = memberSpotlights.filter(m => m.memberId !== memberId && m.id !== memberId);
    setMemberSpotlights(updatedMembers);
    saveSharedDataToFirestore({ memberSpotlights: updatedMembers });
    showToast('Anggota berhasil dihapus dari komunitas.');
  };

  const updateMemberAvatar = (emailOrId: string, avatarUrl: string) => {
    if (!avatarUrl) return;
    const lower = emailOrId.toLowerCase().trim();
    const updatedMembers = memberSpotlights.map(m => {
      if (
        (m.email && m.email.toLowerCase() === lower) ||
        m.memberId.toLowerCase() === lower ||
        m.id === emailOrId
      ) {
        return { ...m, avatarUrl };
      }
      return m;
    });

    setMemberSpotlights(updatedMembers);
    saveSharedDataToFirestore({ memberSpotlights: updatedMembers });
    showToast('Foto profil anggota berhasil diperbarui dari galeri!');
  };

  const updateMemberDetails = (emailOrId: string, details: Partial<CommunityMember>) => {
    const lower = emailOrId.toLowerCase().trim();
    const updatedMembers = memberSpotlights.map(m => {
      if (
        (m.email && m.email.toLowerCase() === lower) ||
        m.memberId.toLowerCase() === lower ||
        m.id === emailOrId
      ) {
        return { ...m, ...details };
      }
      return m;
    });

    setMemberSpotlights(updatedMembers);
    saveSharedDataToFirestore({ memberSpotlights: updatedMembers });
  };

  return (
    <CampContext.Provider
      value={{
        activeTab,
        setActiveTab,
        events,
        pastEvents,
        addTestimonialToPastEvent,
        addNewPastEvent,
        updatePastEvent,
        deletePastEvent,
        deleteTestimonialFromPastEvent,
        updateTestimonialInPastEvent,
        spots: CAMP_SPOTS_JABODETABEK,
        recipes,
        addRecipe,
        addRecipeComment,
        deleteRecipe,
        gearReviews,
        addGearReview,
        addGearReviewComment,
        deleteGearReview,
        teamMembers: TEAM_MEMBERS,
        memberSpotlights,
        registerGoogleUserAsMember,
        updateMemberRole,
        updateMemberAvatar,
        updateMemberDetails,
        removeMember,
        applications,
        settings,
        checkedGearIds,
        toggleGearCheck,
        resetGearCheck,
        isCampfirePlaying,
        toggleCampfireSound,
        campfireVolume,
        changeCampfireVolume,
        registerForEvent,
        cancelEventRegistration,
        addNewEvent,
        updateEvent,
        updateEventStatus,
        deleteEvent,
        submitMembershipApplication,
        approveApplication,
        rejectApplication,
        updateSettings,
        // Gallery
        eventPhotos,
        addCommunityEventPhoto,
        editCommunityEventPhoto,
        removeCommunityEventPhoto,
        likeEventPhoto,
        soloCampStories,
        addSoloCampStory,
        removeSoloCampStory,
        likeSoloStory,
        toastMessage,
        showToast
      }}
    >
      {children}
    </CampContext.Provider>
  );
};

export const useCamp = (): CampContextType => {
  const context = useContext(CampContext);
  if (!context) {
    throw new Error('useCamp must be used within a CampProvider');
  }
  return context;
};
