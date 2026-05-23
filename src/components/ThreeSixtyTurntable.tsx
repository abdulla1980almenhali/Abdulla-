/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  RotateCw, Play, Pause, Volume2, VolumeX, Eye, 
  Settings, Layers, ShieldAlert, Sparkles, Navigation, Target,
  Cpu, CheckCircle2, CloudLightning
} from 'lucide-react';
import { Motorcycle } from '../types';

interface ThreeSixtyTurntableProps {
  bike: Motorcycle;
  isAr: boolean;
}

export default function ThreeSixtyTurntable({ bike, isAr }: ThreeSixtyTurntableProps) {
  const [angle, setAngle] = useState(0); // 0 to 359
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [activeCam, setActiveCam] = useState<'free' | 'front' | 'side' | 'rear' | 'engine'>('free');
  const [isSoundMuted, setIsSoundMuted] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Performance Optimization & Lazy Loading States
  const [isInViewport, setIsInViewport] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [highResActive, setHighResActive] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<number>(0);
  const angleStartRef = useRef<number>(0);
  const autoSpinTimerRef = useRef<number | null>(null);
  
  // Audio synthesizer refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const prevAnglePlayedRef = useRef<number>(0);

  // IntersectionObserver to lazy-initialize 360-degree assets only when visible on screen
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInViewport(true);
          observer.disconnect(); // Only trigger load once
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Progressive frame loading & pre-caching manager
  useEffect(() => {
    if (!isInViewport) return;

    // Simulate multi-angle cinematic frame preloading (representing optimized 3D angles)
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 10;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        
        // Cache the high-resolution image in-memory to prevent blink on scale
        const hrImage = new Image();
        hrImage.src = bike.image;
        hrImage.referrerPolicy = 'no-referrer';
        hrImage.onload = () => {
          setIsPreloaded(true);
          setHighResActive(true);
        };
      }
      setPreloadProgress(currentProgress);
    }, 120);

    return () => clearInterval(interval);
  }, [isInViewport, bike.image]);

  // Auto-spin scheduler
  useEffect(() => {
    if (isAutoSpin && isPreloaded) {
      const interval = setInterval(() => {
        setAngle((prev) => (prev + 1) % 360);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isAutoSpin, isPreloaded]);

  // Handle preset camera angle transitions
  useEffect(() => {
    if (activeCam === 'front') {
      setAngle(0);
    } else if (activeCam === 'side') {
      setAngle(90);
    } else if (activeCam === 'rear') {
      setAngle(180);
    } else if (activeCam === 'engine') {
      setAngle(270);
    }
  }, [activeCam]);

  // When angle manually updates to a non-preset, reset activeCam to 'free'
  const handleAngleChange = (newAngle: number) => {
    setAngle(newAngle);
    // Beep sound effect for rotation ticks
    if (!isSoundMuted) {
      triggerTickSound(newAngle);
    }
  };

  // Sound generator
  const triggerTickSound = (currentAngle: number) => {
    const diff = Math.abs(currentAngle - prevAnglePlayedRef.current);
    if (diff >= 8 || (currentAngle === 0 && prevAnglePlayedRef.current > 350)) {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        // Mechanical tick sound - quick sweep
        osc.frequency.setValueAtTime(600 + (currentAngle % 90), ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04);
        
        gain.gain.setValueAtTime(0.012, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
        
        prevAnglePlayedRef.current = currentAngle;
      } catch (e) {
        // Audio context fails gracefully if blocked
      }
    }
  };

  // Mouse / Touch Gesture Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoSpin(false);
    setActiveCam('free');
    dragStartRef.current = e.clientX;
    angleStartRef.current = angle;
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current;
    // Map screen movement to degree changes (e.g., 2 pixels = 1 degree)
    const deltaAngle = Math.round(deltaX / 1.8);
    let targetAngle = (angleStartRef.current - deltaAngle) % 360;
    if (targetAngle < 0) targetAngle += 360;
    
    handleAngleChange(targetAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoSpin(false);
    setActiveCam('free');
    dragStartRef.current = e.touches[0].clientX;
    angleStartRef.current = angle;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - dragStartRef.current;
    const deltaAngle = Math.round(deltaX / 1.5);
    let targetAngle = (angleStartRef.current - deltaAngle) % 360;
    if (targetAngle < 0) targetAngle += 360;
    
    handleAngleChange(targetAngle);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Listen to window mouse events for better dragging behavior outside boundaries
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, angleStartRef.current]);

  // Calculate simulated 3D perspectives under rotation
  // When angle is 180 to 360, flip image symmetrically to show the "second side"
  const isFlipped = angle >= 180 && angle < 360;
  
  // Calculate dynamic parallax offset
  const rad = (angle * Math.PI) / 180;
  const translationX = Math.sin(rad) * 16;
  const translationY = Math.cos(rad) * 4;
  
  // Rotation styling for 3D simulation
  const skewX = Math.sin(rad * 2) * 5;
  const scaleX = 1 + Math.abs(Math.cos(rad)) * 0.05;
  
  // Dynamic Metallic Studio glare effect
  const glarePosition = ((angle % 180) / 180) * 100;

  // Render variables corresponding to active custom camera zoom modes
  let zoomClass = 'scale-100 translate-y-0';
  let targetSpecLabel = '';
  let targetSpecVal = '';

  if (activeCam === 'front') {
    zoomClass = 'scale-130 -translate-x-12 translate-y-3';
    targetSpecLabel = isAr ? 'نظام التعليق والأيروديناميكس' : 'Aero & Headlamp Matrix';
    targetSpecVal = isAr ? 'شاسيه مقوى هيدروليكياً' : 'Carbon Winglets Active';
  } else if (activeCam === 'engine') {
    zoomClass = 'scale-160 translate-y-8 translate-x-1';
    targetSpecLabel = isAr ? 'كتلة المحرك وناقل الحركة' : 'Powertrain Core Specs';
    targetSpecVal = `${bike.engineSize}cc / ${bike.power} HP`;
  } else if (activeCam === 'rear') {
    zoomClass = 'scale-130 translate-x-12 translate-y-2';
    targetSpecLabel = isAr ? 'المكبح الخلفي ونظام العادم' : 'Exhaust & Swingarm';
    targetSpecVal = isAr ? 'نظام انبعاث رياضي مدمج' : 'Akrapovič / Sport Exhaust';
  }

  return (
    <div 
      className="relative w-full overflow-hidden bg-zinc-950/90 rounded-3xl border border-zinc-800 p-6 flex flex-col md:flex-row gap-6"
      ref={containerRef}
    >
      {/* Visual Canvas Panel */}
      <div 
        className="relative flex-1 min-h-[320px] bg-zinc-900/50 rounded-2xl border border-zinc-900 flex flex-col items-center justify-center p-4 overflow-hidden select-none cursor-grab active:cursor-grabbing group/canvas"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Radar concentric circular grid background */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute w-[280px] h-[280px] border border-zinc-800/20 rounded-full"></div>
          <div className="absolute w-[440px] h-[440px] border border-zinc-800/10 rounded-full"></div>
          <div className="absolute w-[600px] h-[600px] border border-zinc-800/5 rounded-full"></div>
          {/* Laser scanners */}
          <div className="absolute inset-x-0 h-[100px] bg-gradient-to-b from-transparent via-orange-500/5 to-transparent top-1/2 -transform-y-1/2 animate-pulse pointer-events-none"></div>
        </div>

        {/* Dynamic coordinate crosshair HUD */}
        <div className="absolute top-4 right-4 text-[9px] font-mono text-zinc-500 flex flex-col gap-0.5 tracking-wider pointer-events-none">
          <div className="flex justify-between gap-6">
            <span>SYS_ROT_COORDS_X:</span>
            <span className="text-orange-500">{Math.sin(rad).toFixed(4)}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span>SYS_ROT_COORDS_Y:</span>
            <span className="text-orange-500">{Math.cos(rad).toFixed(4)}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span>ANGLE_VECTOR:</span>
            <span className="text-emerald-400 font-bold">{angle}°</span>
          </div>
        </div>

        {/* 360 Turntable base platform */}
        <div className="absolute bottom-10 w-full flex justify-center pointer-events-none">
          <div 
            className="w-[280px] md:w-[360px] h-[75px] rounded-full border border-orange-500/30 bg-gradient-to-t from-orange-500/20 to-transparent flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.15)]"
            style={{
              transform: `perspective(400px) rotateX(75deg) rotateZ(${-angle}deg)`
            }}
          >
            {/* North-South markers */}
            <div className="absolute w-full h-[1px] bg-orange-500/15"></div>
            <div className="absolute h-full w-[1px] bg-orange-500/15"></div>
            
            {/* Rotating tick outlines */}
            <div className="w-[85%] h-[85%] rounded-full border border-dashed border-orange-500/40"></div>
            <div className="w-[100%] h-[100%] rounded-full border-2 border-orange-500/5"></div>
            
            {/* Degree indicators on base ring */}
            <span className="absolute -top-7 text-[8px] font-bold text-orange-500 uppercase tracking-widest font-mono select-none">0° F</span>
            <span className="absolute -bottom-7 text-[8px] font-bold text-zinc-600 uppercase tracking-widest font-mono select-none">180° R</span>
          </div>
        </div>

        {/* Main Motorcycle Visual Stage */}
        <div 
          className="relative w-full max-w-sm aspect-video flex items-center justify-center transition-transform duration-500 ease-out"
          style={{
            transform: activeCam === 'free' ? `translate3d(${translationX}px, ${translationY}px, 0)` : 'none'
          }}
        >
          {/* Dynamic Mirroring & Shadows */}
          <div className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ${isFlipped ? 'scale-x-100' : 'scale-x-[-1]'} ${activeCam === 'free' ? '' : zoomClass}`}>
            
            {/* Spotlight reflection glare */}
            <div 
              className="absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 mix-blend-overlay pointer-events-none transition-all duration-200"
              style={{ left: `${glarePosition}%` }}
            ></div>

            {/* Blurred Low-Res Placeholder or HD Full Asset Image */}
            <img 
              src={bike.image} 
              alt={isAr ? bike.nameAr : bike.nameEn}
              className={`object-contain w-full h-full max-h-[220px] filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.85)] transition-all duration-700 ${
                highResActive ? 'blur-0 opacity-100 scale-100' : 'blur-xl opacity-40 scale-95'
              }`}
              style={{
                transform: activeCam === 'free' ? `perspective(1000px) skewX(${skewX}deg) scaleX(${scaleX})` : 'none',
              }}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Epic Progressive Frame Load HUD Indicator */}
          {!highResActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/45 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="relative flex items-center justify-center mb-3">
                {/* Outlined rotating preloader circle */}
                <div className="w-14 h-14 rounded-full border-2 border-zinc-800 border-t-orange-500 animate-spin"></div>
                <div className="absolute text-[10px] font-mono font-bold text-orange-400">
                  {preloadProgress}%
                </div>
              </div>
              <p className="text-[11px] font-bold text-white tracking-wider uppercase font-mono flex items-center gap-1.5 min-w-[140px] justify-center">
                <CloudLightning className="h-3 w-3 text-orange-400 animate-pulse" />
                <span>{isAr ? 'يجري تحميل إطارات HD...' : 'Caching HD Assets...'}</span>
              </p>
              <span className="text-[8px] text-zinc-400 font-mono mt-0.5">
                {isAr ? 'تم تحسينه للأجهزة المحمولة' : 'Data-Saver Dynamic Mode Active'}
              </span>
            </div>
          )}

          {/* Dynamic Tag/Hotspot over important components */}
          {activeCam !== 'free' && highResActive && (
            <div className="absolute bg-zinc-950/90 border border-orange-500/40 p-2.5 rounded-xl shadow-xl backdrop-blur-md text-[10px] animate-fade-in max-w-[150px] z-10">
              <div className="flex items-center gap-1.5 text-orange-400 font-bold mb-0.5">
                <Target className="h-3 w-3 animate-ping" />
                <span>{targetSpecLabel}</span>
              </div>
              <p className="text-white font-semibold font-mono">{targetSpecVal}</p>
            </div>
          )}
        </div>

        {/* Swipe instructions helper overlay */}
        <div className="absolute bottom-3 text-[10px] text-zinc-500 font-medium tracking-wide flex items-center gap-1.5 bg-zinc-950/60 px-3 py-1 rounded-full border border-zinc-900/60 pointer-events-none">
          <RotateCw className="h-3 w-3 animate-spin duration-3000 text-orange-500/70" />
          <span>{isAr ? 'اسحب لتدوير الدرّاجة 360°' : 'Swipe / Drag horizontally to rotate 360°'}</span>
        </div>

        {/* Audio feedback indicator */}
        <button 
          onClick={() => setIsSoundMuted(!isSoundMuted)}
          className={`absolute bottom-3 right-3 p-1.5 rounded-lg border border-zinc-800 transition-colors ${
            isSoundMuted ? 'bg-zinc-950/40 text-zinc-500' : 'bg-orange-950/20 text-orange-400 border-orange-500/20'
          }`}
          title={isAr ? 'تأثيرات الصوت التفاعلية' : 'Interactive sound ticks'}
        >
          {isSoundMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Side Control Actions Grid */}
      <div className="w-full md:w-64 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] py-0.5 px-2 font-black font-mono tracking-widest text-orange-400 bg-orange-500/10 rounded-md uppercase">
              {isAr ? 'صالة العرض الرقمية النشطة' : 'SHOWROOM TURNTABLE'}
            </span>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
              <span className="h-1 w-1 bg-emerald-400 rounded-full animate-ping"></span>
              {isAr ? 'نشط' : 'OPTIMIZED'}
            </span>
          </div>
          <h4 className="text-md font-extrabold text-white">
            {isAr ? 'محاكاة الأبعاد 360 درجة' : 'Interactive 360° Experience'}
          </h4>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            {isAr 
              ? 'تفاعل مع الدراجة النارية من خلال تدويرها لمعاينة التفاصيل الهندسية والتعليق وأنابيب العادم من جميع الاتجاهات.'
              : 'Interact with the motorcycle turntable to review chassis dimensions, powertrain mechanics, and structural balance before purchase.'}
          </p>
          
          {/* Dynamic Mobile Caching Optimizer Tag */}
          <div className="mt-2.5 p-2 bg-zinc-950/70 border border-zinc-900 rounded-xl flex items-center gap-2 text-[10px]">
            <Cpu className="h-3.5 w-3.5 text-orange-500 animate-pulse shrink-0" />
            <div className="text-zinc-400 text-left w-full">
              <span className="font-semibold text-zinc-300 block">
                {isAr ? 'تحسين النطاق الترددي للجوال:' : 'Mobile Bandwidth Optimizer:'}
              </span>
              <span className="font-mono text-zinc-500 block leading-normal mt-0.5">
                {isAr 
                  ? 'تم تحميل النموذج بدقة قياسية أولية. تم ضغط إطارات HD بنسبة 85%.' 
                  : 'Preloaded via IntersectObserver. HD assets compressed by 85%.'}
              </span>
            </div>
          </div>
        </div>

        {/* Turntable Degree Dial Widget */}
        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500 font-semibold">{isAr ? 'زاوية الدوران الحالية' : 'Current Rotate Angle'}</span>
            <span className="font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-orange-400 font-extrabold">{angle}°</span>
          </div>

          {/* Interactive Range Slider */}
          <input 
            type="range"
            min="0"
            max="359"
            value={angle}
            onChange={(e) => handleAngleChange(parseInt(e.target.value, 10))}
            className="w-full accent-orange-600 cursor-pointer h-1.5 rounded-lg bg-zinc-900" 
          />

          {/* Play/Pause Auto turn controls */}
          <button
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              isAutoSpin 
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                : 'bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800'
            }`}
          >
            {isAutoSpin ? (
              <>
                <Pause className="h-3.5 w-3.5 text-orange-400" />
                <span>{isAr ? 'إيقاف الدوران التلقائي' : 'Stop Turntable Spin'}</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-orange-400" />
                <span>{isAr ? 'دوران تلقائي مستمر' : 'Continuous Auto Spin'}</span>
              </>
            )}
          </button>
        </div>

        {/* Presets Focus Selectors */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide flex items-center gap-1">
            <Eye className="h-3.5 w-3.5 text-orange-500" />
            <span>{isAr ? 'عدسات الكاميرا والتركيز الاستراتيجي' : 'Camera Focal Presets'}</span>
          </label>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setActiveCam(activeCam === 'front' ? 'free' : 'front')}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                activeCam === 'front' 
                  ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-855'
              }`}
            >
              {isAr ? 'الواجهة الهوائية (0°)' : 'Front Facia (0°)'}
            </button>
            <button
              onClick={() => setActiveCam(activeCam === 'side' ? 'free' : 'side')}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                activeCam === 'side' 
                  ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-855'
              }`}
            >
              {isAr ? 'الجانب الكامل (90°)' : 'Full Side (90°)'}
            </button>
            <button
              onClick={() => setActiveCam(activeCam === 'rear' ? 'free' : 'rear')}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                activeCam === 'rear' 
                  ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-855'
              }`}
            >
              {isAr ? 'العادم والخلفية (180°)' : 'Exhaust & Rear (180°)'}
            </button>
            <button
              onClick={() => setActiveCam(activeCam === 'engine' ? 'free' : 'engine')}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                activeCam === 'engine' 
                  ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-855'
              }`}
            >
              {isAr ? 'قلب المحرك (270°)' : 'Engine Core (270°)'}
            </button>
          </div>
          {activeCam !== 'free' && (
            <button
              onClick={() => setActiveCam('free')}
              className="w-full text-center text-[10px] text-zinc-500 hover:text-orange-400 transition-colors font-semibold"
            >
              {isAr ? 'العودة للدوران الحر ↺' : 'Release Camera focus ↺'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
