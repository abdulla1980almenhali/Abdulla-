/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Compass, GitCompare, MessageSquareCode, Sparkles, Languages } from 'lucide-react';

interface NavbarProps {
  lang: 'Ar' | 'En';
  setLang: (l: 'Ar' | 'En') => void;
  compareCount: number;
  scrollToCompare: () => void;
  toggleAiDrawer: () => void;
  inquiriesCount: number;
  setViewInquiries: (v: boolean) => void;
  viewInquiries: boolean;
}

export default function Navbar({
  lang,
  setLang,
  compareCount,
  scrollToCompare,
  toggleAiDrawer,
  inquiriesCount,
  setViewInquiries,
  viewInquiries
}: NavbarProps) {
  const isAr = lang === 'Ar';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-600 to-orange-500 shadow-lg shadow-orange-500/20">
            <span className="font-sans text-xl font-bold text-white">M</span>
            <div className="absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full bg-orange-400 opacity-75"></div>
          </div>
          <div>
            <h1 className="font-heading text-xl font-black tracking-tight text-white">
              {isAr ? 'موتو ' : 'MOTOR'}<span className="text-orange-500">{isAr ? 'اكس' : 'X'}</span>
            </h1>
            <p className="font-mono text-[10px] text-orange-500 uppercase tracking-widest">
              {isAr ? 'صالة العرض الرقمية الفاخرة' : 'Boutique Showroom'}
            </p>
          </div>
        </div>

        {/* Center Icons and Links */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <button 
            onClick={() => setViewInquiries(!viewInquiries)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
              viewInquiries 
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-orange-500" />
            <span>{isAr ? 'الطلبات الواردة' : 'Inbox Queries'}</span>
            {inquiriesCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">
                {inquiriesCount}
              </span>
            )}
          </button>

          <button
            onClick={scrollToCompare}
            className="flex items-center gap-2 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <GitCompare className="h-4 w-4 text-orange-500" />
            <span>{isAr ? 'المقارنة الثنائية' : 'Side-by-Side Compare'}</span>
            {compareCount > 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">
                {compareCount}
              </span>
            )}
          </button>
        </div>

        {/* Right side interactions */}
        <div className="flex items-center gap-3">
          {/* Virtual Assistant Button */}
          <button
            onClick={toggleAiDrawer}
            className="relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-orange-500/10 transition-all hover:scale-[1.02] hover:shadow-orange-500/20 active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="h-4 w-4 animate-pulse text-white" />
            <span className="hidden sm:inline">
              {isAr ? 'مستشار الدراجات الذكي' : 'AI Bike Consultant'}
            </span>
            <span className="sm:hidden">{isAr ? 'المستشار' : 'AI Helper'}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(isAr ? 'En' : 'Ar')}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all hover:border-zinc-700 hover:text-white cursor-pointer"
            title={isAr ? 'English' : 'العربية'}
          >
            <Languages className="h-4 w-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
