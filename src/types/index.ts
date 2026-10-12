export type UserRole = 'tamu' | 'anggota' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  memberId?: string;
  joinDate?: string;
  domisili?: string;
  bio?: string;
  tentModel?: string;
}

export type CampRegion = 'Bogor' | 'Sentul' | 'Cibodas' | 'Sukabumi' | 'Puncak' | 'Kepulauan Seribu';

export interface CampEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  targetTimestamp: number; // for countdown
  duration: string;
  location: string;
  region: CampRegion;
  altitude: string;
  spotsTotal?: number;
  spotsTaken?: number;
  fee: string;
  status: 'upcoming' | 'open' | 'closed' | 'completed';
  illustrationType: 'campfire' | 'pine' | 'mountain' | 'lake' | 'night';
  imageUrl?: string;
  description: string;
  highlights: string[];
  requiredGear: string[];
  rules: string[]; // Peraturan event (Leave No Trace, jam hening, dll)
  equipmentNotes?: string; // Teks panduan peralatan tambahan
  meetingPoint: string;
  registeredUserEmails: string[];
}

export interface EventTestimonial {
  id: string;
  memberName: string;
  memberEmail?: string;
  memberRole?: string;
  avatarUrl?: string;
  photoUrl?: string;
  comment: string;
  rating?: number;
  date?: string;
}

export interface PastEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  region: CampRegion;
  participantsCount: number;
  summary: string;
  story: string;
  highlights: string[];
  illustrationType: 'campfire' | 'mountain' | 'lake';
  imageUrl?: string;
  testimonials?: EventTestimonial[];
}

export interface CampSpot {
  id: string;
  name: string;
  region: CampRegion;
  altitude: string;
  tempDay: string;
  tempNight: string;
  weatherCondition: string;
  groundType: string;
  roadAccess: string;
  signalQuality: 'Kencang' | 'Sedang' | 'Lemah / Offline';
  facilities: string[];
  vibe: string;
}

export interface GearItem {
  id: string;
  category: 'Tenda & Tidur' | 'Masak & Kuliner' | 'Pakaian & Proteksi' | 'Safety & Navigasi';
  name: string;
  essential: boolean;
  weightEst: string;
  description: string;
}

export interface RecipeComment {
  id: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  authorMemberId?: string;
  comment: string;
  createdAt: string;
}

export interface YuruRecipe {
  id: string;
  title: string;
  japaneseName: string;
  prepTime: string;
  cookTime: string;
  difficulty: 'Sangat Mudah' | 'Mudah' | 'Sedang';
  description: string;
  ingredients: string[];
  steps: string[];
  yuruTip: string;
  authorName?: string;
  authorEmail?: string;
  authorAvatar?: string;
  authorMemberId?: string;
  imageUrl?: string;
  comments?: RecipeComment[];
}

export interface GearReviewComment {
  id: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  authorMemberId?: string;
  comment: string;
  createdAt: string;
}

export interface GearReview {
  id: string;
  gearName: string;
  brand: string;
  category: 'Tenda & Tidur' | 'Masak & Kuliner' | 'Pakaian & Proteksi' | 'Safety & Navigasi' | 'Lainnya';
  rating: number;
  weightEst?: string;
  priceEst?: string;
  pros: string[];
  cons: string[];
  reviewText: string;
  imageUrl?: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  authorMemberId?: string;
  createdAt: string;
  comments?: GearReviewComment[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  division: string;
  domisili: string;
  yuruMotto: string;
  avatarBg: string;
  social: string;
}

export type ActiveTab = 'dashboard' | 'events' | 'gallery' | 'guide' | 'community' | 'about' | 'settings';

export interface CommunityMember {
  id: string;
  memberId: string;
  name: string;
  email?: string;
  domisili: string;
  roleTitle: string; // e.g. 'Anggota Komunitas', 'Lead Developer', 'Admin Komunitas', 'Koordinator Lapangan', dll.
  jabatanCategory?: 'lead_dev' | 'admin' | 'pengurus' | 'anggota';
  avatarUrl?: string;
  joinedSince?: string;
  isCustomGoogleUser?: boolean;
}

export type MemberSpotlight = CommunityMember;

export interface MembershipApplication {
  id: string;
  name: string;
  email: string;
  domisili: string;
  phone: string;
  experienceLevel: 'Pemula (Belum pernah camp)' | '1 - 3 kali camp' | 'Sering camp (Pecinta Alam/Backpacker)';
  campingStyle: 'Solo Camping Santai' | 'Group Camping Bersama' | 'Family Camp' | 'Motorcamp / Bikepack';
  socialMedia: string;
  tentBrand: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface CommunityEventPhoto {
  id: string;
  eventId?: string;
  eventTitle: string;
  imageUrl: string;
  caption: string;
  location: string;
  region: CampRegion;
  date: string;
  photographer: string;
  uploadedByAdminEmail?: string;
  likesCount: number;
  likedByUserEmails?: string[];
}

export interface SoloCampStory {
  id: string;
  title: string;
  memberName: string;
  memberEmail: string;
  memberId?: string;
  memberAvatar?: string;
  location: string;
  region: CampRegion;
  altitude?: string;
  tentGear: string;
  date: string;
  imageUrl: string;
  story: string;
  soloTips: string;
  likesCount: number;
  likedByUserEmails?: string[];
  createdAt: string;
}

export interface CommunitySettings {
  adminEmails: string[];
  tagline: string;
  announcement: string;
  announcementActive: boolean;
  allowPublicRegistration: boolean;
  contactWhatsApp: string;
  instagramHandle: string;
  discordLink: string;
  logoUrl?: string;
  heroImageUrl?: string;
  highlightEventImageUrl?: string;
  footerAboutText: string;
}
