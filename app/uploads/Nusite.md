Nusite stage2 design brief · MD
Copy

# NuSite — Stage 2 Design Brief
## Landing Page · Marketing Site · Waitlist · Hero · Pricing
 
> **For:** Claude (Frontend Design)
> **From:** Camluk Technologies (Pty) Ltd
> **Stage:** 2 of 7 — Landing Page
> **Deliverable:** Single-page marketing website with waitlist capture, hero section, feature highlights and pricing tiers
> **Brand Board:** Reference `nusite-brand-board.html` for all visual assets
 
---
 
## 1. Product Overview
 
**NuSite** is an AI-powered website transformation engine. Users input any website — via paste, ZIP upload, URL or GitHub repo — and receive a modernised, transformed version back, paired with deployment instructions tailored to their hosting setup.
 
**Tagline:** *Your site. Reimagined.*
 
**Alt taglines (use in sub-headings or supporting copy):**
- *Old code in. New site out.*
- *Paste. Transform. Ship.*
- *Transform any website with AI.*
**Parent company:** Camluk Technologies (Pty) Ltd — sits quietly in the footer only. Not in the hero or nav.
 
**Domain:** nusite.app
 
---
 
## 2. Brand Tokens
 
### Colours
 
```css
:root {
  /* Primary */
  --void:        #0A0A0F;   /* Page background */
  --indigo:      #5B4CFF;   /* Brand, CTAs, primary UI */
  --indigo-lt:   #7B6FFF;   /* Hover states */
  --ghost:       #F4F4FF;   /* Primary text */
  --lime:        #C8FF00;   /* Accent — transform moments, Premium tier */
 
  /* Secondary */
  --slate:       #1C1C2E;   /* Cards, panels */
  --slate-lt:    #252538;   /* Elevated surfaces */
  --lavender:    #8B85C1;   /* Secondary text, labels */
 
  /* Functional */
  --success:     #22D47A;
  --warning:     #F5A623;
  --error:       #FF4C4C;
 
  /* Utility */
  --border:      rgba(244, 244, 255, 0.08);
  --indigo-tint: rgba(91, 76, 255, 0.12);
  --lime-tint:   rgba(200, 255, 0, 0.08);
}
```
 
### Typography
 
```css
/* Import */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;600&display=swap');
 
/* Usage */
--font-display: 'Syne', sans-serif;       /* H1, H2, wordmark, CTAs, pricing */
--font-body:    'DM Sans', sans-serif;    /* Body, UI, descriptions */
--font-mono:    'JetBrains Mono', mono;   /* Code blocks, badges, labels */
```
 
### Type Scale
 
| Token | Size  | Use |
|-------|-------|-----|
| `5xl` | 72px  | Hero display headline |
| `4xl` | 56px  | Section display |
| `3xl` | 40px  | Section headings |
| `2xl` | 28px  | Sub-headings |
| `xl`  | 20px  | Card headings |
| `lg`  | 18px  | Lead / intro text |
| `base`| 16px  | Body copy |
| `sm`  | 14px  | Secondary, captions |
| `xs`  | 12px  | Badges, labels |
 
### Logo Mark (SVG — inline this exactly)
 
```svg
<svg viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="6" width="5" height="26" rx="2.5" fill="white"/>
  <path d="M4 8 L29 30" stroke="white" stroke-width="5" stroke-linecap="round"/>
  <rect x="22" y="6" width="5" height="26" rx="2.5" fill="white"/>
  <circle cx="32" cy="8" r="3" fill="#C8FF00"/>
</svg>
```
 
**Wordmark:** `NuSite` — "Nu" in `var(--indigo)`, "Site" in `var(--ghost)`. Font: Syne 800.
 
---
 
## 3. Page Architecture
 
Build as a **single HTML file** (or single React component). Sections in order:
 
```
1. Navigation Bar
2. Hero Section          ← most important
3. Social Proof Bar
4. How It Works
5. Transformation Types
6. Pricing               ← second most important
7. Target Audience / Use Cases
8. Waitlist CTA          ← third most important
9. FAQ
10. Footer
```
 
---
 
## 4. Section-by-Section Brief
 
---
 
### 4.1 Navigation Bar
 
**Layout:** Fixed top. Logo left. Links centre (or right). CTA right.
 
**Logo:** Icon (SVG above) + wordmark "NuSite" (Nu in indigo, Site in ghost white).
 
**Nav links:** Features · How It Works · Pricing · FAQ
 
**CTA button:** `Join Waitlist` — solid indigo, Syne font, rounded.
 
**Style:** Glassmorphism — `background: rgba(10,10,15,0.8)`, `backdrop-filter: blur(16px)`, bottom border `1px solid var(--border)`. Transition opacity/blur on scroll.
 
**Mobile:** Hamburger menu. Full-screen overlay in `var(--void)`.
 
---
 
### 4.2 Hero Section
 
**This is the most important section. Make it stunning.**
 
**Headline (H1, Syne 800, 64–72px):**
> Your site.
> Reimagined.
 
Each word / line should feel weighted. Consider a subtle colour split — "Reimagined." in `var(--indigo)` or with a lime underline stroke.
 
**Sub-headline (DM Sans, 18–20px, lavender):**
> Paste old code. Drop a URL. Upload a ZIP. NuSite transforms any website into something modern, responsive and ready to ship — in seconds.
 
**Hero CTA (two buttons side by side):**
- Primary: `Join the Waitlist →` — solid indigo, Syne bold, large (padding 14px 32px)
- Secondary: `See it in action` — ghost/outline style, plays a demo or scrolls to How It Works
**Social proof under CTAs:**
> ✦ Join 400+ developers and founders already on the waitlist
> (Use a small avatar stack of 4–5 generic silhouettes + this line in lavender, 13px DM Sans)
 
**Hero visual (right side or below on mobile):**
A **code transformation mockup** — before/after panel. Left panel: messy old HTML in a dark code block (JetBrains Mono, dim). Right panel: clean modern output glowing slightly in indigo. A horizontal arrow or animated sweep between them. Add a `✦ Transform complete` badge in lime/success green appearing on the right panel.
 
This visual should feel like the product itself. Abstract but functional-looking. Can be CSS/SVG illustrated — does not need to be a real screenshot.
 
**Background:**
- Deep `var(--void)` base
- Radial gradient glow: `rgba(91,76,255,0.18)` top-right
- Secondary glow: `rgba(200,255,0,0.06)` bottom-left
- Optional: subtle dot-grid or noise texture overlay at low opacity
**Animation:**
- Headline words stagger in on load (fade + translateY, 80ms delay between words)
- CTA buttons fade in after headline
- Code mockup animates: left panel types out, then sweeps to right panel
- Keep animations under 1.2s total. Respect `prefers-reduced-motion`.
---
 
### 4.3 Social Proof Bar
 
**Full-width strip, `var(--slate)` background, `border-y: 1px solid var(--border)`.**
 
Show 5–6 logos or text badges of familiar tech/platforms NuSite works with or outputs for:
 
```
React    Next.js    Tailwind CSS    Vercel    GitHub    Netlify
```
 
Display as muted logo wordmarks (lavender, low opacity). Animate as a slow infinite horizontal scroll (marquee effect). Label above: `Works with your stack` in mono xs.
 
---
 
### 4.4 How It Works
 
**Section heading:** `How NuSite works` (Syne, 40px)
**Sub:** `Three steps. Seconds, not days.` (lavender)
 
**Three steps in a horizontal row (cards or numbered flow):**
 
```
Step 1                    Step 2                    Step 3
────────                  ────────                  ────────
⬆ Input your site        ⚙ Choose your transform   ⬇ Download & deploy
───────────────────       ───────────────────       ───────────────────
Paste HTML, drop a        Pick from 8 AI-powered    Get clean, transformed
ZIP, paste a URL or       transformations — make     code. Follow your
connect your GitHub       it responsive, convert      custom deployment
repo.                     to React, modernise it,    guide and ship.
                          and more.
```
 
**Style:** Three cards side by side. Card background `var(--slate)`. Top accent line per card in `var(--indigo)`. Step number in large mono font (60px, 10% opacity indigo) as a watermark behind the card content. Arrow connectors between cards on desktop (SVG, dashed, lavender).
 
**Input type badges** inside Step 1 (small pills):
`Paste` · `ZIP` · `URL` · `GitHub` — pill style, mono font, xs.
 
---
 
### 4.5 Transformation Types
 
**Section heading:** `8 ways to transform` (Syne, 40px)
**Sub:** `Pick one. Stack them. Make it yours.` (lavender)
 
**8-card grid (4 columns × 2 rows):**
 
Each card has:
- A top accent line (colour unique to transform — see below)
- An icon (emoji or SVG)
- A name (Syne bold, 14px)
- A short description (DM Sans, 12px, lavender)
- A tier badge bottom-right (Starter / Pro / Premium)
| Transform | Icon | Accent Colour | Tier |
|-----------|------|---------------|------|
| Static → Responsive | ⬛ | `#00E5FF` | Starter |
| Add CSS Motion | ✦ | `#FF6B6B` | Starter |
| HTML → React | ⚛ | `#61DAFB` | Pro |
| Modernise Design | ◈ | `#A78BFA` | Starter |
| Add Dark Mode | ◑ | `#FCD34D` | Pro |
| Performance Fix | ⚡ | `#34D399` | Pro |
| Accessibility Audit | ♿ | `#F97316` | Pro |
| Convert to Tailwind | 🌬 | `#38BDF8` | Premium |
 
**Hover state:** card lifts slightly (`translateY(-4px)`), border brightens to the accent colour.
 
**Below grid:** small note in lavender, 13px:
> ✦ Premium users can combine transforms or write a custom prompt.
 
---
 
### 4.6 Pricing
 
**Section heading:** `Simple, honest pricing` (Syne, 40px)
**Sub:** `Start free. Upgrade when you're ready.` (lavender)
 
**Toggle (optional):** Monthly / Annual (Annual = 2 months free, show crossed-out price)
 
**Three-column pricing cards:**
 
---
 
#### Starter — Free
 
- Background: `var(--slate)`
- Badge: `STARTER` pill in lavender
**Price:** Free
**Sub:** No card required
 
Features:
- ✓ 5 transforms per month
- ✓ Paste input only
- ✓ 3 basic transformation types
- ✗ No deployment guide
- ✗ NuSite watermark on output
- ✗ No project history
CTA: `Get Started Free` — ghost button, white border
 
---
 
#### Pro — $10/month ⭐ MOST POPULAR
 
- Background: `var(--indigo)`
- `MOST POPULAR` badge in `var(--lime)` text on `var(--void)` bg, top-right corner
- Subtle glow: `box-shadow: 0 0 60px rgba(91,76,255,0.3)`
- Scale slightly larger than the other two cards
**Price:** $10 / month
**Sub:** Billed monthly · Cancel anytime
 
Features:
- ✓ 50 transforms per month
- ✓ Paste + ZIP + URL inputs
- ✓ All 8 transformation types
- ✓ Deployment guide included
- ✓ No watermark
- ✓ 10 saved projects
- ✓ Email support
CTA: `Start Pro` — solid lime (`var(--lime)`), void text, Syne bold
 
---
 
#### Premium — $20/month
 
- Background: dark gradient `linear-gradient(135deg, #1a1a2e, #16213e)`
- Top border: `2px solid rgba(200,255,0,0.4)`
- `PREMIUM` badge in lime
**Price:** $20 / month
**Sub:** Billed monthly · Cancel anytime
 
Features:
- ✓ Unlimited transforms
- ✓ All inputs including GitHub repo
- ✓ All transforms + custom prompt
- ✓ Side-by-side preview + sandbox
- ✓ Unlimited project history
- ✓ Priority support
- ✓ Early access to new transforms
CTA: `Go Premium` — solid indigo, Syne bold
 
---
 
**Below cards:**
> All plans include a 7-day free trial on paid tiers. No charge until trial ends.
 
---
 
### 4.7 Target Audience / Use Cases
 
**Section heading:** `Built for people who ship` (Syne, 40px)
 
**Three use-case cards (horizontal row):**
 
```
🧑‍💻 Freelancers            🚀 Startup Founders        🏢 Small Agencies
──────────────────        ──────────────────         ──────────────────
"Stop spending days       "Your MVP looks             "Modernise 10 client
cleaning up client        like 2015. Fix it           sites in the time it
sites."                   without hiring a            used to take for one."
                          designer."
 
Inherited a messy         Launched fast, looks        Manages multiple
client codebase?          rough. NuSite fixes         client projects.
NuSite modernises         it in seconds —             Needs reliable,
it in seconds.            no design budget            repeatable output.
                          required.
```
 
**Style:** Three cards, `var(--slate)` bg. Left border accent `4px solid var(--indigo)`. Large emoji top. Audience type in Syne bold. Hook line in indigo italic. Body in lavender.
 
---
 
### 4.8 Waitlist CTA Section
 
**This is the conversion section. Make it feel important.**
 
**Full-width section. Background: `var(--indigo)` with noise/grain texture overlay at 4% opacity.**
 
Add a radial glow from centre: `rgba(200,255,0,0.15)`.
 
**Heading (Syne 800, 52px, white):**
> Be first when NuSite launches.
 
**Sub (DM Sans, 18px, rgba(255,255,255,0.75)):**
> We're putting the finishing touches on the app. Join the waitlist and get early access, a free Pro trial, and a founding member discount.
 
**Waitlist form (inline, centred):**
 
```
[ your@email.com                    ] [ Join the Waitlist → ]
```
 
- Input: `background: rgba(255,255,255,0.1)`, `border: 1px solid rgba(255,255,255,0.2)`, white text, rounded-lg, padding 14px 20px, DM Sans
- Button: `var(--lime)` background, `var(--void)` text, Syne bold, same height as input, rounded-lg
- Below form: `🔒 No spam. Unsubscribe anytime.` in 12px, rgba white 0.5
**Perks (three short icons + text below the form):**
 
```
✦ Early access          ⚡ Free Pro trial        🎁 Founding discount
before public launch    for 30 days              locked in forever
```
 
Display in a horizontal row, small mono labels, white at 70% opacity.
 
**Success state (after submit):**
Replace form with:
> ✓ You're on the list! We'll be in touch soon.
> In the meantime, share NuSite with someone who needs it.
> [Share on X] [Copy link]
 
---
 
### 4.9 FAQ
 
**Section heading:** `Questions` (Syne, 40px)
**Layout:** Accordion. Two-column on desktop, single column on mobile.
 
**Questions to include:**
 
1. **When does NuSite launch?**
   > We're in the final stages of development. Waitlist members get first access. Sign up above to be notified.
2. **What kind of websites can NuSite transform?**
   > Any website with accessible HTML, CSS and JS. Paste raw code, upload a ZIP of your project, drop in a live URL (Pro), or connect a GitHub repo (Premium).
3. **Will it work on large codebases?**
   > Yes. NuSite processes files intelligently, handling large projects by transforming them file by file with full context maintained.
4. **Do I need to know how to code?**
   > Not necessarily. NuSite generates clean code with clear deployment instructions. If you can follow a guide, you can ship the result.
5. **What does the deployment guide include?**
   > After your transform, NuSite asks where you're hosting (Vercel, Netlify, cPanel, GitHub Pages, AWS, Firebase, DigitalOcean, Docker/VPS) and gives you step-by-step instructions tailored to your platform.
6. **Can I cancel my subscription?**
   > Yes, anytime. No questions, no friction. Cancel from your account dashboard and you keep access until the end of your billing period.
7. **Is my code stored?**
   > Your code is processed securely and not stored permanently on our servers. Pro and Premium users can opt into saving project history in their account.
8. **Who built NuSite?**
   > NuSite is a product of Camluk Technologies (Pty) Ltd, a Cape Town-based technology company.
**Accordion style:**
- Each item: border-bottom `1px solid var(--border)`, padding 20px 0
- Question: Syne 600, ghost white, 16px
- Arrow icon rotates 180° on open
- Answer: DM Sans, lavender, 14px, slides down with CSS transition
---
 
### 4.10 Footer
 
**Layout:** 4-column grid on desktop, stacked on mobile.
 
**Column 1 — Brand:**
- Logo lockup (icon + wordmark)
- Tagline: *Your site. Reimagined.*
- `A product by Camluk Technologies (Pty) Ltd`
- `Cape Town, South Africa`
- Social icons: X (Twitter), GitHub, LinkedIn — ghost style
**Column 2 — Product:**
- Features
- How It Works
- Pricing
- Changelog *(coming soon)*
- Roadmap *(coming soon)*
**Column 3 — Company:**
- About Camluk
- Contact
- Privacy Policy
- Terms of Service
**Column 4 — Stay Updated:**
- `Get launch updates` label
- Mini email input + subscribe button (same style as waitlist but smaller)
**Bottom bar:**
- Left: `© 2025 Camluk Technologies (Pty) Ltd. All rights reserved.`
- Right: `nusite.app`
- Full-width border top: `1px solid var(--border)`
- Font: DM Sans 300, 12px, lavender
---
 
## 5. Responsive Behaviour
 
| Breakpoint | Behaviour |
|------------|-----------|
| `< 768px` (mobile) | Single column. Hero stacks vertically. Pricing cards stack. Nav becomes hamburger. |
| `768–1024px` (tablet) | Two-column where applicable. Pricing 2+1 or stacked. |
| `> 1024px` (desktop) | Full layout as described above. |
 
---
 
## 6. Interactions & Animation
 
**Page load:**
- Hero headline words stagger in: `opacity 0 → 1`, `translateY(20px → 0)`, 80ms stagger per word, ease-out
- Sub-headline fades after headline completes
- CTAs fade in last
- Total hero animation: ~1s
**Scroll-triggered:**
- Sections fade + slide up as they enter viewport (`IntersectionObserver`)
- Pricing cards: stagger in left to right with 100ms delay each
- Transform cards: cascade in row by row
**Hover:**
- CTA buttons: slight scale `1.02`, brightness up
- Transform cards: `translateY(-4px)`, border colour transitions to accent
- Pricing cards: glow intensifies on Pro card
- Nav links: lavender → ghost white, underline slide in
**Code mockup (hero):**
- Left panel: typewriter effect on old HTML code
- Sweep/wipe transition to right panel
- "Transform complete ✦" badge pops in with lime colour
- Loops after 4s pause
**All animations:** honour `prefers-reduced-motion: reduce` — fall back to instant opacity change.
 
---
 
## 7. Technical Requirements
 
- **Single file** output: one `.html` file with embedded CSS and JS, OR one `.jsx` React component
- Google Fonts loaded via `<link>` in `<head>`
- No external CSS frameworks (no Bootstrap, no Tailwind) — write custom CSS using the token system above
- Waitlist form: on submit, show success state (no real backend needed — simulate with JS)
- FAQ accordion: pure CSS/JS, no library needed
- Marquee/ticker: CSS animation `@keyframes` scroll, no library
- Must render correctly on Chrome, Firefox, Safari
---
 
## 8. Copy & Tone Reference
 
**Voice:** Bold, direct, a little playful. Never corporate. Never jargon-heavy.
 
**Do:**
- Short sentences. Active voice.
- Talk to the user directly ("your site", "you get", "ship it")
- Use numbers ("5 transforms", "8 ways", "seconds not days")
**Don't:**
- "Leverage AI-powered pipelines to facilitate…"
- Passive voice
- Filler phrases ("we are excited to announce…")
**Key phrases to use:**
- *Your site. Reimagined.*
- *Paste. Transform. Ship.*
- *Old code in. New site out.*
- *Seconds, not days.*
- *Ready to ship.*
- *No card required.*
---
 
## 9. Assets Checklist
 
The following are embedded in this brief and need no external files:
 
- [x] Logo SVG (inline in brief above)
- [x] Colour tokens (CSS variables above)
- [x] Typography (Google Fonts URLs above)
- [x] All copy (section by section above)
- [x] Pricing details (tiers, features, prices)
- [x] FAQ questions and answers
- [x] Animation specs
The following are illustrative — design at your discretion:
- [ ] Hero code mockup (CSS/SVG illustration of before/after)
- [ ] Step icons (can use emoji or simple SVG)
- [ ] Social proof avatar stack (CSS generated circles)
- [ ] Stack logos in marquee bar (text-only is fine)
---
 
## 10. Success Criteria
 
The landing page is complete when:
 
- [ ] All 10 sections are present and match this brief
- [ ] Brand colours, fonts and logo are applied correctly
- [ ] Waitlist form shows success state on submit
- [ ] Pricing tiers match exactly (features, prices, CTA copy)
- [ ] FAQ accordion opens and closes
- [ ] Page is fully responsive (mobile, tablet, desktop)
- [ ] Animations work and respect `prefers-reduced-motion`
- [ ] No placeholder text (no "Lorem ipsum")
- [ ] Footer includes Camluk attribution
---
 
*NuSite Brand Brief v1.0 — Stage 2 · Camluk Technologies (Pty) Ltd · Cape Town · 2025*
 