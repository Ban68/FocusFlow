// Frontend -> Vercel Serverless Function. Sin exponer la API key.
const fallback = [
  "Haz 10 respiraciones profundas (4-4-6).",
  "Camina 2 minutos y bebe agua.",
  "Estira cuello y hombros 60 s.",
  "Mira un punto lejano 30 s.",
  "Ordena un elemento del escritorio."
];
const pick = () => fallback[Math.floor(Math.random() * fallback.length)];

export async function getBreakSuggestion(): Promise<string> {
  try {
    const r = await fetch("/api/gemini", { method: "POST", headers: { "Content-Type": "application/json" } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const { text } = await r.json();
    return (text?.trim() || pick());
  } catch (e) {
    console.error("Gemini:", e);
    return pick();
  }
}
