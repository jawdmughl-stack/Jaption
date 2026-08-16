# Japtions

Free video captioning and subtitle styling platform.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL it prints (usually http://localhost:5173).

## Deploy to Vercel (free, public link)

1. Push this folder to a GitHub repo (create a new repo, upload these files, or `git init && git add . && git commit -m "init" && git push`).
2. Go to https://vercel.com → "Add New Project" → import the repo.
3. Framework preset: **Vite**. Leave build command (`npm run build`) and output dir (`dist`) as default.
4. Click Deploy. You'll get a public URL like `japtions.vercel.app`.

## Deploy to Netlify (alternative)

1. `npm install && npm run build` locally — this creates a `dist` folder.
2. Go to https://app.netlify.com/drop and drag the `dist` folder in.
3. You'll instantly get a public URL.

## Notes

- Video export uses the browser's native `MediaRecorder` + Canvas APIs — works best in Chrome or Edge (desktop).
- Exports as `.webm` (no watermark, no paywall). True MP4 muxing isn't possible fully client-side without an extra encoder library.
- Nothing is uploaded to a server — video processing happens entirely in the visitor's browser.
