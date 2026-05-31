// payments-main.jsx — Boot payments + wire Tweaks.

const BILLING_DEFAULTS = /*EDITMODE-BEGIN*/{
  "scene": "planPicker",
  "currentPlan": "starter",
  "billing": "annual",
  "dark": true
}/*EDITMODE-END*/;

const SCENES = [
  { id: 'planPicker',  label: 'Plans' },
  { id: 'checkout',    label: 'Checkout' },
  { id: 'success',     label: 'Success' },
  { id: 'billing',     label: 'Billing' },
  { id: 'paywall',     label: 'Paywall' },
];

function App() {
  const [t, setTweak] = useTweaks(BILLING_DEFAULTS);
  const [selectedPlanId, setSelectedPlanId] = React.useState('pro');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.dark ? 'dark' : 'light');
  }, [t.dark]);

  const goto = (next) => {
    setTweak('scene', next);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const setPlan = (id) => {
    setTweak('currentPlan', id);
  };

  const onBack = () => {
    if (t.scene === 'checkout') goto('planPicker');
    else if (t.scene === 'success') goto('billing');
    else if (t.scene === 'billing') window.location.href = 'NuSite App.html';
    else if (t.scene === 'paywall') goto('billing');
    else window.location.href = 'NuSite App.html';
  };

  return (
    <>
      <div className="billing-shell">
        <BillingBar
          scene={t.scene}
          currentPlan={t.currentPlan}
          onBack={onBack}
          secureCheckout={t.scene === 'checkout'}
          theme={t.dark ? 'dark' : 'light'}
          setTheme={(theme) => setTweak('dark', theme === 'dark')}
        />

        {t.scene === 'planPicker' && (
          <PlanPicker
            currentPlan={t.currentPlan}
            billing={t.billing}
            setBilling={(v) => setTweak('billing', v)}
            onSelect={(id) => {
              if (id === t.currentPlan) return;
              if (id === 'starter') { setPlan('starter'); goto('billing'); return; }
              setSelectedPlanId(id);
              goto('checkout');
            }}
          />
        )}

        {t.scene === 'checkout' && (
          <Checkout
            selectedPlanId={selectedPlanId}
            billing={t.billing}
            setBilling={(v) => setTweak('billing', v)}
            onComplete={() => { setPlan(selectedPlanId); goto('success'); }}
            onBack={() => goto('planPicker')}
          />
        )}

        {t.scene === 'success' && (
          <Success
            planId={t.currentPlan === 'starter' ? selectedPlanId : t.currentPlan}
            onGo={() => { window.location.href = 'NuSite Engine.html'; }}
            onDashboard={() => { window.location.href = 'NuSite App.html'; }}
          />
        )}

        {t.scene === 'billing' && (
          <BillingSettings
            currentPlan={t.currentPlan}
            onChange={() => goto('planPicker')}
            onCancel={() => alert('Cancel flow — not wired in this prototype')}
          />
        )}

        {t.scene === 'paywall' && (
          <Paywall
            onUpgrade={() => goto('planPicker')}
            onDismiss={() => { window.location.href = 'NuSite App.html'; }}
          />
        )}
      </div>

      <TweaksPanel>
        <TweakSection label="Screen" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
          {SCENES.map(s => (
            <button
              key={s.id}
              onClick={() => goto(s.id)}
              style={{
                padding: '8px 6px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                background: t.scene === s.id ? '#29261b' : 'rgba(0,0,0,0.04)',
                color: t.scene === s.id ? '#fafaf7' : 'inherit',
                border: '1px solid rgba(0,0,0,0.08)',
                fontFamily: 'inherit', cursor: 'default',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <TweakSection label="Current plan" />
        <TweakRadio
          label="Plan"
          value={t.currentPlan}
          options={['starter', 'pro', 'premium']}
          onChange={setPlan}
        />

        {(t.scene === 'planPicker' || t.scene === 'checkout') && (
          <>
            <TweakSection label="Billing cycle" />
            <TweakRadio
              label="Cycle"
              value={t.billing}
              options={['monthly', 'annual']}
              onChange={(v) => setTweak('billing', v)}
            />
          </>
        )}

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
