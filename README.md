# NuSite — Landing Page

> *Your site. Reimagined.*

The marketing landing page for **NuSite**, an AI-powered website transformation engine by Camluk Technologies (Pty) Ltd. Single-file HTML build, no framework, no bundler.

---

## 📁 Contents

```
NuSite Landing Page.html   ← the page (open this in a browser)
README.md                  ← you are here
uploads/
  ├── Nusite.md            ← Stage 2 design brief
  └── nusite-brand-board.html
```

The landing page is **a single self-contained HTML file** — all CSS and JS are inlined. Open it directly or drop it on any static host.

---

## 🚀 Quick start

### Run locally
```bash
# any static server works
npx serve .
# or just double-click the .html file
```

### Deploy
Drop `NuSite Landing Page.html` (rename to `index.html` first) onto any of:

| Host | Steps |
|---|---|
| **Vercel** | `vercel deploy` from this folder |
| **Netlify** | Drag-and-drop the file into the Netlify dashboard |
| **GitHub Pages** | Commit as `index.html`, enable Pages on the repo |
| **Cloudflare Pages** | Connect repo, no build command needed |
| **Any cPanel / S3** | Upload `index.html` to the web root |

---

## 🧱 Page sections (in order)

1. **Navigation** — fixed glass nav with logo, links, theme toggle, waitlist CTA
2. **Hero** — animated headline + live before/after code transformation visual
3. **Social proof marquee** — auto-scrolling stack logos (React, Next.js, Tailwind, Vercel, GitHub, Netlify, Astro, Vite)
4. **How it works** — three-step flow with arrow connectors
5. **Transformations** — 4×2 grid of the 8 transform types with accent colours and tier badges
6. **Pricing** — Starter / Pro / Premium with monthly ↔ annual toggle
7. **Audience** — Freelancers, Founders, Agencies
8. **Waitlist CTA** — indigo full-bleed section with email capture + success state
9. **FAQ** — two-column accordion
10. **Footer** — 4-column with Camluk attribution and mini-subscribe form

---

## 🎨 Brand tokens

CSS custom properties live at the top of the `<style>` block. The page ships **two themes** driven by a single attribute on `<html>`.

```css
/* dark (default) */
--void:#0A0A0F;      /* page bg */
--indigo:#5B4CFF;    /* brand */
--lime:#C8FF00;      /* accent / Premium */
--ghost:#F4F4FF;     /* text */
--slate:#1C1C2E;     /* cards */
--lavender:#8B85C1;  /* secondary text */
```

Light mode overrides `--void`, `--ghost`, `--slate`, `--slate-lt`, `--lavender`, `--border` and a few derived shadow/grid variables — everything else (indigo, lime, success, etc.) is shared.

### Typography
- **Syne** 600 / 700 / 800 — display, wordmark, CTAs, pricing numbers
- **DM Sans** 300 / 400 / 500 — body, UI, descriptions
- **JetBrains Mono** 400 / 600 — code, labels, badges, micro-copy

All loaded from Google Fonts in `<head>`.

---

## 🌗 Theme toggle

A sun/moon button in the nav switches between dark and light.

- **Persisted** via `localStorage` under the key `nusite-theme`
- **Auto-detects** `prefers-color-scheme` on first visit
- Toggling adds/removes `data-theme="light"` on `<html>`

To customise theme tokens, edit the `:root` and `:root[data-theme="light"]` blocks at the top of the `<style>` tag.

---

## ✨ Interactive bits

| Feature | Implementation |
|---|---|
| Hero word stagger | CSS `@keyframes rise` with per-word `animation-delay` |
| Code typewriter | Line-by-line reveal in `<code>` blocks, infinite loop with 3.8s pause |
| Marquee | CSS `@keyframes scroll` with track duplicated for seamless loop |
| Scroll reveals | `IntersectionObserver`, `.reveal.in` class flips opacity + translateY |
| Pricing toggle | Click toggles `.annual`; price `<span data-monthly data-annual>` swaps |
| FAQ | Native button click flips `.open`, sets `max-height` from `scrollHeight` |
| Waitlist form | `e.preventDefault()` + simple email check, swaps to success state |
| Theme toggle | Attribute on `<html>` + `localStorage` |

All animations respect `@media (prefers-reduced-motion: reduce)`.

---

## 📱 Responsive

| Breakpoint | Behaviour |
|---|---|
| `> 1024px` | Full desktop layout |
| `768–1024px` | Hero stacks, pricing single column, audience cards stack |
| `< 720px` | Hamburger nav, single-column everything, full-width CTAs |

---

## 🔌 Hooking up a real waitlist

The form currently fakes success. To wire it to a backend, find the `waitlistForm` submit handler at the bottom of the file and replace the success swap with a `fetch()` to your endpoint of choice (ConvertKit, Mailchimp, Beehiiv, Resend, a Supabase row, etc.).

```js
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = form.querySelector('input').value;
  await fetch('https://your-api.example/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  // ...show success state
});
```

The footer mini-form (`footForm`) works the same way.

---

## 🛠 Editing tips

- **Copy** lives inline in the HTML — search for the text you want to change and edit in place.
- **Pricing** numbers live on `<span class="amount" data-monthly="10" data-annual="8">`. Update both attributes when changing prices.
- **Transforms grid** — each card is a `.tcard` with a `style="--accent:#XXX"` inline variable that drives the top bar and icon tint.
- **FAQ** — add a new `<div class="qitem">` with a `.qbtn` button and `.qans > .qans-inner` answer; the JS picks it up automatically.

---

## ✅ Browser support

Tested on current Chrome, Firefox, Safari. Uses:
- CSS custom properties
- `backdrop-filter` (graceful fallback to solid bg)
- `IntersectionObserver`
- `color-mix(in oklab, …)` for one tint — degrades to fallback colour

No polyfills required for evergreen browsers.

---

## 📄 Credits & licence

- **Product & brand:** NuSite — a product of Camluk Technologies (Pty) Ltd, Cape Town, South Africa
- **Fonts:** Syne, DM Sans, JetBrains Mono — all OFL via Google Fonts
- **Build:** Hand-written HTML + CSS + vanilla JS

© 2025 Camluk Technologies (Pty) Ltd. All rights reserved.
