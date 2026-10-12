import {
  CampEvent,
  PastEvent,
  CampSpot,
  GearItem,
  YuruRecipe,
  RecipeComment,
  GearReview,
  TeamMember,
  MemberSpotlight,
  CommunitySettings,
  MembershipApplication,
  CommunityEventPhoto,
  SoloCampStory
} from '../types';

export const DEFAULT_COMMUNITY_SETTINGS: CommunitySettings = {
  adminEmails: [
    'ronybimawan2542@gmail.com', // Developer & Lead Admin (from environment metadata)
    'admin.yurucamp@gmail.com',
    'nadeshiko.k@yurucamp.id'
  ],
  tagline: 'Hangatnya Api Unggun, Tenangnya Hutan Pinus, & Kebersamaan Tanpa Beban',
  announcement: 'Pemberitahuan Cuaca: Akhir pekan ini wilayah Bogor & Sukabumi diprediksi cerah berawan di siang hari dan berkabut sejuk di malam hari (16°C). Siapkan jaket windbreaker dan flysheet cadangan!',
  announcementActive: true,
  allowPublicRegistration: true,
  contactWhatsApp: '+62 812-9876-5432',
  instagramHandle: '@yurucamp.jabodetabek',
  discordLink: 'https://discord.gg/yurucamp-jabodetabek',
  logoUrl: '',
  heroImageUrl: '',
  highlightEventImageUrl: '',
  footerAboutText: 'Wadah perkumpulan pencinta kemping santai, alam bebas, dan hangatnya api unggun di Bogor, Sentul, Cibodas, Sukabumi, dan Puncak. Mengutamakan etika Leave No Trace dan kebersamaan ramah pemula.'
};

// Target date: set to 12 days from now for realistic live countdown
const now = Date.now();
const eventOneTarget = now + 1000 * 60 * 60 * 24 * 11 + 1000 * 60 * 60 * 6; // ~11 days 6 hours
const eventTwoTarget = now + 1000 * 60 * 60 * 24 * 25 + 1000 * 60 * 60 * 14; // ~25 days
const eventThreeTarget = now + 1000 * 60 * 60 * 24 * 42;

export const INITIAL_UPCOMING_EVENTS: CampEvent[] = [
  {
    id: 'ycj-evt-01',
    title: 'Mandalawangi Autumn Chill Camp 2026',
    subtitle: 'Kemping santai di bawah kaki Gunung Gede Pangrango yang sejuk dan damai',
    date: '24 - 25 Oktober 2026',
    targetTimestamp: eventOneTarget,
    duration: '2 Hari 1 Malam (Weekend)',
    location: 'Bumi Perkemahan Mandalawangi, Cibodas, Cianjur (Dekat Puncak)',
    region: 'Cibodas',
    altitude: '1.275 mdpl',
    spotsTotal: 30,
    spotsTaken: 22,
    fee: 'Rp 65.000 / orang (Tiket Masuk + Kavling Tenda + Kayu Bakar Komunal)',
    status: 'open',
    illustrationType: 'campfire',
    description: 'Edisi kemping santai khas Yuru Camp di hamparan rumput luas dan danau buatan Mandalawangi. Menikmati semilir angin pinus, menyeduh kopi tetes pagi hari, dan memasak sup hangat bersama teman-teman camper se-Jabodetabek. Sangat ramah untuk pemula dan solo camper!',
    highlights: [
      'Sesi masak sup nabe bersama saat malam hari',
      'Workshop singkat pasang flysheet anti-badai',
      'Stargazing santai & sharing pengalaman solo camp',
      'Toilet bersih, mushola, dan warung warga 24 jam'
    ],
    requiredGear: [
      'Tenda double-layer (disarankan water column min 2000mm)',
      'Sleeping bag rating nyaman 15°C',
      'Matras aluminium foil atau tiup',
      'Peralatan makan & mug pribadi',
      'Headlamp / senter dengan baterai cadangan',
      'Kantong sampah pribadi (Zero Waste Rule)'
    ],
    rules: [
      'Etika Leave No Trace: Bawa pulang semua sampah tanpa terkecuali.',
      'Batas Waktu Hening (Quiet Hours): Mulai pukul 22.00 WIB dilarang membunyikan musik atau bersuara keras.',
      'Keamanan Api: Dilarang menyalakan api langsung di atas rumput tanpa fire pit / alas pelindung.',
      'Saling toleransi dan menjaga privasi tenda sesama camper.',
      'Dilarang membawa senjata tajam berlebih di luar kebutuhan pisau bushcraft/alat masak.'
    ],
    equipmentNotes: 'Suhu malam hari bisa turun hingga 13°C. Sangat disarankan membawa jaket polar/fleece, kupluk rajut (beanie), dan matras berinsulasi baik agar tidak kedinginan dari bawah.',
    meetingPoint: 'Rest Area Cibodas / Indomaret Simpang Cibodas pukul 09.00 WIB',
    registeredUserEmails: ['nadeshiko.k@yurucamp.id', 'campers.bogor@gmail.com']
  },
  {
    id: 'ycj-evt-02',
    title: 'Pondok Halimun Riverside & Tea Garden',
    subtitle: 'Menikmati gemericik aliran sungai jernih dan aroma kebun teh Goalpara Sukabumi',
    date: '07 - 08 November 2026',
    targetTimestamp: eventTwoTarget,
    duration: '2 Hari 1 Malam',
    location: 'Bumi Perkemahan Pondok Halimun, Sukabumi',
    region: 'Sukabumi',
    altitude: '1.150 mdpl',
    spotsTotal: 25,
    spotsTaken: 14,
    fee: 'Rp 50.000 / orang (Kavling Tepi Sungai + Keamanan)',
    status: 'open',
    illustrationType: 'pine',
    description: 'Camp tepi sungai berbatu dengan suasana sejuk asri. Cocok untuk sesi memasak kari hangat di luar ruangan sambil mendengarkan suara aliran air alami.',
    highlights: [
      'Spot tepi sungai batu kali yang ramah anak & pemula',
      'Trekking santai pagi ke perkebunan teh',
      'Demo memanggang roti camp dengan Hot Sand Maker'
    ],
    requiredGear: [
      'Tenda dome dengan pasak kokoh',
      'Flysheet 3x3 atau 3x4 meter untuk perlindungan embun',
      'Jaket tebal & kaos kaki wol cadangan',
      'Sandal gunung bertali atau sepatu tahan air',
      'Kompor gas portabel / canister & nesting'
    ],
    rules: [
      'Dilarang mencuci peralatan makan memakai sabun kimia langsung di aliran sungai (gunakan wadah terpisah).',
      'Waspada debit air sungai bila hujan lebat turun di hulu.',
      'Jaga kebersihan area camping ground (bawa trash bag sendiri).',
      'Waktu hening dimulai pukul 22.30 WIB.'
    ],
    equipmentNotes: 'Area sungai berbatu cukup licin dan berembun tebal menjelang subuh. Siapkan flysheet tambahan untuk kanopi dapur.',
    meetingPoint: 'Depan Gerbang Utama Selabintana pukul 10.00 WIB',
    registeredUserEmails: []
  },
  {
    id: 'ycj-evt-03',
    title: 'Gunung Pancar Pine Forest Solo & Duo Camp',
    subtitle: 'Camp santai dekat dari Jabodetabek, teduh rimbun di tengah hutan pinus Sentul',
    date: '21 - 22 November 2026',
    targetTimestamp: eventThreeTarget,
    duration: '2 Hari 1 Malam',
    location: 'Taman Wisata Alam Gunung Pancar, Sentul Selatan, Bogor',
    region: 'Sentul',
    altitude: '800 mdpl',
    spotsTotal: 20,
    spotsTaken: 8,
    fee: 'Rp 45.000 / orang',
    status: 'open',
    illustrationType: 'pine',
    description: 'Pilihan pas untuk yang tidak ingin perjalanan jauh dari Jakarta. Hanya 45 menit dari exit tol Sentul Selatan, suasana pinus lebat yang syahdu dan tenang.',
    highlights: [
      'Akses jalan aspal mulus untuk motor & mobil',
      'Pemandian air panas alami di sekitar lokasi',
      'Cocok untuk uji coba tenda baru dan gear ultralight'
    ],
    requiredGear: [
      'Tenda & matras',
      'Lotion anti-serangga / soffell',
      'Peralatan masak kompor gas mini',
      'Lampu tenda baterai rechargeable'
    ],
    rules: [
      'Dilarang merusak getah pohon pinus atau memaku batang pinus.',
      'Api unggun hanya diizinkan di spot yang sudah disediakan pengelola.',
      'Dilarang menyalakan kembang api atau petasan.',
      'Semua sampah wajib dikumpulkan dan dibuang di bak sampah parkiran.'
    ],
    equipmentNotes: 'Akses kendaraan sangat mudah hingga tepi kavling. Sangat cocok bagi kawan yang baru pertama kali berkemah tanpa trekking berat.',
    meetingPoint: 'Parkiran Pintu 2 Gunung Pancar pukul 13.00 WIB',
    registeredUserEmails: []
  }
];

export const PAST_EVENTS_ARCHIVE: PastEvent[] = [
  {
    id: 'past-01',
    title: 'Sukamantri Starry Night & Bogor Citylight Camp',
    date: '19 - 20 September 2026',
    location: 'Buper Sukamantri, Taman Nasional Gunung Halimun Salak, Bogor',
    region: 'Bogor',
    participantsCount: 28,
    summary: 'Malam penuh bintang dengan pemandangan kerlap-kerlip lampu kota Bogor dari ketinggian 850 mdpl. Cuaca sejuk 17°C dengan semangkuk ramen kari bersama.',
    story: 'Sebanyak 28 sahabat Yuru Camp berkumpul di Sukamantri. Meskipun jalanan makadam sedikit menantang di 1 km terakhir, semua terbayar dengan pemandangan magis citylight Bogor. Malam diisi dengan sharing tips mendirikan flysheet dan sesi seduh kopi manual bersama Kang Asep.',
    highlights: ['Pemandangan Citylight Bogor 180°', 'Sup Sukiyaki ala Yuru Camp', 'Foto bersama 16 tenda bercahaya'],
    illustrationType: 'campfire',
    testimonials: [
      {
        id: 'testi-01',
        memberName: 'Dimas Wicaksono',
        memberRole: 'Anggota Resmi #YCJ-018',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dimas&backgroundColor=10b981',
        rating: 5,
        comment: 'Citylight Bogor dari Sukamantri juara banget! Awalnya sempat ragu solo camp, tapi kawan-kawan Yuru Camp saling bantu pasang tenda pas gerimis. Sup ramen hangatnya juga nagih parah.',
        date: '21 September 2026'
      },
      {
        id: 'testi-02',
        memberName: 'Anisa Rahmawati',
        memberRole: 'Anggota Resmi #YCJ-004',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Anisa&backgroundColor=ec4899',
        rating: 5,
        comment: 'Pertama kali ngerasain malam hening tanpa musik jedag-jedug, benar-benar damai sesuai prinsip Leave No Trace dan quiet hours. Bintangnya keliatan jelas banget!',
        date: '22 September 2026'
      },
      {
        id: 'testi-03',
        memberName: 'Reza Fauzan',
        memberRole: 'Anggota Resmi #YCJ-051',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Reza&backgroundColor=0284c7',
        rating: 5,
        comment: 'Jalan bebatuan 1 km terakhir bikin deg-degan tapi sampai atas langsung takjub. Rekomendasi banget buat yang mau rehat dari penatnya Jakarta.',
        date: '23 September 2026'
      }
    ]
  },
  {
    id: 'past-02',
    title: 'Telaga Saat Sunrise & Morning Mist Gathering',
    date: '29 - 30 Agustus 2026',
    location: 'Hulu Sungai Ciliwung, Puncak, Cisarua, Bogor',
    region: 'Puncak',
    participantsCount: 22,
    summary: 'Sensasi kabut pagi yang magis di hamparan kebun teh tertinggi di Puncak. Suhu fajar menyentuh 14°C!',
    story: 'Pagi hari yang begitu tenang di Telaga Saat. Danau berkabut tebal yang perlahan tersibak oleh sinar matahari pertama. Semua peserta menikmati roti bakar kayu manis dan teh melati hangat dalam suasana hening damai.',
    highlights: ['Kabut danau dramatis', 'Roti Bakar Cast Iron', 'Leave No Trace 100% bersih'],
    illustrationType: 'lake',
    testimonials: [
      {
        id: 'testi-04',
        memberName: 'Maya Kartika',
        memberRole: 'Anggota Resmi #YCJ-022',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Maya&backgroundColor=f59e0b',
        rating: 5,
        comment: 'Kabut paginya persis seperti episode anime Yuru Camp waktu Rin kemping di tepi danau Motosu. Suhu 14 derajat bikin teh hangat terasa luar biasa nikmat.',
        date: '31 Agustus 2026'
      },
      {
        id: 'testi-05',
        memberName: 'Hendro Prasetyo',
        memberRole: 'Anggota Resmi #YCJ-009',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Hendro&backgroundColor=8b5cf6',
        rating: 5,
        comment: 'Keren banget panitianya disiplin soal kebersihan, begitu bubar lokasi bener-bener bersih tanpa ada selembar sampah pun yang tertinggal.',
        date: '01 September 2026'
      }
    ]
  },
  {
    id: 'past-03',
    title: 'Curug Cipamingkis Highland Camp & Pine Walk',
    date: '18 - 19 Juli 2026',
    location: 'Cipamingkis Pine Camp, Jonggol - Sukamakmur, Bogor',
    region: 'Bogor',
    participantsCount: 35,
    summary: 'Kemping ceria keluarga dan pemula di Jonggol dengan fasilitas ramah dan trekking air terjun santai.',
    story: 'Event terbesar musim panas dengan 35 peserta. Ada 6 anggota baru yang untuk pertama kalinya mencoba tidur di tenda dan semuanya ketagihan berkat suasana ramah dan saling bantu antar camper.',
    highlights: ['Air terjun sejuk', 'Sesi tutorial pasak tenda', 'Panggang marshmallow hangat'],
    illustrationType: 'mountain',
    testimonials: [
      {
        id: 'testi-06',
        memberName: 'Sarah Wulandari',
        memberRole: 'Anggota Resmi #YCJ-035',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sarah&backgroundColor=06b6d4',
        rating: 5,
        comment: 'Awalnya takut kemping karena bawa gear seadanya, tapi dibantu pasak tenda sama lead dev dan kawan-kawan. Sekarang malah jadi hobi rutin bulanan!',
        date: '20 Juli 2026'
      },
      {
        id: 'testi-07',
        memberName: 'Budi Santoso',
        memberRole: 'Anggota Resmi #YCJ-012',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Budi&backgroundColor=84cc16',
        rating: 5,
        comment: 'Trekking ke curugnya santai dan udaranya segar banget. Pas malam bakar marshmallow sambil ngobrol seputar rute camp Jabodetabek.',
        date: '21 Juli 2026'
      }
    ]
  }
];

export const CAMP_SPOTS_JABODETABEK: CampSpot[] = [
  {
    id: 'spot-mandalawangi',
    name: 'Mandalawangi Cibodas',
    region: 'Cibodas',
    altitude: '1.275 mdpl',
    tempDay: '22°C - 24°C',
    tempNight: '13°C - 16°C',
    weatherCondition: 'Sejuk, Berembun & Cenderung Berkabut saat Senja',
    groundType: 'Rumput hijau tebal & tanah gembur',
    roadAccess: 'Akses aspal mulus sampai parkiran, jalan kaki 150m ke kavling',
    signalQuality: 'Kencang',
    facilities: ['Toilet & Shower Air Dingin', 'Mushola', 'Warung Warga 24 Jam', 'Penyewaan Alat Camp', 'Danau Buatan'],
    vibe: 'Khas Anime Yuru Camp banget! Dingin, danau tenang, dan pepohonan pinus tinggi.'
  },
  {
    id: 'spot-sukamantri',
    name: 'Buper Sukamantri Mt. Salak',
    region: 'Bogor',
    altitude: '850 mdpl',
    tempDay: '25°C - 27°C',
    tempNight: '17°C - 19°C',
    weatherCondition: 'Sejuk, Angin Sepoi, Citylight Sangat Jelas',
    groundType: 'Tanah padat berumput & terasering',
    roadAccess: 'Aspal lalu makadam bebatuan 1.5 km (disarankan motor bebek/trail/mobil tinggi)',
    signalQuality: 'Sedang',
    facilities: ['Toilet Umum', 'Warung Kopi Sederhana', 'Mata Air Alami', 'Area Parkir Luas'],
    vibe: 'Cocok untuk pecinta view gemerlap lampu malam dan hutan kaki gunung Salak yang asri.'
  },
  {
    id: 'spot-gunung-pancar',
    name: 'TWA Gunung Pancar Sentul',
    region: 'Sentul',
    altitude: '800 mdpl',
    tempDay: '26°C - 29°C',
    tempNight: '20°C - 22°C',
    weatherCondition: 'Teduh dinaungi kanopi pinus lebat',
    groundType: 'Tanah jarum pinus kering & datar',
    roadAccess: 'Sangat mudah, 45 menit dari Jakarta lewat Tol Jagorawi',
    signalQuality: 'Kencang',
    facilities: ['Toilet Bersih', 'Pemandian Air Panas Belerang', 'Kafe Pinus', 'Kelistrikan di beberapa titik'],
    vibe: 'Paling ramah pemula dan praktis untuk akhir pekan singkat.'
  },
  {
    id: 'spot-pondok-halimun',
    name: 'Pondok Halimun Sukabumi',
    region: 'Sukabumi',
    altitude: '1.150 mdpl',
    tempDay: '21°C - 23°C',
    tempNight: '14°C - 17°C',
    weatherCondition: 'Sejuk pegunungan, suara aliran sungai menenangkan',
    groundType: 'Bebatuan tepi kali dan hamparan rumput',
    roadAccess: 'Akses jalan cor beton dan aspal dari Kota Sukabumi 30 menit',
    signalQuality: 'Sedang',
    facilities: ['Toilet', 'Aliran Sungai Alami', 'Jalur Trekking Kebun Teh', 'Pos Jaga'],
    vibe: 'Suasana asri alami dengan suara air sungai yang sangat membantu tidur nyenyak.'
  },
  {
    id: 'spot-telaga-saat',
    name: 'Telaga Saat Puncak',
    region: 'Puncak',
    altitude: '1.400 mdpl',
    tempDay: '20°C - 22°C',
    tempNight: '12°C - 15°C',
    weatherCondition: 'Dingin menusuk, kabut pagi tebal memesona',
    groundType: 'Tepi danau berumput dan terasering kebun teh',
    roadAccess: 'Jalan bebatuan kebun teh (sekitar 15 menit dari jalan raya Puncak)',
    signalQuality: 'Sedang',
    facilities: ['Toilet', 'Spot Foto Dermaga', 'Perahu Danau', 'Warung Teh Walini'],
    vibe: 'Pemandangan paling cinematic di Puncak, serasa berada di danau Motosu Yuru Camp versi lokal!'
  }
];

export const GEAR_CHECKLIST: GearItem[] = [
  // Tenda & Tidur
  {
    id: 'gear-01',
    category: 'Tenda & Tidur',
    name: 'Tenda Double Layer (Frame Aluminium / Fiber)',
    essential: true,
    weightEst: '1.8 - 2.8 kg',
    description: 'Wajib double layer untuk mencegah kondensasi tetesan air di iklim lembab pegunungan Jabodetabek.'
  },
  {
    id: 'gear-02',
    category: 'Tenda & Tidur',
    name: 'Flysheet Tambahan (3x3m atau 3x4m)',
    essential: true,
    weightEst: '600 gram',
    description: 'Melindungi teras tenda dari hujan tropis dan terik matahari, plus membuat ruang kumpul nyaman.'
  },
  {
    id: 'gear-03',
    category: 'Tenda & Tidur',
    name: 'Pasak Tenda (Tent Stakes) & Tali Guyline',
    essential: true,
    weightEst: '300 gram',
    description: 'Bawa minimal 8-12 pasak. Tancapkan dengan kemiringan 45 derajat berlawanan arah tarikan.'
  },
  {
    id: 'gear-04',
    category: 'Tenda & Tidur',
    name: 'Matras Aluminium Foil / Matras Angin (Inflatable)',
    essential: true,
    weightEst: '250 - 500 gram',
    description: 'Isolator penting penahan dingin tanah (R-value). Badan kedinginan sering kali dari tanah, bukan udara.'
  },
  {
    id: 'gear-05',
    category: 'Tenda & Tidur',
    name: 'Sleeping Bag (Comfort Rating 10°C - 15°C)',
    essential: true,
    weightEst: '700 - 900 gram',
    description: 'Kunci tidur nyenyak. Gunakan model mummy atau envelope berbahan hollowfiber/down.'
  },
  {
    id: 'gear-06',
    category: 'Tenda & Tidur',
    name: 'Bantal Tiup Mini (Inflatable Pillow)',
    essential: false,
    weightEst: '80 gram',
    description: 'Opsional tapi sangat meningkatkan kenyamanan leher saat tidur di dalam tenda.'
  },

  // Masak & Kuliner
  {
    id: 'gear-07',
    category: 'Masak & Kuliner',
    name: 'Kompor Gas Mini Portable & Tabung Butane',
    essential: true,
    weightEst: '350 gram',
    description: 'Pilih kompor ulir atau model canister mini dengan wind shield (pelindung angin).'
  },
  {
    id: 'gear-08',
    category: 'Masak & Kuliner',
    name: 'Cooking Set / Nesting Pot Kecil',
    essential: true,
    weightEst: '400 gram',
    description: 'Panci kecil dengan pegangan lipat, cukup untuk merebus air, sup, dan mi instan.'
  },
  {
    id: 'gear-09',
    category: 'Masak & Kuliner',
    name: 'Mug Stainless / Titanium & Sendok Garpu Lipat',
    essential: true,
    weightEst: '150 gram',
    description: 'Mug pribadi untuk menyeduh teh atau kopi panas, hindari gelas plastik sekali pakai.'
  },
  {
    id: 'gear-10',
    category: 'Masak & Kuliner',
    name: 'Hot Sand Maker / Panggangan Roti Tangkup',
    essential: false,
    weightEst: '500 gram',
    description: 'Khas Yuru Camp! Membuat roti bakar keju leleh atau gyoza panggang dengan cepat dan lezat.'
  },
  {
    id: 'gear-11',
    category: 'Masak & Kuliner',
    name: 'Spons Cuci Ramah Lingkungan & Wadah Air Lipat',
    essential: true,
    weightEst: '120 gram',
    description: 'Menjaga kebersihan peralatan masak tanpa mencemari sumber air alami.'
  },

  // Pakaian & Proteksi
  {
    id: 'gear-12',
    category: 'Pakaian & Proteksi',
    name: 'Jaket Windbreaker / Fleece Hangat',
    essential: true,
    weightEst: '450 gram',
    description: 'Menghalau angin gunung di malam hari. Suhu Cibodas/Puncak malam bisa turun ke 13°C.'
  },
  {
    id: 'gear-13',
    category: 'Pakaian & Proteksi',
    name: 'Jas Hujan / Poncho Ultralight',
    essential: true,
    weightEst: '300 gram',
    description: 'Iklim pegunungan Jabodetabek bisa tiba-tiba hujan gerimis walau ramalan cuaca cerah.'
  },
  {
    id: 'gear-14',
    category: 'Pakaian & Proteksi',
    name: 'Kaos Kaki Tebal & Beanie / Kupluk Wol',
    essential: true,
    weightEst: '100 gram',
    description: 'Menjaga kehangatan kepala dan kaki agar terhindar dari kram dingin.'
  },
  {
    id: 'gear-15',
    category: 'Pakaian & Proteksi',
    name: 'Sepatu / Sandal Outdoor dengan Grip Baik',
    essential: true,
    weightEst: '600 gram',
    description: 'Mencegah terpeleset di tanah rumput basah berembun atau bebatuan sungai.'
  },

  // Safety & Navigasi
  {
    id: 'gear-16',
    category: 'Safety & Navigasi',
    name: 'Headlamp / Senter Tenda (Lampu LED Hangat)',
    essential: true,
    weightEst: '120 gram',
    description: 'Pencahayaan hands-free saat malam hari dan lampu lentera gantung untuk di dalam tenda.'
  },
  {
    id: 'gear-17',
    category: 'Safety & Navigasi',
    name: 'Kotak P3K & Obat Pribadi',
    essential: true,
    weightEst: '200 gram',
    description: 'Plester luka, antiseptik, paracetamol, antasida, obat alergi, dan minyak kayu putih.'
  },
  {
    id: 'gear-18',
    category: 'Safety & Navigasi',
    name: 'Power Bank Kapasitas Minimal 10.000 mAh',
    essential: true,
    weightEst: '250 gram',
    description: 'Menjaga daya baterai smartphone tetap siaga untuk navigasi dan komunikasi darurat.'
  },
  {
    id: 'gear-19',
    category: 'Safety & Navigasi',
    name: 'Trash Bag / Kantong Sampah Kuat (Trash In Trash Out)',
    essential: true,
    weightEst: '50 gram',
    description: 'Wajib membawa pulang semua sampah pribadi tanpa terkecuali!'
  }
];

export const YURU_CAMP_RECIPES: YuruRecipe[] = [
  {
    id: 'rec-01',
    title: 'Curry Ramen Nabe Hangat',
    japaneseName: 'Karee Men Nabe (カレー麺鍋)',
    prepTime: '5 Menit',
    cookTime: '10 Menit',
    difficulty: 'Sangat Mudah',
    authorName: 'Rin Shima',
    authorMemberId: '#YCJ-001',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RinCamp&backgroundColor=38bdf8',
    description: 'Menu andalan Rin Shima saat kemping musim gugur di danau. Kuah kari kental gurih berpadu dengan mi kenyal, telur setengah matang, dan daun bawang renyah.',
    ingredients: [
      '1 bungkus Mi Ramen instan kuah kari (atau mi instan rasa kari favorit)',
      '1 butir telur ayam rebus atau telur segar',
      '1 batang daun bawang (iris serong)',
      '3 butir bakso sapi atau sosis (iris melintang)',
      '1 slice keju cheddar mudah leleh',
      '400 ml air bersih'
    ],
    steps: [
      'Didihkan 400 ml air di dalam panci kemping mini di atas kompor portable.',
      'Masukkan potongan sosis atau bakso bersama bumbu kari instan, aduk rata hingga harum.',
      'Masukkan keping mi instan, masak selama 2-3 menit dengan api sedang.',
      'Pecahkan telur ke bagian tengah atau masukkan telur rebus, jangan diaduk agar kuning telur tetap utuh.',
      'Taburkan irisan daun bawang dan letakkan keju slice di atasnya, tutup panci selama 1 menit hingga keju meleleh.',
      'Nikmati selagi mengepul hangat sambil memandangi kabut senja!'
    ],
    yuruTip: 'Jangan buang sisa kuah kari ke tanah! Seruput habis atau tambahkan sejumput nasi hangat ke sisa kuah untuk hidangan risotto darurat.',
    comments: [
      {
        id: 'rc-01',
        authorName: 'Nadeshiko K.',
        authorMemberId: '#YCJ-002',
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nadeshiko&backgroundColor=f43f5e',
        comment: 'Rin-chan! Aku coba tambahkan sosis keju di Mandalawangi kemarin, kuahnya makin gurih banget!',
        createdAt: '06 Oktober 2026'
      },
      {
        id: 'rc-02',
        authorName: 'Dimas Aditya',
        authorMemberId: '#YCJ-ADM-102',
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dimas&backgroundColor=0284c7',
        comment: 'Paling cocok dimasak pas suhu di bawah 16°C. Kuah kari bikin badan langsung hangat.',
        createdAt: '08 Oktober 2026'
      }
    ]
  },
  {
    id: 'rec-02',
    title: 'Hot Sand Maker Keju & Sosis Campur',
    japaneseName: 'Hotto Sando Yaki (ホットサンド)',
    prepTime: '3 Menit',
    cookTime: '6 Menit',
    difficulty: 'Sangat Mudah',
    authorName: 'Nadeshiko Kagamihara',
    authorMemberId: '#YCJ-002',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nadeshiko&backgroundColor=f43f5e',
    description: 'Sarapan favorit para camper. Roti tawar krispi keemasan di luar dengan keju lumer dan sosis gurih di dalam.',
    ingredients: [
      '2 lembar roti tawar gandum atau putih',
      '1 buah sosis bakar atau kornet sapi',
      '1 slice keju mozzarella / quick melt',
      '1 sdm mentega atau margarin',
      'Saus sambal atau tomat secukupnya'
    ],
    steps: [
      'Olesi bagian luar kedua roti dengan mentega tipis-tipis.',
      'Letakkan selembar roti di atas panggangan hot sand maker.',
      'Beri isian sosis yang sudah diiris, keju leleh, dan sedikit saus di tengahnya.',
      'Tutup dengan lembaran roti kedua, lalu jepit kuat cetakan hot sand maker.',
      'Panggang di atas api kecil kompor camp selama 3 menit tiap sisi hingga berwarna cokelat keemasan renyah.',
      'Buka cetakan dan potong diagonal. Rasakan sensasi krispinya!'
    ],
    yuruTip: 'Gunakan api sekecil mungkin agar roti matang merata tanpa gosong.',
    comments: [
      {
        id: 'rc-03',
        authorName: 'Aoi Inuyama',
        authorMemberId: '#YCJ-004',
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aoi&backgroundColor=10b981',
        comment: 'Bisa dicoba juga diganti selai cokelat pisang buat camilan malam sebelum tidur!',
        createdAt: '09 Oktober 2026'
      }
    ]
  },
  {
    id: 'rec-03',
    title: 'Sup Tomat Bakso Hangat Kaki Gunung',
    japaneseName: 'Tomato Dango Supu (トマト団子スープ)',
    prepTime: '7 Menit',
    cookTime: '12 Menit',
    difficulty: 'Mudah',
    authorName: 'Siti Sarah',
    authorMemberId: '#YCJ-021',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Siti&backgroundColor=ec4899',
    description: 'Sup asam segar manis kaya vitamin C untuk mengembalikan stamina setelah perjalanan trekking menuju lokasi camp.',
    ingredients: [
      '2 buah tomat merah ranum (potong dadu)',
      '1 sdm pasta tomat atau saus tomat',
      '6 butir bakso mini atau tahu sutra',
      '1 genggam jamur enoki atau kancing',
      '2 siung bawang putih cincang',
      'Garam, lada bubuk, dan kaldu jamur'
    ],
    steps: [
      'Tumis bawang putih cincang dengan sedikit minyak di panci camp hingga harum.',
      'Masukkan potongan tomat segar, tekan perlahan hingga sari tomat keluar dan melembut.',
      'Tuang 450 ml air, lalu masukkan pasta tomat, garam, dan lada bubuk.',
      'Setelah mendidih, masukkan bakso mini dan jamur enoki.',
      'Masak hingga bakso mengapung dan kuah mengental harum.',
      'Sajikan dengan taburan seledri segar.'
    ],
    yuruTip: 'Sup tomat sangat efektif melawan mual perjalanan darat menuju dataran tinggi.',
    comments: [
      {
        id: 'rc-04',
        authorName: 'Ena Saito',
        authorMemberId: '#YCJ-005',
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ena&backgroundColor=a855f7',
        comment: 'Rasanya seger banget, apalagi kalau ditambah sedikit perasan jeruk nipis.',
        createdAt: '10 Oktober 2026'
      }
    ]
  },
  {
    id: 'rec-04',
    title: 'Pour-Over Drip Coffee Fajar Pinus',
    japaneseName: 'Asa No Dorippu Kohi (朝のドリップ珈琲)',
    prepTime: '3 Menit',
    cookTime: '4 Menit',
    difficulty: 'Mudah',
    authorName: 'Rony Bimawan',
    authorMemberId: '#YCJ-DEV-001',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rony&backgroundColor=0284c7',
    description: 'Ritual wajib pagi hari di Yuru Camp. Aroma biji kopi Jawa Barat (Gunung Puntang / Malabar) yang diseduh di udara dingin 15°C.',
    ingredients: [
      '15 gram biji kopi gilingan medium-coarse',
      'Dripper lipat silikon atau kertas filter V60',
      '225 ml air mineral panas (suhu sekitar 90°C)',
      'Mug ganda dinding (double wall) favorit'
    ],
    steps: [
      'Rebus air di teko leher angsa camp hingga mendidih, lalu diamkan 45 detik agar suhu turun ke 90°C.',
      'Pasang dripper di atas mug, masukkan kertas saring, dan bilas sebentar dengan air panas.',
      'Masukkan bubuk kopi, ratakan permukaannya.',
      'Lakukan blooming: tuang 40 ml air memutar perlahan, tunggu 30 detik hingga kopi mengembang melepaskan aroma harum.',
      'Lanjutkan tuang sisa air dalam 2 tahap secara perlahan searah jarum jam.',
      'Angkat dripper, nikmati tegukan pertama sambil menyambut fajar emas di balik bukit.'
    ],
    yuruTip: 'Gunakan air mineral asli pegunungan untuk mendapatkan rasa manis alami kopi yang lebih terasa.',
    comments: [
      {
        id: 'rc-05',
        authorName: 'Budi Santoso',
        authorMemberId: '#YCJ-018',
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Budi&backgroundColor=84cc16',
        comment: 'Dripper lipat silikon emang paling praktis buat solo camp, hemat tempat di ransel!',
        createdAt: '11 Oktober 2026'
      }
    ]
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-01',
    name: 'Rony Bimawan',
    role: 'Lead Developer & Community Founder',
    division: 'Teknologi & Kepengurusan Inti',
    domisili: 'Jakarta Selatan',
    yuruMotto: '"Kemping itu bukan ajang adu mahal gear, tapi soal menemukan ketenangan di antara ranting dan kabut."',
    avatarBg: 'bg-sky-500',
    social: '@ronybimawan'
  },
  {
    id: 'team-02',
    name: 'Dimas Aditya',
    role: 'Safety & Field Logistics Officer',
    division: 'Operasional Lapangan & Manajemen Resiko',
    domisili: 'Bogor',
    yuruMotto: '"Selalu periksa pasak dan ramalan cuaca sebelum tidur. Keselamatan adalah tiket pulang kita."',
    avatarBg: 'bg-amber-500',
    social: '@dimas.outdoors'
  },
  {
    id: 'team-03',
    name: 'Siti Sarah (Sara)',
    role: 'Camp Chef & Culinary Coordinator',
    division: 'Edukasi Kuliner & Nutrisi Outdoor',
    domisili: 'Depok',
    yuruMotto: '"Makanan hangat di udara dingin punya rasa sepuluh kali lebih lezat dari resto bintang lima."',
    avatarBg: 'bg-emerald-500',
    social: '@sara.campcooking'
  },
  {
    id: 'team-04',
    name: 'Fauzan Pratama',
    role: 'Media & Documentation Lead',
    division: 'Dokumentasi & Relasi Komunitas',
    domisili: 'Tangerang',
    yuruMotto: '"Abadikan momen tanpa merusak alam. Leave nothing but footprints, take nothing but photos."',
    avatarBg: 'bg-indigo-500',
    social: '@fauzan_camper'
  }
];

export const MEMBER_SPOTLIGHTS: MemberSpotlight[] = [
  {
    id: 'spot-lead-dev',
    memberId: '#YCJ-DEV-001',
    name: 'Rony Bimawan',
    email: 'ronybimawan2542@gmail.com',
    domisili: 'Jakarta Selatan',
    roleTitle: 'Lead Developer & App Creator',
    jabatanCategory: 'lead_dev',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=RonyLeadDev&backgroundColor=0284c7',
    joinedSince: 'November 2023'
  },
  {
    id: 'spot-01',
    memberId: '#YCJ-004',
    name: 'Anisa Rahmawati',
    domisili: 'Bekasi Timur',
    roleTitle: 'Anggota Resmi',
    jabatanCategory: 'anggota',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    joinedSince: 'Januari 2024'
  },
  {
    id: 'spot-02',
    memberId: '#YCJ-018',
    name: 'Budi Santoso',
    domisili: 'Tangerang Selatan',
    roleTitle: 'Anggota Resmi (Family Camp)',
    jabatanCategory: 'anggota',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    joinedSince: 'Maret 2024'
  },
  {
    id: 'spot-03',
    memberId: '#YCJ-042',
    name: 'Naufal Ikhsan',
    domisili: 'Jakarta Barat',
    roleTitle: 'Koordinator Perlengkapan & Kopi',
    jabatanCategory: 'pengurus',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    joinedSince: 'Mei 2024'
  },
  {
    id: 'spot-04',
    memberId: '#YCJ-051',
    name: 'Rizky Ramadhan',
    domisili: 'Bogor Kota',
    roleTitle: 'Pemandu Jalur Salak & Cibodas',
    jabatanCategory: 'pengurus',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    joinedSince: 'Juni 2024'
  },
  {
    id: 'spot-05',
    memberId: '#YCJ-063',
    name: 'Siti Fatimah',
    domisili: 'Depok',
    roleTitle: 'Anggota Resmi (Solo Camper)',
    jabatanCategory: 'anggota',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    joinedSince: 'Juli 2024'
  },
  {
    id: 'spot-06',
    memberId: '#YCJ-077',
    name: 'Arya Wicaksono',
    domisili: 'Jakarta Selatan',
    roleTitle: 'Anggota Resmi',
    jabatanCategory: 'anggota',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    joinedSince: 'Agustus 2024'
  },
  {
    id: 'spot-07',
    memberId: '#YCJ-085',
    name: 'Nadya Amanda',
    domisili: 'Tangerang Kota',
    roleTitle: 'Anggota Resmi (Solo Camper)',
    jabatanCategory: 'anggota',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    joinedSince: 'September 2024'
  },
  {
    id: 'spot-08',
    memberId: '#YCJ-092',
    name: 'Denny Setiawan',
    domisili: 'Cibinong, Kab. Bogor',
    roleTitle: 'Anggota Resmi',
    jabatanCategory: 'anggota',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    joinedSince: 'Oktober 2024'
  },
  {
    id: 'spot-09',
    memberId: '#YCJ-104',
    name: 'Maya Puspitasari',
    domisili: 'Bekasi Barat',
    roleTitle: 'Anggota Resmi',
    jabatanCategory: 'anggota',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    joinedSince: 'November 2024'
  },
  {
    id: 'spot-10',
    memberId: '#YCJ-115',
    name: 'Farhan Maulana',
    domisili: 'Jakarta Timur',
    roleTitle: 'Anggota Resmi',
    jabatanCategory: 'anggota',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    joinedSince: 'Desember 2024'
  },
  {
    id: 'spot-11',
    memberId: '#YCJ-126',
    name: 'Gita Anggraini',
    domisili: 'Jakarta Pusat',
    roleTitle: 'Anggota Resmi',
    jabatanCategory: 'anggota',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80',
    joinedSince: 'Januari 2025'
  },
  {
    id: 'spot-12',
    memberId: '#YCJ-139',
    name: 'Kevin Pratama',
    domisili: 'Depok Baru',
    roleTitle: 'Anggota Resmi',
    jabatanCategory: 'anggota',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    joinedSince: 'Februari 2025'
  },
  {
    id: 'spot-13',
    memberId: '#YCJ-148',
    name: 'Dian Kusuma',
    domisili: 'Ciputat, Tangsel',
    roleTitle: 'Anggota Resmi (Solo Camper)',
    jabatanCategory: 'anggota',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    joinedSince: 'Maret 2025'
  },
  {
    id: 'spot-14',
    memberId: '#YCJ-155',
    name: 'Reza Firmansyah',
    domisili: 'Cikarang, Bekasi',
    roleTitle: 'Anggota Resmi',
    jabatanCategory: 'anggota',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    joinedSince: 'April 2025'
  },
  {
    id: 'spot-15',
    memberId: '#YCJ-162',
    name: 'Aditya Pratama',
    domisili: 'Sentul, Bogor',
    roleTitle: 'Anggota Resmi',
    jabatanCategory: 'anggota',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    joinedSince: 'Mei 2025'
  },
  {
    id: 'spot-16',
    memberId: '#YCJ-173',
    name: 'Fajar Nugroho',
    domisili: 'Bogor Selatan',
    roleTitle: 'Anggota Resmi (Solo Camper)',
    jabatanCategory: 'anggota',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80',
    joinedSince: 'Juni 2025'
  }
];

export const INITIAL_APPLICATIONS: MembershipApplication[] = [
  {
    id: 'app-001',
    name: 'Hendra Gunawan',
    email: 'hendra.gunawan99@gmail.com',
    domisili: 'Bogor Barat',
    phone: '081312345678',
    experienceLevel: '1 - 3 kali camp',
    campingStyle: 'Solo Camping Santai',
    socialMedia: '@hendra.outdoors',
    tentBrand: 'Mobi Garden Light Knight',
    reason: 'Ingin cari teman kemping santai akhir pekan yang sehobi dan bisa diajak sharing etika alam bebas.',
    status: 'approved',
    submittedAt: '02 Oktober 2026'
  },
  {
    id: 'app-002',
    name: 'Putri Dwi Astuti',
    email: 'putri.astuti@gmail.com',
    domisili: 'Jakarta Timur',
    phone: '085798765432',
    experienceLevel: 'Pemula (Belum pernah camp)',
    campingStyle: 'Group Camping Bersama',
    socialMedia: '@putridwi_',
    tentBrand: 'Belum punya (ingin sewa dahulu)',
    reason: 'Suka nonton anime Yuru Camp dan ingin mencoba langsung rasanya tidur di tenda dan masak sup hangat di Cibodas.',
    status: 'pending',
    submittedAt: '09 Oktober 2026'
  }
];

export const INITIAL_COMMUNITY_EVENT_PHOTOS: CommunityEventPhoto[] = [
  {
    id: 'cep-01',
    eventId: 'ycj-evt-01',
    eventTitle: 'Mandalawangi Autumn Chill Camp 2026',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1000&auto=format&fit=crop&q=80',
    caption: 'Deretan tenda dome di tepi danau buatan Mandalawangi Cibodas berselimut kabut senja 15°C.',
    location: 'Bumi Perkemahan Mandalawangi, Cibodas',
    region: 'Cibodas',
    date: '24 Oktober 2026',
    photographer: 'Fauzan Pratama (Dokumentasi Inti)',
    uploadedByAdminEmail: 'ronybimawan2542@gmail.com',
    likesCount: 38
  },
  {
    id: 'cep-02',
    eventId: 'ycj-evt-01',
    eventTitle: 'Mandalawangi Autumn Chill Camp 2026',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cbdaf?w=1000&auto=format&fit=crop&q=80',
    caption: 'Campfire komunal malam hari dan sesi berbagi cerita solo camp antar member se-Jabodetabek.',
    location: 'Mandalawangi Pine Forest, Cianjur',
    region: 'Cibodas',
    date: '24 Oktober 2026',
    photographer: 'Dimas Aditya',
    uploadedByAdminEmail: 'ronybimawan2542@gmail.com',
    likesCount: 45
  },
  {
    id: 'cep-03',
    eventId: 'past-01',
    eventTitle: 'Sukamantri Starry Night & Citylight',
    imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1000&auto=format&fit=crop&q=80',
    caption: 'Panorama gemerlap lampu kota Bogor (citylight) dari ketinggian 850 mdpl Gunung Salak.',
    location: 'Buper Sukamantri, Taman Nasional Halimun Salak',
    region: 'Bogor',
    date: '19 September 2026',
    photographer: 'Fauzan Pratama',
    uploadedByAdminEmail: 'ronybimawan2542@gmail.com',
    likesCount: 52
  },
  {
    id: 'cep-04',
    eventId: 'past-02',
    eventTitle: 'Telaga Saat Sunrise & Morning Mist',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1000&auto=format&fit=crop&q=80',
    caption: 'Menikmati fajar emas yang perlahan menyibak kabut tebal di atas hamparan danau kebun teh Puncak.',
    location: 'Telaga Saat, Cisarua, Puncak',
    region: 'Puncak',
    date: '29 Agustus 2026',
    photographer: 'Rony Bimawan (Lead Dev)',
    uploadedByAdminEmail: 'ronybimawan2542@gmail.com',
    likesCount: 67
  },
  {
    id: 'cep-05',
    eventId: 'ycj-evt-02',
    eventTitle: 'Pondok Halimun Riverside Camp',
    imageUrl: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=1000&auto=format&fit=crop&q=80',
    caption: 'Sesi memasak bersama ala Yuru Camp: cast iron toastie dan sup dango hangat di tepi sungai berbatu.',
    location: 'Pondok Halimun, Sukabumi',
    region: 'Sukabumi',
    date: '07 November 2026',
    photographer: 'Siti Sarah (Camp Chef)',
    uploadedByAdminEmail: 'ronybimawan2542@gmail.com',
    likesCount: 29
  },
  {
    id: 'cep-06',
    eventId: 'ycj-evt-03',
    eventTitle: 'Gunung Pancar Pine Forest Solo & Duo',
    imageUrl: 'https://images.unsplash.com/photo-1496545672447-f699b503d270?w=1000&auto=format&fit=crop&q=80',
    caption: 'Kanopi pohon pinus yang rapat memberikan keteduhan alami untuk santai akhir pekan tanpa perjalanan jauh.',
    location: 'TWA Gunung Pancar, Sentul Selatan',
    region: 'Sentul',
    date: '21 November 2026',
    photographer: 'Fauzan Pratama',
    uploadedByAdminEmail: 'ronybimawan2542@gmail.com',
    likesCount: 34
  }
];

export const INITIAL_SOLO_CAMP_STORIES: SoloCampStory[] = [
  {
    id: 'scs-01',
    title: 'Malam Hening & Ritual Seduh Kopi Fajar di Sudut Rahasia Cibodas',
    memberName: 'Rin Shima',
    memberEmail: 'rin.shima.guest@gmail.com',
    memberId: '#YCJ-001',
    memberAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RinCamp&backgroundColor=38bdf8',
    location: 'Sudut Danau Mandalawangi, Cibodas',
    region: 'Cibodas',
    altitude: '1.275 mdpl',
    tentGear: 'Naturehike Cloud Up 1 (Ultralight) + Kompor Canister BRS-3000T',
    date: '04 Oktober 2026',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1000&auto=format&fit=crop&q=80',
    story: 'Kenapa saya lebih menyukai solo camp? Karena di tengah kesunyian tanpa kebisingan kota, kita bisa benar-benar mendengarkan desau angin di antara jarum pinus dan bunyi gemericik air mendidih. Awalnya ada rasa cemas saat kabut tebal turun sekitar pukul 17.30 dan suhu merosot ke 14°C. Tapi begitu lampu lentera gantung dinyalakan dan semangkuk ramen kari panas selesai dimasak, rasa takut itu berganti dengan rasa damai yang tak bisa dibeli di mana pun. Tidur di dalam sleeping bag dengan suara rintik gerimis tipis adalah terapi terbaik.',
    soloTips: 'Bawa matras foil aluminium berkualitas sebagai isolator dingin tanah, headlamp dengan baterai cadangan, dan satu novel fisik tebal untuk menemani malam tanpa sinyal.',
    likesCount: 42,
    createdAt: '05 Oktober 2026'
  },
  {
    id: 'scs-02',
    title: 'Mengatasi Rasa Cemas Pertama Kali Solo Camp di Kaki Gunung Salak',
    memberName: 'Budi Santoso',
    memberEmail: 'budi.santoso@gmail.com',
    memberId: '#YCJ-018',
    memberAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=BudiCamp&backgroundColor=f59e0b',
    location: 'Buper Sukamantri, Ciapus Bogor',
    region: 'Bogor',
    altitude: '850 mdpl',
    tentGear: 'Tenda Dome 2P Frame Alloy + Flysheet Tarp 3x3m',
    date: '18 September 2026',
    imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1000&auto=format&fit=crop&q=80',
    story: 'Selama ini saya selalu kemping beramai-ramai dengan teman kantor. Kali ini saya memberanikan diri mencoba solo camp di Sukamantri untuk pertama kali. Di awal malam, suara ranting patah atau hembusan angin sempat membuat kaget. Namun setelah menyalakan kompor, memanggang roti isi keju dengan hot sand maker, dan melihat pemandangan lampu kota Bogor yang gemerlap di kejauhan, saya sadar betapa berharganya waktu berbincang dengan diri sendiri.',
    soloTips: 'Untuk pemula yang baru pertama kali solo camp, pilih bumi perkemahan resmi yang memiliki pos penjaga/warga 24 jam dan pasang tenda tidak terlalu jauh dari titik kumpul darurat.',
    likesCount: 35,
    createdAt: '20 September 2026'
  },
  {
    id: 'scs-03',
    title: 'Solo Motorcamp Santai Melipir ke Kebun Teh Pondok Halimun',
    memberName: 'Naufal Ikhsan',
    memberEmail: 'naufal.ikhsan@gmail.com',
    memberId: '#YCJ-042',
    memberAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=NaufalCamp&backgroundColor=0284c7',
    location: 'Pondok Halimun, Sukabumi',
    region: 'Sukabumi',
    altitude: '1.150 mdpl',
    tentGear: 'A-Frame Canvas Single Pole + Kompor Trangia Spiritus',
    date: '28 Agustus 2026',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cbdaf?w=1000&auto=format&fit=crop&q=80',
    story: 'Sabtu pagi gas motor matic dari Jakarta Selatan lewat jalur Cijeruk - Sukabumi. Bawa ransel 45L dan drybag di behel belakang. Tiba sore di tepi sungai Pondok Halimun, mendirikan tenda dekat aliran air jernih. Memasak sup tahu dan daging iris sederhana, lalu menyeduh kopi filter sambil meresapi udara sejuk 16°C. Bangun pagi disambut kabut tipis di pucuk-pucuk daun teh. Ini adalah definisi liburan hemat energi dan menyegarkan jiwa.',
    soloTips: 'Pastikan motor dalam kondisi prima (rem dan ban), ikat tas dengan tali strap ratchet kokoh, dan jangan membawa gear yang tidak esensial agar motor tetap lincah.',
    likesCount: 56,
    createdAt: '30 Agustus 2026'
  }
];

export const INITIAL_GEAR_REVIEWS: GearReview[] = [
  {
    id: 'gr-01',
    gearName: 'Naturehike Cloud Up 2 Ultralight Upgrade (210T)',
    brand: 'Naturehike',
    category: 'Tenda & Tidur',
    rating: 5,
    weightEst: '1.8 kg',
    priceEst: 'Rp 980.000',
    pros: [
      'Sangat ringan & compact masuk ransel 40L',
      'Frame aluminium 7001 kokoh menahan angin Mandalawangi',
      'Sudah include footprint pelindung lantai tenda'
    ],
    cons: [
      'Vestibule/teras depan agak sempit jika bawa tas besar',
      'Agak pas-pasan jika diisi 2 orang berbadan besar'
    ],
    reviewText: 'Sudah saya pakai lebih dari 8 kali camp di Mandalawangi Cibodas dan Sukamantri. Di cuaca hujan deras berangin semalaman, tenda tetap 100% kering tanpa rembes (kondensasi minimal karena ada ventilasi belakang). Pemasangan juga super cepat, sekitar 4 menit sendirian.',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80',
    authorName: 'Rin Shima',
    authorEmail: 'rin.shima.guest@gmail.com',
    authorMemberId: '#YCJ-001',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RinCamp&backgroundColor=38bdf8',
    createdAt: '02 Oktober 2026',
    comments: [
      {
        id: 'grc-01',
        authorName: 'Budi Santoso',
        authorMemberId: '#YCJ-018',
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=BudiCamp&backgroundColor=f59e0b',
        comment: 'Kuat nahan angin kencang gak kak kalau pasang di puncak bukit terbuka?',
        createdAt: '03 Oktober 2026'
      },
      {
        id: 'grc-02',
        authorName: 'Rin Shima',
        authorMemberId: '#YCJ-001',
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RinCamp&backgroundColor=38bdf8',
        comment: 'Kuat banget asalkan guyline (tali pengencang badai) dipasang semua dan pasak ditancapkan miring 45 derajat!',
        createdAt: '03 Oktober 2026'
      }
    ]
  },
  {
    id: 'gr-02',
    gearName: 'Kompor Ultralight BRS-3000T Titanium Mini Canister',
    brand: 'BRS',
    category: 'Masak & Kuliner',
    rating: 5,
    weightEst: '25 gram',
    priceEst: 'Rp 145.000',
    pros: [
      'Beratnya cuma 25 gram, muat di saku celana',
      'Api biru fokus dan cepat mendidihkan 500ml air (kurang dari 3 menit)',
      'Bahan titanium awet dan tahan karat'
    ],
    cons: [
      'Penampang kaki tungku agak kecil, kurang stabil untuk panci lebar di atas 1 liter',
      'Sensitif terhadap tiupan angin samping (butuh wind guard)'
    ],
    reviewText: 'Kompor legendaris wajib para solo camper ultralight. Dipasangkan dengan nesting mug titanium 750ml, kita bisa langsung rebus air kopi atau masak ramen instan di mana saja tanpa beban di punggung.',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cbdaf?w=800&auto=format&fit=crop&q=80',
    authorName: 'Dimas Aditya',
    authorEmail: 'dimas.aditya@gmail.com',
    authorMemberId: '#YCJ-ADM-102',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dimas&backgroundColor=0284c7',
    createdAt: '05 Oktober 2026',
    comments: [
      {
        id: 'grc-03',
        authorName: 'Naufal Ikhsan',
        authorMemberId: '#YCJ-042',
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=NaufalCamp&backgroundColor=0284c7',
        comment: 'Bisa pakai gas tabung kaleng mini yang biasa dijual di minimarket gak bang?',
        createdAt: '06 Oktober 2026'
      },
      {
        id: 'grc-04',
        authorName: 'Dimas Aditya',
        authorMemberId: '#YCJ-ADM-102',
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dimas&backgroundColor=0284c7',
        comment: 'Bisa banget! Cukup beli adaptor kompor ulir ke gas kaleng seharga 15 ribuan.',
        createdAt: '06 Oktober 2026'
      }
    ]
  },
  {
    id: 'gr-03',
    gearName: 'Matras Foil Thermal Aluminium Eva Foam 8mm',
    brand: 'WildPeak Outdoor',
    category: 'Tenda & Tidur',
    rating: 4,
    weightEst: '280 gram',
    priceEst: 'Rp 45.000',
    pros: [
      'Harga sangat terjangkau',
      'Efektif memblokir hawa dingin tanah 14°C',
      'Tahan air dan mudah dibersihkan dari lumpur'
    ],
    cons: [
      'Ukuran lipatan/gulungan cukup memakan ruang di luar ransel'
    ],
    reviewText: 'Gear murah meriah tapi penyelamat tidur pulas! Seringkali orang kedinginan di tenda bukan karena sleeping bag-nya jelek, tapi karena tanah menyerap panas tubuh tanpa isolator foil. Selalu alasi lantai tenda dengan matras ini.',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80',
    authorName: 'Rony Bimawan',
    authorEmail: 'ronybimawan2542@gmail.com',
    authorMemberId: '#YCJ-DEV-001',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rony&backgroundColor=0284c7',
    createdAt: '08 Oktober 2026',
    comments: [
      {
        id: 'grc-05',
        authorName: 'Siti Sarah',
        authorMemberId: '#YCJ-021',
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Siti&backgroundColor=ec4899',
        comment: 'Setuju banget, kemping di Telaga Saat dinginnya tembus kalau gak pakai matras foil ini!',
        createdAt: '09 Oktober 2026'
      }
    ]
  }
];
