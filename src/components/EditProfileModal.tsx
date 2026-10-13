import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCamp } from '../context/CampContext';
import { ImageUploadPicker } from './ImageUploadPicker';
import { User, Check, X, Camera, MapPin, Sparkles, Tent } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile } = useAuth();
  const { updateMemberDetails, updateMemberAvatar, showToast } = useCamp();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [domisili, setDomisili] = useState('');
  const [bio, setBio] = useState('');
  const [tentModel, setTentModel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setDomisili(user.domisili || 'Jabodetabek');
      setBio(user.bio || '');
      setTentModel(user.tentModel || '');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const updatedData = {
        name: name.trim(),
        avatar: avatar.trim() || user.avatar,
        domisili: domisili.trim() || 'Jabodetabek',
        bio: bio.trim(),
        tentModel: tentModel.trim()
      };

      // 1. Update in AuthContext
      updateUserProfile(updatedData);

      // 2. Sync to CampContext (community members list & spotlight cards)
      if (user.email) {
        updateMemberDetails(user.email, {
          name: updatedData.name,
          avatarUrl: updatedData.avatar,
          domisili: updatedData.domisili
        });
        updateMemberAvatar(user.email, updatedData.avatar);
      }

      showToast('Profil & foto berhasil diperbarui!');
      onClose();
    } catch {
      showToast('Gagal memperbarui profil.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-3xl border-2 border-slate-900 shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 p-5 sm:p-6 flex items-start justify-between relative overflow-hidden border-b-2 border-slate-900">
          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles size={11} />
              <span>Profil Anggota Komunitas</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 text-slate-950">
              <User size={22} className="text-slate-950" />
              Edit Nama &amp; Foto Profil
            </h3>
            <p className="text-amber-950 text-xs font-medium">
              Sesuaikan nama panggilan dan unggah foto profil Anda langsung dari galeri HP atau kamera.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/10 hover:bg-slate-900/20 text-slate-950 transition-colors relative z-10"
            title="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Email Info Badge */}
          <div className="p-3 bg-neutral-100 rounded-2xl border border-slate-300 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Akun Terverifikasi
              </span>
              <span className="font-mono text-xs font-bold text-slate-800">
                {user.email || 'Akun Tamu (Belum Login)'}
              </span>
            </div>
            {user.memberId && (
              <span className="px-2.5 py-1 bg-amber-200 text-amber-950 text-[10px] font-extrabold rounded-lg border border-amber-400">
                {user.memberId}
              </span>
            )}
          </div>

          {/* Photo Upload Picker (Mobile Gallery & Camera support) */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border-2 border-amber-300/80 space-y-2">
            <ImageUploadPicker
              value={avatar}
              onChange={url => setAvatar(url)}
              label="Foto Profil (Galeri HP / Kamera)"
              placeholder="Pilih foto dari galeri HP Anda..."
              helperText="Foto otomatis dikompresi & tampil rapi di kartu anggota resmi dan galeri."
            />
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Nama Lengkap / Nama Panggilan: *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Contoh: Rony Bimawan"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border-2 border-slate-900 rounded-xl font-medium text-xs sm:text-sm focus:outline-hidden focus:bg-white"
            />
          </div>

          {/* Domicile Field */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <MapPin size={12} className="text-amber-600" />
              <span>Kota Domisili:</span>
            </label>
            <input
              type="text"
              value={domisili}
              onChange={e => setDomisili(e.target.value)}
              placeholder="Contoh: Jakarta Timur, Bogor, Bekasi, dll"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border-2 border-slate-900 rounded-xl font-medium text-xs sm:text-sm focus:outline-hidden focus:bg-white"
            />
          </div>

          {/* Tent Model / Favorite Gear */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Tent size={12} className="text-amber-600" />
              <span>Tenda &amp; Gear Andalan:</span>
            </label>
            <input
              type="text"
              value={tentModel}
              onChange={e => setTentModel(e.target.value)}
              placeholder="Contoh: Naturehike Cloud Up 2 & Hot Sand Maker"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border-2 border-slate-900 rounded-xl font-medium text-xs sm:text-sm focus:outline-hidden focus:bg-white"
            />
          </div>

          {/* Bio Field */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Bio / Motto Kemping Santai:
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Ceritakan sedikit tentang gaya kempingmu..."
              className="w-full px-3.5 py-2.5 bg-neutral-50 border-2 border-slate-900 rounded-xl font-medium text-xs sm:text-sm focus:outline-hidden focus:bg-white resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-slate-700 hover:bg-neutral-100 transition-colors text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all text-xs flex items-center gap-1.5 active:translate-y-0.5 disabled:opacity-50"
            >
              <Check size={14} />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
