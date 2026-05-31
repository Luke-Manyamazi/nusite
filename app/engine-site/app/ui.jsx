// ui.jsx — Shared NuSite app primitives. Globals exported to window.

const NuMark = ({ size = 22 }) => (
  <svg viewBox="0 0 38 38" width={size} height={size} fill="none" aria-hidden="true">
    <rect x="4" y="6" width="5" height="26" rx="2.5" fill="white" />
    <path d="M4 8 L29 30" stroke="white" strokeWidth="5" strokeLinecap="round" />
    <rect x="22" y="6" width="5" height="26" rx="2.5" fill="white" />
    <circle cx="32" cy="8" r="3" fill="#C8FF00" />
  </svg>
);

const Logo = ({ size = 40, showWord = true, wordSize = 22 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
    <span className="logo-icon" style={{ width: size, height: size, borderRadius: Math.round(size * 0.225) }}>
      <NuMark size={Math.round(size * 0.58)} />
    </span>
    {showWord && (
      <span className="wordmark" style={{ fontSize: wordSize }}>
        <span className="nu">Nu</span>Site
      </span>
    )}
  </span>
);

// Tier helper — what's locked per tier
const TIER_GATES = {
  starter: {
    inputs: { paste: false, zip: true, url: true, github: true },
    // 3 basic transforms are unlocked. Rest locked.
    transforms: {
      responsive: false,    // Starter
      motion: false,        // Starter
      modernise: false,     // Starter
      react: 'pro',
      darkmode: 'pro',
      perf: 'pro',
      a11y: 'pro',
      tailwind: 'premium',
      custom: 'premium',
    },
    monthlyLimit: 5,
    used: 2,
  },
  pro: {
    inputs: { paste: false, zip: false, url: false, github: true },
    transforms: {
      responsive: false, motion: false, modernise: false,
      react: false, darkmode: false, perf: false, a11y: false,
      tailwind: 'premium', custom: 'premium',
    },
    monthlyLimit: 50,
    used: 12,
  },
  premium: {
    inputs: { paste: false, zip: false, url: false, github: false },
    transforms: {
      responsive: false, motion: false, modernise: false,
      react: false, darkmode: false, perf: false, a11y: false,
      tailwind: false, custom: false,
    },
    monthlyLimit: Infinity,
    used: 47,
  },
};

const LockIcon = ({ size = 9 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <rect x="2.5" y="5.5" width="7" height="5" rx="1" fill="currentColor" />
    <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

// A small lock pill saying "Pro" or "Premium" with a tooltip on hover
const LockPill = ({ requires = 'pro', label }) => {
  const isPremium = requires === 'premium';
  return (
    <span className="tt-host" style={{ display: 'inline-flex' }}>
      <span className={`lock-pill ${isPremium ? 'premium' : ''}`}>
        <LockIcon />
        {label || (isPremium ? 'Premium' : 'Pro')}
      </span>
      <span className="tt">
        Upgrade to <b>{isPremium ? 'Premium' : 'Pro'}</b> to unlock
      </span>
    </span>
  );
};

// TierBadge — used in nav, account areas
const TierBadge = ({ tier = 'starter' }) => {
  const label = tier[0].toUpperCase() + tier.slice(1);
  const cls = tier === 'pro' ? 'indigo' : tier === 'premium' ? 'lime' : '';
  return <span className={`chip ${cls}`}>{label}</span>;
};

// Avatar
const Avatar = ({ name = 'Kgomotso M.', size = 32 }) => {
  const initials = name.split(/\s+/).map(s => s[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--indigo), var(--indigo-dk))',
      color: '#fff', fontFamily: 'var(--syne)', fontWeight: 700, fontSize: Math.round(size * 0.4),
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      border: '1.5px solid var(--border-strong)', flexShrink: 0,
    }}>{initials}</span>
  );
};

// Section heading helper
const EyebrowLabel = ({ children, style }) => (
  <div style={{
    fontFamily: 'var(--mono)', fontSize: 10.5, fontWeight: 600,
    letterSpacing: '0.18em', textTransform: 'uppercase',
    color: 'var(--lavender)', display: 'flex', alignItems: 'center', gap: 10, ...style
  }}>
    {children}
  </div>
);

// Icons — minimalist line set
const ic = {
  arr: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrL: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  upload: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 11V2m0 0L4.5 5.5M8 2l3.5 3.5M2.5 11.5V13a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5v-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  link: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M7 9.5 9.5 7m-3.2 4.4-1.7 1.7a3 3 0 0 1-4.2-4.2l1.7-1.7m4.2-1.4 1.7-1.7a3 3 0 0 1 4.2 4.2l-1.7 1.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  github: <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.34c-2.22.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.52-1.03 2.19-.82 2.19-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.28.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>,
  paste: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="3" y="2" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="5" y="1" width="6" height="3" rx="0.7" fill="currentColor"/></svg>,
  search: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="m11 11 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  bell: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 11V7a4 4 0 0 1 8 0v4m-9 .5h10M6.5 13a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  plus: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  sun: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M8 1.5v1.7M8 12.8v1.7M14.5 8h-1.7M3.2 8H1.5m11-4.6-1.2 1.2M4.7 11.3l-1.2 1.2M12.5 12.5l-1.2-1.2M4.7 4.7 3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  moon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.5 9.5A5.5 5.5 0 1 1 6.5 2.5a4.5 4.5 0 0 0 7 7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  home: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2.5 7 8 2.5 13.5 7v6a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  folder: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 4.5A1 1 0 0 1 3 3.5h3l1.5 1.5h5.5a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  zap: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M9 1.5 3 9h4l-1 5.5L13 7H8.5L9 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  cog: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.4"/><path d="M8 1.5v1.7M8 12.8v1.7M14.5 8h-1.7M3.2 8H1.5m11-4.6-1.2 1.2M4.7 11.3l-1.2 1.2M12.5 12.5l-1.2-1.2M4.7 4.7 3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  credit: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 6.5h13" stroke="currentColor" strokeWidth="1.4"/></svg>,
  doc: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M4 1.5h6l3 3V14a.5.5 0 0 1-.5.5h-9A.5.5 0 0 1 3 14V2a.5.5 0 0 1 .5-.5h.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M10 1.5v3h3" stroke="currentColor" strokeWidth="1.4"/></svg>,
  spark: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1.5v4M8 10.5v4M1.5 8h4m5 0h4m-9.6-4.6 2.8 2.8m4.6 4.6 2.8 2.8M3.4 12.6l2.8-2.8m4.6-4.6 2.8-2.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  check: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="m2.5 6.5 2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  x: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="m3 3 6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  ext: <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M4 2h6v6M10 2 4 8M5 2H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

// Transform catalog (synced with brand board)
const TRANSFORMS = [
  { id: 'responsive', name: 'Static → Responsive', desc: 'Fluid layouts & breakpoints', icon: '⬛', accent: '#00E5FF', tier: 'starter' },
  { id: 'motion',     name: 'Add CSS Motion',      desc: 'Animations & scroll effects', icon: '✦', accent: '#FF6B6B', tier: 'starter' },
  { id: 'modernise',  name: 'Modernise Design',    desc: 'Contemporary CSS & type',     icon: '◈', accent: '#A78BFA', tier: 'starter' },
  { id: 'react',      name: 'HTML → React',        desc: 'Clean component output',      icon: '⚛', accent: '#61DAFB', tier: 'pro' },
  { id: 'darkmode',   name: 'Add Dark Mode',       desc: 'Toggle with CSS variables',   icon: '◑', accent: '#FCD34D', tier: 'pro' },
  { id: 'perf',       name: 'Performance Fix',     desc: 'Optimise, defer, lazy-load',  icon: '⚡', accent: '#34D399', tier: 'pro' },
  { id: 'a11y',       name: 'Accessibility',       desc: 'ARIA, semantics, keyboard',   icon: '♿', accent: '#F97316', tier: 'pro' },
  { id: 'tailwind',   name: '→ Tailwind CSS',      desc: 'Utility-class rewrite',       icon: '🌬', accent: '#38BDF8', tier: 'premium' },
];

// Sample recent project data
const RECENT_PROJECTS = [
  { name: 'oldsite-portfolio.html', transform: 'modernise', when: '12m ago', size: '847 lines', status: 'done' },
  { name: 'mvp-landing.zip',        transform: 'responsive', when: '2h ago',  size: '12 files',  status: 'done' },
  { name: 'client-bistro.com',      transform: 'darkmode',  when: 'Yesterday', size: '23 files', status: 'done' },
  { name: 'portfolio-2014',          transform: 'react',     when: 'Thu',      size: '5 files',  status: 'done' },
  { name: 'docs-styleguide.html',   transform: 'a11y',      when: 'Tue',      size: '212 lines', status: 'done' },
];

// Export to window
Object.assign(window, {
  NuMark, Logo, LockIcon, LockPill, TierBadge, Avatar, EyebrowLabel,
  TIER_GATES, TRANSFORMS, RECENT_PROJECTS, ic,
});
