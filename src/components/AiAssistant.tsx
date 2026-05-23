/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, X, RefreshCw, MessageSquareCode, ShieldCheck, Check } from 'lucide-react';
import { Message } from '../types';

interface AiAssistantProps {
  lang: 'Ar' | 'En';
  isOpen: boolean;
  onClose: () => void;
}

export default function AiAssistant({
  lang,
  isOpen,
  onClose
}: AiAssistantProps) {
  const isAr = lang === 'Ar';
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: isAr
        ? 'مرحباً بك في صالة موتو زون الفاخرة! أنا مستشارك الذكي للدراجات النارية. كيف يمكنني مساعدتك اليوم في اختيار دراجة أحلامك، مقارنة المحركات، أو حساب الأقساط؟'
        : 'Welcome to MotoZone premium showroom! I am your AI Motorcycle Consultant. How can I help you discover, compare or order your ideal ride today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const updatedMessages = [...messages, userMsg];
      const response = await fetch('/api/gemini/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'model', text: data.text }]);
      } else {
        const data = await response.json();
        setMessages(prev => [...prev, {
          role: 'model',
          text: isAr
            ? `عذراً، حدث خطأ: ${data.error || 'فشل تحميل الرد'}`
            : `Sorry, an error occurred: ${data.error || 'Failed to get answer'}`
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: isAr
          ? 'تعذر الاتصال بالخادم. الرجاء التأكد من وجود مفتاح API مفعل في الإعدادات.'
          : 'Failed to contact the server node. Please ensure GEMINI_API_KEY is active in Settings.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'model',
        text: isAr
          ? 'أهلاً بك مجدداً. تم تصفير سجل الاستشارات. اسألني عن أي دراجة رياضية، كلاسيكية، جبلي، أو سكوتر ترغب به!'
          : 'System restarted. Chat history cleared. Ask me about any sport, cruiser, adventure, or scooter catalog!'
      }
    ]);
  };

  const suggestions = isAr
    ? [
        { label: 'أسرع دراجة نارية رياضية 🏁', text: 'ما هي أسرع درجتين رياضيتين متوفرة لديكم وما ميزاتها وسعرها؟' },
        { label: 'دراجة كروزر مريحة 🛣️', text: 'أريد دراجة كلاسيكية كروزر مريحة للسفر، ما الذي تنصحني به؟' },
        { label: 'أفضل دراجة للمبتدئين 🔰', text: 'أنا مبتدئ وأبحث عن دراجة رخيصة وسهلة التحكم، ماذا تقترح؟' },
        { label: 'دراجة للبر والكثبان 🏜️', text: 'ما هي مواصفات البي إم دبليو وهل هي مناسبة للبر وتخطي الكثبان الرملية والدروب الصحراوية؟' }
      ]
    : [
        { label: 'Fastest sports bike 🏁', text: 'What is your fastest and highest performance sports model in stock, its specs, and total cost?' },
        { label: 'Cruiser for travel 🛣️', text: 'Recommend a comfortable cruiser model for cross-city touring with solid road stance.' },
        { label: 'Perfect beginner choice 🔰', text: 'I am a beginner under average budget. What easy-to-ride entry models do you have?' },
        { label: 'Dune conqueror 🏜️', text: 'Show me your extreme offroad dual-sport options with solid mud clearance.' }
      ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-gray-800 bg-gray-950 shadow-2xl transition-transform duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900/60 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {isAr ? 'مستشار الدراجات الذكي' : 'AI Bike Consultant'}
            </h3>
            <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {isAr ? 'يعمل بنموذج ديب مايند Gemini' : 'Powered by Gemini 3.5'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
            title={isAr ? 'مسح المحادثة' : 'Reset Chat'}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isModel = msg.role === 'model';
          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                isModel ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  isModel ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-800 text-gray-300'
                }`}
              >
                {isModel ? <Bot className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
              </div>
              <div
                className={`flex flex-col max-w-[80%]`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                    isModel
                      ? 'bg-gray-900/40 border border-gray-800 text-gray-200'
                      : 'bg-amber-500 text-gray-950 font-medium'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[9px] text-gray-500 mt-1 self-start font-mono">
                  {isModel ? (isAr ? 'المستشار الذكي' : 'Consultant') : (isAr ? 'أنت' : 'You')}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Bot className="h-4.5 w-4.5 animate-bounce" />
            </div>
            <div className="rounded-2xl bg-gray-900/40 border border-gray-800 px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>{isAr ? 'جاري مراجعة الكتالوج الحقيقي...' : 'Analyzing real inventory...'}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Bubbles (Only if no custom chat depth has been written, or small helper buttons) */}
      <div className="px-4 py-2 border-t border-gray-800 bg-gray-900/20 space-y-1.5">
        <p className="text-[10px] text-gray-500 font-bold block">
          {isAr ? 'اقتراحات سريعة للحديث:' : 'Quick Prompts:'}
        </p>
        <div className="flex flex-wrap gap-1">
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug.text)}
              className="rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-850 px-2.5 py-1.5 text-[10px] text-gray-300 transition-all cursor-pointer hover:border-amber-500/40 hover:text-white"
            >
              {sug.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Footer */}
      <div className="border-t border-gray-800 bg-gray-950 p-4">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend(input);
            }}
            placeholder={isAr ? 'اسأل المستشار عن دراجة نارية، سعر...' : 'Ask about financing, speed, specs...'}
            className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-xs text-white placeholder-gray-500 transition-colors focus:border-amber-500 focus:outline-none pr-10"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || loading}
            className="absolute right-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-gray-800 p-2 text-gray-950 disabled:text-gray-600 transition-all cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-[9px] text-gray-500 mt-2 text-center leading-normal">
          {isAr 
            ? 'ملاحظة: هذا الكيان الذكي يستند مباشرة إلى كتالوج دراجات المعرض الفعلي.'
            : 'Note: Counsel responses reference strictly standard live dealer logs.'}
        </p>
      </div>

    </div>
  );
}
