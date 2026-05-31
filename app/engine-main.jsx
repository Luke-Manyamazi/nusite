// engine-main.jsx — Boot the Transform Engine.

const ENGINE_DEFAULTS = /*EDITMODE-BEGIN*/{
  "state": "preflight",
  "progress": 0,
  "autoplay": false,
  "tier": "pro",
  "dark": true
}/*EDITMODE-END*/;

const STATES = [
  { id: 'preflight', label: 'Pre-flight' },
  { id: 'running',   label: 'Running' },
  { id: 'done',      label: 'Done' },
  { id: 'deploy',    label: 'Deploy' },
  { id: 'failed',    label: 'Failed' },
];

function App() {
  const [t, setTweak] = useTweaks(ENGINE_DEFAULTS);
  const [tick, setTick] = React.useState(t.progress);

  // theme drive
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.dark ? 'dark' : 'light');
  }, [t.dark]);

  // sync tick with stored progress when state changes
  React.useEffect(() => {
    setTick(t.progress);
  }, [t.state, t.progress]);

  // autoplay running state
  React.useEffect(() => {
    if (t.state !== 'running' || !t.autoplay) return;
    const id = setInterval(() => {
      setTick(p => {
        const next = p + 1;
        if (next >= 100) { clearInterval(id); return 100; }
        return next;
      });
    }, 220);
    return () => clearInterval(id);
  }, [t.state, t.autoplay]);

  const onClose = () => {
    // Back action — pretend to leave for the dashboard
    window.location.href = 'app.html';
  };

  const goto = (next) => {
    setTweak('state', next);
    if (next === 'running') {
      setTick(0);
      setTweak('progress', 0);
      setTweak('autoplay', true);
    }
    if (next === 'done') {
      setTick(100);
      setTweak('progress', 100);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <>
      <Engine
        state={t.state}
        progress={t.state === 'done' || t.state === 'deploy' ? 100 : t.state === 'preflight' ? 0 : tick}
        setProgress={setTick}
        tier={t.tier}
        theme={t.dark ? 'dark' : 'light'}
        setTheme={(theme) => setTweak('dark', theme === 'dark')}
        onClose={onClose}
        goto={goto}
      />

      <TweaksPanel>
        <TweakSection label="Engine state" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
          {STATES.map(s => (
            <button
              key={s.id}
              onClick={() => setTweak('state', s.id)}
              style={{
                padding: '8px 6px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                background: t.state === s.id ? '#29261b' : 'rgba(0,0,0,0.04)',
                color: t.state === s.id ? '#fafaf7' : 'inherit',
                border: '1px solid rgba(0,0,0,0.08)',
                fontFamily: 'inherit', cursor: 'default',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {t.state === 'running' && (
          <>
            <TweakSection label="Progress" />
            <TweakSlider
              label="Progress"
              value={tick}
              min={0}
              max={100}
              unit="%"
              onChange={(v) => { setTick(v); setTweak('progress', v); setTweak('autoplay', false); }}
            />
            <TweakToggle
              label="Autoplay"
              value={t.autoplay}
              onChange={(v) => { setTweak('autoplay', v); if (v) setTick(0); }}
            />
          </>
        )}

        <TweakSection label="Tier" />
        <TweakRadio
          label="Plan"
          value={t.tier}
          options={['starter', 'pro', 'premium']}
          onChange={(v) => setTweak('tier', v)}
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
