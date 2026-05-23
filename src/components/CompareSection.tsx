/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Motorcycle } from '../types';
import { Trash2, AlertCircle, Sparkles, Scale, Info, Check } from 'lucide-react';

interface CompareSectionProps {
  lang: 'Ar' | 'En';
  compareBikes: Motorcycle[];
  onRemove: (b: Motorcycle) => void;
  onInquire: (b: Motorcycle) => void;
  clearAll: () => void;
}

export default function CompareSection({
  lang,
  compareBikes,
  onRemove,
  onInquire,
  clearAll
}: CompareSectionProps) {
  const isAr = lang === 'Ar';

  if (compareBikes.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/10 p-10 text-center">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-zinc-400">
          <Scale className="h-6 w-6" />
        </div>
        <h4 className="mt-3 text-base font-bold text-white max-w-sm mx-auto">
          {isAr ? 'منصة المقارنة الفنية فارغة' : 'Compare Tray Empty'}
        </h4>
        <p className="mx-auto mt-2 max-w-sm text-xs text-zinc-500 leading-relaxed">
          {isAr 
            ? 'فضلاً أضف دراجات نارية (بحد أقصى 3) عن طريق الضغط على زر مقارنة (المربع ذو السهمين) في بطاقة أي دراجة أعلاه لتشغيل المحاكي.' 
            : 'Press the compare button (arrows icon) under any motorcycle to run this side-by-side analyzer.'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="h-3 w-3 animate-pulse" />
            {isAr ? 'محاكي المقارنة والتحليل الفني' : 'Side-by-Side Spec Analyzer'}
          </span>
          <h3 className="text-xl font-bold text-white">
            {isAr ? 'مقارنة مواصفات الدراجات النارية' : 'Specifications Comparison Table'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            {isAr 
              ? `أنت تقارن حالياً بين ${compareBikes.length} من الدراجات المختارة` 
              : `You are currently validating ${compareBikes.length} selected bikes side-by-side`}
          </p>
        </div>
        <button
          onClick={clearAll}
          className="self-start sm:self-center font-mono text-xs text-rose-500 hover:text-white border border-rose-500/20 bg-rose-500/10 rounded-xl px-3 py-1.5 transition-colors cursor-pointer"
        >
          {isAr ? 'إفراغ القائمة' : 'Clear Compare Tray'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse text-xs min-w-[600px] border-spacing-y-2">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="py-3 px-4 text-zinc-400 font-semibold w-1/4">
                {isAr ? 'المواصفة الفنية' : 'Technical Spec'}
              </th>
              {compareBikes.map(bike => (
                <th key={bike.id} className="py-3 px-4 text-center text-white font-bold w-1/4">
                  <div className="relative group">
                    <button
                      onClick={() => onRemove(bike)}
                      className="absolute -top-1 right-2 rounded-md bg-rose-500/10 p-1 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                      title={isAr ? 'حذف من المقارنة' : 'Remove bike'}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex justify-center mb-2 mt-4">
                      <img
                        src={bike.image}
                        alt={isAr ? bike.nameAr : bike.nameEn}
                        className="h-20 w-32 object-cover rounded-2xl border border-zinc-800 shadow-md animate-fade-in"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="block text-sm text-orange-500 mt-1">
                      {isAr ? bike.brandAr : bike.brandEn}
                    </span>
                    <span className="block text-white font-bold">
                      {isAr ? bike.nameAr : bike.nameEn}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {/* Price Row */}
            <tr className="bg-orange-500/[0.02]">
              <td className="py-4 px-4 font-bold text-zinc-300">
                {isAr ? 'السعر الكلي' : 'Total Cost'}
              </td>
              {compareBikes.map(bike => (
                <td key={bike.id} className="py-4 px-4 text-center font-mono text-sm font-bold text-orange-400">
                  {bike.price.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}
                </td>
              ))}
            </tr>

            {/* Condition Row */}
            <tr>
              <td className="py-3 px-4 text-zinc-400">
                {isAr ? 'حالة الدراجة' : 'Condition'}
              </td>
              {compareBikes.map(bike => (
                <td key={bike.id} className="py-3 px-4 text-center">
                  {bike.condition === 'new' ? (
                    <span className="text-emerald-400 font-medium font-bold">
                      {isAr ? 'جديد 2026' : 'New 2026'}
                    </span>
                  ) : (
                    <span className="text-orange-450 text-orange-400 font-medium font-bold">
                      {isAr ? `مستعمل (ممشى ${bike.mileage.toLocaleString()} كم)` : `Used (${bike.mileage.toLocaleString()} km)`}
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Year Row */}
            <tr className="bg-zinc-900/20">
              <td className="py-3 px-4 text-zinc-400">
                {isAr ? 'سنة الموديل' : 'Model Year'}
              </td>
              {compareBikes.map(bike => (
                <td key={bike.id} className="py-3 px-4 text-center text-zinc-200">
                  {bike.year}
                </td>
              ))}
            </tr>

            {/* Displacement CC Row */}
            <tr>
              <td className="py-3 px-4 font-bold text-zinc-300">
                {isAr ? 'سعة المحرك (سي سي)' : 'Displacement (CC)'}
              </td>
              {compareBikes.map(bike => (
                <td key={bike.id} className="py-3 px-4 text-center text-white font-bold font-mono">
                  {bike.engineSize} cc
                </td>
              ))}
            </tr>

            {/* Horsepower Row */}
            <tr className="bg-zinc-900/20">
              <td className="py-3 px-4 text-zinc-400">
                {isAr ? 'القوة الحصانية (حصان)' : 'Peak Output (HP)'}
              </td>
              {compareBikes.map(bike => (
                <td key={bike.id} className="py-3 px-4 text-center text-zinc-200 font-mono">
                  {bike.power} hp
                </td>
              ))}
            </tr>

            {/* Weight Row */}
            <tr>
              <td className="py-3 px-4 text-zinc-400">
                {isAr ? 'الوزن الإجمالي للدراجة' : 'Curb Weight'}
              </td>
              {compareBikes.map(bike => (
                <td key={bike.id} className="py-3 px-4 text-center text-zinc-200 font-mono">
                  {bike.weight} kg
                </td>
              ))}
            </tr>

            {/* Fuel capacity Row */}
            <tr className="bg-zinc-900/20">
              <td className="py-3 px-4 text-zinc-400">
                {isAr ? 'سعة خزان الوقود' : 'Fuel Capacity'}
              </td>
              {compareBikes.map(bike => (
                <td key={bike.id} className="py-3 px-4 text-center text-zinc-200 font-mono">
                  {bike.fuelCapacity} Liters
                </td>
              ))}
            </tr>

            {/* Color Row */}
            <tr>
              <td className="py-3 px-4 text-zinc-400">
                {isAr ? 'اللون المتوفر' : 'Available Colors'}
              </td>
              {compareBikes.map(bike => (
                <td key={bike.id} className="py-3 px-4 text-center text-zinc-300 text-[11px]">
                  {isAr ? bike.colorAr : bike.colorEn}
                </td>
              ))}
            </tr>

            {/* Key Specs Highlights */}
            <tr className="bg-zinc-950/40">
              <td className="py-4 px-4 font-semibold text-orange-500">
                {isAr ? 'المواصفات والتقنيات المميزة' : 'Key Technology'}
              </td>
              {compareBikes.map(bike => (
                <td key={bike.id} className="py-4 px-4 text-right">
                  <ul className="space-y-1 list-none text-[10px] text-zinc-400">
                    {(isAr ? bike.keySpecsAr : bike.keySpecsEn).map((spec, sIdx) => (
                      <li key={sIdx} className="flex gap-1.5 items-start justify-end">
                        <span>{spec}</span>
                        <Check className="h-3 w-3 text-emerald-450 text-emerald-400 flex-shrink-0 mt-0.5" />
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Action Row */}
            <tr>
              <td className="py-4 px-4">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <Info className="h-4 w-4" />
                  <span>{isAr ? 'اتخاذ قرار الحجز' : 'Action'}</span>
                </div>
              </td>
              {compareBikes.map(bike => (
                <td key={bike.id} className="py-4 px-4 text-center">
                  <button
                    onClick={() => onInquire(bike)}
                    className="w-full rounded-2xl bg-orange-600 hover:bg-orange-700 text-white py-2.5 font-bold transition-all text-sm cursor-pointer"
                  >
                    {isAr ? 'طلب وحجز الدراجة' : 'Request Assignment'}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
