// Frontend -> Vercel Serverless Function. Sin exponer la API key.
const fallback = [
  "Haz 10 respiraciones profundas (4-4-6).",
  "Camina 2 minutos y bebe agua.",
  "Estira cuello y hombros 60 s.",
  "Mira un punto lejano 30 s.",
  "Ordena un elemento del escritorio."
];
const pick = () => fallback[Math.floor(Math.random() * fallback.length)];

export async function getBreakSuggestion(
  signal?: AbortSignal
): Promise<string> {
  const prompt =
    "Sugiere una única micro-pausa saludable, concreta y sin pantallas. Devuelve solo la acción.";

  try {
    const r = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      signal,
    });

    if (!r.ok) {
      console.error("Gemini HTTP:", r.status);
      return pick();
    }

    const type = r.headers.get("content-type") || "";
    if (!type.includes("application/json")) {
      console.error("Gemini tipo:", type);
      return pick();
    }

    try {
      const { text } = await r.json();
      return text?.trim() || pick();
    } catch (e) {
      console.error("Gemini parse:", e);
      return pick();
    }
  } catch (e) {
    console.error("Gemini red:", e);
    return pick();
  }
}
