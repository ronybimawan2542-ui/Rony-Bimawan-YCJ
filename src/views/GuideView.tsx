import React, { useState } from 'react';
import { useCamp } from '../context/CampContext';
import { useAuth } from '../context/AuthContext';
import { GEAR_CHECKLIST } from '../data/mockData';
import { YuruRecipe, GearReview } from '../types';
import { CampIllustration } from '../components/CampIllustration';
import { ImageUploadPicker } from '../components/ImageUploadPicker';
import { 
  CheckSquare, 
  Square, 
  Flame, 
  Coffee, 
  Compass, 
  TreePine, 
  ShieldCheck, 
  RotateCcw, 
  BookOpen, 
  Utensils, 
  Tent,
  MessageSquare,
  Send,
  Plus,
  Star,
  Search,
  X,
  Check,
  AlertTriangle,
  Trash2,
  Clock,
  Sparkles,
  Tag,
  ThumbsUp,
  Image as ImageIcon
} from 'lucide-react';

// Image Presets for Quick Upload
const RECIPE_IMAGE_PRESETS = [
  { label: '🍜 Curry Ramen', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80' },
  { label: '🥪 Hot Sandwich', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80' },
  { label: '🍚 Nasi Liwet', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80' },
  { label: '🍢 Sosis Panggang', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80' },
  { label: '🍲 Sup Hangat', url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80' },
  { label: '☕ Kopi V60 Camp', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80' }
];

const GEAR_IMAGE_PRESETS = [
  { label: '⛺ Tenda Dome Ultralight', url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80' },
  { label: '🔥 Kompor Mini Titanium', url: 'https://images.unsplash.com/photo-1508873696983-2df5293cbdaf?w=800&auto=format&fit=crop&q=80' },
  { label: '🛌 Matras & Sleeping Bag', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80' },
  { label: '🍳 Nesting Cookset', url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&auto=format&fit=crop&q=80' },
  { label: '💡 Lampu Lentera Camp', url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&auto=format&fit=crop&q=80' },
  { label: '🎒 Ransel Carrier 50L', url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop&q=80' }
];

export const GuideView: React.FC = () => {
  const { 
    checkedGearIds, 
    toggleGearCheck, 
    resetGearCheck, 
    recipes, 
    addRecipe, 
    addRecipeComment, 
    deleteRecipe,
    gearReviews,
    addGearReview,
    addGearReviewComment,
    deleteGearReview
  } = useCamp();
  const { user, isLoggedIn, isAdmin, setLoginWithGoogleModal } = useAuth();

  const [activeGuideTab, setActiveGuideTab] = useState<'checklist' | 'tenda' | 'etika' | 'resep' | 'review'>('checklist');

  // Search & Filter for Recipes
  const [recipeSearch, setRecipeSearch] = useState('');
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [recipeChatInputs, setRecipeChatInputs] = useState<Record<string, string>>({});

  // New Recipe Form State
  const [recipeForm, setRecipeForm] = useState({
    title: '',
    japaneseName: '',
    prepTime: '5 Menit',
    cookTime: '10 Menit',
    difficulty: 'Sangat Mudah' as 'Sangat Mudah' | 'Mudah' | 'Sedang',
    description: '',
    ingredientsText: '',
    stepsText: '',
    yuruTip: '',
    imageUrl: '',
    authorCustomName: ''
  });

  // Search & Filter for Gear Reviews
  const [gearSearch, setGearSearch] = useState('');
  const [selectedGearCategory, setSelectedGearCategory] = useState<string>('all');
  const [showAddGearReviewModal, setShowAddGearReviewModal] = useState(false);
  const [gearChatInputs, setGearChatInputs] = useState<Record<string, string>>({});

  // New Gear Review Form State
  const [gearForm, setGearForm] = useState({
    gearName: '',
    brand: '',
    category: 'Tenda & Tidur' as GearReview['category'],
    rating: 5,
    weightEst: '',
    priceEst: '',
    prosText: '',
    consText: '',
    reviewText: '',
    imageUrl: '',
    authorCustomName: ''
  });

  const totalGearCount = GEAR_CHECKLIST.length;
  const checkedCount = checkedGearIds.size;
  const progressPercent = Math.round((checkedCount / totalGearCount) * 100);

  // Categories for checklist
  const categories: Array<'Tenda & Tidur' | 'Masak & Kuliner' | 'Pakaian & Proteksi' | 'Safety & Navigasi'> = [
    'Tenda & Tidur',
    'Masak & Kuliner',
    'Pakaian & Proteksi',
    'Safety & Navigasi'
  ];

  const gearCategories = [
    'all',
    'Tenda & Tidur',
    'Masak & Kuliner',
    'Pakaian & Proteksi',
    'Safety & Navigasi',
    'Lainnya'
  ];

  // Filtered recipes
  const filteredRecipes = recipes.filter(r => {
    if (!recipeSearch.trim()) return true;
    const q = recipeSearch.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.japaneseName.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      (r.authorName && r.authorName.toLowerCase().includes(q))
    );
  });

  // Filtered gear reviews
  const filteredGearReviews = gearReviews.filter(g => {
    const matchCat = selectedGearCategory === 'all' || g.category === selectedGearCategory;
    if (!gearSearch.trim()) return matchCat;
    const q = gearSearch.toLowerCase();
    const matchQuery =
      g.gearName.toLowerCase().includes(q) ||
      g.brand.toLowerCase().includes(q) ||
      g.reviewText.toLowerCase().includes(q) ||
      g.authorName.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  const handleRecipeCommentSubmit = (recipeId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = (recipeChatInputs[recipeId] || '').trim();
    if (!text) return;

    const authorName = isLoggedIn && user ? user.name : 'Sahabat Camper';
    const authorEmail = isLoggedIn && user ? user.email : 'camper@yurucamp.id';
    const authorAvatar = isLoggedIn && user ? user.avatar : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(text.slice(0, 10))}&backgroundColor=38bdf8`;
    const authorMemberId = isLoggedIn && user ? (user.memberId || '#Member') : '#TamuCamp';

    addRecipeComment(recipeId, {
      authorName,
      authorEmail,
      authorAvatar,
      authorMemberId,
      comment: text
    });

    setRecipeChatInputs(prev => ({ ...prev, [recipeId]: '' }));
  };

  const handleGearCommentSubmit = (gearReviewId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = (gearChatInputs[gearReviewId] || '').trim();
    if (!text) return;

    const authorName = isLoggedIn && user ? user.name : 'Sahabat Camper';
    const authorEmail = isLoggedIn && user ? user.email : 'camper@yurucamp.id';
    const authorAvatar = isLoggedIn && user ? user.avatar : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(text.slice(0, 10))}&backgroundColor=0284c7`;
    const authorMemberId = isLoggedIn && user ? (user.memberId || '#Member') : '#TamuCamp';

    addGearReviewComment(gearReviewId, {
      authorName,
      authorEmail,
      authorAvatar,
      authorMemberId,
      comment: text
    });

    setGearChatInputs(prev => ({ ...prev, [gearReviewId]: '' }));
  };

  const handleCreateRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeForm.title.trim()) return;

    const ingredients = recipeForm.ingredientsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    const steps = recipeForm.stepsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const authorName = isLoggedIn && user ? user.name : (recipeForm.authorCustomName.trim() || 'Sahabat Camper');
    const authorEmail = isLoggedIn && user ? user.email : 'member@yurucamp.id';
    const authorAvatar = isLoggedIn && user ? user.avatar : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName)}&backgroundColor=f59e0b`;
    const authorMemberId = isLoggedIn && user ? (user.memberId || '#Member') : `#YCJ-M-${Math.floor(100 + Math.random() * 900)}`;

    addRecipe({
      title: recipeForm.title.trim(),
      japaneseName: recipeForm.japaneseName.trim() || 'Outdoor Camp Meal',
      prepTime: recipeForm.prepTime.trim() || '5 Menit',
      cookTime: recipeForm.cookTime.trim() || '10 Menit',
      difficulty: recipeForm.difficulty,
      description: recipeForm.description.trim() || 'Kreasi masakan outdoor lezat dari member Yuru Camp.',
      ingredients: ingredients.length > 0 ? ingredients : ['Bahan sesuai selera'],
      steps: steps.length > 0 ? steps : ['Masak hingga matang dan sajikan hangat.'],
      yuruTip: recipeForm.yuruTip.trim() || 'Nikmati selagi hangat di samping api unggun!',
      imageUrl: recipeForm.imageUrl.trim() || undefined,
      authorName,
      authorEmail,
      authorAvatar,
      authorMemberId
    });

    setRecipeForm({
      title: '',
      japaneseName: '',
      prepTime: '5 Menit',
      cookTime: '10 Menit',
      difficulty: 'Sangat Mudah',
      description: '',
      ingredientsText: '',
      stepsText: '',
      yuruTip: '',
      imageUrl: '',
      authorCustomName: ''
    });
    setShowAddRecipeModal(false);
  };

  const handleCreateGearReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gearForm.gearName.trim() || !gearForm.reviewText.trim()) return;

    const pros = gearForm.prosText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    const cons = gearForm.consText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const authorName = isLoggedIn && user ? user.name : (gearForm.authorCustomName.trim() || 'Sahabat Camper');
    const authorEmail = isLoggedIn && user ? user.email : 'member@yurucamp.id';
    const authorAvatar = isLoggedIn && user ? user.avatar : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName)}&backgroundColor=0284c7`;
    const authorMemberId = isLoggedIn && user ? (user.memberId || '#Member') : `#YCJ-M-${Math.floor(100 + Math.random() * 900)}`;

    addGearReview({
      gearName: gearForm.gearName.trim(),
      brand: gearForm.brand.trim() || 'Umum',
      category: gearForm.category,
      rating: gearForm.rating,
      weightEst: gearForm.weightEst.trim() || undefined,
      priceEst: gearForm.priceEst.trim() || undefined,
      pros: pros.length > 0 ? pros : ['Fungsional & praktis'],
      cons: cons.length > 0 ? cons : ['Perlu perawatan rutin'],
      reviewText: gearForm.reviewText.trim(),
      imageUrl: gearForm.imageUrl.trim() || undefined,
      authorName,
      authorEmail,
      authorAvatar,
      authorMemberId
    });

    setGearForm({
      gearName: '',
      brand: '',
      category: 'Tenda & Tidur',
      rating: 5,
      weightEst: '',
      priceEst: '',
      prosText: '',
      consText: '',
      reviewText: '',
      imageUrl: '',
      authorCustomName: ''
    });
    setShowAddGearReviewModal(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
              Panduan Praktis, Kuliner & Review Gear
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Buku Saku Berkemah Yuru Camp
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Panduan mendirikan tenda, checklist peralatan, etika Leave No Trace, resep masakan outdoor member dengan kolom chat, dan review gear camping bersama.
            </p>
          </div>

          {/* Navigation Segments */}
          <div className="flex p-1.5 bg-neutral-100 rounded-2xl border-2 border-slate-900 overflow-x-auto scrollbar-none gap-1">
            <button
              onClick={() => setActiveGuideTab('checklist')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
                activeGuideTab === 'checklist' ? 'bg-amber-500 text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Checklist Gear ({checkedCount}/{totalGearCount})
            </button>
            <button
              onClick={() => setActiveGuideTab('tenda')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
                activeGuideTab === 'tenda' ? 'bg-amber-500 text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tutorial Tenda
            </button>
            <button
              onClick={() => setActiveGuideTab('etika')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
                activeGuideTab === 'etika' ? 'bg-amber-500 text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Etika No-Trace
            </button>
            <button
              onClick={() => setActiveGuideTab('resep')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeGuideTab === 'resep' ? 'bg-amber-500 text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Resep Masak ({recipes.length})</span>
            </button>
            <button
              onClick={() => setActiveGuideTab('review')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeGuideTab === 'review' ? 'bg-amber-500 text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tent className="w-3.5 h-3.5" />
              <span>Review Gear ({gearReviews.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2 KARTU SOROTAN UTAMA FITUR: RESEP MASAK OUTDOOR & REVIEW GEAR CAMPING MEMBER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fitur 1: Resep Masak Outdoor Member */}
        <div 
          onClick={() => setActiveGuideTab('resep')}
          className={`cursor-pointer p-5 rounded-3xl border-2 border-slate-900 transition-all ${
            activeGuideTab === 'resep' 
              ? 'bg-amber-100 shadow-[6px_6px_0px_0px_#f59e0b]' 
              : 'bg-white hover:bg-amber-50 shadow-[4px_4px_0px_0px_#0f172a]'
          } flex flex-col justify-between gap-4`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 border-2 border-slate-900 font-bold shadow-xs">
                  <Utensils className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide block">
                    Kuliner Camp Komunal
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Resep Masak Outdoor Member
                  </h2>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl bg-amber-200/90 text-amber-900 border border-amber-300">
                {recipes.length} Resep
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              Tiap member bisa mengupload resep masakan camping mereka sendiri dan berdiskusi langsung di kolom chat interaktif setiap resep!
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-amber-800">
              {activeGuideTab === 'resep' ? '● Sedang Dibuka' : 'Klik untuk Buka Resep →'}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveGuideTab('resep');
                setShowAddRecipeModal(true);
              }}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-extrabold rounded-xl border-2 border-slate-900 shadow-xs flex items-center gap-1.5 transition-transform active:translate-y-0.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Resep Kamu</span>
            </button>
          </div>
        </div>

        {/* Fitur 2: Review Gear Camping Member */}
        <div 
          onClick={() => setActiveGuideTab('review')}
          className={`cursor-pointer p-5 rounded-3xl border-2 border-slate-900 transition-all ${
            activeGuideTab === 'review' 
              ? 'bg-sky-100 shadow-[6px_6px_0px_0px_#0284c7]' 
              : 'bg-white hover:bg-sky-50 shadow-[4px_4px_0px_0px_#0f172a]'
          } flex flex-col justify-between gap-4`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2.5 rounded-2xl bg-sky-500 text-white border-2 border-slate-900 font-bold shadow-xs">
                  <Tent className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wide block">
                    Ulasan Jujur Sahabat Outdoor
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Review Gear Camping Member
                  </h2>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl bg-sky-200/90 text-sky-900 border border-sky-300">
                {gearReviews.length} Ulasan
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              Tiap member bisa mengupload review gear camping yang dimiliki, lengkap dengan rating, pros & cons, dan kolom chat tanya jawab!
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-sky-800">
              {activeGuideTab === 'review' ? '● Sedang Dibuka' : 'Klik untuk Buka Review →'}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveGuideTab('review');
                setShowAddGearReviewModal(true);
              }}
              className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-extrabold rounded-xl border-2 border-slate-900 shadow-xs flex items-center gap-1.5 transition-transform active:translate-y-0.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Review Gear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Interactive Checklist */}
      {activeGuideTab === 'checklist' && (
        <div className="space-y-6">
          {/* Progress Header Card */}
          <div className="bg-sky-50 rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Kesiapan Perlengkapan Kemping Kamu
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Centang gear yang sudah masuk ke ransel atau bagasi motor/mobilmu. Tersimpan otomatis di browsermu!
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-right">
                  <div className="text-xl font-black font-mono text-sky-900">{progressPercent}%</div>
                  <div className="text-[10px] text-slate-500">{checkedCount} dari {totalGearCount} Siap</div>
                </div>
                <button
                  onClick={resetGearCheck}
                  className="p-2.5 bg-white hover:bg-neutral-100 rounded-xl border-2 border-slate-900 text-slate-700 transition-colors"
                  title="Reset Semua Centang"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="w-full h-3 bg-white rounded-full overflow-hidden border-2 border-slate-900 mt-4">
              <div className="h-full bg-amber-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {/* Categorized Checklist Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map(cat => {
              const items = GEAR_CHECKLIST.filter(g => g.category === cat);
              return (
                <div
                  key={cat}
                  className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 space-y-3"
                >
                  <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2">
                    <h4 className="font-extrabold text-slate-900 text-base">{cat}</h4>
                    <span className="text-[11px] font-bold text-slate-500 font-mono">
                      {items.filter(i => checkedGearIds.has(i.id)).length} / {items.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {items.map(item => {
                      const isChecked = checkedGearIds.has(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleGearCheck(item.id)}
                          className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 select-none ${
                            isChecked
                              ? 'bg-amber-50 border-amber-400 text-slate-900'
                              : 'bg-neutral-50 border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <button
                            type="button"
                            className="mt-0.5 text-slate-900 shrink-0 focus:outline-hidden"
                          >
                            {isChecked ? (
                              <div className="w-5 h-5 rounded-md bg-amber-500 border border-slate-900 flex items-center justify-center text-slate-950 font-bold text-xs">
                                ✓
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-md bg-white border-2 border-slate-400" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-xs font-bold ${isChecked ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                {item.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 shrink-0">
                                {item.weightEst}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Tutorial Pasang Tenda */}
      {activeGuideTab === 'tenda' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 space-y-4">
              <div className="text-xs font-bold text-amber-700 uppercase">Langkah 01</div>
              <h3 className="text-xl font-bold text-slate-900">
                Memilih Lokasi & Orientasi Tenda
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sebelum membongkar tas tenda, amati tanah sekitar secara teliti:
              </p>
              <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside bg-neutral-50 p-4 rounded-2xl border border-slate-200 leading-relaxed">
                <li><strong>Hindari Cekungan:</strong> Jangan pernah mendirikan tenda di tanah yang membentuk cekungan, karena saat hujan air akan menggenang di bawah alas tendamu.</li>
                <li><strong>Cek Atap Pepohonan:</strong> Pastikan di atas tenda tidak ada dahan lapuk atau pohon mati (deadfall) yang rawan patah tertiup angin kencang.</li>
                <li><strong>Arah Pintu Masuk:</strong> Posisikan pintu tenda membelakangi arah angin utama untuk mencegah angin kencang meniup langsung ke dalam ruangan saat dibuka.</li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 space-y-4">
              <div className="text-xs font-bold text-amber-700 uppercase">Langkah 02</div>
              <h3 className="text-xl font-bold text-slate-900">
                Teknik Pasak 45 Derajat & Tali Pengencang
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kekuatan tenda di iklim pegunungan berangin terletak pada pasak yang benar:
              </p>
              <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside bg-neutral-50 p-4 rounded-2xl border border-slate-200 leading-relaxed">
                <li><strong>Sudut Kemiringan 45°:</strong> Tancapkan pasak miring 45 derajat berlawanan dari arah tarikan tali tenda (guyline), bukan tegak lurus.</li>
                <li><strong>Tanam Sampai Rata:</strong> Masukkan pasak sedalam mungkin ke tanah agar tidak terinjak orang lewat di malam hari dan tidak mudah lepas tercabut.</li>
                <li><strong>Jika Tanah Gembur:</strong> Tumpuk batu kali padat di atas pasak untuk mengunci posisinya (teknik deadman anchor sederhana).</li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 space-y-4">
              <div className="text-xs font-bold text-amber-700 uppercase">Langkah 03</div>
              <h3 className="text-xl font-bold text-slate-900">
                Pemasangan Flysheet & Anti-Kondensasi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Penyebab utama kasur dan sleeping bag basah di pagi hari adalah tetesan kondensasi napas kita yang menyentuh kain luar dingin:
              </p>
              <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside bg-neutral-50 p-4 rounded-2xl border border-slate-200 leading-relaxed">
                <li><strong>Tarik Flysheet Kencang (Taut):</strong> Jangan biarkan flysheet luar menempel pada kain jaring dalam (inner tent). Harus ada jarak udara minimal 5-10 cm.</li>
                <li><strong>Buka Ventilasi Udara:</strong> Jangan pernah menutup rapat jendela ventilasi atap tenda meski di luar dingin menusuk. Aliran udara segar adalah kunci mencegah embun basah di dalam.</li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 space-y-4">
              <div className="text-xs font-bold text-amber-700 uppercase">Langkah 04</div>
              <h3 className="text-xl font-bold text-slate-900">
                Matras & Isolasi Panas Tubuh
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Banyak pemula kedinginan karena menyangka udara luar yang dingin, padahal tanah menyerap panas tubuh lebih cepat:
              </p>
              <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside bg-neutral-50 p-4 rounded-2xl border border-slate-200 leading-relaxed">
                <li><strong>Gunakan Matras Foil Lapisan Pertama:</strong> Pasang matras foil dengan sisi mengkilap menghadap ke atas tubuh untuk memantulkan kembali radiasi hangat badanmu.</li>
                <li><strong>Matras Busa / Tiup Lapisan Kedua:</strong> Menambah ketebalan dan kenyamanan punggung saat tidur.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Etika Leave No Trace */}
      {activeGuideTab === 'etika' && (
        <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 sm:p-8 space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-emerald-700 uppercase">Kode Etik Kehormatan</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              7 Prinsip Etika Alam Bebas (Leave No Trace)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Komunitas Yuru Camp Jabodetabek memegang teguh prinsip bahwa bumi perkemahan yang kita tinggalkan harus lebih bersih dari saat kita datang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 text-sm">01. Rencanakan & Siapkan Matang-Matang</span>
              <p className="text-xs text-slate-600 leading-relaxed">Pahami aturan pengelola setempat, cek ramalan cuaca BMKG, dan hindari membawa kemasan plastik sekali pakai berlebihan.</p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 text-sm">02. Berkemah di Permukaan Tahan Banting</span>
              <p className="text-xs text-slate-600 leading-relaxed">Dirikan tenda di tanah padat atau rumput yang memang diperuntukkan untuk camp, bukan merusak semak alami baru.</p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-400 space-y-1.5">
              <span className="font-bold text-emerald-950 text-sm">03. Bawa Pulang Semua Sampahmu (Trash Out)</span>
              <p className="text-xs text-emerald-900 leading-relaxed">Satu puntung rokok, bungkus bumbu mi, atau sisa makanan wajib dimasukkan ke kantong sampah dan dibawa turun ke tempat sampah kota.</p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 text-sm">04. Tinggalkan Apa yang Kamu Temukan</span>
              <p className="text-xs text-slate-600 leading-relaxed">Jangan memetik bunga edelweis, mencoret pohon pinus, atau memindahkan formasi batu alami sungai.</p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 text-sm">05. Minimalkan Dampak Api Unggun</span>
              <p className="text-xs text-slate-600 leading-relaxed">Utamakan kompor gas kecil untuk memasak. Jika menyalakan kayu bakar, gunakan tungku komunal dan pastikan bara padam total sebelum tidur.</p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 text-sm">06. Hormati Satwa Liar & Serangga Alami</span>
              <p className="text-xs text-slate-600 leading-relaxed">Jangan memberi makan monyet liar atau hewan malam dengan makanan manusia karena akan mengubah insting alami mereka.</p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-400 space-y-1.5 md:col-span-2">
              <span className="font-bold text-amber-950 text-sm">07. Hargai Hak Ketenangan Camper Lain</span>
              <p className="text-xs text-amber-900 leading-relaxed">Hening setelah pukul 22.00 WIB. Dilarang menyalakan sound system speaker keras yang mengganggu desau angin alami dan kedamaian camper tetangga.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Resep Masakan Ala Yuru Camp & Kreasi Member */}
      {activeGuideTab === 'resep' && (
        <div className="space-y-6">
          {/* Header Controls: Info, Search, and Upload Button */}
          <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase flex items-center gap-1.5">
                <Utensils className="w-4 h-4" />
                <span>Kuliner Camp Komunal</span>
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                Resep Masak Outdoor Member ({filteredRecipes.length})
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                Setiap member dapat mengunggah kreasi resep masakan camping favoritnya dan berdiskusi langsung di kolom chat setiap resep!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={recipeSearch}
                  onChange={e => setRecipeSearch(e.target.value)}
                  placeholder="Cari resep, bahan..."
                  className="pl-9 pr-3 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden w-full sm:w-48"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isLoggedIn) {
                    setLoginWithGoogleModal(true);
                  } else {
                    setShowAddRecipeModal(true);
                  }
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center gap-1.5 transition-transform active:translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>Bagikan Resep Kamu</span>
              </button>
            </div>
          </div>

          {/* Recipes List */}
          {filteredRecipes.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-slate-900 p-12 text-center shadow-[6px_6px_0px_0px_#0f172a]">
              <Utensils className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Belum ada resep yang cocok dengan pencarian.</p>
              {recipeSearch && (
                <button
                  onClick={() => setRecipeSearch('')}
                  className="mt-3 px-4 py-1.5 bg-neutral-200 text-slate-800 text-xs font-bold rounded-xl"
                >
                  Reset Pencarian
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRecipes.map(rec => (
                <div
                  key={rec.id}
                  className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Optional Photo Banner */}
                    {rec.imageUrl && (
                      <div className="h-44 w-full bg-slate-900 overflow-hidden relative border-b-2 border-slate-900">
                        <img
                          src={rec.imageUrl}
                          alt={rec.title}
                          className="w-full h-full object-cover"
                          onError={e => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">
                          {rec.difficulty}
                        </div>
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                      {/* Author Header */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl border border-slate-900 overflow-hidden bg-amber-100 shrink-0">
                            <img
                              src={rec.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(rec.authorName || 'Chef')}`}
                              alt={rec.authorName || 'Author'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-xs block leading-tight">
                              {rec.authorName || 'Sahabat Yuru Camp'}
                            </span>
                            <span className="text-[10px] font-mono text-amber-700">
                              {rec.authorMemberId || '#ResepKomunitas'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 border border-sky-300">
                            {rec.difficulty}
                          </span>
                          {(isAdmin || (user && user.email === rec.authorEmail)) && (
                            <button
                              onClick={() => deleteRecipe(rec.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus Resep Ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Title & Desc */}
                      <div>
                        {rec.japaneseName && (
                          <span className="text-[10px] font-mono text-amber-700 block font-semibold">
                            {rec.japaneseName}
                          </span>
                        )}
                        <h3 className="text-lg font-black text-slate-900 leading-snug">
                          {rec.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {rec.description}
                        </p>
                      </div>

                      {/* Prep & Cook Time */}
                      <div className="flex items-center gap-4 text-xs font-mono text-slate-600 bg-neutral-50 p-2.5 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Persiapan: <strong>{rec.prepTime}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-rose-600" />
                          <span>Masak: <strong>{rec.cookTime}</strong></span>
                        </div>
                      </div>

                      {/* Ingredients */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-900">Bahan-Bahan:</span>
                        <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside bg-neutral-50 p-3 rounded-xl border border-slate-200">
                          {rec.ingredients.map((ing, i) => (
                            <li key={i}>{ing}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Steps */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-900">Cara Memasak:</span>
                        <ol className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside leading-relaxed bg-neutral-50 p-3 rounded-xl border border-slate-200">
                          {rec.steps.map((st, i) => (
                            <li key={i}>{st}</li>
                          ))}
                        </ol>
                      </div>

                      {/* Yuru Tip */}
                      {rec.yuruTip && (
                        <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-300 text-xs text-amber-950">
                          <strong className="text-amber-900">💡 Tips Yuru Camp:</strong> {rec.yuruTip}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* KOLOM CHAT & DISKUSI RESEP MEMBER */}
                  <div className="border-t-2 border-slate-100 bg-neutral-50/70 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <MessageSquare className="w-4 h-4 text-sky-600" />
                        <span>Kolom Chat Diskusi Resep</span>
                        <span className="text-[10px] bg-slate-900 text-white font-mono px-1.5 py-0.2 rounded-md">
                          {(rec.comments || []).length}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">Bahas resep & tips modifikasi</span>
                    </div>

                    {/* Comment Feed */}
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {(!rec.comments || rec.comments.length === 0) ? (
                        <div className="p-3 text-center bg-white rounded-xl border border-slate-200 text-[11px] text-slate-500">
                          Belum ada pesan chat. Jadilah yang pertama bertanya atau membagikan tips!
                        </div>
                      ) : (
                        rec.comments.map(c => (
                          <div
                            key={c.id}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1 text-xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-md border border-slate-900 overflow-hidden bg-sky-100 shrink-0">
                                  <img
                                    src={c.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(c.authorName)}`}
                                    alt={c.authorName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="font-extrabold text-slate-900 text-[11px]">
                                  {c.authorName}
                                </span>
                                {c.authorMemberId && (
                                  <span className="text-[9px] font-mono text-amber-700 bg-amber-50 px-1 rounded border border-amber-200">
                                    {c.authorMemberId}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {c.createdAt}
                              </span>
                            </div>
                            <p className="text-slate-700 pl-7 text-[11px] leading-relaxed">
                              {c.comment}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Chat Input Form */}
                    <form
                      onSubmit={e => handleRecipeCommentSubmit(rec.id, e)}
                      className="flex items-center gap-2 pt-1"
                    >
                      <input
                        type="text"
                        value={recipeChatInputs[rec.id] || ''}
                        onChange={e => setRecipeChatInputs({ ...recipeChatInputs, [rec.id]: e.target.value })}
                        placeholder={isLoggedIn ? 'Tulis komentar atau tips resep...' : 'Login untuk ikut chat resep...'}
                        className="flex-1 px-3 py-2 text-xs bg-white border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl border-2 border-slate-900 shadow-xs flex items-center justify-center transition-transform active:translate-y-0.5"
                        title="Kirim Komentar"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Review Gear Camping Setiap Member & Kolom Chat */}
      {activeGuideTab === 'review' && (
        <div className="space-y-6">
          {/* Header Controls: Info, Search, Category Filter, and Upload Button */}
          <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-sky-700 uppercase flex items-center gap-1.5">
                  <Tent className="w-4 h-4" />
                  <span>Ulasan Jujur Sahabat Outdoor</span>
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  Review Gear Camping Member ({filteredGearReviews.length})
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xl">
                  Rekomendasi riil tenda, matras, kompor, dan perlengkapan camping dari member komunitas. Setiap review dilengkapi kolom chat tanya jawab!
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isLoggedIn) {
                    setLoginWithGoogleModal(true);
                  } else {
                    setShowAddGearReviewModal(true);
                  }
                }}
                className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center gap-1.5 transition-transform active:translate-y-0.5 shrink-0 self-start md:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Tulis Review Gear Kamu</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {gearCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedGearCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap border ${
                      selectedGearCategory === cat
                        ? 'bg-sky-500 text-white border-slate-900 shadow-xs'
                        : 'bg-neutral-50 text-slate-700 border-slate-200 hover:bg-neutral-100'
                    }`}
                  >
                    {cat === 'all' ? 'Semua Kategori' : cat}
                  </button>
                ))}
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={gearSearch}
                  onChange={e => setGearSearch(e.target.value)}
                  placeholder="Cari merek, tipe gear..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          {filteredGearReviews.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-slate-900 p-12 text-center shadow-[6px_6px_0px_0px_#0f172a]">
              <Tent className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Belum ada review gear untuk kategori atau kata kunci ini.</p>
              <button
                onClick={() => {
                  setGearSearch('');
                  setSelectedGearCategory('all');
                }}
                className="mt-3 px-4 py-1.5 bg-neutral-200 text-slate-800 text-xs font-bold rounded-xl"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredGearReviews.map(gr => (
                <div
                  key={gr.id}
                  className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Gear Photo Banner if provided */}
                    {gr.imageUrl && (
                      <div className="h-44 w-full bg-slate-900 overflow-hidden relative border-b-2 border-slate-900">
                        <img
                          src={gr.imageUrl}
                          alt={gr.gearName}
                          className="w-full h-full object-cover"
                          onError={e => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">
                          {gr.category}
                        </div>
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                      {/* Author Header */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl border border-slate-900 overflow-hidden bg-sky-100 shrink-0">
                            <img
                              src={gr.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(gr.authorName)}`}
                              alt={gr.authorName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-xs block leading-tight">
                              {gr.authorName}
                            </span>
                            <span className="text-[10px] font-mono text-amber-700">
                              {gr.authorMemberId || '#Member'} · {gr.createdAt}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-neutral-100 text-slate-800 border border-slate-300">
                            {gr.category}
                          </span>
                          {(isAdmin || (user && user.email === gr.authorEmail)) && (
                            <button
                              onClick={() => deleteGearReview(gr.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus Review Ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Gear Title, Brand & Star Rating */}
                      <div>
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                          <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                            Brand: {gr.brand}
                          </span>
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`w-3.5 h-3.5 ${
                                  idx < gr.rating
                                    ? 'fill-amber-400 text-amber-500'
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                            <span className="text-xs font-mono font-bold text-slate-800 ml-1">
                              {gr.rating}.0
                            </span>
                          </div>
                        </div>

                        <h3 className="text-lg font-black text-slate-900 leading-snug">
                          {gr.gearName}
                        </h3>
                      </div>

                      {/* Specs Badge */}
                      {(gr.weightEst || gr.priceEst) && (
                        <div className="flex items-center gap-3 text-xs font-mono text-slate-600 bg-neutral-50 p-2.5 rounded-xl border border-slate-200 flex-wrap">
                          {gr.weightEst && (
                            <span>Berat: <strong className="text-slate-900">{gr.weightEst}</strong></span>
                          )}
                          {gr.weightEst && gr.priceEst && <span>•</span>}
                          {gr.priceEst && (
                            <span>Estimasi Harga: <strong className="text-emerald-700">{gr.priceEst}</strong></span>
                          )}
                        </div>
                      )}

                      {/* Pros & Cons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-1">
                          <span className="text-[11px] font-bold text-emerald-950 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Kelebihan (Pros):</span>
                          </span>
                          <ul className="text-xs text-emerald-900 space-y-1 list-disc list-inside">
                            {gr.pros.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 space-y-1">
                          <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Kekurangan (Cons):</span>
                          </span>
                          <ul className="text-xs text-amber-900 space-y-1 list-disc list-inside">
                            {gr.cons.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Full Review Text */}
                      <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-200 text-xs text-slate-700 leading-relaxed italic">
                        "{gr.reviewText}"
                      </div>
                    </div>
                  </div>

                  {/* KOLOM CHAT & TANYA JAWAB GEAR MEMBER */}
                  <div className="border-t-2 border-slate-100 bg-neutral-50/70 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <MessageSquare className="w-4 h-4 text-sky-600" />
                        <span>Kolom Chat Tanya Jawab Gear</span>
                        <span className="text-[10px] bg-slate-900 text-white font-mono px-1.5 py-0.2 rounded-md">
                          {(gr.comments || []).length}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">Diskusi performa di lapangan</span>
                    </div>

                    {/* Comment Feed */}
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {(!gr.comments || gr.comments.length === 0) ? (
                        <div className="p-3 text-center bg-white rounded-xl border border-slate-200 text-[11px] text-slate-500">
                          Belum ada pertanyaan. Tanyakan detail gear ini ke pemiliknya!
                        </div>
                      ) : (
                        gr.comments.map(c => (
                          <div
                            key={c.id}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1 text-xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-md border border-slate-900 overflow-hidden bg-sky-100 shrink-0">
                                  <img
                                    src={c.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(c.authorName)}`}
                                    alt={c.authorName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="font-extrabold text-slate-900 text-[11px]">
                                  {c.authorName}
                                </span>
                                {c.authorMemberId && (
                                  <span className="text-[9px] font-mono text-amber-700 bg-amber-50 px-1 rounded border border-amber-200">
                                    {c.authorMemberId}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {c.createdAt}
                              </span>
                            </div>
                            <p className="text-slate-700 pl-7 text-[11px] leading-relaxed">
                              {c.comment}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Chat Input Form */}
                    <form
                      onSubmit={e => handleGearCommentSubmit(gr.id, e)}
                      className="flex items-center gap-2 pt-1"
                    >
                      <input
                        type="text"
                        value={gearChatInputs[gr.id] || ''}
                        onChange={e => setGearChatInputs({ ...gearChatInputs, [gr.id]: e.target.value })}
                        placeholder={isLoggedIn ? 'Tanya seputar gear ini atau bagikan pengalaman...' : 'Login untuk ikut chat gear...'}
                        className="flex-1 px-3 py-2 text-xs bg-white border-2 border-slate-900 rounded-xl focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl border-2 border-slate-900 shadow-xs flex items-center justify-center transition-transform active:translate-y-0.5"
                        title="Kirim Pesan"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: TAMBAH RESEP MASAK OUTDOOR */}
      {showAddRecipeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 p-5 bg-amber-100 border-b-2 border-slate-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-900 border border-slate-900">
                  Kreasi Kuliner Member
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Bagikan Resep Masakan Outdoor
                </h3>
              </div>
              <button
                onClick={() => setShowAddRecipeModal(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 bg-white rounded-xl border border-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRecipeSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Resep *</label>
                <input
                  type="text"
                  required
                  value={recipeForm.title}
                  onChange={e => setRecipeForm({ ...recipeForm, title: e.target.value })}
                  placeholder="contoh: Nasi Liwet Teri Daun Jeruk Panci Nesting"
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Santai / Jepang (Opsional)</label>
                  <input
                    type="text"
                    value={recipeForm.japaneseName}
                    onChange={e => setRecipeForm({ ...recipeForm, japaneseName: e.target.value })}
                    placeholder="contoh: Liwet Rice Ala Camp"
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tingkat Kesulitan *</label>
                  <select
                    value={recipeForm.difficulty}
                    onChange={e => setRecipeForm({ ...recipeForm, difficulty: e.target.value as any })}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                  >
                    <option value="Sangat Mudah">Sangat Mudah</option>
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu Persiapan</label>
                  <input
                    type="text"
                    value={recipeForm.prepTime}
                    onChange={e => setRecipeForm({ ...recipeForm, prepTime: e.target.value })}
                    placeholder="contoh: 5 Menit"
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu Memasak</label>
                  <input
                    type="text"
                    value={recipeForm.cookTime}
                    onChange={e => setRecipeForm({ ...recipeForm, cookTime: e.target.value })}
                    placeholder="contoh: 15 Menit"
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Singkat Resep</label>
                <textarea
                  rows={2}
                  value={recipeForm.description}
                  onChange={e => setRecipeForm({ ...recipeForm, description: e.target.value })}
                  placeholder="Ceritakan cita rasa masakan ini dan kapan paling nikmat disantap..."
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bahan-Bahan (1 baris per bahan) *</label>
                <textarea
                  rows={3}
                  required
                  value={recipeForm.ingredientsText}
                  onChange={e => setRecipeForm({ ...recipeForm, ingredientsText: e.target.value })}
                  placeholder="1 cup beras pulen&#10;50g teri medan goreng&#10;3 lembar daun jeruk & serai&#10;Garam & kaldu bubuk"
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Langkah Memasak (1 baris per langkah) *</label>
                <textarea
                  rows={3}
                  required
                  value={recipeForm.stepsText}
                  onChange={e => setRecipeForm({ ...recipeForm, stepsText: e.target.value })}
                  placeholder="Cuci beras dan masukkan ke panci nesting bersama air seujung jari.&#10;Masukkan teri, daun jeruk, serai, dan sedikit minyak.&#10;Tutup rapat dan masak dengan api kecil selama 15 menit hingga harum."
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tips Yuru Camp</label>
                <input
                  type="text"
                  value={recipeForm.yuruTip}
                  onChange={e => setRecipeForm({ ...recipeForm, yuruTip: e.target.value })}
                  placeholder="contoh: Beri pemberat batu bersih di atas tutup panci agar uap tidak bocor keluar."
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                />
              </div>

              {/* Foto Masakan: Pilih dari Galeri HP atau URL / Preset */}
              <ImageUploadPicker
                value={recipeForm.imageUrl}
                onChange={url => setRecipeForm({ ...recipeForm, imageUrl: url })}
                label="Foto Masakan Outdoor (Galeri HP / Kamera) *"
                placeholder="https://... atau pilih dari galeri ponsel"
                presets={RECIPE_IMAGE_PRESETS}
                helperText="Bisa langsung memilih foto kreasi masakan dari galeri HP atau kamera ponsel"
              />

              {/* Author Identity Block */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-slate-200">
                {isLoggedIn && user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl border border-slate-900 overflow-hidden bg-amber-100 shrink-0">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block leading-tight">Pengunggah: {user.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{user.email} · {user.memberId || '#Member'}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      Akun Terhubung
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">Nama Pengunggah (Tamu / Member):</span>
                      <button
                        type="button"
                        onClick={() => setLoginWithGoogleModal(true)}
                        className="text-[10px] font-bold text-sky-700 hover:underline"
                      >
                        Login Google untuk Nama Resmi →
                      </button>
                    </div>
                    <input
                      type="text"
                      value={recipeForm.authorCustomName}
                      onChange={e => setRecipeForm({ ...recipeForm, authorCustomName: e.target.value })}
                      placeholder="Masukkan nama Anda (misal: Rian Camper)"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-900 rounded-lg focus:outline-hidden"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddRecipeModal(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                >
                  Publikasikan Resep
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TULIS REVIEW GEAR CAMPING */}
      {showAddGearReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 p-5 bg-sky-100 border-b-2 border-slate-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-500 text-white border border-slate-900">
                  Ulasan Gear Member
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Tulis Review Gear Camping Kamu
                </h3>
              </div>
              <button
                onClick={() => setShowAddGearReviewModal(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 bg-white rounded-xl border border-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGearReviewSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Gear / Tipe *</label>
                  <input
                    type="text"
                    required
                    value={gearForm.gearName}
                    onChange={e => setGearForm({ ...gearForm, gearName: e.target.value })}
                    placeholder="contoh: Naturehike Cloud Up 2"
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Merek / Brand *</label>
                  <input
                    type="text"
                    required
                    value={gearForm.brand}
                    onChange={e => setGearForm({ ...gearForm, brand: e.target.value })}
                    placeholder="contoh: Naturehike, Eiger, BRS..."
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori *</label>
                  <select
                    value={gearForm.category}
                    onChange={e => setGearForm({ ...gearForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                  >
                    <option value="Tenda & Tidur">Tenda & Tidur</option>
                    <option value="Masak & Kuliner">Masak & Kuliner</option>
                    <option value="Pakaian & Proteksi">Pakaian & Proteksi</option>
                    <option value="Safety & Navigasi">Safety & Navigasi</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rating Bintang *</label>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setGearForm({ ...gearForm, rating: star })}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= gearForm.rating
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold text-slate-800 ml-1">
                      {gearForm.rating} / 5
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimasi Berat</label>
                  <input
                    type="text"
                    value={gearForm.weightEst}
                    onChange={e => setGearForm({ ...gearForm, weightEst: e.target.value })}
                    placeholder="contoh: 1.8 kg"
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimasi Harga Beli</label>
                  <input
                    type="text"
                    value={gearForm.priceEst}
                    onChange={e => setGearForm({ ...gearForm, priceEst: e.target.value })}
                    placeholder="contoh: Rp 950.000"
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kelebihan / Pros (1 baris per poin) *</label>
                <textarea
                  rows={2}
                  value={gearForm.prosText}
                  onChange={e => setGearForm({ ...gearForm, prosText: e.target.value })}
                  placeholder="Ringan dan compact&#10;Mudah didirikan sendirian&#10;Tahan hujan deras"
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kekurangan / Cons (1 baris per poin) *</label>
                <textarea
                  rows={2}
                  value={gearForm.consText}
                  onChange={e => setGearForm({ ...gearForm, consText: e.target.value })}
                  placeholder="Teras depan agak sempit&#10;Pasak bawaan mudah bengkok di tanah berbatu"
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ulasan Pengalaman Pemakaian Lengkap *</label>
                <textarea
                  rows={4}
                  required
                  value={gearForm.reviewText}
                  onChange={e => setGearForm({ ...gearForm, reviewText: e.target.value })}
                  placeholder="Ceritakan pengalaman riil memakai gear ini: sudah berapa kali dipakai kemping, di lokasi mana saja, bagaimana ketahanan terhadap angin/hujan..."
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border-2 border-slate-900 rounded-xl focus:outline-hidden leading-relaxed"
                />
              </div>

              {/* Foto Perlengkapan Gear: Pilih dari Galeri HP atau URL / Preset */}
              <ImageUploadPicker
                value={gearForm.imageUrl}
                onChange={url => setGearForm({ ...gearForm, imageUrl: url })}
                label="Foto Perlengkapan Gear (Galeri HP / Kamera) *"
                placeholder="https://... atau pilih dari galeri ponsel"
                presets={GEAR_IMAGE_PRESETS}
                helperText="Bisa langsung memilih foto gear milikmu dari galeri HP atau kamera ponsel"
              />

              {/* Author Identity Block */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-slate-200">
                {isLoggedIn && user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl border border-slate-900 overflow-hidden bg-sky-100 shrink-0">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block leading-tight">Pengulas: {user.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{user.email} · {user.memberId || '#Member'}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                      Akun Terhubung
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">Nama Pengulas (Tamu / Member):</span>
                      <button
                        type="button"
                        onClick={() => setLoginWithGoogleModal(true)}
                        className="text-[10px] font-bold text-sky-700 hover:underline"
                      >
                        Login Google untuk Nama Resmi →
                      </button>
                    </div>
                    <input
                      type="text"
                      value={gearForm.authorCustomName}
                      onChange={e => setGearForm({ ...gearForm, authorCustomName: e.target.value })}
                      placeholder="Masukkan nama Anda (misal: Budi Camper)"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-900 rounded-lg focus:outline-hidden"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddGearReviewModal(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                >
                  Publikasikan Review Gear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
