import React from 'react';
import { CampIllustration, CommunityLogo } from '../components/CampIllustration';
import { Compass, Flame, Shield, Heart, TreePine, Sparkles, Coffee } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Hero Banner */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 sm:p-10">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Sejarah & Nilai Filosofi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Tentang Komunitas Yuru Camp Jabodetabek
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Lahir dari kerinduan akan ketenangan alam bebas di tengah padatnya ritme kota metropolitan Jakarta, Bogor, Depok, Tangerang, dan Bekasi.
            </p>
          </div>

          <div className="w-full lg:w-96 rounded-2xl border-2 border-slate-900 overflow-hidden shrink-0">
            <CampIllustration type="campfire" className="w-full h-56" />
          </div>
        </div>
      </div>

      {/* Story & Origin Section */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 sm:p-8 space-y-4">
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-bold text-sky-700 uppercase tracking-wider">
            Kisah Perjalanan Kami
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Bermula dari Secangkir Kopi Panas & Danau Sunyi
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Terinspirasi dari serial <em>Yuru Camp△</em> (Laid-Back Camp), kami menyadari bahwa berkemah tidak melulu harus menaklukkan puncak gunung tinggi yang ekstrem dengan ransel puluhan kilogram. Berkemah bisa sesederhana mendirikan tenda kecil di bawah naungan pinus Cibodas atau Sentul, memasak sup hangat, membaca buku favorit, dan menghirup udara pegunungan yang bersih.
          </p>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Didirikan pada awal tahun 2024 oleh <strong>Rony Bimawan</strong> bersama rekan-rekan camper Jabodetabek, komunitas ini berfokus merangkul siapa saja—terutama pemula yang belum pernah tidur di tenda dan solo camper yang ingin menikmati waktu hening tanpa dihakimi oleh standar gear mahal.
          </p>
        </div>
      </div>

      {/* Visi & Misi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-sky-50 rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 sm:p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white font-black flex items-center justify-center border-2 border-slate-900 shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Visi Kami</h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Menjadi wadah berkemah santai yang paling ramah pemula, inklusif, dan pelopor gaya hidup outdoor beretika kelestarian tinggi (Zero Waste) di seluruh wilayah Jabodetabek dan Jawa Barat.
          </p>
        </div>

        <div className="bg-amber-50 rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 sm:p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-900 font-black flex items-center justify-center border-2 border-slate-900 shadow-xs">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Misi Komunitas</h3>
          <ul className="text-xs sm:text-sm text-slate-700 space-y-2 list-disc list-inside leading-relaxed">
            <li>Memfasilitasi agenda kemping bersama berkala di bumi perkemahan terawat Jabodetabek.</li>
            <li>Mengedukasi teknik dasar keselamatan dan pemasangan tenda yang tahan cuaca.</li>
            <li>Menerapkan prinsip 100% <em>Leave No Trace</em> di setiap kegiatan perkemahan.</li>
            <li>Menciptakan ruang hangat untuk berbagi resep masakan outdoor sederhana dan lezat.</li>
          </ul>
        </div>
      </div>

      {/* 4 Pilar Nilai Kebersamaan */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            Landasan Komunitas
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            Empat Nilai Kebersamaan Yuru Camp
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-50 border-2 border-slate-200 space-y-2">
            <div className="text-2xl font-black text-amber-600 font-mono">01.</div>
            <h4 className="font-bold text-slate-900 text-sm">Yuru (Santai & Nyaman)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Tidak ada target fisik berlebih. Kemping adalah momen memulihkan pikiran dari kepenatan pekerjaan.</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border-2 border-slate-200 space-y-2">
            <div className="text-2xl font-black text-sky-600 font-mono">02.</div>
            <h4 className="font-bold text-slate-900 text-sm">Keselamatan Utama</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Selalu periksa pasak, ventilasi tenda, dan prakiraan cuaca. Pulang ke rumah dengan selamat adalah prioritas.</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border-2 border-slate-200 space-y-2">
            <div className="text-2xl font-black text-emerald-600 font-mono">03.</div>
            <h4 className="font-bold text-slate-900 text-sm">Etika No-Trace</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Bawa pulang semua sampah tanpa terkecuali. Jaga kelestarian rumput dan mata air alami.</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border-2 border-slate-200 space-y-2">
            <div className="text-2xl font-black text-indigo-600 font-mono">04.</div>
            <h4 className="font-bold text-slate-900 text-sm">Inklusif & Saling Bantu</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Semua teman baru diterima setara, baik yang memakai tenda sewa sederhana maupun gear koleksi.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
