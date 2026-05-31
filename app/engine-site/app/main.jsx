// main.jsx — Boot the NuSite app shell. Owns scene routing + Tweaks panel.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "tier": "starter",
  "layout": "split",
  "dark": true,
  "startScene": "signin"
}/*EDITMODE-END*/;

const SCENES = [
  { id: 'signin',     label: 'Sign in' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'dashboard',  label: 'Dashboard' },
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [scene, setScene] = React.useState(() => {
    try {
      const stored = localStorage.getItem('nusite-scene');
      const hasUser = !!localStorage.getItem('nusite-email');
      // Only restore session if a real user is stored
      if (stored && stored !== 'signin' && hasUser) return stored;
      return 'signin';
    } catch(e) { return 'signin'; }
  });

  // Theme — drive html[data-theme]
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.dark ? 'dark' : 'light');
  }, [t.dark]);

  const goto = (next) => {
    setScene(next);
    try { localStorage.setItem('nusite-scene', next); } catch(e) {}
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <>
      {scene === 'signin' && (
        <AuthScreen onSignIn={() => goto('onboarding')} />
      )}
      {scene === 'onboarding' && (
        <Onboarding tier={t.tier} onDone={() => goto('dashboard')} />
      )}
      {scene === 'dashboard' && (
        <Dashboard
          tier={t.tier}
          layout={t.layout}
          theme={t.dark ? 'dark' : 'light'}
          setTheme={(theme) => setTweak('dark', theme === 'dark')}
          onSignOut={() => { try { localStorage.removeItem('nusite-scene'); } catch(e) {} goto('signin'); }}
        />
      )}

      <TweaksPanel>
        <TweakSection label="Scene" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
          {SCENES.map(s => (
            <button
              key={s.id}
              onClick={() => goto(s.id)}
              style={{
                padding: '8px 6px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                background: scene === s.id ? '#29261b' : 'rgba(0,0,0,0.04)',
                color: scene === s.id ? '#fafaf7' : 'inherit',
                border: '1px solid rgba(0,0,0,0.08)',
                fontFamily: 'inherit', cursor: 'default',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <TweakSection label="Tier · gating" />
        <TweakRadio
          label="Plan"
          value={t.tier}
          options={['starter', 'pro', 'premium']}
          onChange={(v) => setTweak('tier', v)}
        />
        <div style={{ fontSize: 10.5, color: 'rgba(41,38,27,0.55)', lineHeight: 1.5, padding: '4px 2px' }}>
          {t.tier === 'starter' && 'Free · 5 transforms · paste-only input · 3 basic transforms.'}
          {t.tier === 'pro' && 'Pro · 50 transforms · paste/ZIP/URL · all 8 transforms.'}
          {t.tier === 'premium' && 'Premium · unlimited · all inputs · custom prompts.'}
        </div>

        <TweakSection label="Layout" />
        <TweakRadio
          label="Dashboard"
          value={t.layout}
          options={[
            { value: 'split', label: 'Top + Split' },
            { value: 'sidebar', label: 'Sidebar' },
          ]}
          onChange={(v) => setTweak('layout', v)}
        />

        <TweakSection label="Theme" />
        <TweakToggle
          label="Dark mode"
          value={t.dark}
          onChange={(v) => setTweak('dark', v)}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
