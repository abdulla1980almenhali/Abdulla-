/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { MOTORCYCLES } from './src/data';
import dotenv from 'dotenv';

// Load environment variables (.env)
dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // Initialize Gemini Client
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log('Gemini API client initialized successfully.');
  } else {
    console.warn('Warning: GEMINI_API_KEY is not defined in the environment variables.');
  }

  // API Route: AI Motorcycle Consultant Proxy
  app.post('/api/gemini/consult', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: 'Gemini Assistant is currently misconfigured. Please set your GEMINI_API_KEY in the Secrets panel.'
        });
      }

      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Please provide valid messages block.' });
      }

      // Convert our current showroom catalog schema into a simplified catalog string to feed the system instruction
      const catalogDescription = MOTORCYCLES.map(bike => {
        return `- الاسم: ${bike.nameAr} (${bike.nameEn})
  العلامة التجارية: ${bike.brandAr} (${bike.brandEn})
  التصنيف: ${bike.category}
  السعر: ${bike.price} ر.س
  الحالة: ${bike.condition === 'new' ? 'جديد 2026' : 'مستعمل'}
  السنة: ${bike.year}
  الممشى: ${bike.mileage} كم
  قوة المحرك: ${bike.engineSize} سي سي (${bike.power} حصان)
  الوزن: ${bike.weight} كجم
  سعة خزان الوقود: ${bike.fuelCapacity} لتر
  اللون: ${bike.colorAr}
  الوصف: ${bike.descriptionAr}
  ميزات إضافية: ${bike.keySpecsAr.join('، ')}`;
      }).join('\n\n');

      const systemInstruction = `أنت مستشار مبيعات ذكي وودود وخبير دراجات نارية في معرض موتو زون (MotoZone) الافتراضي الفاخر.
مهمتك هي إرشاد العميل ومساعدته على اختيار الدراجة المثالية له من الكتالوج المتوفر لدينا الحصري في المعرض.
تواصل مع العميل باللغة العربية الفصحى الراقية والمهذبة والمرحبة. أضف لمسة حماسية تناسب هيبة وعشاق الدراجات النارية!

الكتالوج المتوفر لدينا في صالة العرض هو:
${catalogDescription}

تعليمات هامة للاستجابة:
1. انصح العميل واقترح عليه دراجات مخصصة من كتالوج المخزون الحقيقي المذكور أعلاه فقط! لا تقم بالتأليف أو ابتكار موديلات أخرى لا تتوفر في صالة العرض.
2. إذا سأل العميل عن دراجة للقيادة اليومية أو المبتدئين، اقترح عليه دراجات مثل "هوندا ريبيل 500" أو "سكوتر فيسبا بريميفيرا 150".
3. إذا سأل العميل عن السرعة القصوى والمنافسة، وجهه إلى فئة الرياضية (Sports) مثل "كاواساكي نينجا H2R" أو "ياماها YZF-R1M" أو "دوكاتي بانيجالي V4 S".
4. للمغامرات وتضاريس البر الوعرة، وجهه إلى فئة الأدفنتشر مثل "بي إم دبليو R 1300 GS" أو "هوندا أفريكا توين".
5. للمدن والشباب العصري، ناقش فئة النيكد (Naked) مثل "دوكاتي مونستر SP" و "هوندا CB650R".
6. ساعد العميل أيضاً في مقارنة الأسعار وحساب الأقساط بشكل استرشادي مبسط إذا تطلب الأمر.
7. في نهاية إجابتك، شجع العميل دائماً على حجز تجربة قيادة أو الضغط على زر "طلب عرض سعر" المتوفر بجوار بطاقة كل دراجة نارية في الموقع.`;

      // Structure historical chats plus the new message
      // Convert standard client message format `{ role: 'user' | 'model', text: '...' }` to GoogleGenAI format
      // In @google/genai, the chats object can handle messages sequentially.
      // Since it's a stateless HTTP call, let's use GenerateContent with historical messages array.
      
      const contents = messages.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const responseText = response.text || 'عذراً، لم أستطع توليد رد في الوقت الحالي. يرجى تجربة سؤال آخر.';
      return res.json({ text: responseText });

    } catch (e: any) {
      console.error('Gemini proxy error:', e);
      return res.status(500).json({ error: e.message || 'Error communicating with Gemini' });
    }
  });

  // Mock Inquiry Submission Store (In-memory list of enquiries for simulation panel)
  const inquiries: any[] = [];

  app.post('/api/inquiries', (req, res) => {
    const { bikeId, bikeName, clientName, phone, email, type, notes } = req.body;
    if (!clientName || !phone || !bikeName) {
      return res.status(400).json({ error: 'الرجاء إدخال الاسم ورقم الهاتف واسم الدراجة' });
    }
    const newInquiry = {
      id: `inq-${Date.now()}`,
      bikeId,
      bikeName,
      clientName,
      phone,
      email: email || 'غير متوفر',
      type: type || 'buy',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };
    inquiries.push(newInquiry);
    return res.status(201).json({ success: true, inquiry: newInquiry });
  });

  app.get('/api/inquiries', (req, res) => {
    res.json(inquiries);
  });

  // Integration with Vite
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Motorcycle App server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
