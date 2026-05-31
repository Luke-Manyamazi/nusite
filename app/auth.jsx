// auth.jsx — Sign in screen with Google only. Side panel features live before/after transformation.

const AuthScreen = ({ onSignIn }) => {
  const [loading, setLoading] = React.useState(false);
  const handleGoogle = () => {
    setLoading(true);
    setTimeout(onSignIn, 900);
  };

  return (
    <div className="scene" style={{
      minHeight: '100vh', position: 'relative', zIndex: 1,
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
    }}>
      {/* Left — brand side */}
      <div className="auth-side" style={{
        position: 'relative', padding: '40px 56px', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', borderRight: '1px solid var(--border)',
        background: 'linear-gradient(180deg, transparent, rgba(91,76,255,0.05))',
        overflow: 'hidden', minHeight: '100vh',
      }}>
        {/* Top — brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo size={36} wordSize={20} />
          <span className="chip live">Live</span>
        </div>

        {/* Middle — Live transformation preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginTop: 32 }}>
          <div>
            <EyebrowLabel style={{ marginBottom: 14 }}>
              <span style={{ width: 24, height: 1, background: 'var(--lime)' }}></span>
              The transformation engine
            </EyebrowLabel>
            <h1 style={{
              fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 56,
              lineHeight: 1.05, letterSpacing: '-0.025em', color: 'var(--ghost)',
              textWrap: 'pretty',
            }}>
              Old code in.<br />
              <span style={{ color: 'var(--indigo-lt)' }}>New site out.</span>
            </h1>
            <p style={{ marginTop: 16, color: 'var(--lavender)', fontSize: 16, maxWidth: 460 }}>
              Sign in to keep your transforms, projects and deployment guides in one place.
            </p>
          </div>

          {/* Animated before/after window */}
          <BeforeAfterDemo />
        </div>

        {/* Bottom — footer note */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', color: 'var(--lavender)', fontSize: 12, fontFamily: 'var(--mono)', letterSpacing: '0.08em' }}>
          <span>v1.0 · NUSITE.APP</span>
          <span>© CAMLUK TECHNOLOGIES</span>
        </div>
      </div>

      {/* Right — sign in card */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px',
        minHeight: '100vh', position: 'relative',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <EyebrowLabel style={{ marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--lime)', boxShadow: '0 0 8px var(--lime)' }}></span>
            Sign in · or sign up
          </EyebrowLabel>

          <h2 style={{
            fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 36,
            lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 10,
          }}>
            Welcome to <span style={{ color: 'var(--indigo-lt)' }}>NuSite</span>
          </h2>
          <p style={{ color: 'var(--lavender)', fontSize: 15, marginBottom: 32 }}>
            One click. No password to remember. Pick up where you left off.
          </p>

          {/* Google sign in */}
          <button
            className="btn btn-lg"
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: '100%', background: 'var(--ghost)', color: 'var(--void)',
              fontWeight: 700, justifyContent: 'center', gap: 12, height: 56,
              fontFamily: 'var(--syne)', fontSize: 15, position: 'relative',
              border: '1.5px solid var(--ghost)',
            }}
          >
            {loading ? (
              <>
                <span className="spark" style={{ animation: 'livePulse 0.8s ease infinite' }}></span>
                <span>Signing you in…</span>
              </>
            ) : (
              <>
                <GoogleG />
                Continue with Google
                <span style={{ marginLeft: 'auto', color: 'rgba(10,10,15,0.45)' }}>{ic.arr}</span>
              </>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0', color: 'var(--lavender)', fontSize: 12, fontFamily: 'var(--mono)', letterSpacing: '0.1em' }}>
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }}></span>
            <span>MORE COMING SOON</span>
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }}></span>
          </div>

          {/* "Coming soon" auth methods */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <SoonBtn label="GitHub" icon={ic.github} />
            <SoonBtn label="Apple" icon={<AppleLogo />} />
            <SoonBtn label="Email" icon={<EmailIcon />} />
          </div>

          {/* Perks */}
          <div style={{
            marginTop: 36, padding: '18px 20px', borderRadius: 12,
            background: 'var(--slate-lt)', border: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--ghost)' }}>
              <span className="spark"></span>
              <span><b style={{ fontFamily: 'var(--syne)', fontWeight: 700, color: 'var(--lime)' }}>5 free transforms</b> on us — no card required.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--lavender)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--lavender-dk)' }}></span>
              <span>Waitlist members get 30 days of Pro free.</span>
            </div>
          </div>

          <p style={{ marginTop: 24, color: 'var(--lavender)', fontSize: 12, lineHeight: 1.6 }}>
            By signing in you agree to our <a href="#" style={{ color: 'var(--ghost)', textDecoration: 'underline', textDecorationColor: 'var(--border-strong)' }}>Terms</a> and acknowledge our <a href="#" style={{ color: 'var(--ghost)', textDecoration: 'underline', textDecorationColor: 'var(--border-strong)' }}>Privacy Policy</a>.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px){
          .auth-side{ display:none }
          [data-auth-grid]{ grid-template-columns:1fr !important }
        }
      `}</style>
    </div>
  );
};

const SoonBtn = ({ label, icon }) => (
  <button className="btn btn-sm tt-host" style={{
    background: 'var(--slate-lt)', color: 'var(--lavender)',
    border: '1px solid var(--border)', justifyContent: 'center',
    fontFamily: 'var(--dm)', fontWeight: 500, gap: 6, position: 'relative',
  }}>
    <span style={{ opacity: 0.7 }}>{icon}</span>
    {label}
    <span className="tt">Coming soon</span>
  </button>
);

// Google G
const GoogleG = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.581C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"/>
  </svg>
);

const AppleLogo = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M11.18 8.52c-.02-1.86 1.52-2.76 1.6-2.81-.87-1.27-2.23-1.45-2.71-1.47-1.16-.12-2.26.68-2.85.68-.6 0-1.5-.66-2.46-.65-1.27.02-2.43.74-3.08 1.87-1.31 2.27-.34 5.63.93 7.48.62.9 1.36 1.92 2.32 1.88.94-.04 1.29-.6 2.42-.6 1.13 0 1.45.6 2.44.58 1.01-.02 1.65-.92 2.27-1.83.71-1.05 1.01-2.07 1.03-2.13-.02-.01-1.97-.76-1.99-3Zm-1.84-5.55c.52-.63.87-1.51.77-2.38-.75.03-1.65.5-2.19 1.12-.48.56-.91 1.45-.79 2.31.83.07 1.68-.42 2.21-1.05Z"/></svg>
);
const EmailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="m2 4.5 6 4.5 6-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
);

// ─── BeforeAfterDemo ───────────────────────────────────────────────────
// A "window" that scrolls old code on the left, transforms to a clean preview on the right.
const BeforeAfterDemo = () => {
  return (
    <div style={{
      borderRadius: 14, background: 'var(--slate)', border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-3)', overflow: 'hidden', position: 'relative',
    }}>
      {/* window chrome */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'var(--void-2)' }}>
        <div className="traffic"><span></span><span></span><span></span></div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--lavender)', letterSpacing: '0.05em' }}>
          nusite ✦ transform · client-portfolio
        </div>
        <span className="chip success">DONE</span>
      </div>

      <div className="scan-host" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 220, position: 'relative' }}>
        {/* Left — old */}
        <div style={{ padding: 14, borderRight: '1px solid var(--border)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)', letterSpacing: '0.14em' }}>BEFORE — 2014</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)' }}>index.html</span>
          </div>
          <pre className="codeblock" style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 11, lineHeight: 1.6, color: 'var(--lavender-dk)' }}>
{`<table width="100%">
  <tr><td bgcolor="#eee">
    <font face="Arial" size=5>
      Welcome
    </font>
  </td></tr>
  <tr><td>
    <img src="bg.jpg" />
    <p>Hello world.</p>
  </td></tr>
</table>`}
          </pre>
        </div>

        {/* Right — new */}
        <div style={{ padding: 14, position: 'relative', background: 'rgba(91,76,255,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lime)', letterSpacing: '0.14em' }}>✦ AFTER — TODAY</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)' }}>page.tsx</span>
          </div>
          <pre className="codeblock" style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 11, lineHeight: 1.6 }}>
{`export default function Hero(){
  return (
    `}<span style={{ color: '#a78bfa' }}>{`<section className="hero">`}</span>{`
      `}<span style={{ color: '#a78bfa' }}>{`<h1>`}</span>{`Welcome.`}<span style={{ color: '#a78bfa' }}>{`</h1>`}</span>{`
      `}<span style={{ color: '#a78bfa' }}>{`<p>`}</span>{`Hello world.`}<span style={{ color: '#a78bfa' }}>{`</p>`}</span>{`
    `}<span style={{ color: '#a78bfa' }}>{`</section>`}</span>{`
  );
}`}
          </pre>
        </div>
      </div>

      {/* footer with stats */}
      <div style={{ display: 'flex', gap: 18, padding: '10px 14px', borderTop: '1px solid var(--border)', background: 'var(--void-2)' }}>
        <Stat k="Lines" v="847 → 312" />
        <Stat k="Lighthouse" v="62 → 98" lime />
        <Stat k="Mobile" v="Broken → Fluid" />
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)' }}>
          ~2.3s
        </span>
      </div>
    </div>
  );
};
const Stat = ({ k, v, lime }) => (
  <div>
    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--lavender)', letterSpacing: '0.14em' }}>{k.toUpperCase()}</div>
    <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 12, color: lime ? 'var(--lime)' : 'var(--ghost)' }}>{v}</div>
  </div>
);

Object.assign(window, { AuthScreen });
