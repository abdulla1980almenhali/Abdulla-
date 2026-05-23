/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Motorcycle } from '../types';
import { Gauge, Zap, Weight, Fuel, GitCompare, Eye, ShoppingCart, RotateCw, Sparkles } from 'lucide-react';

interface MotorcycleCardProps {
  key?: string;
  lang: 'Ar' | 'En';
  bike: Motorcycle;
  onViewDetails: (b: Motorcycle) => void;
  onInquire: (b: Motorcycle) => void;
  onToggleCompare: (b: Motorcycle) => void;
  isComparing: boolean;
}

export default function MotorcycleCard({
  lang,
  bike,
  onViewDetails,
  onInquire,
  onToggleCompare,
  isComparing
}: MotorcycleCardProps) {
  const isAr = lang === 'Ar';
  const [show360, setShow360] = useState(false);
  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Card-Level Progressive 360 Preloading for Mobile performance
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);

  const startXRef = useRef<number>(0);
  const startAngleRef = useRef<number>(0);

  // Trigger frame preloading on hover activity or user 360 toggle
  useEffect(() => {
    if (!show360) {
      setIsPreloaded(false);
      setPreloadProgress(0);
      return;
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        // Preload memory reference 
        const hrImg = new Image();
        hrImg.src = bike.image;
        hrImg.referrerPolicy = 'no-referrer';
        hrImg.onload = () => {
          setIsPreloaded(true);
        };
      }
      setPreloadProgress(progress);
    }, 80);

    return () => clearInterval(interval);
  }, [show360, bike.image]);

  // Format category name for human eye
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'sport': return isAr ? 'رياضية (ريس)' : 'Sport';
      case 'cruiser': return isAr ? 'كروزر وكلاسيك' : 'Cruiser';
      case 'adventure': return isAr ? 'مغامرات وجبلي' : 'Adventure';
      case 'scooter': return isAr ? 'سكوتر' : 'Scooter';
      case 'naked': return isAr ? 'رياضية مكشوفة' : 'Naked Street';
      default: return category;
    }
  };

  // Drag logic for inline 360
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startAngleRef.current = angle;
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    const deltaAngle = Math.round(deltaX / 1.5);
    let targetAngle = (startAngleRef.current - deltaAngle) % 360;
    if (targetAngle < 0) targetAngle += 360;
    setAngle(targetAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
    startAngleRef.current = angle;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    const deltaAngle = Math.round(deltaX / 1.2);
    let targetAngle = (startAngleRef.current - deltaAngle) % 360;
    if (targetAngle < 0) targetAngle += 360;
    setAngle(targetAngle);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Angle transforms
  const isFlipped = angle >= 180 && angle < 360;
  const rad = (angle * Math.PI) / 180;
  const translationX = Math.sin(rad) * 10;
  const skewX = Math.sin(rad * 2) * 4;
  const scaleX = 1 + Math.abs(Math.cos(rad)) * 0.04;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 transition-all duration-300 hover:scale-[1.01] hover:border-zinc-700 hover:bg-zinc-900/70 hover:shadow-2xl hover:shadow-zinc-950/40">
      
      {/* Top badges floating */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 pointer-events-none">
        {bike.condition === 'new' ? (
          <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
            {isAr ? 'جديد 2026' : 'NEW 2026'}
          </span>
        ) : (
          <span className="rounded-lg bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 text-[10px] font-bold tracking-wider text-orange-400 uppercase">
            {isAr ? `مستعمل (${bike.mileage.toLocaleString()} كم)` : `USED (${bike.mileage.toLocaleString()} km)`}
          </span>
        )}
      </div>

      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
        {/* Toggle 360 View Badge */}
        <button
          onClick={() => setShow360(!show360)}
          className={`rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase transition-all border flex items-center gap-1 cursor-pointer ${
            show360
              ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-500/20'
              : 'bg-zinc-950/80 text-zinc-300 border-zinc-850 hover:text-orange-400 hover:bg-zinc-900'
          }`}
          title={isAr ? 'تشغيل المعاينة ثلاثية الأبعاد 360' : 'Toggle 360 view'}
        >
          <RotateCw className={`h-3 w-3 ${show360 ? 'animate-spin duration-3000' : ''}`} />
          <span>360°</span>
        </button>

        <span className="rounded-lg bg-zinc-950/80 px-2 py-1 text-[10px] font-medium text-zinc-300 backdrop-blur-sm pointer-events-none border border-zinc-900/40">
          {getCategoryLabel(bike.category)}
        </span>
      </div>

      {/* Image Container with Hover Zoom & Inline 360 Support */}
      <div 
        className="relative h-48 overflow-hidden bg-zinc-950 flex flex-col items-center justify-center select-none cursor-grab active:cursor-grabbing"
        onMouseDown={show360 ? handleMouseDown : undefined}
        onTouchStart={show360 ? handleTouchStart : undefined}
        onTouchMove={show360 ? handleTouchMove : undefined}
        onTouchEnd={show360 ? handleTouchEnd : undefined}
      >
        {!show360 ? (
          <>
            <img
              src={bike.image}
              alt={isAr ? bike.nameAr : bike.nameEn}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60 pointer-events-none"></div>

            {/* Quick Hover 360 Prompt */}
            <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="rounded-xl bg-orange-600/90 text-white font-bold text-xs py-2 px-4 shadow-xl flex items-center gap-1.5 backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-all">
                <RotateCw className="h-3.5 w-3.5 animate-spin duration-3000" />
                {isAr ? 'عرض تفاعلي 360°' : 'Interactive 360°'}
              </span>
            </div>
          </>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Showroom visual platform helper grid */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
              <div 
                className="w-48 h-[25px] rounded-full border border-orange-500/20 bg-gradient-to-t from-orange-500/10 to-transparent"
                style={{
                  transform: `perspective(200px) rotateX(75deg) rotateZ(${-angle}deg)`
                }}
              ></div>
            </div>

            {/* Simulated 3D image scaling & flipping with blur transition support */}
            <div 
              className={`relative max-w-[200px] h-32 flex items-center justify-center transition-all duration-500 ${
                isFlipped ? 'scale-x-100' : 'scale-x-[-1]'
              }`}
              style={{
                transform: `translateX(${translationX}px)`,
              }}
            >
              <img
                src={bike.image}
                alt={isAr ? bike.nameAr : bike.nameEn}
                className={`object-contain w-full h-full filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.8)] transition-all duration-500 ${
                  isPreloaded ? 'blur-0 opacity-100' : 'blur-lg opacity-30 scale-90'
                }`}
                style={{
                  transform: `perspective(500px) skewX(${skewX}deg) scaleX(${scaleX})`,
                }}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Visual scan indicator */}
            {isPreloaded && (
              <div className="absolute inset-x-0 h-[1px] bg-orange-500/30 top-1/2 pointer-events-none animate-pulse"></div>
            )}

            {/* Dynamic Card-Level Progressive 360 preloader overlay */}
            {!isPreloaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px] uppercase font-bold tracking-wider mb-1 bg-zinc-900 border border-zinc-850 py-1 px-2.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
                  <span>{isAr ? `جاري التخزين ${preloadProgress}%` : `Buffering ${preloadProgress}%`}</span>
                </div>
                <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-widest">{isAr ? 'عرض ذكي موفر للبيانات' : 'Smart Data-Saver Active'}</span>
              </div>
            )}

            {/* Angle status HUD details */}
            {isPreloaded && (
              <div className="absolute bottom-2 left-3 bg-zinc-950/80 border border-zinc-850 py-0.5 px-2 rounded-md text-[8px] font-mono text-zinc-400 flex items-center gap-1 transition-all">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                <span>ANGLE_Y: <span className="text-orange-400">{angle}°</span></span>
              </div>
            )}

            {/* Draggable range slider */}
            {isPreloaded && (
              <div className="absolute bottom-2 right-3 left-24 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <input
                  type="range"
                  min="0"
                  max="359"
                  value={angle}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    setAngle(parseInt(e.target.value, 10));
                  }}
                  className="w-full h-1 bg-zinc-800 accent-orange-600 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        
        {/* Brand & Year Row */}
        <div className="flex items-center justify-between text-xs text-orange-500 mb-1 font-mono">
          <span>{isAr ? bike.brandAr : bike.brandEn}</span>
          <span>{bike.year}</span>
        </div>

        {/* Title */}
        <h4 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-orange-400 transition-colors">
          {isAr ? bike.nameAr : bike.nameEn}
        </h4>

        {/* Brief Description */}
        <p className="text-xs text-zinc-400 line-clamp-2 mb-4 h-8 leading-relaxed">
          {isAr ? bike.descriptionAr : bike.descriptionEn}
        </p>

        {/* Essential Specs Grid */}
        <div className="grid grid-cols-4 gap-2 border-y border-zinc-800 py-3 mb-4 text-center">
          <div className="space-y-0.5">
            <div className="flex justify-center text-zinc-500 group-hover:text-orange-500/30 transition-colors">
              <Gauge className="h-3.5 w-3.5" />
            </div>
            <p className="font-mono text-xs font-semibold text-zinc-200">{bike.engineSize}cc</p>
            <p className="text-[9px] text-zinc-500">{isAr ? 'المحرك' : 'CC'}</p>
          </div>
          
          <div className="space-y-0.5">
            <div className="flex justify-center text-zinc-500 group-hover:text-orange-500/30 transition-colors">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <p className="font-mono text-xs font-semibold text-zinc-200">{bike.power}hp</p>
            <p className="text-[9px] text-zinc-500">{isAr ? 'القوة' : 'HP'}</p>
          </div>

          <div className="space-y-0.5">
            <div className="flex justify-center text-zinc-500 group-hover:text-orange-500/30 transition-colors">
              <Weight className="h-3.5 w-3.5" />
            </div>
            <p className="font-mono text-xs font-semibold text-zinc-200">{bike.weight}kg</p>
            <p className="text-[9px] text-zinc-500">{isAr ? 'الوزن' : 'Weight'}</p>
          </div>

          <div className="space-y-0.5">
            <div className="flex justify-center text-zinc-500 group-hover:text-orange-500/30 transition-colors">
              <Fuel className="h-3.5 w-3.5" />
            </div>
            <p className="font-mono text-xs font-semibold text-zinc-200">{bike.fuelCapacity}L</p>
            <p className="text-[9px] text-zinc-500">{isAr ? 'الخزان' : 'Fuel'}</p>
          </div>
        </div>

        {/* Pricing Row */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] text-zinc-500">{isAr ? 'السعر الإجمالي' : 'Total Price'}</p>
            <span className="text-xl font-bold tracking-tight text-white">
              {bike.price.toLocaleString()}
              <span className="text-xs font-normal text-orange-500 mr-1">
                {isAr ? 'ر.س' : 'SAR'}
              </span>
            </span>
          </div>

          {/* Quick specs pill */}
          <span className="rounded bg-zinc-950 px-2 py-1 text-[10px] font-mono text-zinc-400">
            {bike.colorAr.split(' ')[0]}
          </span>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Compare Button */}
          <button
            onClick={() => onToggleCompare(bike)}
            className={`flex items-center justify-center gap-1.5 rounded-2xl border py-2.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
              isComparing
                ? 'bg-orange-500/10 text-orange-400 border-orange-500'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title={isAr ? 'أضف للمقارنة الثنائية' : 'Add to Compare list'}
          >
            <GitCompare className="h-4 w-4" />
            <span className="hidden leading-none xl:inline">{isAr ? 'مقارنة' : 'Compare'}</span>
          </button>

          {/* Details Modal Trigger */}
          <button
            onClick={() => onViewDetails(bike)}
            className="flex items-center justify-center gap-1.5 rounded-2xl border border-zinc-800 bg-zinc-950 py-2.5 text-xs text-white hover:bg-zinc-855 hover:text-orange-400 transition-all cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            <span className="leading-none">{isAr ? 'تفاصيل' : 'Details'}</span>
          </button>

          {/* Quote Inquiry Trigger */}
          <button
            onClick={() => onInquire(bike)}
            className="flex items-center justify-center gap-1.2 rounded-2xl bg-orange-600 py-2.5 text-xs font-bold text-white hover:bg-orange-700 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="leading-none">{isAr ? 'دفع' : 'Order'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
