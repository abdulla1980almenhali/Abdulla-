/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Motorcycle } from '../types';
import { X, CheckCircle2, Phone, User, Mail, FileText, Send, CalendarRange, Landmark, Coins } from 'lucide-react';

interface InquiryModalProps {
  lang: 'Ar' | 'En';
  bike: Motorcycle | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InquiryModal({
  lang,
  bike,
  onClose,
  onSuccess
}: InquiryModalProps) {
  const isAr = lang === 'Ar';
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    type: 'buy' as 'buy' | 'test_drive' | 'finance',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!bike) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.phone.trim()) {
      setError(isAr ? 'الرجاء تعبئة الاسم ورقم الهاتف' : 'Please fill name and phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const resp = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bikeId: bike.id,
          bikeName: bike.nameAr,
          ...formData
        })
      });

      if (resp.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1800);
      } else {
        const errorData = await resp.json();
        setError(errorData.error || (isAr ? 'حدث خطأ في تقديم الطلب.' : 'Error submitting request.'));
      }
    } catch (err) {
      setError(isAr ? 'عذراً، فشل الاتصال بالخادم.' : 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {isAr ? 'تم تقديم طلبك بنجاح!' : 'Request Sent Successfully!'}
              </h3>
              <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                {isAr 
                  ? 'نشكرك على اختيارك موتو زون. سيقوم مستشار المبيعات بالتواصل معك هاتفياً خلال 24 ساعة.' 
                  : 'Thank you for choosing MotoZone. An inventory consultant will contact you via phone within 24 hours.'}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Header */}
            <div>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                {isAr ? 'بوابة الحجز المباشر' : 'Secure Booking Terminal'}
              </span>
              <h3 className="text-xl font-bold text-white leading-snug">
                {isAr ? `طلب دراجة: ${bike.nameAr}` : `Order Setup: ${bike.nameEn}`}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {isAr ? 'يرجى تقديم بياناتك ليتم توجيه طلبك فوراً لمستشار مبيعات الصالة.' : 'Submit details to trigger sales assignment.'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
                {error}
              </div>
            )}

            {/* Inquiry/Booking Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 block">
                {isAr ? 'نوع الطلب المفضل' : 'Pre-selected Option'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'buy' }))}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all cursor-pointer ${
                    formData.type === 'buy'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                      : 'border-gray-800 bg-gray-950 text-gray-400 hover:text-white'
                  }`}
                >
                  <Coins className="h-4.5 w-4.5" />
                  <span className="text-[10px] font-bold">{isAr ? 'شراء نقدي' : 'Cash buy'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'test_drive' }))}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all cursor-pointer ${
                    formData.type === 'test_drive'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                      : 'border-gray-800 bg-gray-950 text-gray-400 hover:text-white'
                  }`}
                >
                  <CalendarRange className="h-4.5 w-4.5" />
                  <span className="text-[10px] font-bold">{isAr ? 'تجربة قيادة' : 'Test Drive'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'finance' }))}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all cursor-pointer ${
                    formData.type === 'finance'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                      : 'border-gray-800 bg-gray-950 text-gray-400 hover:text-white'
                  }`}
                >
                  <Landmark className="h-4.5 w-4.5" />
                  <span className="text-[10px] font-bold">{isAr ? 'طلب تمويل' : 'Financing'}</span>
                </button>

              </div>
            </div>

            {/* Client Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-amber-500" />
                <span>{isAr ? 'الاسم الثنائي الكامل' : 'Applicant Full Name'}</span>
              </label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder={isAr ? 'مثال: محمد السديري' : 'e.g. Salim Al-Otaibi'}
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-2 text-sm text-white placeholder-gray-600 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Phone Number Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-amber-500" />
                <span>{isAr ? 'رقم الجوال لتأكيد الحجز' : 'Phone Number'}</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder={isAr ? '966 5x xxx xxxx' : '+966 50 123 4567'}
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-2 text-sm text-white placeholder-gray-600 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Email Address Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-amber-500" />
                <span>{isAr ? 'البريد الإلكتروني (اختياري)' : 'Email Address (Optional)'}</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-2 text-sm text-white placeholder-gray-600 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Notes Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-amber-500" />
                <span>{isAr ? 'ملاحظات إضافية وموعد الاتصال المفضل' : 'Add custom requests or call times'}</span>
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder={isAr ? 'اكتب أي طلب مخصص أو خيار تمويل تفضله...' : 'e.g. looking for 2 years payment plans...'}
                rows={3}
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-2 text-sm text-white placeholder-gray-600 focus:border-amber-500 focus:outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-gray-950 hover:bg-amber-400 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-950 border-t-transparent"></span>
              ) : (
                <>
                  <Send className="h-4.5 w-4.5" />
                  <span>{isAr ? 'إرسال طلب الحجز والاتصال' : 'Transmit Booking Packet'}</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
