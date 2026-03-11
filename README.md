# OpenSource - Navigator AI 🚀

A lightweight, AI-powered platform to discover and evaluate open-source projects across platforms (GitHub, package registries, etc.). It combines multi-platform discovery, project analytics, and AI-driven project suggestions to help developers find good opportunities to learn or contribute.

Quick links
- Tech: React + TypeScript, Vite
- AI: Uses Google generative AI client (Gemini) — requires GEMINI_API_KEY
- Deploy: Netlify (netlify.toml included)

---

## Features (quick)
- Multi-platform discovery (GitHub + registries)
- Smart project analytics (maintenance, community, activity, documentation scores)
- AI project suggestions (Gemini) — optional but powerful
- Advanced filtering (languages, topics, characteristics)
- Bookmark projects (localStorage)
- Project detail modal with README preview for GitHub repos

---

## Quickstart

Prerequisites
- Node.js >= 18
- npm (or yarn)
- (Optional) pandoc and LaTeX if you want to generate PDF via CLI

Install & run locally
1. Clone and install
   ```bash
   git clone https://github.com/Karansri123/OpenSource - Navigator AI 
   cd OpenSource - Navigator AI 
   npm install
   ```

2. Set environment variables (see Environment)
   - For development you can create a .env file (not included in repo) or export variables in your shell:
   ```bash
   # Bash example
   export GEMINI_API_KEY="your_gemini_api_key_here"
   ```

3. Start dev server
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 (Vite will print the exact URL).

Build / preview
```bash
npm run build
npm run preview   # serve the production build locally (vite preview)
```

Lint (if configured)
```bash
npm run lint
```

---

## Environment & AI configuration

Required for AI suggestions:
- GEMINI_API_KEY — used by services/geminiService.ts and injected by vite.config.ts (process.env.GEMINI_API_KEY).

How to set it
- Locally (temporary):
  ```bash
  export GEMINI_API_KEY="sk-..."
  npm run dev
  ```

- In CI / Netlify:
  - Set the environment variable in Netlify site settings (Site settings > Build & deploy > Environment).
  - The repo includes netlify.toml with build and publish configuration.

Important
- If GEMINI_API_KEY is missing or invalid, AI suggestions will fail with an explanatory error (services/geminiService.ts logs detailed errors).
- The app can still run and discover projects via non-AI sources; AI suggestions are optional.

---

## How it works — high level

Core pieces
- UI:
  - App.tsx — main application (fetches data, manages pages, bookmarks, modals).
  - components/*
    - UserInputForm.tsx — filter inputs and AI suggestion button.
    - ProjectCard.tsx — result card visuals and icons.
    - ProjectDetailModal.tsx — detailed view and README rendering for GitHub repos.
- Services:
  - services/projectDiscoveryService.ts — orchestrates platform searches and maps responses to Project objects.
  - services/projectAnalyticsService.ts — computes health/metrics (maintenance, community, activity, documentation).
  - services/geminiService.ts — calls the Google Generative AI client (Gemini) to fetch AI-based suggestions and parses JSON responses.

Data model
- Projects are represented by the Project type (see types.ts). Services map external formats (GitHub, package registries) into this unified shape.

Where to start changing logic
- Discovery behavior and platform-specific fetching: services/projectDiscoveryService.ts
- AI prompt & parsing: services/geminiService.ts
- Health/score calculations: services/projectAnalyticsService.ts

---

## Development notes & tips

- Use the browser devtools console for network and parsing errors. The app logs helpful messages (especially around AI responses).
- Bookmarks are stored in localStorage under key `OpenSource - Navigator AI`.
- The app is opinionated about UI styles — Tailwind utilities are used in components; index.html loads Tailwind CDN for runtime styling.

Accessibility & UX
- The app uses semantic headings, ARIA attributes in modal dialogs, and focuses on keyboard-friendly inputs — keep that in mind if you modify modal or input behavior.

---

## Deployment (Netlify)

This repository includes netlify.toml. Default settings:
- Build command: npm install && npm run build
- Publish directory: dist

Steps
1. Push this repo to GitHub.
2. On Netlify: New site from Git > connect your repository.
3. Set build settings:
   - Build command: npm run build
   - Publish directory: dist
4. Add environment variables in Netlify UI:
   - GEMINI_API_KEY (if you want AI suggestions to work)
5. Deploy.

Notes
- netlify.toml includes redirects for SPA routing and caching headers optimized for static assets and HTML.

---

## Generate a summarized PDF

If you want a compact PDF summary of this README (or a custom summary), here are two practical options.

Method A — Browser (quick, no extra tools)
1. Open the README in GitHub or open a local copy of README.md in your browser (many editors have "Open in Browser" or use a markdown preview).
2. File → Print → Save as PDF. Adjust layout and margins as needed.
This is often the fastest way to create a presentable PDF.

Method B — CLI with pandoc (more customizable)
1. Install pandoc and a PDF engine (e.g., TeX Live or TinyTeX).
2. Optional: Create a short summary file (SUMMARY.md) with the sections you want to include (e.g., Overview, Quickstart, Deploy).
3. Convert to PDF:
   ```bash
   # Full README to PDF
   pandoc README.md -o OpenSource - Navigator AI .pdf --pdf-engine=xelatex -V geometry:margin=1in -V fontsize=10pt

   # Use a custom summary file
   pandoc SUMMARY.md -o OpenSource - Navigator AI .pdf --pdf-engine=xelatex -V geometry:margin=1in -V fontsize=11pt
   ```

Method C — Automated one-file summary (using AI or scripts)
- You can generate a short SUMMARY.md by using an AI (locally or via an API) to extract the top-level points, then run the pandoc command above. The repo already includes a Gemini integration — you could adapt services/geminiService.ts prompt to produce a short README summary (be sure to respect API usage and keys).

---

## Troubleshooting

- "Could not find root element to mount to" — ensure index.html has a div with id="root".
- AI errors / GEMINI_API_KEY missing — set GEMINI_API_KEY in your environment; check vite.config.ts injects process.env.GEMINI_API_KEY.
- README modal not loading content for GitHub repos — project owner/name parsing may fail for non-standard repo name strings; services/projectDiscoveryService.ts and ProjectDetailModal.tsx contain the logic to extract owner and repo name.
- CORS or rate limit issues when fetching platform APIs — external platform APIs (GitHub, registries) may require auth or have rate limits; add tokens where needed and respect API terms.

---

## Contributing

Contributions welcome! A few guidelines:
- Open an issue first for larger changes or new platform integrations.
- Follow the TypeScript types in types.ts and add unit tests for analysis functions where possible.
- Keep UI changes accessible and responsive. Use existing Tailwind classes.
- Code style: ESLint + TypeScript are configured (see package.json). Run linting and fix issues before opening PRs.

Suggested tasks for contributors
- Add support for additional package registries (e.g., Packagist, CocoaPods).
- Add persistent user profiles and saved searches (backend required).
- Implement caching layer for discovery results and better rate-limit handling.
- Add tests (unit and integration) for services and parsing logic.

See CONTRIBUTING.md for any repository-specific processes.

---

## Files you’ll likely edit

- services/OpenSource - Navigator AI  — discovery orchestration and platform adapters.
- services/geminiService.ts — AI prompt formatting and response parsing.
- services/projectAnalyticsService.ts — scoring and comparison logic.
- components/* — UI and accessibility refinements.
- vite.config.ts — add other env-injected keys as needed.

---

## License

MIT License — see the LICENSE file.

---

## Acknowledgements

Built from a community-first idea to speed up discovering and evaluating open-source projects. Contributions and feedback welcome.

Made with ❤️ by the OpenSource - Navigator AI contributors.
