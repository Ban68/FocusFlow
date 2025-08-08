import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) { res.status(500).json({ error: 'Missing GEMINI_API_KEY' }); return; }
    const prompt = (typeof req.body === 'object' && (req.body as any)?.prompt)
      || 'Sugiere una única micro-pausa saludable, concreta y sin pantallas. Devuelve solo la acción.';
    const ai = new GoogleGenAI({ apiKey: key });
    const out = await ai.responses.generate({ model: 'gemini-2.5-flash', contents: prompt });
    const text = typeof (out as any).text === 'function' ? await (out as any).text() : ((out as any).text ?? '');
    res.status(200).json({ text });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Gemini error' });
  }
}
