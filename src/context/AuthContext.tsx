import React, { createContext, useContext, useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { SHARED_DATA_DOC, saveSharedDataToFirestore } from '../services/firebaseDb';
import { User, UserRole } from '../types';
import { DEFAULT_COMMUNITY_SETTINGS } from '../data/mockData';
import {
  signInWithGoogleOfficial,
  signOutGoogle,
  getCachedAccessToken,
  setCachedAccessToken
} from '../services/firebaseAuth';
import { generateWelcomeEmailHtml, SendEmailParams } from '../services/gmailService';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isGoogleLoggedIn: boolean;
  role: UserRole | 'none';
  isAdmin: boolean;
  isLeadDeveloper: boolean;
  adminEmails: string[];
  addAdminEmail: (email: string) => void;
  removeAdminEmail: (email: string) => void;
  loginWithGoogleModal: boolean;
  setLoginWithGoogleModal: (open: boolean) => void;
  editProfileModalOpen: boolean;
  setEditProfileModalOpen: (open: boolean) => void;
  loginWithCustomGoogle: (email: string, name: string, preferredRole?: UserRole) => void;
  signInWithGoogle: () => Promise<void>;
  quickSwitchRole: (preset: 'none' | 'tamu' | 'anggota' | 'admin') => void;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  // Gmail Integration States & Handlers
  isGmailReady: boolean;
  sendWelcomeEmailModalOpen: boolean;
  setSendWelcomeEmailModalOpen: (open: boolean) => void;
  welcomeEmailParams: SendEmailParams | null;
  prepareWelcomeEmail: (targetUser?: User) => void;
}

export const GUEST_SHIMA_RIN: User = {
  id: 'usr-tamu-rin',
  name: 'Shima Rin',
  email: '',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RinCamp&backgroundColor=38bdf8',
  role: 'tamu',
  domisili: 'Bogor (Tamu)',
  joinDate: 'Pengunjung',
  bio: 'Pengunjung santai solo camp di kaki gunung Salak.'
};

export const ADMIN_RONY: User = {
  id: 'usr-admin-lead',
  name: 'Rony Bimawan',
  email: 'ronybimawan2542@gmail.com',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RonyLeadDev&backgroundColor=0284c7',
  role: 'admin',
  memberId: '#YCJ-DEV-001',
  domisili: 'Jakarta Selatan',
  joinDate: 'November 2023',
  bio: 'Lead Developer & App Creator Yuru Camp Jabodetabek. Penjaga etika alam dan konfigurasi sistem.',
  tentModel: 'MSR Hubba Hubba & Trangia Spirit Stove'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'ycj_auth_user_v2';
const STORAGE_KEY_ADMIN_EMAILS = 'ycj_admin_emails_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminEmails, setAdminEmails] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADMIN_EMAILS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_COMMUNITY_SETTINGS.adminEmails;
  });

  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email !== 'nadeshiko.k@yurucamp.id' && parsed.name !== 'Nadeshiko K. (Anggota Resmi)') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return GUEST_SHIMA_RIN;
  });

  const [loginWithGoogleModal, setLoginWithGoogleModal] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [sendWelcomeEmailModalOpen, setSendWelcomeEmailModalOpen] = useState(false);
  const [welcomeEmailParams, setWelcomeEmailParams] = useState<SendEmailParams | null>(null);

  // Firestore sync for admin emails
  useEffect(() => {
    const unsubscribe = onSnapshot(
      SHARED_DATA_DOC,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Array.isArray(data.adminEmails)) {
            setAdminEmails(data.adminEmails);
          } else if (data.settings && Array.isArray(data.settings.adminEmails)) {
            setAdminEmails(data.settings.adminEmails);
          }
        }
      },
      () => {}
    );
    return () => unsubscribe();
  }, []);

  const prepareWelcomeEmail = (targetUser?: User) => {
    const u = targetUser || user;
    if (!u || !u.email) return;

    const emailHtml = generateWelcomeEmailHtml(
      u.name,
      u.memberId || '#YCJ-MEMBER',
      u.email,
      u.domisili || 'Jabodetabek'
    );

    setWelcomeEmailParams({
      to: u.email,
      subject: `🏕️ Selamat Datang di Komunitas Yuru Camp Jabodetabek! (${u.memberId || '#Member'})`,
      bodyHtml: emailHtml,
      fromName: 'Yuru Camp Jabodetabek'
    });
    setSendWelcomeEmailModalOpen(true);
  };

  const signInWithGoogle = async () => {
    try {
      const { user: fbUser, accessToken } = await signInWithGoogleOfficial();
      const trimmedEmail = (fbUser.email || '').trim().toLowerCase();
      const isAdminEmail = checkIsAdmin(trimmedEmail);

      const finalRole: UserRole = isAdminEmail ? 'admin' : 'anggota';
      const finalName = fbUser.displayName || trimmedEmail.split('@')[0] || 'Anggota Yuru Camp';
      const finalAvatar = fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(finalName)}&backgroundColor=f59e0b`;
      const finalMemberId = isAdminEmail ? '#YCJ-DEV-001' : `#YCJ-${Math.floor(100 + Math.random() * 900)}`;

      const newUser: User = {
        id: fbUser.uid,
        name: finalName,
        email: trimmedEmail,
        avatar: finalAvatar,
        role: finalRole,
        memberId: finalMemberId,
        domisili: 'Jabodetabek',
        joinDate: 'Oktober 2026',
        bio: isAdminEmail ? 'Administrator Resmi Komunitas' : 'Anggota Resmi Komunitas Yuru Camp Jabodetabek'
      };

      setUser(newUser);
      setLoginWithGoogleModal(false);

      if (trimmedEmail && accessToken) {
        prepareWelcomeEmail(newUser);
      }
    } catch (err: any) {
      console.error('Sign in with Google error:', err);
      throw err;
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_EMAILS, JSON.stringify(adminEmails));
    } catch {
      // ignore
    }
  }, [adminEmails]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch {
      // ignore
    }
  }, [user]);

  const addAdminEmail = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || adminEmails.includes(trimmed)) return;
    const updated = [...adminEmails, trimmed];
    setAdminEmails(updated);
    saveSharedDataToFirestore({ adminEmails: updated });
  };

  const removeAdminEmail = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (trimmed === 'ronybimawan2542@gmail.com') return;
    const updated = adminEmails.filter(e => e.toLowerCase() !== trimmed);
    setAdminEmails(updated);
    saveSharedDataToFirestore({ adminEmails: updated });
  };

  const checkIsAdmin = (emailToCheck: string | undefined): boolean => {
    if (!emailToCheck) return false;
    const lower = emailToCheck.toLowerCase();
    return lower === 'ronybimawan2542@gmail.com' || adminEmails.some(a => a.toLowerCase() === lower);
  };

  const loginWithCustomGoogle = (email: string, name: string, preferredRole?: UserRole) => {
    const trimmedEmail = email.trim().toLowerCase();
    const isAdminEmail = checkIsAdmin(trimmedEmail);

    let finalRole: UserRole = 'anggota';
    if (isAdminEmail) {
      finalRole = 'admin';
    } else if (preferredRole) {
      finalRole = preferredRole;
    }

    const newUser: User = {
      id: `usr-google-${Date.now()}`,
      name: name.trim() || trimmedEmail.split('@')[0],
      email: trimmedEmail,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || trimmedEmail)}&backgroundColor=${finalRole === 'admin' ? '0284c7' : 'f59e0b'}`,
      role: finalRole,
      memberId: finalRole === 'admin' ? '#YCJ-DEV-001' : `#YCJ-${Math.floor(100 + Math.random() * 900)}`,
      domisili: 'Jabodetabek',
      joinDate: 'Oktober 2026',
      bio: finalRole === 'admin' ? 'Administrator Resmi Komunitas' : 'Anggota Resmi Komunitas Yuru Camp Jabodetabek'
    };

    setUser(newUser);
    setLoginWithGoogleModal(false);
  };

  const quickSwitchRole = (preset: 'none' | 'tamu' | 'anggota' | 'admin') => {
    if (preset === 'none' || preset === 'tamu') {
      setUser(GUEST_SHIMA_RIN);
      try {
        localStorage.removeItem(STORAGE_KEY_USER);
      } catch {
        // ignore
      }
    } else if (preset === 'admin') {
      setUser(ADMIN_RONY);
    } else if (preset === 'anggota') {
      setUser({
        id: 'usr-member-test',
        name: 'Member Komunitas',
        email: 'member.test@gmail.com',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MemberCamp&backgroundColor=f59e0b',
        role: 'anggota',
        memberId: '#YCJ-042',
        domisili: 'Jakarta Timur',
        joinDate: 'Oktober 2026',
        bio: 'Anggota resmi komunitas kemping santai.'
      });
    }
  };

  const logout = () => {
    signOutGoogle().catch(() => {});
    setUser(GUEST_SHIMA_RIN);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch {
      // ignore
    }
  };

  const updateUserProfile = (data: Partial<User>) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  const isGoogleLoggedIn = !!user && user.role !== 'tamu' && !!user.email;
  const isLoggedIn = isGoogleLoggedIn;
  const role: UserRole | 'none' = user ? user.role : 'tamu';
  const isAdmin = user ? (user.role === 'admin' || checkIsAdmin(user.email)) : false;
  const isLeadDeveloper = user ? user.email.toLowerCase() === 'ronybimawan2542@gmail.com' : false;
  const isGmailReady = !!getCachedAccessToken();

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isGoogleLoggedIn,
        role,
        isAdmin,
        isLeadDeveloper,
        adminEmails,
        addAdminEmail,
        removeAdminEmail,
        loginWithGoogleModal,
        setLoginWithGoogleModal,
        editProfileModalOpen,
        setEditProfileModalOpen,
        loginWithCustomGoogle,
        signInWithGoogle,
        quickSwitchRole,
        logout,
        updateUserProfile,
        isGmailReady,
        sendWelcomeEmailModalOpen,
        setSendWelcomeEmailModalOpen,
        welcomeEmailParams,
        prepareWelcomeEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
