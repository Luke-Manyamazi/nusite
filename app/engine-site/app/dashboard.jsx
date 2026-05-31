// dashboard.jsx — Two layout variants. Variant A: top-nav + 2-col split. Variant B: sidebar + canvas.

const Dashboard = ({ tier, layout, theme, setTheme, onSignOut }) => {
  const gates = TIER_GATES[tier];
  return layout === 'split'
    ? <DashboardSplit tier={tier} gates={gates} theme={theme} setTheme={setTheme} onSignOut={onSignOut} />
    : <DashboardSidebar tier={tier} gates={gates} theme={theme} setTheme={setTheme} onSignOut={onSignOut} />;
};

// ════════════════════════════════════════════════════════════════════════
// VARIANT A — Top nav + 2-col split
// ════════════════════════════════════════════════════════════════════════
const DashboardSplit = ({ tier, gates, theme, setTheme, onSignOut }) => {
  const [activeTransform, setActiveTransform] = React.useState('modernise');

  return (
    <div className="scene" data-screen-label="Dashboard · Split" style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      <TopNav tier={tier} theme={theme} setTheme={setTheme} onSignOut={onSignOut} />

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 32px 80px' }}>
        <Greeting tier={tier} gates={gates} />

        <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 22, marginTop: 28, alignItems: 'flex-start' }}>
          {/* LEFT — Composer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <TransformComposer tier={tier} gates={gates} activeTransform={activeTransform} setActiveTransform={setActiveTransform} />
            <SuggestionStrip />
          </div>

          {/* RIGHT — Recents + Usage */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'sticky', top: 86 }}>
            <UsageCard tier={tier} gates={gates} />
            <RecentProjectsCard compact />
          </div>
        </div>
      </div>

      <ResponsiveDashCss />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
// VARIANT B — Sidebar + canvas with hero dropzone
// ════════════════════════════════════════════════════════════════════════
const DashboardSidebar = ({ tier, gates, theme, setTheme, onSignOut }) => {
  const [activeTransform, setActiveTransform] = React.useState('modernise');
  const [activeNav, setActiveNav] = React.useState('home');

  return (
    <div className="scene" data-screen-label="Dashboard · Sidebar" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'grid', gridTemplateColumns: '240px 1fr' }}>
      <Sidebar tier={tier} theme={theme} setTheme={setTheme} active={activeNav} setActive={setActiveNav} onSignOut={onSignOut} />

      <main style={{ padding: '24px 32px 80px', minWidth: 0 }}>
        {/* Search bar / actions row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 22 }}>
          <SearchBar />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="btn btn-ghost btn-sm">{ic.bell}<span className="hide-sm">Updates</span></button>
            <Avatar name={localStorage.getItem("nusite-user") || "New User"} />
          </div>
        </div>

        <Greeting tier={tier} gates={gates} compact />

        {/* Hero dropzone — front and centre */}
        <div style={{ marginTop: 24 }}>
          <TransformComposer tier={tier} gates={gates} activeTransform={activeTransform} setActiveTransform={setActiveTransform} hero />
        </div>

        {/* Below: 2-col with usage + recents grid */}
        <div className="dash-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginTop: 22 }}>
          <UsageCard tier={tier} gates={gates} />
          <StatCard label="This month" value={String(gates.used)} sub="transforms run" />
          <StatCard label="Best speed" value="1.8s" sub="last week median" lime />
        </div>

        <div style={{ marginTop: 22 }}>
          <RecentProjectsGrid />
        </div>
      </main>

      <ResponsiveDashCss sidebar />
    </div>
  );
};

// ─── Top nav ─────────────────────────────────────────────────────────
const TopNav = ({ tier, theme, setTheme, onSignOut }) => (
  <div style={{
    position: 'sticky', top: 0, zIndex: 10,
    background: 'rgba(10,10,15,0.7)', backdropFilter: 'blur(16px) saturate(140%)',
    borderBottom: '1px solid var(--border)',
  }}>
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
      <Logo size={32} wordSize={18} />

      <nav className="hide-sm" style={{ display: 'flex', gap: 2, marginLeft: 12 }}>
        <NavLink active>{ic.home} Home</NavLink>
        <NavLink>{ic.folder} Projects</NavLink>
        <NavLink>{ic.zap} Transforms</NavLink>
        <NavLink>{ic.doc} Docs</NavLink>
      </nav>

      <div style={{ flex: 1 }}></div>

      <SearchBar compact />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="btn btn-ghost btn-sm" style={{ padding: 8, width: 34, height: 34 }} title="Theme">
          {theme === 'dark' ? ic.sun : ic.moon}
        </button>
        <button className="btn btn-ghost btn-sm" style={{ padding: 8, width: 34, height: 34, position: 'relative' }}>
          {ic.bell}
          <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: 'var(--lime)', boxShadow: '0 0 6px var(--lime)' }}></span>
        </button>
        <TierBadge tier={tier} />
        <Avatar name={localStorage.getItem("nusite-user") || "New User"} />
      </div>
    </div>
  </div>
);

const NavLink = ({ active, children }) => (
  <button style={{
    padding: '8px 14px', fontFamily: 'var(--dm)', fontWeight: 500, fontSize: 13,
    color: active ? 'var(--ghost)' : 'var(--lavender)', borderRadius: 8,
    background: active ? 'var(--slate-lt)' : 'transparent',
    display: 'inline-flex', alignItems: 'center', gap: 8,
    border: active ? '1px solid var(--border-strong)' : '1px solid transparent',
    transition: 'all .15s',
  }}>{children}</button>
);

// ─── Sidebar ─────────────────────────────────────────────────────────
const Sidebar = ({ tier, theme, setTheme, active, setActive, onSignOut }) => {
  const items = [
    { id: 'home', icon: ic.home, label: 'Home' },
    { id: 'proj', icon: ic.folder, label: 'Projects', count: 12 },
    { id: 'tform', icon: ic.zap, label: 'Transforms' },
    { id: 'docs', icon: ic.doc, label: 'Docs' },
  ];
  const bottom = [
    { id: 'bill', icon: ic.credit, label: 'Billing' },
    { id: 'set', icon: ic.cog, label: 'Settings' },
  ];

  return (
    <aside className="sidebar" style={{
      position: 'sticky', top: 0, height: '100vh',
      borderRight: '1px solid var(--border)',
      background: 'rgba(28,28,46,0.4)', backdropFilter: 'blur(16px)',
      padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div style={{ padding: '4px 8px 14px', borderBottom: '1px solid var(--border)' }}>
        <Logo size={28} wordSize={17} />
      </div>

      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start', gap: 10, height: 40, padding: '0 14px' }}>
        {ic.plus} New transform
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.6, letterSpacing: '0.06em' }}>⌘N</span>
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
        {items.map(it => <SideItem key={it.id} item={it} active={active === it.id} onClick={() => setActive(it.id)} />)}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {bottom.map(it => <SideItem key={it.id} item={it} active={active === it.id} onClick={() => setActive(it.id)} />)}
        <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }}></div>

        {/* Tier card */}
        <div style={{
          padding: '14px 14px 12px', borderRadius: 12,
          background: tier === 'starter' ? 'var(--slate-lt)' : tier === 'premium' ? 'rgba(200,255,0,0.08)' : 'rgba(91,76,255,0.12)',
          border: `1px solid ${tier === 'premium' ? 'rgba(200,255,0,0.3)' : tier === 'pro' ? 'rgba(91,76,255,0.3)' : 'var(--border)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <TierBadge tier={tier} />
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ color: 'var(--lavender)', padding: 4 }}>
              {theme === 'dark' ? ic.sun : ic.moon}
            </button>
          </div>
          {tier === 'starter' && (
            <>
              <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Go further with Pro</div>
              <div style={{ fontSize: 11.5, color: 'var(--lavender)', lineHeight: 1.5, marginBottom: 10 }}>
                All 8 transforms, ZIP & URL inputs, no watermark.
              </div>
              <button className="btn btn-lime btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Upgrade to Pro</button>
            </>
          )}
          {tier === 'pro' && (
            <>
              <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Premium unlocks GitHub</div>
              <div style={{ fontSize: 11.5, color: 'var(--lavender)', lineHeight: 1.5, marginBottom: 10 }}>
                Unlimited runs, custom prompts, side-by-side sandbox.
              </div>
              <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(200,255,0,0.4)', color: 'var(--lime)' }}>Compare Premium</button>
            </>
          )}
          {tier === 'premium' && (
            <>
              <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Everything's unlocked</div>
              <div style={{ fontSize: 11.5, color: 'var(--lavender)', lineHeight: 1.5 }}>
                Unlimited transforms · all inputs · custom prompts · priority support.
              </div>
            </>
          )}
        </div>

        {/* Account row */}
        <button onClick={onSignOut} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px', borderRadius: 8,
          color: 'var(--lavender)', fontSize: 12.5, marginTop: 4,
        }}>
          <Avatar name={localStorage.getItem("nusite-user") || "New User"} size={26} />
          <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
            <div style={{ color: 'var(--ghost)', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{localStorage.getItem("nusite-user") || "New User"}</div>
            <div style={{ fontSize: 10.5, color: 'var(--lavender)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{localStorage.getItem("nusite-email") || "your@email.com"}</div>
          </div>
        </button>
      </div>
    </aside>
  );
};

const SideItem = ({ item, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: '9px 12px', borderRadius: 9, position: 'relative',
    display: 'flex', alignItems: 'center', gap: 10,
    color: active ? 'var(--ghost)' : 'var(--lavender)',
    background: active ? 'var(--slate-hi)' : 'transparent',
    fontSize: 13, fontFamily: 'var(--dm)', fontWeight: active ? 600 : 500,
    transition: 'all .15s',
  }}>
    {active && <span style={{ position: 'absolute', left: -14, top: 8, bottom: 8, width: 3, borderRadius: 2, background: 'linear-gradient(180deg, var(--indigo), var(--lime))' }}></span>}
    <span style={{ color: active ? 'var(--indigo-lt)' : 'var(--lavender)' }}>{item.icon}</span>
    {item.label}
    {item.count && <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)' }}>{item.count}</span>}
  </button>
);

// ─── Greeting ─────────────────────────────────────────────────────────
const Greeting = ({ tier, gates, compact }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
    <div>
      <EyebrowLabel style={{ marginBottom: 10 }}>
        <span className="spark" style={{ width: 6, height: 6 }}></span>
        TUESDAY · 14:32
        <span style={{ width: 24, height: 1, background: 'var(--border)' }}></span>
      </EyebrowLabel>
      <h1 style={{
        fontFamily: 'var(--syne)', fontWeight: 800,
        fontSize: compact ? 36 : 44, lineHeight: 1.05, letterSpacing: '-0.025em',
      }}>
        Welcome back<span style={{ color: "var(--indigo-lt)" }}>.</span>
      </h1>
      {!compact && (
        <p style={{ marginTop: 10, color: 'var(--lavender)', fontSize: 15, maxWidth: 540 }}>
          Pick up where you left off — your last transform was <span style={{ color: 'var(--ghost)' }}>modernising client-bistro.com</span>.
        </p>
      )}
    </div>

    {!compact && (
      <div style={{ display: 'flex', gap: 18 }}>
        <MicroStat k="Used this month" v={`${gates.used} / ${gates.monthlyLimit === Infinity ? '∞' : gates.monthlyLimit}`} />
        <MicroStat k="Projects" v="12" />
        <MicroStat k="Avg speed" v="2.1s" lime />
      </div>
    )}
  </div>
);

const MicroStat = ({ k, v, lime }) => (
  <div style={{ padding: '10px 16px', borderRadius: 10, background: 'var(--slate)', border: '1px solid var(--border)' }}>
    <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--lavender)', letterSpacing: '0.14em', marginBottom: 3 }}>{k.toUpperCase()}</div>
    <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 18, color: lime ? 'var(--lime)' : 'var(--ghost)' }}>{v}</div>
  </div>
);

// ─── Search bar ───────────────────────────────────────────────────────
const SearchBar = ({ compact }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'var(--slate-lt)', border: '1px solid var(--border)', borderRadius: 10,
    padding: '8px 14px', flex: compact ? '0 1 280px' : 1, maxWidth: compact ? 320 : 520,
  }}>
    <span style={{ color: 'var(--lavender)' }}>{ic.search}</span>
    <input
      placeholder={compact ? 'Search projects, transforms…' : 'Search your projects, transforms, deploys…'}
      style={{ flex: 1, background: 'transparent', fontSize: 13, fontFamily: 'var(--dm)' }}
    />
    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)', padding: '2px 6px', background: 'var(--slate-hi)', borderRadius: 4, letterSpacing: '0.06em' }}>⌘K</span>
  </div>
);

// ════════════════════════════════════════════════════════════════════════
// COMPOSER — the big "Start a transform" card
// ════════════════════════════════════════════════════════════════════════
const TransformComposer = ({ tier, gates, activeTransform, setActiveTransform, hero }) => {
  const [inputType, setInputType] = React.useState('paste');
  const [pasted, setPasted] = React.useState(`<table width="100%" bgcolor="#eee">
  <tr><td><font face="Arial" size="5">Hello world</font></td></tr>
</table>`);

  const inputs = [
    { id: 'paste', label: 'Paste code', icon: ic.paste },
    { id: 'zip', label: 'ZIP file', icon: ic.upload },
    { id: 'url', label: 'URL', icon: ic.link },
    { id: 'github', label: 'GitHub repo', icon: ic.github },
  ];

  return (
    <section className="scan-host" style={{
      position: 'relative', borderRadius: 18,
      background: 'linear-gradient(180deg, var(--slate), var(--slate))',
      border: '1px solid var(--border-strong)', overflow: 'hidden',
      boxShadow: 'var(--shadow-2), var(--shadow-glow)',
    }}>
      {/* Header */}
      <div style={{
        padding: hero ? '24px 28px 0' : '20px 22px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
      }}>
        <div>
          <EyebrowLabel style={{ marginBottom: 8 }}>
            <span className="spark" style={{ width: 6, height: 6 }}></span>
            START A TRANSFORM
          </EyebrowLabel>
          <h2 style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: hero ? 28 : 22, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Drop something in. Watch it transform.
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hide-sm">
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--lavender)', letterSpacing: '0.14em' }}>RECIPE</span>
          <button className="btn btn-ghost btn-sm" style={{ gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: TRANSFORMS.find(t => t.id === activeTransform)?.accent || 'var(--indigo)' }}></span>
            {TRANSFORMS.find(t => t.id === activeTransform)?.name || 'Pick a transform'}
            {ic.arr}
          </button>
        </div>
      </div>

      {/* Input source tabs */}
      <div style={{ padding: hero ? '18px 28px 0' : '14px 22px 0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {inputs.map(inp => {
          const locked = gates.inputs[inp.id];
          const active = inputType === inp.id;
          return (
            <button
              key={inp.id}
              onClick={() => !locked && setInputType(inp.id)}
              className={locked ? 'tt-host' : ''}
              style={{
                padding: '8px 14px', borderRadius: 10,
                background: active ? 'var(--indigo-tint)' : 'var(--slate-lt)',
                border: `1px solid ${active ? 'var(--indigo)' : 'var(--border)'}`,
                color: locked ? 'var(--lavender-dk)' : active ? 'var(--ghost)' : 'var(--lavender)',
                fontFamily: 'var(--dm)', fontWeight: 500, fontSize: 12.5,
                display: 'inline-flex', alignItems: 'center', gap: 8, position: 'relative',
                opacity: locked ? 0.7 : 1,
              }}
            >
              <span>{inp.icon}</span>
              {inp.label}
              {locked && <LockIcon size={10} />}
              {locked && <span className="tt">Upgrade to <b>{inp.id === 'github' ? 'Premium' : 'Pro'}</b> to unlock</span>}
            </button>
          );
        })}
      </div>

      {/* Body — input area */}
      <div style={{ padding: hero ? '14px 28px 0' : '14px 22px 0' }}>
        {inputType === 'paste' && (
          <PastePane value={pasted} onChange={setPasted} />
        )}
        {inputType === 'zip' && <ZipDropPane />}
        {inputType === 'url' && <UrlPane />}
        {inputType === 'github' && <GithubPane />}
      </div>

      {/* Transform picker */}
      <div style={{ padding: hero ? '20px 28px 0' : '16px 22px 0' }}>
        <EyebrowLabel style={{ marginBottom: 10 }}>
          <span>CHOOSE TRANSFORM</span>
          <span style={{ flex: 1, height: 1, background: 'var(--border)' }}></span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)' }}>STACKABLE</span>
        </EyebrowLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {TRANSFORMS.map(t => {
            const lockedAt = gates.transforms[t.id];
            const locked = lockedAt && lockedAt !== false;
            const active = activeTransform === t.id;
            return (
              <button
                key={t.id}
                onClick={() => !locked && setActiveTransform(t.id)}
                className={locked ? 'tt-host' : ''}
                style={{
                  padding: '10px 12px', borderRadius: 10,
                  background: active ? 'var(--indigo-tint)' : 'var(--slate-lt)',
                  border: `1px solid ${active ? 'var(--indigo)' : 'var(--border)'}`,
                  textAlign: 'left', position: 'relative',
                  display: 'flex', alignItems: 'center', gap: 10,
                  cursor: locked ? 'not-allowed' : 'pointer',
                }}
              >
                <span style={{ width: 8, height: 24, borderRadius: 2, background: t.accent, flexShrink: 0 }}></span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 12, color: locked ? 'var(--lavender)' : 'var(--ghost)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--lavender)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.desc}</div>
                </span>
                {locked && <LockIcon />}
                {locked && <span className="tt">Upgrade to <b>{lockedAt === 'premium' ? 'Premium' : 'Pro'}</b> to unlock</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / CTA bar */}
      <div style={{
        marginTop: hero ? 24 : 18, padding: hero ? '18px 28px' : '14px 22px',
        background: 'var(--void-2)', borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'var(--lavender)', fontSize: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span className="spark" style={{ width: 5, height: 5 }}></span>
            <span><b style={{ color: 'var(--ghost)', fontFamily: 'var(--syne)', fontWeight: 700 }}>~2s</b> estimated</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 5, height: 5, background: 'var(--lavender-dk)', borderRadius: '50%' }}></span>
            <span><b style={{ color: 'var(--ghost)', fontFamily: 'var(--syne)', fontWeight: 700 }}>{Math.max(0, gates.monthlyLimit === Infinity ? 999 : gates.monthlyLimit - gates.used)}</b> left this month</span>
          </span>
        </div>
        <div style={{ flex: 1 }}></div>
        <button className="btn btn-ghost btn-sm">Save as recipe</button>
        <button className="btn btn-lime btn-lg" style={{ minWidth: 200 }}>
          {ic.zap} Transform now
        </button>
      </div>
    </section>
  );
};

// ─── Input panes ──────────────────────────────────────────────────────
const PastePane = ({ value, onChange }) => (
  <div style={{ position: 'relative', borderRadius: 12, background: 'var(--void-2)', border: '1px solid var(--border)', minHeight: 200, overflow: 'hidden' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="traffic" style={{ transform: 'scale(0.8)', transformOrigin: 'left' }}><span></span><span></span><span></span></div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)', marginLeft: 6, letterSpacing: '0.06em' }}>untitled.html</span>
      </div>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--lavender)', letterSpacing: '0.12em' }}>{value.split('\n').length} LINES · HTML</span>
    </div>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
      style={{
        width: '100%', minHeight: 180, padding: '14px 16px',
        fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.7,
        color: 'var(--ghost)', background: 'transparent', border: 'none', outline: 'none',
        resize: 'vertical',
      }}
    />
  </div>
);

const ZipDropPane = () => (
  <div style={{ position: 'relative', minHeight: 220, borderRadius: 12, background: 'var(--void-2)', overflow: 'hidden' }}>
    <div className="ants" style={{ borderRadius: 12 }}></div>
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center', gap: 12,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14, background: 'var(--indigo-tint)',
        color: 'var(--indigo-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{ic.upload}</div>
      <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 18 }}>Drop a ZIP up to 20 MB</div>
      <div style={{ color: 'var(--lavender)', fontSize: 13, maxWidth: 380 }}>HTML, CSS, JS, images. We keep your folder structure intact.</div>
      <button className="btn btn-ghost btn-sm" style={{ marginTop: 4 }}>Or browse files</button>
    </div>
  </div>
);

const UrlPane = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '8px 0' }}>
    <div style={{ display: 'flex', gap: 10 }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--void-2)', border: '1px solid var(--border)', borderRadius: 12, padding: '4px 14px' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--lavender)', paddingRight: 8, borderRight: '1px solid var(--border)', marginRight: 8 }}>https://</span>
        <input placeholder="yoursite.com/page" defaultValue="client-bistro.com" style={{ flex: 1, padding: '10px 0', fontFamily: 'var(--mono)', fontSize: 13 }} />
        <button className="btn btn-ghost btn-sm">Fetch</button>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--success)' + '14', border: '1px solid rgba(34,212,122,0.25)', borderRadius: 10, fontSize: 12.5, color: 'var(--success)' }}>
      {ic.check} <span style={{ color: 'var(--ghost)' }}>Fetched <b style={{ color: 'var(--success)', fontFamily: 'var(--syne)' }}>23 files</b> (HTML + CSS + 18 images) — 487 KB total.</span>
    </div>
  </div>
);

const GithubPane = () => (
  <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--void-2)', border: '1px solid var(--border)', borderRadius: 12, padding: '4px 14px' }}>
      <span style={{ paddingRight: 10, color: 'var(--lavender)' }}>{ic.github}</span>
      <input placeholder="owner/repo or full URL" defaultValue="camluk/portfolio-2014" style={{ flex: 1, padding: '10px 0', fontFamily: 'var(--mono)', fontSize: 13 }} />
      <button className="btn btn-ghost btn-sm">Branch: main</button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      <RepoFile name="index.html" size="12 KB" />
      <RepoFile name="styles.css" size="4 KB" />
      <RepoFile name="script.js" size="1.2 KB" />
    </div>
  </div>
);

const RepoFile = ({ name, size }) => (
  <div style={{ padding: '8px 12px', background: 'var(--slate-lt)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ color: 'var(--indigo-lt)' }}>{ic.doc}</span>
    <span style={{ fontFamily: 'var(--mono)', fontSize: 11.5, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)' }}>{size}</span>
  </div>
);

// ─── Suggestion strip ─────────────────────────────────────────────────
const SuggestionStrip = () => (
  <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
    <span className="spark" style={{ width: 6, height: 6 }}></span>
    <div style={{ flex: 1, minWidth: 200 }}>
      <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Suggested for you</div>
      <div style={{ color: 'var(--lavender)', fontSize: 12.5 }}>Based on your role: <span style={{ color: 'var(--ghost)' }}>Freelancer</span></div>
    </div>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <span className="chip indigo">Modernise + Responsive</span>
      <span className="chip">Quick a11y audit</span>
      <span className="chip">Bulk client refresh</span>
    </div>
  </div>
);

// ─── Usage card ───────────────────────────────────────────────────────
const UsageCard = ({ tier, gates }) => {
  const cap = gates.monthlyLimit === Infinity ? 100 : gates.monthlyLimit;
  const pct = Math.min(100, (gates.used / cap) * 100);
  const unlimited = gates.monthlyLimit === Infinity;
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <EyebrowLabel>USAGE · MAY</EyebrowLabel>
        <TierBadge tier={tier} />
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 38, lineHeight: 1, letterSpacing: '-0.025em' }}>
          {gates.used}
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--lavender)' }}>
          / {unlimited ? '∞' : gates.monthlyLimit}
        </span>
        <span style={{ marginLeft: 6, fontFamily: 'var(--dm)', fontSize: 13, color: 'var(--lavender)' }}>transforms</span>
      </div>

      <div style={{ position: 'relative', height: 8, background: 'var(--slate-lt)', borderRadius: 4, overflow: 'hidden', marginTop: 12, marginBottom: 14 }}>
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 0, width: `${unlimited ? 100 : pct}%`,
          background: unlimited ? 'linear-gradient(90deg, var(--indigo), var(--lime))' : pct > 80 ? 'linear-gradient(90deg, var(--indigo), var(--warning))' : 'linear-gradient(90deg, var(--indigo-dk), var(--indigo))',
          borderRadius: 4,
        }}></div>
        {!unlimited && (
          <span className="spark" style={{
            position: 'absolute', left: `calc(${pct}% - 3px)`, top: '50%', transform: 'translateY(-50%)',
            width: 8, height: 8,
          }}></span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--lavender)' }}>
        <span>Resets {unlimited ? 'never' : 'in 8 days'}</span>
        {tier === 'starter' && <a href="#" style={{ color: 'var(--lime)', fontWeight: 600 }}>Upgrade →</a>}
      </div>

      {tier !== 'premium' && (
        <button className={`btn btn-sm ${tier === 'starter' ? 'btn-lime' : 'btn-ghost'}`} style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}>
          {tier === 'starter' ? 'Upgrade to Pro · $10/mo' : 'Compare Premium · $20/mo'}
        </button>
      )}
    </div>
  );
};

const StatCard = ({ label, value, sub, lime }) => (
  <div className="card" style={{ padding: 20 }}>
    <EyebrowLabel style={{ marginBottom: 10 }}>{label.toUpperCase()}</EyebrowLabel>
    <div style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 38, lineHeight: 1, letterSpacing: '-0.025em', color: lime ? 'var(--lime)' : 'var(--ghost)' }}>
      {value}
    </div>
    <div style={{ marginTop: 6, color: 'var(--lavender)', fontSize: 12.5 }}>{sub}</div>
  </div>
);

// ─── Recent projects ──────────────────────────────────────────────────
const TransformIconChip = ({ tid }) => {
  const t = TRANSFORMS.find(x => x.id === tid);
  if (!t) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 8px', borderRadius: 100,
      background: `${t.accent}1a`, border: `1px solid ${t.accent}40`,
      fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.06em',
      color: t.accent,
    }}>
      <span style={{ fontSize: 11 }}>{t.icon}</span> {t.name}
    </span>
  );
};

const RecentProjectsCard = ({ compact }) => (
  <div className="card" style={{ padding: 0 }}>
    <div style={{ padding: '16px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <EyebrowLabel>RECENT PROJECTS</EyebrowLabel>
      <a href="#" style={{ fontSize: 12, color: 'var(--lavender)' }}>See all →</a>
    </div>
    <div>
      {RECENT_PROJECTS.slice(0, 5).map((p, i) => (
        <ProjectRow key={i} p={p} compact={compact} last={i === 4} />
      ))}
    </div>
  </div>
);

const ProjectRow = ({ p, compact, last }) => (
  <div style={{
    padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12,
    borderTop: '1px solid var(--border)', transition: 'background .15s', cursor: 'pointer',
  }}
  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--slate-lt)'}
  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
  >
    <ProjectThumb tid={p.transform} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: 'var(--dm)', fontWeight: 500, fontSize: 13, color: 'var(--ghost)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3, color: 'var(--lavender)', fontSize: 11.5 }}>
        <TransformIconChip tid={p.transform} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10 }}>·</span>
        <span>{p.size}</span>
      </div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)', letterSpacing: '0.08em' }}>{p.when.toUpperCase()}</div>
      <div style={{ marginTop: 3, display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--success)' }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 6px var(--success)' }}></span>
        DONE
      </div>
    </div>
  </div>
);

// A tiny before/after thumb that hovers to reveal "after"
const ProjectThumb = ({ tid }) => {
  const t = TRANSFORMS.find(x => x.id === tid);
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 56, height: 40, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
        background: 'var(--void-2)', border: '1px solid var(--border)',
        position: 'relative',
      }}
    >
      {/* Before — grey grid */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, var(--slate-hi), var(--slate-lt))`,
        opacity: hover ? 0 : 1, transition: 'opacity .25s',
      }}>
        <div style={{ height: 6, background: '#3a3a52', margin: '6px 8px 4px' }}></div>
        <div style={{ height: 3, background: '#3a3a52', margin: '0 8px 3px', width: '60%' }}></div>
        <div style={{ height: 3, background: '#3a3a52', margin: '0 8px', width: '40%' }}></div>
      </div>
      {/* After — accent gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, ${t?.accent}33, var(--indigo-tint))`,
        opacity: hover ? 1 : 0, transition: 'opacity .25s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, color: t?.accent,
      }}>
        {t?.icon}
      </div>
    </div>
  );
};

// Recent projects as a grid
const RecentProjectsGrid = () => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <EyebrowLabel><span style={{ width: 24, height: 1, background: 'var(--border)' }}></span>RECENT PROJECTS</EyebrowLabel>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-ghost btn-sm">All</button>
        <button className="btn btn-ghost btn-sm" style={{ background: 'var(--slate-lt)' }}>Modernise</button>
        <button className="btn btn-ghost btn-sm">Responsive</button>
        <button className="btn btn-ghost btn-sm">A11y</button>
      </div>
    </div>
    {RECENT_PROJECTS.length === 0 ? (
      <div style={{
        padding: '48px 24px', textAlign: 'center',
        border: '1.5px dashed var(--border)', borderRadius: 14,
        color: 'var(--lavender)',
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ghost)', marginBottom: 6 }}>No transforms yet</div>
        <div style={{ fontSize: 13, marginBottom: 20 }}>Paste your first site above to get started.</div>
      </div>
    ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {RECENT_PROJECTS.map((p, i) => <ProjectCard key={i} p={p} />)}
        <NewProjectCard />
      </div>
    )}
  </div>
);

const ProjectCard = ({ p }) => {
  const t = TRANSFORMS.find(x => x.id === p.transform);
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="card"
      style={{
        padding: 0, transition: 'transform .2s, border-color .2s',
        transform: hover ? 'translateY(-3px)' : 'none',
        borderColor: hover ? t?.accent + '80' : 'var(--border)',
        cursor: 'pointer',
      }}
    >
      {/* preview area */}
      <div style={{
        height: 120, position: 'relative', overflow: 'hidden',
        background: 'var(--void-2)',
      }}>
        {/* Before mock */}
        <div style={{
          position: 'absolute', inset: 0, padding: 14,
          background: 'linear-gradient(180deg, var(--slate-hi), var(--slate-lt))',
          opacity: hover ? 0 : 1, transition: 'opacity .35s',
        }}>
          <div style={{ height: 8, background: '#3a3a52', marginBottom: 6, width: '70%' }}></div>
          <div style={{ height: 4, background: '#3a3a52', marginBottom: 3, width: '90%' }}></div>
          <div style={{ height: 4, background: '#3a3a52', marginBottom: 3, width: '60%' }}></div>
          <div style={{ height: 4, background: '#3a3a52', marginBottom: 12, width: '80%' }}></div>
          <div style={{ height: 22, background: '#3a3a52', width: 70 }}></div>
          <span style={{ position: 'absolute', top: 8, right: 12, fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--lavender)', letterSpacing: '0.14em' }}>BEFORE</span>
        </div>
        {/* After mock */}
        <div style={{
          position: 'absolute', inset: 0, padding: 14,
          background: `linear-gradient(135deg, ${t?.accent}22, var(--indigo-tint))`,
          opacity: hover ? 1 : 0, transition: 'opacity .35s',
        }}>
          <div style={{ height: 10, background: t?.accent, marginBottom: 8, width: '50%', borderRadius: 2 }}></div>
          <div style={{ height: 4, background: 'var(--ghost)', marginBottom: 3, width: '90%', borderRadius: 2, opacity: 0.8 }}></div>
          <div style={{ height: 4, background: 'var(--ghost)', marginBottom: 3, width: '80%', borderRadius: 2, opacity: 0.6 }}></div>
          <div style={{ height: 4, background: 'var(--ghost)', marginBottom: 12, width: '70%', borderRadius: 2, opacity: 0.5 }}></div>
          <div style={{ height: 22, background: 'var(--lime)', width: 80, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 10, color: 'var(--void)' }}>
            {t?.icon} READY
          </div>
          <span style={{ position: 'absolute', top: 8, right: 12, fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--lime)', letterSpacing: '0.14em' }}>✦ AFTER</span>
        </div>
        {/* accent line */}
        <span style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: t?.accent }}></span>
      </div>

      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontFamily: 'var(--dm)', fontWeight: 600, fontSize: 13, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--lavender)', fontSize: 11.5 }}>
          <TransformIconChip tid={p.transform} />
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em' }}>{p.when.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

const NewProjectCard = () => (
  <button className="scan-host" style={{
    padding: 0, minHeight: 200, borderRadius: 16,
    background: 'var(--slate)', border: '1.5px dashed var(--border-strong)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 10, position: 'relative', color: 'var(--lavender)',
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: 12, background: 'var(--indigo-tint)',
      color: 'var(--indigo-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{ic.plus}</div>
    <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 14, color: 'var(--ghost)' }}>New transform</div>
    <div style={{ fontSize: 11.5 }}>Or paste from clipboard ⌘V</div>
  </button>
);

// Responsive helpers
const ResponsiveDashCss = ({ sidebar }) => (
  <style>{`
    @media (max-width: 1100px){
      .dash-grid{ grid-template-columns: 1fr !important }
      .dash-bottom-grid{ grid-template-columns: 1fr 1fr !important }
    }
    @media (max-width: 760px){
      .dash-bottom-grid{ grid-template-columns: 1fr !important }
      ${sidebar ? '.sidebar{ display:none !important } [data-screen-label="Dashboard · Sidebar"]{ grid-template-columns: 1fr !important }' : ''}
    }
  `}</style>
);

Object.assign(window, { Dashboard });
