// onboarding.jsx — 4-step wizard with traveling-spark progress

const ROLES = [
  { id: 'freelancer', icon: '🧑‍💻', name: 'Freelancer', desc: 'Client work, inherited messes.' },
  { id: 'founder',    icon: '🚀', name: 'Founder',     desc: 'MVP shipped — needs polish.' },
  { id: 'agency',     icon: '🏢', name: 'Agency',      desc: 'Many clients, repeatable output.' },
  { id: 'curious',    icon: '🧪', name: 'Just curious', desc: 'Kicking the tires.' },
];

const GOALS = [
  { id: 'responsive', label: 'Make it responsive', hint: 'Mobile-first CSS' },
  { id: 'modernise',  label: 'Modernise design',   hint: 'Fresh type & palette' },
  { id: 'motion',     label: 'Add motion',         hint: 'CSS transitions' },
  { id: 'react',      label: 'Convert to React',   hint: 'Component output', tier: 'pro' },
  { id: 'darkmode',   label: 'Add dark mode',      hint: 'Theme toggle', tier: 'pro' },
  { id: 'perf',       label: 'Fix performance',    hint: 'Lazy, defer, optimise', tier: 'pro' },
  { id: 'a11y',       label: 'Improve a11y',       hint: 'ARIA + keyboard', tier: 'pro' },
  { id: 'tailwind',   label: 'Convert to Tailwind', hint: 'Utility classes', tier: 'premium' },
];

const Onboarding = ({ onDone, tier }) => {
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState('Kgomotso');
  const [role, setRole] = React.useState('freelancer');
  const [goals, setGoals] = React.useState(['responsive', 'modernise']);

  const steps = ['Welcome', 'Role', 'Goals', 'First transform'];
  const next = () => step < 3 ? setStep(s => s + 1) : onDone();
  const back = () => step > 0 && setStep(s => s - 1);

  return (
    <div className="scene" style={{
      minHeight: '100vh', position: 'relative', zIndex: 1,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top — minimal nav */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 32px', borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,15,0.6)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 5,
      }}>
        <Logo size={32} wordSize={18} />

        <ProgressTrack step={step} steps={steps} />

        <button
          onClick={onDone}
          style={{
            fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--lavender)',
            letterSpacing: '0.14em', padding: '8px 14px',
          }}
        >
          SKIP →
        </button>
      </div>

      {/* Step body */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
        <div style={{ width: '100%', maxWidth: 880 }} key={step}>
          {step === 0 && <StepWelcome name={name} setName={setName} />}
          {step === 1 && <StepRole role={role} setRole={setRole} />}
          {step === 2 && <StepGoals goals={goals} setGoals={setGoals} tier={tier} />}
          {step === 3 && <StepFirstTransform name={name} role={role} goals={goals} />}
        </div>
      </div>

      {/* Footer nav */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 32px', borderTop: '1px solid var(--border)',
      }}>
        <button
          className="btn btn-ghost"
          onClick={back}
          style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
        >
          {ic.arrL} Back
        </button>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--lavender)', letterSpacing: '0.1em' }}>
          STEP {step + 1} / 4 — {steps[step].toUpperCase()}
        </span>
        <button className="btn btn-primary" onClick={next}>
          {step === 3 ? <>Enter NuSite {ic.arr}</> : <>Continue {ic.arr}</>}
        </button>
      </div>
    </div>
  );
};

// Traveling-spark progress indicator
const ProgressTrack = ({ step, steps }) => {
  const pct = (step / (steps.length - 1)) * 100;
  return (
    <div className="hide-sm" style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 360 }}>
      <div style={{ position: 'relative', flex: 1, height: 2, background: 'var(--border-strong)', borderRadius: 1 }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${pct}%`, background: 'linear-gradient(90deg, var(--indigo), var(--lime))',
          borderRadius: 1, transition: 'width .4s cubic-bezier(.2,.7,.2,1)',
        }}></div>
        <div style={{
          position: 'absolute', left: `${pct}%`, top: '50%', transform: 'translate(-50%, -50%)',
          width: 12, height: 12, borderRadius: '50%',
          background: 'var(--lime)', boxShadow: '0 0 14px var(--lime)',
          transition: 'left .4s cubic-bezier(.2,.7,.2,1)',
        }}></div>
        {steps.map((_, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${(i / (steps.length - 1)) * 100}%`, top: '50%', transform: 'translate(-50%, -50%)',
            width: 8, height: 8, borderRadius: '50%',
            background: i <= step ? 'var(--indigo)' : 'var(--slate-hi)',
            border: '2px solid var(--void)',
          }}></div>
        ))}
      </div>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--lavender)', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
        {step + 1}/4
      </span>
    </div>
  );
};

// ─── Step 1: Welcome ──────────────────────────────────────────────────
const StepWelcome = ({ name, setName }) => (
  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {/* hero spark logo */}
    <div style={{
      width: 96, height: 96, borderRadius: 22, background: 'var(--indigo)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      boxShadow: '0 12px 60px rgba(91,76,255,0.5), 0 0 0 8px rgba(91,76,255,0.08)',
      marginBottom: 28,
    }}>
      <NuMark size={56} />
      <span className="spark" style={{
        position: 'absolute', top: -4, right: -4, width: 14, height: 14,
        animation: 'spinAround 3s linear infinite',
      }}></span>
    </div>

    <EyebrowLabel style={{ justifyContent: 'center', marginBottom: 14 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--lime)' }}></span>
      ACCOUNT READY · KICKOFF
    </EyebrowLabel>

    <h1 style={{
      fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 68, lineHeight: 1, letterSpacing: '-0.03em',
      textWrap: 'balance', marginBottom: 16,
    }}>
      Welcome in,<br />
      <span style={{ color: 'var(--indigo-lt)' }}>{name || 'friend'}.</span>
    </h1>
    <p style={{ color: 'var(--lavender)', fontSize: 17, maxWidth: 560, marginBottom: 36, textWrap: 'pretty' }}>
      30 seconds to tune NuSite to how you work. We'll line up your first transform at the end.
    </p>

    <div style={{ width: '100%', maxWidth: 380 }}>
      <label style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.16em', color: 'var(--lavender)', display: 'block', marginBottom: 8, textAlign: 'left' }}>
        WHAT SHOULD WE CALL YOU?
      </label>
      <input
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your first name"
        style={{ fontSize: 16, padding: '14px 16px' }}
      />
    </div>

    <div style={{ display: 'flex', gap: 20, marginTop: 40, color: 'var(--lavender)', fontSize: 13 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span className="spark" style={{ width: 5, height: 5 }}></span> Takes ~30 seconds</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 5, height: 5, background: 'var(--lavender-dk)', borderRadius: '50%' }}></span> You can change everything later</span>
    </div>

    <style>{`@keyframes spinAround { from{transform:rotate(0) translateX(58px) rotate(0)} to{transform:rotate(360deg) translateX(58px) rotate(-360deg)} }`}</style>
  </div>
);

// ─── Step 2: Role ─────────────────────────────────────────────────────
const StepRole = ({ role, setRole }) => (
  <div>
    <div style={{ textAlign: 'center', marginBottom: 32 }}>
      <EyebrowLabel style={{ justifyContent: 'center', marginBottom: 14 }}>
        <span>02 — WHO ARE YOU</span>
      </EyebrowLabel>
      <h1 style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 48, lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: 12 }}>
        How do you ship?
      </h1>
      <p style={{ color: 'var(--lavender)', fontSize: 16 }}>
        We'll tailor the dashboard and suggested transforms to your work.
      </p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
      {ROLES.map(r => {
        const active = r.id === role;
        return (
          <button
            key={r.id}
            onClick={() => setRole(r.id)}
            style={{
              background: active ? 'var(--indigo-tint)' : 'var(--slate)',
              border: `1.5px solid ${active ? 'var(--indigo)' : 'var(--border)'}`,
              borderRadius: 16, padding: '22px 24px', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 18,
              transition: 'all .2s', position: 'relative', overflow: 'hidden',
              boxShadow: active ? '0 8px 30px rgba(91,76,255,0.25)' : 'none',
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 14, fontSize: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: active ? 'var(--indigo)' : 'var(--slate-lt)',
              border: '1px solid var(--border)', flexShrink: 0,
            }}>{r.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 19, marginBottom: 4 }}>{r.name}</div>
              <div style={{ color: 'var(--lavender)', fontSize: 13 }}>{r.desc}</div>
            </div>
            {active && (
              <span style={{
                width: 26, height: 26, borderRadius: '50%', background: 'var(--lime)',
                color: 'var(--void)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{ic.check}</span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

// ─── Step 3: Goals ────────────────────────────────────────────────────
const StepGoals = ({ goals, setGoals, tier }) => {
  const toggle = (id, locked) => {
    if (locked) return;
    setGoals(g => g.includes(id) ? g.filter(x => x !== id) : [...g, id]);
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <EyebrowLabel style={{ justifyContent: 'center', marginBottom: 14 }}>
          <span>03 — TRANSFORMS</span>
        </EyebrowLabel>
        <h1 style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 48, lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: 12 }}>
          What do you want to do first?
        </h1>
        <p style={{ color: 'var(--lavender)', fontSize: 16 }}>
          Pick as many as you like. We'll pin them to your dashboard.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {GOALS.map(g => {
          const locked = g.tier && g.tier !== tier && !(g.tier === 'pro' && tier === 'premium');
          const active = goals.includes(g.id);
          const transform = TRANSFORMS.find(t => t.id === g.id);
          return (
            <button
              key={g.id}
              onClick={() => toggle(g.id, locked)}
              className={locked ? 'tt-host' : ''}
              style={{
                background: active ? 'var(--indigo-tint)' : 'var(--slate)',
                border: `1.5px solid ${active ? 'var(--indigo)' : 'var(--border)'}`,
                borderRadius: 14, padding: '18px 16px',
                textAlign: 'left', position: 'relative', overflow: 'hidden',
                opacity: locked ? 0.55 : 1,
                cursor: locked ? 'not-allowed' : 'pointer',
                minHeight: 130,
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* accent line */}
              <span style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: transform?.accent || 'var(--indigo)' }}></span>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'auto' }}>
                <span style={{ fontSize: 20 }}>{transform?.icon}</span>
                {locked ? <LockPill requires={g.tier} /> : (
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: active ? 'var(--lime)' : 'transparent',
                    border: active ? '0' : '1.5px solid var(--border-strong)',
                    color: 'var(--void)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {active && ic.check}
                  </span>
                )}
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{g.label}</div>
                <div style={{ color: 'var(--lavender)', fontSize: 11.5 }}>{g.hint}</div>
              </div>
              {locked && <span className="tt">Upgrade to <b>{g.tier === 'premium' ? 'Premium' : 'Pro'}</b> to unlock</span>}
            </button>
          );
        })}
      </div>

      <div style={{
        marginTop: 20, padding: '12px 16px', borderRadius: 10, background: 'var(--slate-lt)',
        border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10,
        fontSize: 13, color: 'var(--lavender)',
      }}>
        <span className="spark" style={{ width: 5, height: 5 }}></span>
        <span><b style={{ color: 'var(--ghost)', fontFamily: 'var(--syne)', fontWeight: 700 }}>{goals.length}</b> selected — you can change these anytime in <span style={{ color: 'var(--ghost)' }}>Settings → Preferences</span>.</span>
      </div>
    </div>
  );
};

// ─── Step 4: First transform ──────────────────────────────────────────
const StepFirstTransform = ({ name, role, goals }) => (
  <div>
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <EyebrowLabel style={{ justifyContent: 'center', marginBottom: 14 }}>
        <span>04 — READY TO SHIP</span>
      </EyebrowLabel>
      <h1 style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 48, lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: 12 }}>
        Try your first transform.
      </h1>
      <p style={{ color: 'var(--lavender)', fontSize: 16 }}>
        Drop something in below, or run the sample. It's on us.
      </p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
      {/* Big dropzone */}
      <div className="scan-host" style={{
        position: 'relative', borderRadius: 16, background: 'var(--slate)',
        border: '1.5px dashed var(--border-strong)', padding: '32px 28px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', textAlign: 'center', minHeight: 280,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: 'var(--indigo-tint)',
          color: 'var(--indigo-lt)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16,
        }}>{ic.upload}</div>
        <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
          Paste, drop or pick a file
        </div>
        <div style={{ color: 'var(--lavender)', fontSize: 14, marginBottom: 24, maxWidth: 360 }}>
          Raw HTML/CSS/JS, a ZIP up to 20MB, or pick the sample below to skip ahead.
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="chip">{ic.paste}<span>Paste</span></span>
          <span className="chip">{ic.upload}<span>ZIP</span></span>
          <span className="chip">{ic.link}<span>URL</span></span>
          <span className="chip">{ic.github}<span>GitHub</span></span>
        </div>
      </div>

      {/* Recipe */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: '18px 20px', background: 'var(--slate)', border: '1px solid var(--border)', borderRadius: 14 }}>
          <EyebrowLabel style={{ marginBottom: 12 }}>
            <span>YOUR FIRST RECIPE</span>
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }}></span>
          </EyebrowLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {goals.slice(0, 4).map((g, i) => {
              const t = TRANSFORMS.find(x => x.id === g);
              return (
                <div key={g} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 18, height: 18, borderRadius: 4, background: t?.accent || 'var(--indigo)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--void)' }}>{t?.icon}</span>
                  <span style={{ fontSize: 13, fontFamily: 'var(--syne)', fontWeight: 600 }}>{t?.name}</span>
                  <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)' }}>0{i + 1}</span>
                </div>
              );
            })}
            {goals.length === 0 && <span style={{ color: 'var(--lavender)', fontSize: 13 }}>Nothing selected — pick a few in the prior step.</span>}
          </div>
        </div>

        <button className="btn btn-lime btn-lg" style={{ justifyContent: 'center' }}>
          {ic.zap} Run the sample transform
        </button>

        <div style={{ padding: '14px 16px', background: 'var(--lime-tint)', border: '1px solid rgba(200,255,0,0.25)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
          <span className="spark" style={{ width: 6, height: 6 }}></span>
          <span><b style={{ color: 'var(--lime)', fontFamily: 'var(--syne)', fontWeight: 700 }}>5 transforms</b> ready to use this month.</span>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, { Onboarding });
