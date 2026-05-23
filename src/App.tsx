/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  Volume2, 
  ArrowLeft, 
  GitCompare, 
  Sparkles, 
  Layers, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle,
  Trash2
} from 'lucide-react';
import { MOTORCYCLES, BRANDS } from './data';
import { Motorcycle, FilterState, Inquiry } from './types';
import Navbar from './components/Navbar';
import FilterSidebar from './components/FilterSidebar';
import MotorcycleCard from './components/MotorcycleCard';
import MotorcycleDetailModal from './components/MotorcycleDetailModal';
import CompareSection from './components/CompareSection';
import AiAssistant from './components/AiAssistant';
import InquiryModal from './components/InquiryModal';

export default function App() {
  // Locale / Language State
  const [lang, setLang] = useState<'Ar' | 'En'>('Ar');
  const isAr = lang === 'Ar';

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    brand: 'all',
    condition: 'all',
    minPrice: 10000,
    maxPrice: 250000,
    searchQuery: '',
    sortBy: 'price_desc'
  });

  // Selected for comparison (max 3)
  const [compareBikes, setCompareBikes] = useState<Motorcycle[]>([]);

  // Active details modal
  const [selectedBike, setSelectedBike] = useState<Motorcycle | null>(null);

  // Active inquiry model
  const [inquiryBike, setInquiryBike] = useState<Motorcycle | null>(null);

  // AI Assistant Drawer toggle
  const [aiOpen, setAiOpen] = useState(false);

  // Inquiries List (For CRM Viewer)
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [viewInquiries, setViewInquiries] = useState(false);

  // References for scrolling
  const compareRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  // Load inquiries from backend on start and whenever a new request is made
  const fetchInquiries = async () => {
    try {
      const resp = await fetch('/api/inquiries');
      if (resp.ok) {
        const data = await resp.json();
        setInquiries(data);
      }
    } catch (e) {
      console.warn('Could not read inquiries database from Node backend.');
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleToggleCompare = (bike: Motorcycle) => {
    setCompareBikes(prev => {
      const exists = prev.some(b => b.id === bike.id);
      if (exists) {
        return prev.filter(b => b.id !== bike.id);
      }
      if (prev.length >= 3) {
        alert(isAr 
          ? 'تنبيه: يمكنك المقارنة بين 3 دراجات نارية كحد أقصى في وقت واحد.' 
          : 'Limit exceeded: You can compare up to 3 models simultaneously.');
        return prev;
      }
      return [...prev, bike];
    });
  };

  const removeCompareBike = (bike: Motorcycle) => {
    setCompareBikes(prev => prev.filter(b => b.id !== bike.id));
  };

  const handleInquirySubmitSuccess = () => {
    fetchInquiries();
    setViewInquiries(true); // Open CRM inbox to show success record
  };

  const handleDeleteInquiry = async (inqId: string) => {
    // Client-side visual remove for simulation, as we saved in-memory
    setInquiries(prev => prev.filter(i => i.id !== inqId));
  };

  // Scroll Helpers
  const scrollToCompare = () => {
    compareRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Filtering Logic
  const filteredBikes = MOTORCYCLES.filter(bike => {
    // 1. Category filter
    if (filters.category !== 'all' && bike.category !== filters.category) {
      return false;
    }
    // 2. Brand filter
    if (filters.brand !== 'all' && bike.brandAr !== filters.brand) {
      return false;
    }
    // 3. Condition filter
    if (filters.condition !== 'all' && bike.condition !== filters.condition) {
      return false;
    }
    // 4. Price range filter
    if (bike.price > filters.maxPrice || bike.price < filters.minPrice) {
      return false;
    }
    // 5. Keyword search text (Case insensitive on name, brand, features)
    if (filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      const matchNameAr = bike.nameAr.toLowerCase().includes(q);
      const matchNameEn = bike.nameEn.toLowerCase().includes(q);
      const matchBrandAr = bike.brandAr.toLowerCase().includes(q);
      const matchBrandEn = bike.brandEn.toLowerCase().includes(q);
      const matchDescAr = bike.descriptionAr.toLowerCase().includes(q);
      const matchDescEn = bike.descriptionEn.toLowerCase().includes(q);
      return (matchNameAr || matchNameEn || matchBrandAr || matchBrandEn || matchDescAr || matchDescEn);
    }
    return true;
  }).sort((a, b) => {
    // Sorting Switch Case
    if (filters.sortBy === 'price_asc') {
      return a.price - b.price;
    }
    if (filters.sortBy === 'price_desc') {
      return b.price - a.price;
    }
    if (filters.sortBy === 'year_desc') {
      return b.year - a.year;
    }
    if (filters.sortBy === 'cc_desc') {
      return b.engineSize - a.engineSize;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500 selection:text-zinc-950" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Navbar Integration */}
      <Navbar
        lang={lang}
        setLang={setLang}
        compareCount={compareBikes.length}
        scrollToCompare={scrollToCompare}
        toggleAiDrawer={() => setAiOpen(!aiOpen)}
        inquiriesCount={inquiries.length}
        setViewInquiries={setViewInquiries}
        viewInquiries={viewInquiries}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* HERO SECTION / PROMOTION (BENTO STYLE HERO) */}
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-6 sm:p-10 lg:p-12 shadow-2xl transition-all hover:border-zinc-700">
          
          {/* Subtle decoration grids (Bento design) */}
          <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:40px_40px] opacity-20"></div>
          
          {/* Spotlight aura */}
          <div className="absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-orange-500/10 blur-[130px]" />
          <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-orange-600/5 blur-[130px]" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
            {/* Promo copy */}
            <div className="flex-1 space-y-6 text-right">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-600/10 border border-orange-500/20 px-3 py-1 font-mono text-xs font-semibold text-orange-500">
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-orange-500" />
                <span>{isAr ? 'الموسم الجديد: دراجات نارية 2026 النخبة' : 'Season Launch: 2026 Elite models'}</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                {isAr ? 'اختر دراجتك النارية الفاخرة بكل ثقة واحترافية' : 'Discover Your Perfect High-Performance Motorcycle'}
              </h1>

              <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
                {isAr 
                  ? 'أرقى صالة عرض رقمية واستشارات احترافية لكبرى العلامات التجارية. تصفح دراجات نارية رياضية (ريس)، كروزر كلاسيكية، مغامرات أدفنتشر، وسكوتر، مع إمكانية المقارنة المباشرة، وحساب الأقساط الشهرية، والاستعانة بالمستشار الذكي.'
                  : 'The premier online showroom featuring top class Japanese, Italian, and American superbikes. Perform dual specs comparisons, calculate customized finance routes, and consult our smart virtual sales broker.'}
              </p>

              {/* Stats highlights (Clean Bento Cells) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-zinc-800">
                <div className="p-3 bg-zinc-950/40 rounded-2xl border border-zinc-850">
                  <p className="font-heading text-2xl font-black text-white">{MOTORCYCLES.length}+</p>
                  <p className="text-[11px] text-zinc-500 mt-1">{isAr ? 'دراجات متوفرة بالصالة' : 'Premium Inventory'}</p>
                </div>
                <div className="p-3 bg-zinc-950/40 rounded-2xl border border-zinc-850">
                  <p className="font-heading text-2xl font-black text-orange-500">7+</p>
                  <p className="text-[11px] text-zinc-500 mt-1">{isAr ? 'علامات تجارية معتمدة' : 'Official Brands'}</p>
                </div>
                <div className="p-3 bg-zinc-950/40 rounded-2xl border border-zinc-850">
                  <p className="font-heading text-2xl font-black text-white">0%</p>
                  <p className="text-[11px] text-zinc-500 mt-1">{isAr ? 'دفعة أولى تمويلية مرنة' : 'Flexible Downpayment'}</p>
                </div>
                <div className="p-3 bg-zinc-950/40 rounded-2xl border border-zinc-850">
                  <p className="font-heading text-2xl font-black text-emerald-400">24h</p>
                  <p className="text-[11px] text-zinc-500 mt-1">{isAr ? 'دعم المستشار الفوري' : 'AI Consultant Support'}</p>
                </div>
              </div>

              {/* Call to action buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={scrollToCatalog}
                  className="rounded-2xl bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 text-sm font-bold transition-all hover:scale-[1.01] shadow-lg shadow-orange-500/10 cursor-pointer"
                >
                  {isAr ? 'تصفح دراجات المعرض' : 'Browse Inventory Catalogue'}
                </button>
                <button
                  onClick={() => setAiOpen(true)}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-850 text-zinc-300 px-6 py-3 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-orange-500" />
                  <span>{isAr ? 'تفعيل مستشاري الذكي' : 'Consult AI Sales Guide'}</span>
                </button>
              </div>

            </div>

            {/* Visual Hero motorcycle promo spot - styled with Bento card overlay */}
            <div className="w-full lg:w-[40%] xl:w-[45%] shrink-0">
              <div className="relative group max-w-md mx-auto rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950">
                <img
                  src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200&h=800"
                  alt="Feature Superbike"
                  className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                
                {/* Embedded badge */}
                <div className="absolute bottom-4 right-4 text-right">
                  <span className="rounded bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 text-[9px] font-bold text-orange-400 uppercase tracking-widest">
                    {isAr ? 'الموديل الموصى به' : 'Dealers Pick'}
                  </span>
                  <p className="text-base font-black text-white mt-1">هارلي ديفيدسون فت بوي 114</p>
                  <p className="text-xs text-orange-500 font-mono">98,000 ر.س</p>
                </div>

                <div className="absolute top-4 left-4 bg-zinc-950/80 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-bold backdrop-blur-sm border border-emerald-500/20 flex items-center gap-1">
                  <Award className="h-4 w-4 text-orange-500" />
                  <span>{isAr ? 'شحن مجاني للخليج' : 'Premium Gulf Shipping'}</span>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* CRM INQUIRIES VIEW (Hidden by default, triggered on demand) */}
        {viewInquiries && (
          <section className="rounded-3xl border border-orange-500/30 bg-orange-500/[0.02] p-6 space-y-4">
            <div className="flex border-b border-zinc-800 pb-3 items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500 animate-pulse" />
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isAr ? 'طلبات وعروض الأسعار وحجوزات المعرض (CRM)' : 'Active Showroom Inquiries Panel'}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {isAr ? 'لوحة المبيعات الإدارية التفاعلية لمعاينة الطلبات الواردة في الوقت الفعلي ومتابعة العملاء.' : 'Interim Real-time CRM Ledger for tracking requests.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewInquiries(false)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                {isAr ? 'إخفاء اللوحة' : 'Collapse CRM Panel'}
              </button>
            </div>

            {inquiries.length === 0 ? (
              <div className="py-6 text-center text-zinc-500 text-xs">
                {isAr ? 'لا توجد طلبات واردة حالياً. حاول تقديم حجز دراجة لتشغيل المحرك.' : 'No active inquiries listed yet. Submit an Inquiry form to preview details here.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right divide-y divide-zinc-850">
                  <thead>
                    <tr className="text-zinc-400 font-bold bg-zinc-950/40">
                      <th className="py-2.5 px-4">{isAr ? 'رقم الطلب' : 'Request UUID'}</th>
                      <th className="py-2.5 px-4">{isAr ? 'اسم العميل' : 'Customer'}</th>
                      <th className="py-2.5 px-4">{isAr ? 'الهاتف' : 'Phone'}</th>
                      <th className="py-2.5 px-4">{isAr ? 'الدراجة المطلوبة' : 'Selected Model'}</th>
                      <th className="py-2.5 px-4 text-center">{isAr ? 'نوع التمويل' : 'Type'}</th>
                      <th className="py-2.5 px-4">{isAr ? 'ملاحظات' : 'Remarks'}</th>
                      <th className="py-2.5 px-4 text-left">{isAr ? 'إجراء' : 'Act'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40">
                    {inquiries.map((inq, idx) => {
                      const labelsMap = {
                        buy: isAr ? 'شراء كاش' : 'Cash buy',
                        test_drive: isAr ? 'تجربة قيادة' : 'Test drive',
                        finance: isAr ? 'تمويل إسلامي' : 'Finance route'
                      };
                      return (
                        <tr key={inq.id} className="hover:bg-zinc-900/30 transition-colors">
                          <td className="py-3 px-4 font-mono text-zinc-500">{inq.id}</td>
                          <td className="py-3 px-4 font-bold text-white">{inq.clientName}</td>
                          <td className="py-3 px-4 font-mono text-zinc-300">{inq.phone}</td>
                          <td className="py-3 px-4 text-orange-500 font-medium">{inq.bikeName}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="rounded bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 text-[10px] text-orange-500 font-semibold">
                              {labelsMap[inq.type]}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-zinc-400 truncate max-w-[200px]" title={inq.notes}>
                            {inq.notes || '-'}
                          </td>
                          <td className="py-3 px-4 text-left">
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="rounded bg-rose-500/10 p-1.5 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                              title={isAr ? 'حذف السجل' : 'Liquidate ledger row'}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* COMPARISON BAR ANCHOR */}
        <div ref={compareRef} className="scroll-mt-28">
          <CompareSection
            lang={lang}
            compareBikes={compareBikes}
            onRemove={removeCompareBike}
            onInquire={(bike) => setInquiryBike(bike)}
            clearAll={() => setCompareBikes([])}
          />
        </div>

        {/* MAIN SHOWROOM CATALOG WITH FILTER SIDEBAR */}
        <section ref={catalogRef} className="scroll-mt-28 space-y-6">
          
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isAr ? 'المخزون المتوفر في صالة العرض' : 'Approved Showroom Inventory'}
              </h2>
              <p className="text-xs text-zinc-400">
                {isAr 
                  ? `نعرض حالياً ${filteredBikes.length} من أصل ${MOTORCYCLES.length} دراجة نارية معتمدة` 
                  : `Currently serving ${filteredBikes.length} of ${MOTORCYCLES.length} vetted motorcycles`}
              </p>
            </div>

            {/* Floating indicator */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] text-zinc-400 font-mono">
                {isAr ? 'الأسعار محدثة بريال سعودي شامل الضريبة' : 'VAT inclusive Saudi Riyal pricing'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Filters Column (1/4 on desktop) */}
            <div className="lg:col-span-1">
              <FilterSidebar
                lang={lang}
                filters={filters}
                setFilters={setFilters}
                availableBrands={BRANDS}
              />
            </div>

            {/* Listing Grid Column (3/4 on desktop) */}
            <div className="lg:col-span-3 space-y-6">
              {filteredBikes.length === 0 ? (
                <div className="rounded-3xl border border-zinc-850 bg-zinc-900/10 p-12 text-center">
                  <AlertCircle className="mx-auto h-10 w-10 text-orange-500/60" />
                  <h4 className="mt-4 text-base font-bold text-white">
                    {isAr ? 'عذراً، لم نجد دراجات تطابق هذه التصفية' : 'No matches located'}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto">
                    {isAr 
                      ? 'جرب ضبط مرشحات البحث، أو تصفير مساحة السعر، أو إدخال كلمة أقل تحديداً ليتلاءم النظام مع مخزون الدراجات.' 
                      : 'Try resetting price filters or search words to pull from active inventory logs.'}
                  </p>
                  <button
                    onClick={() => setFilters({
                      category: 'all',
                      brand: 'all',
                      condition: 'all',
                      minPrice: 10000,
                      maxPrice: 250000,
                      searchQuery: '',
                      sortBy: 'price_desc'
                    })}
                    className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-semibold text-orange-500 hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    {isAr ? 'تصفير جميع الفلاتر' : 'Reset filters'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredBikes.map(bike => (
                    <MotorcycleCard
                      key={bike.id}
                      lang={lang}
                      bike={bike}
                      onViewDetails={(b) => setSelectedBike(b)}
                      onInquire={(b) => setInquiryBike(b)}
                      onToggleCompare={handleToggleCompare}
                      isComparing={compareBikes.some(b => b.id === bike.id)}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 bg-zinc-950/80 mt-20 relative z-10 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-500 text-center">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500"></span>
            <p className="font-mono text-[10px] uppercase tracking-wide">
              {isAr ? 'موتو اكس موتو ديلر ش.م.ح - جميع الحقوق محفوظة' : 'MOTORX Dealership SA. All rights reserved.'} © 2026
            </p>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-orange-500 transition-colors pointer-events-none">
              {isAr ? 'شروط وأحكام الحجز الشرعي' : 'Terms & Conditions'}
            </span>
            <span>•</span>
            <span className="hover:text-orange-500 transition-colors pointer-events-none">
              {isAr ? 'سياسة حماية بيانات العملاء' : 'Privacy standards'}
            </span>
          </div>
        </div>
      </footer>

      {/* MODALS & DRAWERS HOOKS */}
      
      {/* 1. Detail Sheet Modal */}
      {selectedBike && (
        <MotorcycleDetailModal
          lang={lang}
          bike={selectedBike}
          onClose={() => setSelectedBike(null)}
          onInquire={(bike) => setInquiryBike(bike)}
        />
      )}

      {/* 2. Buy/Booking Inquiry Modal */}
      {inquiryBike && (
        <InquiryModal
          lang={lang}
          bike={inquiryBike}
          onClose={() => setInquiryBike(null)}
          onSuccess={handleInquirySubmitSuccess}
        />
      )}

      {/* 3. Sliding AI consulting room */}
      <AiAssistant
        lang={lang}
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
      />

    </div>
  );
}
