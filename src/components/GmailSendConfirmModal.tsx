import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertTriangle, X, Send, Sparkles, Loader2, KeyRound } from 'lucide-react';
import { sendGmailMessage, SendEmailParams } from '../services/gmailService';
import { getCachedAccessToken, signInWithGoogleOfficial } from '../services/firebaseAuth';

export interface GmailSendConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailParams: SendEmailParams | null;
  onSuccess?: () => void;
}

export const GmailSendConfirmModal: React.FC<GmailSendConfirmModalProps> = ({
  isOpen,
  onClose,
  emailParams,
  onSuccess
}) => {
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !emailParams) return null;

  const handleConfirmSend = async () => {
    let token = getCachedAccessToken();
    setIsSending(true);
    setStatus('idle');
    setErrorMessage('');

    if (!token) {
      try {
        const res = await signInWithGoogleOfficial();
        token = res.accessToken;
      } catch (authErr: any) {
        setIsSending(false);
        setStatus('error');
        setErrorMessage(
          authErr.message ||
            'Izin akun Google & Gmail belum aktif. Anda dapat menghubungkan akun Google resmi atau menggunakan tombol simulasi preview.'
        );
        return;
      }
    }

    if (token) {
      try {
        await sendGmailMessage(token, emailParams);
        setStatus('success');
        if (onSuccess) onSuccess();
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Gagal mengirim email melalui Gmail API.');
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleSimulatedSuccess = () => {
    setStatus('success');
    if (onSuccess) onSuccess();
  };

  const handleClose = () => {
    setStatus('idle');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-sky-100 border-b-2 border-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-900 flex items-center justify-center text-sky-700 shadow-xs">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Konfirmasi Pengiriman Email via Gmail
              </h3>
              <p className="text-[11px] text-slate-600">
                Persetujuan Pengiriman Pesan Resmi Akun Google
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 bg-white rounded-xl border border-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {status === 'success' ? (
            <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-slate-900 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Email Berhasil Dikirim via Gmail!
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Pesan sambutan dan kartu keanggotaan telah terkirim langsung ke kotak masuk{' '}
                  <strong className="text-slate-900">{emailParams.to}</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="mt-2 px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl border-2 border-slate-900 shadow-xs"
              >
                Selesai & Tutup
              </button>
            </div>
          ) : (
            <>
              {/* Info Box */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-950 leading-relaxed">
                  Aplikasi akan mengirimkan email sambutan resmi, nomor ID keanggotaan, serta panduan komunitas ke alamat email di bawah atas izin Anda.
                </p>
              </div>

              {/* Email Details Details Table */}
              <div className="bg-neutral-50 rounded-2xl border-2 border-slate-900 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-500">Penerima (To):</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                    {emailParams.to}
                  </span>
                </div>
                <div className="flex items-start justify-between text-[11px] gap-2 pt-1 border-t border-slate-200">
                  <span className="font-bold text-slate-500 shrink-0">Subjek (Subject):</span>
                  <span className="font-bold text-slate-900 text-right">
                    {emailParams.subject}
                  </span>
                </div>
              </div>

              {/* Message Preview Box */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">
                  Pratinjau Format Pesan Email:
                </span>
                <div className="max-h-40 overflow-y-auto p-3 bg-white rounded-xl border border-slate-300 text-[11px] text-slate-600 space-y-1 leading-relaxed">
                  <p><strong>Salam Hangat dari Yuru Camp Jabodetabek!</strong></p>
                  <p>• ID Anggota Resmi Komunitas Yuru Camp</p>
                  <p>• Panduan Bergabung & Akses Agenda Event Kemping</p>
                  <p>• Akses Upload Resep Masak Outdoor & Review Gear</p>
                  <p>• Etika & Tata Tertib Leave No Trace di Alam Terbuka</p>
                </div>
              </div>

              {/* Error Message */}
              {status === 'error' && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-300 text-[11px] text-rose-800 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                  <div className="pt-1 flex items-center justify-between border-t border-rose-200">
                    <span className="text-[10px] text-rose-700">Opsi pengujian tanpa popup:</span>
                    <button
                      type="button"
                      onClick={handleSimulatedSuccess}
                      className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-900 border border-rose-300 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Simulasi Kirim Sukses (Preview)
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSending}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-slate-700 font-bold rounded-xl border border-slate-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSend}
                  disabled={isSending}
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1.5 transition-transform active:translate-y-0.5 disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengirim via Gmail...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Konfirmasi & Kirim Email</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
