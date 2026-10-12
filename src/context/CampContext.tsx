import React, { createContext, useContext, useState, useEffect } from 'react';
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
  updatePastEvent: (eventId: string, updatedData: Partial<PastEvent>) => void;
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
    } catch {
      // ignore
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PAST_EVENTS, JSON.stringify(pastEvents));
    } catch {
      // ignore
    }
  }, [pastEvents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(applications));
    } catch {
      // ignore
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EVENT_PHOTOS, JSON.stringify(eventPhotos));
    } catch {
      // ignore
    }
  }, [eventPhotos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SOLO_STORIES, JSON.stringify(soloCampStories));
    } catch {
      // ignore
    }
  }, [soloCampStories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(memberSpotlights));
    } catch {
      // ignore
    }
  }, [memberSpotlights]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GEAR, JSON.stringify(Array.from(checkedGearIds)));
    } catch {
      // ignore
    }
  }, [checkedGearIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(recipes));
    } catch {
      // ignore
    }
  }, [recipes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GEAR_REVIEWS, JSON.stringify(gearReviews));
    } catch {
      // ignore
    }
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

    setEvents(prev =>
      prev.map(evt => {
        if (evt.id === eventId) {
          return {
            ...evt,
            spotsTaken: (evt.spotsTaken || 0) + 1,
            registeredUserEmails: [...evt.registeredUserEmails, userEmail]
          };
        }
        return evt;
      })
    );

    showToast(`🏕️ Berhasil terdaftar di "${target.title}"! Siapkan gear kempingmu.`);
    return { success: true, message: 'Pendaftaran sukses!' };
  };

  const cancelEventRegistration = (eventId: string, userEmail: string) => {
    setEvents(prev =>
      prev.map(evt => {
        if (evt.id === eventId) {
          return {
            ...evt,
            spotsTaken: Math.max(0, (evt.spotsTaken || 1) - 1),
            registeredUserEmails: evt.registeredUserEmails.filter(e => e !== userEmail)
          };
        }
        return evt;
      })
    );
    showToast('Pendaftaran event berhasil dibatalkan.');
  };

  const addNewEvent = (eventData: Omit<CampEvent, 'id' | 'registeredUserEmails' | 'spotsTaken'>) => {
    const newEvt: CampEvent = {
      ...eventData,
      id: `ycj-evt-${Date.now()}`,
      spotsTaken: 0,
      registeredUserEmails: []
    };
    setEvents(prev => [newEvt, ...prev]);
    showToast(`✅ Event "${newEvt.title}" berhasil ditambahkan oleh Admin!`);
  };

  const updateEvent = (eventId: string, updatedData: Partial<CampEvent>) => {
    setEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, ...updatedData } : e))
    );
    showToast('Data & informasi event berhasil diperbarui oleh Admin!');
  };

  const updateEventStatus = (eventId: string, status: CampEvent['status']) => {
    setEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, status } : e))
    );
    showToast('Status event diperbarui.');
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    showToast('Event telah dihapus.');
  };

  const addTestimonialToPastEvent = (eventId: string, testimonialData: Omit<EventTestimonial, 'id'>) => {
    const newTestimonial: EventTestimonial = {
      ...testimonialData,
      id: `testi-${Date.now()}`
    };
    setPastEvents(prev =>
      prev.map(p => {
        if (p.id === eventId) {
          return {
            ...p,
            testimonials: [newTestimonial, ...(p.testimonials || [])]
          };
        }
        return p;
      })
    );
    showToast('💬 Terima kasih! Testimoni kempingmu berhasil ditambahkan.');
  };

  const updatePastEvent = (eventId: string, updatedData: Partial<PastEvent>) => {
    setPastEvents(prev =>
      prev.map(p => (p.id === eventId ? { ...p, ...updatedData } : p))
    );
    showToast('Data arsip event berhasil diperbarui.');
  };

  const submitMembershipApplication = (data: Omit<MembershipApplication, 'id' | 'status' | 'submittedAt'>) => {
    const newApp: MembershipApplication = {
      ...data,
      id: `app-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    setApplications(prev => [newApp, ...prev]);
    showToast('🎉 Formulir terkirim! Admin Yuru Camp Jabodetabek akan mereview pendaftaranmu.');
  };

  const approveApplication = (appId: string) => {
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status: 'approved' as const } : app))
    );
    showToast('✅ Pendaftaran anggota disetujui sebagai Anggota Resmi!');
  };

  const rejectApplication = (appId: string) => {
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status: 'rejected' as const } : app))
    );
    showToast('Pendaftaran anggota ditolak.');
  };

  const updateSettings = (newSettings: Partial<CommunitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Pengaturan komunitas berhasil disimpan oleh Admin!');
  };

  // Community Event Photo Actions
  const addCommunityEventPhoto = (photoData: Omit<CommunityEventPhoto, 'id' | 'likesCount'>) => {
    const newPhoto: CommunityEventPhoto = {
      ...photoData,
      id: `cep-${Date.now()}`,
      likesCount: 0
    };
    setEventPhotos(prev => [newPhoto, ...prev]);
    showToast('📸 Foto galeri event berhasil diunggah oleh Admin!');
  };

  const editCommunityEventPhoto = (id: string, updated: Partial<CommunityEventPhoto>) => {
    setEventPhotos(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updated } : p))
    );
    showToast('Foto galeri event berhasil diperbarui.');
  };

  const removeCommunityEventPhoto = (id: string) => {
    setEventPhotos(prev => prev.filter(p => p.id !== id));
    showToast('Foto galeri event berhasil dihapus oleh Admin.');
  };

  const likeEventPhoto = (id: string, userEmail?: string): boolean => {
    let resultLiked = false;
    const emailKey = (userEmail || 'tamu-pengunjung').trim().toLowerCase();

    setEventPhotos(prev =>
      prev.map(p => {
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
      })
    );

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
    setSoloCampStories(prev => [newStory, ...prev]);
    showToast('🏕️ Cerita & foto solo camping berhasil dibagikan ke komunitas!');
  };

  const removeSoloCampStory = (id: string) => {
    setSoloCampStories(prev => prev.filter(s => s.id !== id));
    showToast('Cerita solo camping telah dihapus.');
  };

  const likeSoloStory = (id: string, userEmail?: string): boolean => {
    let resultLiked = false;
    const emailKey = (userEmail || 'tamu-pengunjung').trim().toLowerCase();

    setSoloCampStories(prev =>
      prev.map(s => {
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
      })
    );

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
    setRecipes(prev => [newRecipe, ...prev]);
    showToast('🍳 Resep masak outdoor berhasil dibagikan ke komunitas!');
  };

  const addRecipeComment = (recipeId: string, commentData: Omit<RecipeComment, 'id' | 'createdAt'>) => {
    const newComment: RecipeComment = {
      ...commentData,
      id: `rc-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    setRecipes(prev =>
      prev.map(r => {
        if (r.id === recipeId) {
          return {
            ...r,
            comments: [...(r.comments || []), newComment]
          };
        }
        return r;
      })
    );
    showToast('💬 Komentar / chat resep berhasil dikirim!');
  };

  const deleteRecipe = (recipeId: string) => {
    setRecipes(prev => prev.filter(r => r.id !== recipeId));
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
    setGearReviews(prev => [newReview, ...prev]);
    showToast('⛺ Review gear camping berhasil dibagikan ke komunitas!');
  };

  const addGearReviewComment = (reviewId: string, commentData: Omit<GearReviewComment, 'id' | 'createdAt'>) => {
    const newComment: GearReviewComment = {
      ...commentData,
      id: `grc-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    setGearReviews(prev =>
      prev.map(gr => {
        if (gr.id === reviewId) {
          return {
            ...gr,
            comments: [...(gr.comments || []), newComment]
          };
        }
        return gr;
      })
    );
    showToast('💬 Komentar / chat review gear berhasil dikirim!');
  };

  const deleteGearReview = (reviewId: string) => {
    setGearReviews(prev => prev.filter(gr => gr.id !== reviewId));
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

    setMemberSpotlights(prev => [newMember, ...prev]);
    showToast(`🎉 Selamat datang ${userData.name}! Anda otomatis tergabung di daftar Komunitas.`);
    return newMember;
  };

  const updateMemberRole = (
    memberId: string, 
    roleTitle: string, 
    jabatanCategory?: 'lead_dev' | 'admin' | 'pengurus' | 'anggota'
  ) => {
    setMemberSpotlights(prev =>
      prev.map(m => {
        if (m.memberId === memberId || m.id === memberId) {
          return {
            ...m,
            roleTitle: roleTitle.trim(),
            jabatanCategory: jabatanCategory || m.jabatanCategory
          };
        }
        return m;
      })
    );
    showToast(`Jabatan anggota "${roleTitle}" berhasil diperbarui oleh Admin / Lead Dev!`);
  };

  const removeMember = (memberId: string) => {
    // Protect lead dev
    const target = memberSpotlights.find(m => m.memberId === memberId || m.id === memberId);
    if (target?.email?.toLowerCase() === 'ronybimawan2542@gmail.com') {
      showToast('⚠️ Tidak dapat menghapus Lead Developer dari anggota komunitas.');
      return;
    }
    setMemberSpotlights(prev => prev.filter(m => m.memberId !== memberId && m.id !== memberId));
    showToast('Anggota berhasil dihapus dari komunitas.');
  };

  const updateMemberAvatar = (emailOrId: string, avatarUrl: string) => {
    if (!avatarUrl) return;
    const lower = emailOrId.toLowerCase().trim();
    setMemberSpotlights(prev =>
      prev.map(m => {
        if (
          (m.email && m.email.toLowerCase() === lower) ||
          m.memberId.toLowerCase() === lower ||
          m.id === emailOrId
        ) {
          return { ...m, avatarUrl };
        }
        return m;
      })
    );
    showToast('Foto profil anggota berhasil diperbarui dari galeri!');
  };

  return (
    <CampContext.Provider
      value={{
        activeTab,
        setActiveTab,
        events,
        pastEvents,
        addTestimonialToPastEvent,
        updatePastEvent,
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
