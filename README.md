# FocusFlow — Deploy desde cero (Vercel + GitHub)

## 1) Subir a GitHub
```powershell
cd <carpeta>
git init
git add -A
git commit -m "init"
git branch -M main
git remote add origin https://github.com/<USER>/<REPO>.git
git push -u origin main
```

## 2) Vercel
- Add New → Project → Importa el repo
- Framework: **Vite**
- Build: `npm run build` | Output: `dist`
- Settings → Environment Variables:
  - `GEMINI_API_KEY = <tu clave>` (Production + Preview + Development)

## 3) Verificación
- La app llama a `/api/gemini` (serverless). La key **no** se expone al cliente.
- Visita `/api/gemini`: deberías ver `{ "text": "..." }`.
