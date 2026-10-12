import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CampProvider, useCamp } from './context/CampContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GoogleLoginModal } from './components/GoogleLoginModal';
import { GmailSendConfirmModal } from './components/GmailSendConfirmModal';
import { DashboardView } from './views/DashboardView';
import { EventsView } from './views/EventsView';
import { GalleryView } from './views/GalleryView';
import { GuideView } from './views/GuideView';
import { CommunityView } from './views/CommunityView';
import { AboutView } from './views/AboutView';
import { AdminSettingsView } from './views/AdminSettingsView';

const AppContent: React.FC = () => {
  const { activeTab, toastMessage } = useCamp();
  const { 
    sendWelcomeEmailModalOpen, 
    setSendWelcomeEmailModalOpen, 
    welcomeEmailParams 
  } = useAuth();

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-800 flex flex-col font-sans selection:bg-amber-200 selection:text-slate-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'events' && <EventsView />}
        {activeTab === 'gallery' && <GalleryView />}
        {activeTab === 'guide' && <GuideView />}
        {activeTab === 'community' && <CommunityView />}
        {activeTab === 'about' && <AboutView />}
        {activeTab === 'settings' && <AdminSettingsView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <GoogleLoginModal />
      <GmailSendConfirmModal
        isOpen={sendWelcomeEmailModalOpen}
        onClose={() => setSendWelcomeEmailModalOpen(false)}
        emailParams={welcomeEmailParams}
      />

      {/* Toast Notification (Flat Bento Pill with crisp border) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#f59e0b] text-xs font-bold flex items-center gap-2 max-w-sm animate-fade-in">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CampProvider>
        <AppContent />
      </CampProvider>
    </AuthProvider>
  );
}
