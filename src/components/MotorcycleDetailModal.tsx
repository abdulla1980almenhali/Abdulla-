/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Motorcycle } from '../types';
import { X, Check, Calculator, ShieldAlert, BadgeInfo, ShoppingCart, DollarSign, ArrowRight, RotateCw, Eye } from 'lucide-react';
import ThreeSixtyTurntable from './ThreeSixtyTurntable';

interface MotorcycleDetailModalProps {
  lang: 'Ar' | 'En';
  bike: Motorcycle | null;
  onClose: () => void;
  onInquire: (b: Motorcycle) => void;
}

export default function MotorcycleDetailModal({
  lang,
  bike,
  onClose,
  onInquire
}: MotorcycleDetailModalProps) {
  const isAr = lang === 'Ar';
  const [viewMode, setViewMode] = useState<'360' | 'photo'>('360');

  // Calculator states
  const [downPaymentPercent, setDownPaymentPercent] = useState(20); // 20% default
  const [termMonths, setTermMonths] = useState(24); // 24 months default
  const interestRate = 0.035; // 3.5% yearly profit rate

  if (!bike) return null;

  // Monthly Installment Calculation
  const price = bike.price;
  const downPayment = Math.round(price * (downPaymentPercent / 100));
  const principal = price - downPayment;
  // Simple Profit formula used commonly in Gulf auto financing (Murabaha)
  // Total profit = principal * rate * (months / 12)
  const totalProfit = principal * interestRate * (termMonths / 12);
  const totalDebt = principal + totalProfit;
  const monthlyInstallment = Math.round(totalDebt / termMonths);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8 shadow-2xl my-8 text-right bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 rounded-xl bg-zinc-950/80 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer border border-zinc-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          
          {/* Column 1: Media, Title, Specs list */}
          <div className="space-y-6">
            
            {/* View Mode Switching Tabs */}
            <div className="flex rounded-2xl bg-zinc-950 p-1 border border-zinc-850 w-full">
              <button
                type="button"
                onClick={() => setViewMode('360')}
                className={`flex-1 rounded-xl py-2 text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  viewMode === '360'
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-500/10'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>{isAr ? 'معاينة تفاعلية 360°' : '360° Showroom'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('photo')}
                className={`flex-1 rounded-xl py-2 text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  viewMode === 'photo'
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-500/10'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>{isAr ? 'صورة ستوديو كاملة' : 'Studio Portrait'}</span>
              </button>
            </div>

            {viewMode === '360' ? (
              <ThreeSixtyTurntable bike={bike} isAr={isAr} />
            ) : (
              <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 h-72 sm:h-80 shadow-2xl animate-fade-in">
                <img
                  src={bike.image}
                  alt={isAr ? bike.nameAr : bike.nameEn}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="rounded-lg bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 text-xs font-bold font-mono text-orange-400">
                    {bike.year}
                  </span>
                  <span className="text-xl font-black text-white">
                    {bike.price.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}
                  </span>
                </div>
              </div>
            )}

            {/* Quick Specs List */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white border-b border-zinc-850 pb-2">
                {isAr ? 'منظومة المواصفات والخصائص الفنية' : 'Technical Specifications Blueprint'}
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                <li className="flex justify-between items-center bg-gray-950/50 rounded-xl p-2.5 border border-gray-850">
                  <span className="font-semibold text-gray-200">{bike.engineSize} cc</span>
                  <span className="text-gray-500">{isAr ? 'سعة المحرك' : 'Engine CC'}</span>
                </li>
                <li className="flex justify-between items-center bg-gray-950/50 rounded-xl p-2.5 border border-gray-850">
                  <span className="font-semibold text-gray-200">{bike.power} hp</span>
                  <span className="text-gray-500">{isAr ? 'القوة الحصانية' : 'Horsepower'}</span>
                </li>
                <li className="flex justify-between items-center bg-gray-950/50 rounded-xl p-2.5 border border-gray-850">
                  <span className="font-semibold text-gray-200">{bike.weight} kg</span>
                  <span className="text-gray-500">{isAr ? 'الوزن الصافي' : 'Dry Weight'}</span>
                </li>
                <li className="flex justify-between items-center bg-gray-950/50 rounded-xl p-2.5 border border-gray-850">
                  <span className="font-semibold text-gray-200">{bike.fuelCapacity} Liters</span>
                  <span className="text-gray-500">{isAr ? 'خزان الوقود' : 'Fuel capacity'}</span>
                </li>
                <li className="flex justify-between items-center bg-gray-950/50 rounded-xl p-2.5 border border-gray-850 col-span-1 sm:col-span-2">
                  <span className="font-semibold text-gray-200">{isAr ? bike.colorAr : bike.colorEn}</span>
                  <span className="text-gray-500">{isAr ? 'الألوان المتوفرة' : 'Primary color'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 2: Details & Murabaha Calculator & Purchase */}
          <div className="flex flex-col justify-between space-y-6">
            
            {/* Title Block */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-mono">
                <span>{isAr ? bike.brandAr : bike.brandEn}</span>
                <span>•</span>
                <span className="capitalize">{bike.category}</span>
              </div>
              <h2 className="text-2xl font-black text-white leading-tight">
                {isAr ? bike.nameAr : bike.nameEn}
              </h2>
              <p className="text-gray-300 text-xs leading-relaxed">
                {isAr ? bike.descriptionAr : bike.descriptionEn}
              </p>
            </div>

            {/* Bullet Highlights */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400">
                {isAr ? 'المميزات الرئيسية والتجهيزات:' : 'Main Technologies Pre-fitted:'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(isAr ? bike.keySpecsAr : bike.keySpecsEn).map((spec, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2 text-[11px] text-gray-400">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ESTIMATED INSTALLMENT CALCULATOR (MURABAHA) */}
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <span className="font-mono text-[10px] text-amber-500 tracking-wider">
                  {isAr ? 'حاسبة تقسيط التمويل الشرعي' : 'Murabaha Loan Calculator'}
                </span>
                <div className="flex items-center gap-1 text-gray-400">
                  <Calculator className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-bold text-white">{isAr ? 'الحاسب المالي' : 'Financing Calculator'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Down Payment slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-[11px] text-gray-400">
                    <span>{downPaymentPercent}%</span>
                    <span>{isAr ? 'الدفعة الأولى' : 'Down Payment'}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-500 h-1 cursor-pointer bg-gray-800 rounded-lg"
                  />
                  <div className="flex justify-between font-mono text-[9px] text-gray-500">
                    <span>{Math.round(bike.price * 0.1).toLocaleString()} ر.س</span>
                    <span>{Math.round(bike.price * 0.6).toLocaleString()} ر.س</span>
                  </div>
                </div>

                {/* Term term months radio */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-gray-400 block text-left">
                    {isAr ? 'مدة التقسيط التمويلية' : 'Financing Duration'}
                  </span>
                  <div className="grid grid-cols-3 gap-1 rounded-lg bg-gray-900 p-1 border border-gray-800">
                    {([12, 24, 36] as const).map((months) => (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setTermMonths(months)}
                        className={`rounded py-1 text-center font-mono text-xs transition-colors cursor-pointer ${
                          termMonths === months
                            ? 'bg-amber-500 text-gray-950 font-bold'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {months} {isAr ? 'شهر' : 'm'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calculator Summary block */}
              <div className="grid grid-cols-3 gap-2 bg-gray-900/60 p-3 rounded-xl text-center border border-gray-850">
                <div>
                  <p className="text-[9px] text-gray-500">{isAr ? 'الدفعة الأولى' : 'Downpayment'}</p>
                  <p className="font-mono text-xs font-bold text-gray-300">{downPayment.toLocaleString()} ر.س</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500">{isAr ? 'هامش الربح (سنوي)' : 'Profit Margins'}</p>
                  <p className="font-mono text-xs font-bold text-gray-300">{(interestRate * 100).toFixed(1)}%</p>
                </div>
                <div className="border-r border-gray-800">
                  <p className="text-[9px] text-amber-500 font-bold">{isAr ? 'القسط الشهري الإسترشادي' : 'Monthly installment'}</p>
                  <p className="font-mono text-sm font-black text-amber-400">
                    {monthlyInstallment.toLocaleString()}
                    <span className="text-[9px] font-normal text-amber-500 mr-0.5">{isAr ? 'ر.س' : 'SAR'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="flex gap-3 justify-end pt-2 border-t border-gray-800">
              <button
                onClick={onClose}
                className="rounded-xl border border-gray-800 bg-gray-950 px-6 py-3 text-xs font-semibold text-gray-400 hover:bg-gray-855 hover:text-white transition-all cursor-pointer"
              >
                {isAr ? 'إغلاق التفاصيل' : 'Close Sheet'}
              </button>

              <button
                onClick={() => {
                  onInquire(bike);
                  onClose();
                }}
                className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-450 px-8 py-3 text-xs font-bold text-gray-950 transition-all cursor-pointer"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>{isAr ? 'حجز وشراء هذه الدراجة' : 'Commit Sales Inquiry'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
