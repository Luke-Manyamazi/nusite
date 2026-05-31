# NuSite

> *Your site. Reimagined.*

**NuSite** is an AI-powered website transformation engine by Camluk Technologies (Pty) Ltd. It converts static websites into modern, responsive React applications.

## 🌐 Live sites

| Site | URL |
|---|---|
| Landing page | https://nusite-landing.netlify.app |
| Engine | https://nusite-engine.netlify.app |

---

## 📁 Project structure

```
NuSite/
├── README.md
└── app/                          ← core engine + all project files
    ├── main.jsx                  ← entry point
    ├── engine.jsx                ← transformation engine
    ├── engine-main.jsx
    ├── dashboard.jsx
    ├── auth.jsx
    ├── onboarding.jsx
    ├── payments.jsx
    ├── payments-main.jsx
    ├── deploy.jsx
    ├── tweaks-panel.jsx
    ├── ui.jsx                    ← reusable UI components
    ├── nusite.css                ← component styles
    ├── pages/                    ← HTML pages
    │   ├── NuSite Landing Page.html
    │   ├── NuSite App.html
    │   ├── NuSite Engine.html
    │   ├── NuSite Billing.html
    │   └── Engine Live.html
    ├── handoff/                  ← developer handoff docs
    ├── launch/                   ← launch assets and templates
    └── uploads/                  ← brand assets and design briefs
```

---

## 🚀 Quick start

### View the landing page
Open `app/pages/NuSite Landing Page.html` directly in a browser, or serve it with any static server:

```bash
npx serve app/pages
```

### Deploy the landing page
Rename `NuSite Landing Page.html` to `index.html` and drop it onto any static host:

| Host | Steps |
|---|---|
| **Vercel** | `vercel deploy` |
| **Netlify** | Drag-and-drop into the Netlify dashboard |
| **GitHub Pages** | Commit as `index.html`, enable Pages on the repo |
| **Cloudflare Pages** | Connect repo, no build command needed |
| **Any cPanel / S3** | Upload `index.html` to the web root |

---

## 🧱 Pages

| File | Description |
|---|---|
| `NuSite Landing Page.html` | Marketing site — self-contained single file (CSS + JS inlined) |
| `index.html` + `script.js` + `styles.css` | Marketing site — split-file version with external assets |
| `NuSite App.html` | Web application UI |
| `NuSite Engine.html` | Transformation engine interface |
| `NuSite Billing.html` | Subscription and payment UI |
| `Engine Live.html` | Real-time engine demo |

### Landing page versions

There are two builds of the marketing landing page in `app/pages/`:

**Self-contained (`NuSite Landing Page.html`)**
All CSS and JS inlined into a single file. Best for quick sharing, drag-and-drop deploys, or sending as a standalone file. Open directly in a browser — no server needed.

**Split-file (`index.html` + `script.js` + `styles.css`)**
HTML, CSS, and JS separated into individual files, with `nusite_logo.png` as an external asset. Better for version-controlled diffs, incremental edits, and hosts that expect a standard `index.html` entry point.

To deploy the split-file version, serve the `app/pages/` folder as the web root — all asset paths are relative.

---

## ⚙️ App components (`app/`)

| File | Role |
|---|---|
| `main.jsx` | Entry point |
| `engine.jsx` / `engine-main.jsx` | Core transformation logic |
| `dashboard.jsx` | User dashboard |
| `auth.jsx` | Authentication |
| `onboarding.jsx` | User onboarding flow |
| `payments.jsx` / `payments-main.jsx` | Billing and subscriptions |
| `deploy.jsx` | Deployment guidance |
| `tweaks-panel.jsx` | UI customisation panel |
| `ui.jsx` | Shared UI components |
| `nusite.css` | Component stylesheet |

---

## 🎨 Brand tokens

CSS custom properties defined at the top of each page's `<style>` block. Two themes driven by a single attribute on `<html>`.

```css
/* dark (default) */
--void:     #0A0A0F;   /* page bg */
--indigo:   #5B4CFF;   /* brand */
--lime:     #C8FF00;   /* accent / Premium */
--ghost:    #F4F4FF;   /* text */
--slate:    #1C1C2E;   /* cards */
--lavender: #8B85C1;   /* secondary text */
```

Light mode overrides `--void`, `--ghost`, `--slate`, `--lavender`, and border/shadow variables. Indigo, lime, and success colours are shared across themes.

### Typography
- **Poppins** 300/400/500/600/700/800 — all text across the app

---

## 🌗 Theme toggle

- Persisted via `localStorage` key `nusite-theme`
- Auto-detects `prefers-color-scheme` on first visit
- Toggles `data-theme="light"` on `<html>`

---

## ✨ Interactive features

| Feature | Implementation |
|---|---|
| Hero word stagger | CSS `@keyframes rise` with per-word `animation-delay` |
| Code typewriter | Line-by-line reveal, infinite loop with 3.8s pause |
| Marquee | CSS `@keyframes scroll`, track duplicated for seamless loop |
| Scroll reveals | `IntersectionObserver`, `.reveal.in` flips opacity + translateY |
| Pricing toggle | Monthly ↔ annual via `data-monthly` / `data-annual` attributes |
| FAQ accordion | `max-height` from `scrollHeight` on button click |
| Waitlist form | Email capture with success state swap |

All animations respect `@media (prefers-reduced-motion: reduce)`.

---

## 📱 Responsive breakpoints

| Breakpoint | Behaviour |
|---|---|
| `> 1024px` | Full desktop layout |
| `768–1024px` | Hero stacks, pricing single column |
| `< 720px` | Hamburger nav, single-column everything |

---

## 🔌 Wiring up the waitlist

The form fakes success by default. To connect a real backend, find the `waitlistForm` submit handler and replace it:

```js
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = form.querySelector('input').value;
  await fetch('https://your-api.example/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  // show success state
});
```

The footer `footForm` works the same way.

---

## ✅ Browser support

Tested on current Chrome, Firefox, Safari. Uses CSS custom properties, `backdrop-filter`, `IntersectionObserver`, and `color-mix()`. No polyfills required for evergreen browsers.

---

## 📄 Credits & licence

- **Product & brand:** NuSite — a product of Camluk Technologies (Pty) Ltd, Cape Town, South Africa
- **Fonts:** Poppins — OFL via Google Fonts

© 2025 Camluk Technologies (Pty) Ltd. All rights reserved.
