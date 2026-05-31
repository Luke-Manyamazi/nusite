// engine.jsx — Stage 4 Transform Engine. 4 states: preflight | running | done | failed.

// ════════════════════════════════════════════════════════════════════════
// Sample data
// ════════════════════════════════════════════════════════════════════════

const BEFORE_CODE = `<!DOCTYPE html>
<html>
<head>
  <title>Studio Lebani</title>
</head>
<body bgcolor="#eeeeee">
  <table width="980" align="center" cellspacing="0">
    <tr><td bgcolor="#222222">
      <font face="Arial" color="#ffffff" size="6">
        Studio Lebani
      </font>
    </td></tr>
    <tr><td>
      <table cellpadding="8"><tr>
        <td><img src="work1.jpg" border="0"></td>
        <td><img src="work2.jpg" border="0"></td>
        <td><img src="work3.jpg" border="0"></td>
      </tr></table>
    </td></tr>
  </table>
</body>
</html>`;

const AFTER_CODE = `import Image from 'next/image';

export default function Hero() {
  return (
    <section className="hero">
      <h1 className="display">Studio Lebani</h1>
      <p className="lede">
        A design practice for editorial,
        identity & packaging.
      </p>
      <ul className="works">
        <li><Image src="/work1.jpg" alt="Identity" width={520} height={680}/></li>
        <li><Image src="/work2.jpg" alt="Editorial" width={520} height={680}/></li>
        <li><Image src="/work3.jpg" alt="Packaging" width={520} height={680}/></li>
      </ul>
    </section>
  );
}`;

const PIPELINE = [
  { id: 'parse',     label: 'Parse',     desc: 'Reading input files',         range: [0, 14] },
  { id: 'plan',      label: 'Plan',      desc: 'Choosing transformations',    range: [14, 28] },
  { id: 'transform', label: 'Transform', desc: 'Generating new code',         range: [28, 70] },
  { id: 'optimize',  label: 'Optimize',  desc: 'Lazy-load · ARIA · semantic', range: [70, 88] },
  { id: 'package',   label: 'Package',   desc: 'Bundling output',             range: [88, 100] },
];

const FILE_QUEUE = [
  { name: 'index.html',   after: 'page.tsx',           ty: -120, ty2: -110 },
  { name: 'styles.css',   after: 'hero.module.css',    ty: -50,  ty2: -40  },
  { name: 'script.js',    after: 'works.tsx',          ty: 30,   ty2: 40   },
  { name: 'bg.jpg',       after: 'bg.webp',            ty: 100,  ty2: 95   },
  { name: 'about.html',   after: 'about.tsx',          ty: -80,  ty2: 60   },
  { name: 'logo.gif',     after: 'logo.svg',           ty: 60,   ty2: -70  },
  { name: 'works.html',   after: 'works.tsx',          ty: -110, ty2: 80   },
  { name: 'old.css',      after: 'globals.css',        ty: 80,   ty2: -100 },
];

const LOG_ENTRIES = [
  { t: '00:01', body: <span>Parsing <b>index.html</b>…</span>, kind: 'ok', pct: 4 },
  { t: '00:02', body: 'Detected: table layout, inline <font>, deprecated tags', kind: 'ok', pct: 8 },
  { t: '00:03', body: 'Found 3 images · 1 stylesheet · 1 script', kind: 'ok', pct: 12 },
  { t: '00:04', body: <span>Planning: <b>Modernise</b> + <b>Responsive</b> + <b>HTML→React</b></span>, kind: 'ok', pct: 18 },
  { t: '00:05', body: 'Reasoning: extracting semantic structure…', kind: 'ok', pct: 26 },
  { t: '00:07', body: <span>Generating <b>Hero.tsx</b>…</span>, kind: 'ok', pct: 34 },
  { t: '00:09', body: <span>Generating <b>Works.tsx</b>…</span>, kind: 'ok', pct: 44 },
  { t: '00:11', body: <span>Generating <b>hero.module.css</b>…</span>, kind: 'ok', pct: 54 },
  { t: '00:13', body: <span>Generating <b>globals.css</b>…</span>, kind: 'ok', pct: 64 },
  { t: '00:15', body: 'Optimizing: converting bg.jpg → bg.webp', kind: 'ok', pct: 74 },
  { t: '00:16', body: 'Lazy-loading all <Image /> elements', kind: 'ok', pct: 80 },
  { t: '00:17', body: 'Adding ARIA labels & semantic HTML5', kind: 'ok', pct: 86 },
  { t: '00:18', body: 'Bundling 12 files into output package', kind: 'ok', pct: 92 },
  { t: '00:19', body: <span><b>Transform complete</b> ✦ ready to ship</span>, kind: 'ok', pct: 100 },
];

// ════════════════════════════════════════════════════════════════════════
// Engine shell — owns top bar + stepper, routes the body
// ════════════════════════════════════════════════════════════════════════
const Engine = ({ state, progress, setProgress, tier, theme, setTheme, onClose, goto }) => {
  const stageIdx = currentStageIdx(progress);

  return (
    <div className="engine-shell">
      <EngineBar state={state} progress={progress} tier={tier} theme={theme} setTheme={setTheme} onClose={onClose} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {state === 'preflight' && <PreflightView tier={tier} onBegin={() => goto && goto('running')} />}
        {state === 'running'   && <RunningView progress={progress} setProgress={setProgress} />}
        {state === 'done'      && <DoneView tier={tier} onDeploy={() => goto && goto('deploy')} />}
        {state === 'failed'    && <FailedView />}
        {state === 'deploy'    && <DeployView onBackToResult={() => goto && goto('done')} />}
      </div>

      {state !== 'deploy' && <Stepper state={state} stageIdx={stageIdx} />}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
// Top engine bar
// ════════════════════════════════════════════════════════════════════════
const EngineBar = ({ state, progress, tier, theme, setTheme, onClose }) => {
  const label = state === 'preflight' ? 'READY'
              : state === 'running' ? 'PROCESSING'
              : state === 'done' ? 'DONE'
              : 'FAILED';
  const labelChip = (
    <span className={`chip ${state === 'running' ? '' : state === 'done' ? 'success' : state === 'failed' ? '' : 'indigo'}`}
      style={state === 'failed' ? { background: 'rgba(255,76,76,0.1)', borderColor: 'rgba(255,76,76,0.3)', color: 'var(--error)' } : null}
    >
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: state === 'running' ? 'var(--lime)'
                  : state === 'done' ? 'var(--success)'
                  : state === 'failed' ? 'var(--error)'
                  : 'var(--indigo-lt)',
        boxShadow: state === 'running' ? '0 0 10px var(--lime)' : 'none',
        animation: state === 'running' ? 'livePulse 1s ease-in-out infinite' : 'none',
      }}></span>
      {label}
    </span>
  );

  return (
    <div className="engine-bar">
      <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '6px 10px' }}>
        {ic.arrL} Back
      </button>
      <div style={{ width: 1, height: 22, background: 'var(--border)' }}></div>

      <Logo size={28} wordSize={16} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--lavender)', fontSize: 13 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--lavender)' }}>·</span>
        <span style={{ fontFamily: 'var(--syne)', fontWeight: 600, fontSize: 14, color: 'var(--ghost)' }}>portfolio-2014.zip</span>
        <span className="chip indigo">Modernise + React + Responsive</span>
      </div>

      <div style={{ flex: 1 }}></div>

      {state === 'running' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 280 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--lavender)', letterSpacing: '0.1em' }}>
            {String(progress).padStart(2, '0')}%
          </span>
          <div style={{ flex: 1, height: 4, background: 'var(--slate-lt)', borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0, width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--indigo), var(--lime))',
              transition: 'width .4s cubic-bezier(.2,.7,.2,1)',
              borderRadius: 2,
            }}></div>
            <span className="spark" style={{
              position: 'absolute', left: `calc(${progress}% - 4px)`, top: '50%',
              transform: 'translateY(-50%)', width: 8, height: 8,
            }}></span>
          </div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--lavender)' }}>
            {progress < 100 ? `~${Math.max(1, Math.ceil((100 - progress) / 5))}s` : '0s'}
          </span>
        </div>
      )}

      {labelChip}
      <TierBadge tier={tier} />
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="btn btn-ghost btn-sm" style={{ padding: 8, width: 32, height: 32 }}>
        {theme === 'dark' ? ic.sun : ic.moon}
      </button>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
// PRE-FLIGHT — confirm + begin
// ════════════════════════════════════════════════════════════════════════
const PreflightView = ({ tier, onBegin }) => (
  <div className="scene" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
    <div style={{ width: '100%', maxWidth: 980 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <EyebrowLabel style={{ justifyContent: 'center', marginBottom: 14 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--lime)', boxShadow: '0 0 10px var(--lime)' }}></span>
          PRE-FLIGHT — REVIEW & GO
        </EyebrowLabel>
        <h1 style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 52, lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: 12 }}>
          Ready when you are.
        </h1>
        <p style={{ color: 'var(--lavender)', fontSize: 16, maxWidth: 540, margin: '0 auto' }}>
          A quick look at what's about to happen. Estimated ~20 seconds. We'll keep you posted.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Input summary */}
        <div className="card" style={{ padding: 22 }}>
          <EyebrowLabel style={{ marginBottom: 12 }}>INPUT · ZIP</EyebrowLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, background: 'var(--indigo-tint)', color: 'var(--indigo-lt)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{ic.upload}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 16 }}>portfolio-2014.zip</div>
              <div style={{ color: 'var(--lavender)', fontSize: 12, fontFamily: 'var(--mono)' }}>12 files · 487 KB · uploaded 14:32</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['index.html', 'about.html', 'works.html', 'styles.css', 'old.css', 'script.js', 'bg.jpg', 'work1.jpg', 'work2.jpg', 'work3.jpg', 'logo.gif', 'fav.ico'].map(f => (
              <span key={f} className="chip" style={{ fontSize: 10, letterSpacing: '0.04em' }}>{f}</span>
            ))}
          </div>
        </div>

        {/* Transforms */}
        <div className="card" style={{ padding: 22 }}>
          <EyebrowLabel style={{ marginBottom: 12 }}>RECIPE · 3 TRANSFORMS</EyebrowLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['modernise', 'responsive', 'react'].map((id, i) => {
              const t = TRANSFORMS.find(x => x.id === id);
              return (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--slate-lt)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <span style={{ width: 6, height: 28, background: t.accent, borderRadius: 2, flexShrink: 0 }}></span>
                  <span style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 13 }}>{t.name}</div>
                    <div style={{ color: 'var(--lavender)', fontSize: 11 }}>{t.desc}</div>
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)' }}>0{i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Estimate strip */}
      <div className="card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', marginBottom: 20 }}>
        <EstStat k="Estimated time" v="~20 sec" />
        <Divider />
        <EstStat k="Files in / out" v="12 → ~18" />
        <Divider />
        <EstStat k="Output format" v="Next.js project" />
        <Divider />
        <EstStat k="Cost" v="1 transform" lime />
        <div style={{ flex: 1 }}></div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--lavender)', letterSpacing: '0.12em' }}>
          {tier === 'starter' ? '4 LEFT THIS MONTH' : tier === 'pro' ? '38 LEFT THIS MONTH' : 'UNLIMITED · PREMIUM'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost">Edit recipe</button>
        <button className="btn btn-ghost">Save & run later</button>
        <button className="btn btn-lime btn-lg" style={{ minWidth: 220 }} onClick={onBegin}>
          {ic.zap} Begin transform
        </button>
      </div>
    </div>
  </div>
);

const EstStat = ({ k, v, lime }) => (
  <div>
    <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--lavender)', letterSpacing: '0.14em' }}>{k.toUpperCase()}</div>
    <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 15, color: lime ? 'var(--lime)' : 'var(--ghost)' }}>{v}</div>
  </div>
);
const Divider = () => <span style={{ width: 1, height: 26, background: 'var(--border)' }}></span>;

// ════════════════════════════════════════════════════════════════════════
// RUNNING — cinematic orb + streaming
// ════════════════════════════════════════════════════════════════════════
const RunningView = ({ progress, setProgress }) => {
  const isFrozenByTweak = false; // controlled by parent

  return (
    <div className="scene" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Cinematic stage */}
      <div className="stage" style={{ flex: '0 0 56vh', minHeight: 420 }}>

        {/* Side preview windows */}
        <div className="preview-window left">
          <div className="pwhead"><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#444' }}></span>BEFORE · index.html</div>
          <div style={{ padding: 10, background: '#eaeaea', height: 'calc(100% - 26px)', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'Times New Roman, serif', fontSize: 14, color: '#222', fontWeight: 700 }}>Studio Lebani</div>
            <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
              <div style={{ width: 38, height: 28, background: '#999' }}></div>
              <div style={{ width: 38, height: 28, background: '#999' }}></div>
              <div style={{ width: 38, height: 28, background: '#999' }}></div>
            </div>
          </div>
        </div>

        <div className="preview-window right">
          <div className="pwhead"><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--lime)', boxShadow: '0 0 6px var(--lime)' }}></span>AFTER · page.tsx</div>
          <div style={{ padding: 10, background: '#0e0e1f', height: 'calc(100% - 26px)' }}>
            <div style={{ fontFamily: 'var(--syne)', fontSize: 16, fontWeight: 800, color: 'var(--ghost)', letterSpacing: '-0.02em' }}>Studio Lebani</div>
            <div style={{ fontSize: 9, color: 'var(--lavender)', marginTop: 2 }}>Design practice · editorial · identity</div>
            <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
              <div style={{ height: 28, background: 'var(--indigo)', borderRadius: 3 }}></div>
              <div style={{ height: 28, background: 'var(--indigo-lt)', borderRadius: 3 }}></div>
              <div style={{ height: 28, background: 'var(--lime)', borderRadius: 3 }}></div>
            </div>
          </div>
        </div>

        {/* The Orb */}
        <div className="orb">
          <NuMark size={86} />
          {/* spark bursts from orb */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const sx = Math.cos(angle) * 160;
            const sy = Math.sin(angle) * 100;
            return (
              <span key={i} className="sparkout" style={{
                '--sx': `${sx}px`, '--sy': `${sy}px`,
                animationDelay: `${i * 0.3}s`,
              }}></span>
            );
          })}
        </div>

        {/* File pills flying */}
        {FILE_QUEUE.map((f, i) => (
          <FlyingFile key={i} f={f} idx={i} />
        ))}

        {/* Floating status mid-stage */}
        <div style={{
          position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center', zIndex: 8,
        }}>
          <EyebrowLabel style={{ justifyContent: 'center', marginBottom: 4 }}>
            <span style={{ width: 24, height: 1, background: 'var(--lime)' }}></span>
            STAGE {currentStageIdx(progress) + 1} OF {PIPELINE.length}
            <span style={{ width: 24, height: 1, background: 'var(--lime)' }}></span>
          </EyebrowLabel>
          <div style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 30, letterSpacing: '-0.02em' }}>
            {PIPELINE[currentStageIdx(progress)].label}<span style={{ color: 'var(--lime)' }}>.</span>
          </div>
          <div style={{ color: 'var(--lavender)', fontSize: 13, marginTop: 2 }}>
            {PIPELINE[currentStageIdx(progress)].desc}
          </div>
        </div>

        {/* Bottom hint */}
        <div style={{
          position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
          fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--lavender)', letterSpacing: '0.14em', zIndex: 8,
        }}>
          ✦ NUSITE IS THINKING — KEEP THIS TAB OPEN
        </div>
      </div>

      {/* Streaming code + activity log */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16,
        padding: '20px 28px 24px', borderTop: '1px solid var(--border)',
        background: 'var(--void-2)', minHeight: 0, flex: 1,
      }}>
        <StreamingCode progress={progress} />
        <ActivityLog progress={progress} />
      </div>
    </div>
  );
};

const FlyingFile = ({ f, idx }) => {
  const delay = idx * 0.7;
  const duration = 5.6;
  return (
    <>
      {/* Before pill (left side) */}
      <span className="filefly" style={{
        '--ty': `${f.ty}px`, '--ty2': `${f.ty2}px`,
        animationDelay: `${delay}s`, animationDuration: `${duration}s`,
      }}>
        <span className="dot"></span>
        {f.name}
      </span>
    </>
  );
};

// Live typewriter that paces by progress
const StreamingCode = ({ progress }) => {
  // Map progress 28→95% to chars 0→full
  const startPct = 28, endPct = 95;
  const total = AFTER_CODE.length;
  const cap = progress <= startPct ? 0
            : progress >= endPct ? total
            : Math.floor((progress - startPct) / (endPct - startPct) * total);
  const shown = AFTER_CODE.slice(0, cap);
  const isStreaming = progress > startPct && progress < endPct;

  return (
    <div style={{
      borderRadius: 12, background: 'var(--slate)', border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="spark" style={{ width: 6, height: 6 }}></span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ghost)', letterSpacing: '0.06em' }}>
            ✦ STREAMING — page.tsx
          </span>
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)', letterSpacing: '0.1em' }}>
          {shown.split('\n').length} / {total > 0 ? AFTER_CODE.split('\n').length : 0} LINES
        </span>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px', position: 'relative' }}>
        <pre style={{
          fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.7,
          color: 'var(--ghost)', whiteSpace: 'pre', margin: 0,
        }}>
          {syntaxColor(shown)}
          {isStreaming && <span className="tw-cursor"></span>}
        </pre>
        {progress <= startPct && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(28,28,46,0.6)', backdropFilter: 'blur(4px)',
            fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--lavender)', letterSpacing: '0.14em',
          }}>
            WAITING FOR PLAN…
          </div>
        )}
      </div>
    </div>
  );
};

// Very light syntax coloring
const syntaxColor = (src) => {
  // Cheap: split on key tokens
  const parts = [];
  const re = /(\/\/.*$)|(['"`])([^'"`]*?)\2|(\b(?:import|export|default|function|return|from|const|let|var)\b)|(<\/?\w+|className|alt|src|width|height)/gm;
  let last = 0;
  let m;
  while ((m = re.exec(src))) {
    if (m.index > last) parts.push(src.slice(last, m.index));
    if (m[1])      parts.push(<span key={parts.length} style={{ color: 'rgba(139,133,193,0.6)', fontStyle: 'italic' }}>{m[1]}</span>);
    else if (m[2]) parts.push(<span key={parts.length} style={{ color: '#22D47A' }}>{m[2] + m[3] + m[2]}</span>);
    else if (m[4]) parts.push(<span key={parts.length} style={{ color: '#7B6FFF' }}>{m[4]}</span>);
    else if (m[5]) parts.push(<span key={parts.length} style={{ color: '#FCD34D' }}>{m[5]}</span>);
    last = re.lastIndex;
  }
  if (last < src.length) parts.push(src.slice(last));
  return parts;
};

const ActivityLog = ({ progress }) => {
  const visible = LOG_ENTRIES.filter(e => e.pct <= progress);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [visible.length]);

  return (
    <div style={{
      borderRadius: 12, background: 'var(--slate)', border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ghost)', letterSpacing: '0.06em' }}>
          ACTIVITY
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)' }}>
          {visible.length} events
        </span>
      </div>
      <div ref={ref} className="log" style={{ flex: 1, overflowY: 'auto', padding: '10px 14px' }}>
        {visible.map((e, i) => (
          <div key={i} className={`row ${e.kind}`}>
            <span className="t">{e.t}</span>
            <span className="body">{e.body}</span>
          </div>
        ))}
        {progress < 100 && (
          <div className="row">
            <span className="t" style={{ color: 'var(--lime)' }}>···</span>
            <span style={{ color: 'var(--lime)' }}>
              <span className="spark" style={{ width: 5, height: 5, marginRight: 6 }}></span>
              working<span className="tw-cursor" style={{ height: '0.9em', width: 5 }}></span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
// DONE — split-drag compare + AI suggestions
// ════════════════════════════════════════════════════════════════════════
const DoneView = ({ tier, onDeploy }) => {
  const [view, setView] = React.useState('preview'); // 'preview' | 'code'

  return (
    <div className="scene" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 28px 24px', minHeight: 0, gap: 16 }}>
      {/* Action bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <EyebrowLabel style={{ marginBottom: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }}></span>
            DONE IN 19.4s · 12 → 18 FILES
          </EyebrowLabel>
          <h1 style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em' }}>
            Transformation complete<span style={{ color: 'var(--lime)' }}>.</span>
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          {/* View toggle */}
          <div style={{ display: 'inline-flex', background: 'var(--slate-lt)', borderRadius: 10, padding: 3, border: '1px solid var(--border)' }}>
            {['preview', 'code', 'diff'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '7px 14px', borderRadius: 7, fontSize: 12,
                fontFamily: 'var(--syne)', fontWeight: 700, letterSpacing: '0.01em',
                color: view === v ? 'var(--ghost)' : 'var(--lavender)',
                background: view === v ? 'var(--slate-hi)' : 'transparent',
                textTransform: 'capitalize',
              }}>{v}</button>
            ))}
          </div>

          <button className="btn btn-ghost btn-sm">{ic.doc} View files (18)</button>
          <button className="btn btn-ghost btn-sm">Open in sandbox {ic.ext}</button>
          <button className="btn btn-lime">{ic.upload} Download · 487 KB</button>
        </div>
      </div>

      {/* Side-by-side compare */}
      <div style={{ flex: 1, minHeight: 380, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Before pane */}
        <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
          <span style={{
            position: 'absolute', top: 12, left: 12, zIndex: 2,
            padding: '4px 10px', borderRadius: 6, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
            background: 'rgba(10,10,15,0.6)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)',
            color: 'var(--lavender)', fontFamily: 'var(--mono)',
          }}>BEFORE · 2014</span>
          {view === 'preview' ? <BeforePreview /> : <CodePane code={BEFORE_CODE} lang="HTML · 2014" before />}
        </div>
        {/* After pane */}
        <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
          <span style={{
            position: 'absolute', top: 12, right: 12, zIndex: 2,
            padding: '4px 10px', borderRadius: 6, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
            background: 'rgba(10,10,15,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(200,255,0,0.3)',
            color: 'var(--lime)', fontFamily: 'var(--mono)',
          }}>✦ AFTER · TODAY</span>
          {view === 'preview' ? <AfterPreview /> : <CodePane code={AFTER_CODE} lang="page.tsx · 2025" />}
        </div>
      </div>

      {/* Bottom action bar */}
      <DoneBottomBar onDeploy={onDeploy} />

      {/* AI Recommendations — tier-gated */}
      <AiSuggestions tier={tier} onDeploy={onDeploy} />
    </div>
  );
};

// "Before" rendered preview — a 2014-looking page
const BeforePreview = () => (
  <div className="preview-before">
    <div style={{ background: '#222', padding: '14px 16px', marginBottom: 0 }}>
      <span style={{ fontFamily: 'Arial, sans-serif', color: '#fff', fontSize: 28, fontWeight: 700 }}>
        Studio Lebani
      </span>
      <span style={{ marginLeft: 14, color: '#888', fontSize: 11, fontFamily: 'Verdana' }}>
        Home &nbsp;|&nbsp; About &nbsp;|&nbsp; Works &nbsp;|&nbsp; Contact
      </span>
    </div>
    <div style={{ padding: '16px 0', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          width: 130, height: 90, background: '#aaa', border: '4px solid #fff', boxShadow: '2px 2px 0 #888',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontFamily: 'Verdana', fontSize: 11,
        }}>work{i}.jpg</div>
      ))}
    </div>
    <p style={{ fontSize: 13, color: '#333', maxWidth: 460, marginTop: 6, lineHeight: 1.4 }}>
      Welcome to my page! Please feel free to browse my designs. I update every Sunday.
    </p>
    <div style={{ marginTop: 12, padding: '4px 8px', display: 'inline-block', background: '#dadada', border: '2px outset #ccc', cursor: 'default', fontSize: 11, color: '#222' }}>
      « contact me »
    </div>
    <div style={{ marginTop: 24, fontSize: 10, color: '#777', fontFamily: 'Verdana' }}>
      Visitors: 003,481 · Last updated: 03/2014
    </div>
  </div>
);

// "After" rendered preview — a modern, on-brand page
const AfterPreview = () => (
  <div className="preview-after">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
      <Logo size={26} wordSize={14} />
      <nav style={{ display: 'flex', gap: 18, fontFamily: 'var(--dm)', fontSize: 12, color: 'var(--lavender)' }}>
        <span style={{ color: 'var(--ghost)' }}>Home</span>
        <span>About</span>
        <span>Works</span>
        <span>Contact</span>
      </nav>
    </div>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
      <div>
        <EyebrowLabel style={{ marginBottom: 10 }}>
          <span className="spark" style={{ width: 6, height: 6 }}></span>
          DESIGN PRACTICE · CAPE TOWN
        </EyebrowLabel>
        <h1 style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 44, lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: 8, textWrap: 'balance' }}>
          Studio <span style={{ color: 'var(--indigo-lt)' }}>Lebani</span>
        </h1>
        <p style={{ color: 'var(--lavender)', fontSize: 13, maxWidth: 320 }}>
          Editorial, identity & packaging for studios who think a bit harder.
        </p>
      </div>
      <span className="chip lime">EST. 2014</span>
    </div>
    <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
      {[
        ['Identity', 'var(--indigo)'],
        ['Editorial', 'var(--indigo-lt)'],
        ['Packaging', 'var(--lime)'],
      ].map(([label, c], i) => (
        <div key={i} style={{
          aspectRatio: '4/5', borderRadius: 10, background: `linear-gradient(135deg, ${c}, ${c}66)`,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 10,
          fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 12, color: c === 'var(--lime)' ? 'var(--void)' : 'var(--ghost)',
        }}>{label}</div>
      ))}
    </div>
  </div>
);

const CodePane = ({ code, lang, before }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: before ? '#eaeaea' : 'var(--void-2)' }}>
    <div style={{
      padding: '10px 14px', borderBottom: '1px solid var(--border)',
      display: 'flex', justifyContent: 'space-between',
      background: before ? '#d4d4d4' : 'var(--slate)',
      color: before ? '#222' : 'var(--lavender)',
      fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.08em',
    }}>
      <span>{lang}</span>
      <span>{code.split('\n').length} LINES</span>
    </div>
    <pre style={{
      flex: 1, padding: '16px 18px', overflow: 'auto',
      fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.7,
      color: before ? '#444' : 'var(--ghost)',
      whiteSpace: 'pre', margin: 0,
    }}>
      {before ? code : syntaxColor(code)}
    </pre>
  </div>
);

const DoneBottomBar = ({ onDeploy }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: 'repeat(5, 1fr) auto', gap: 0,
    background: 'var(--slate)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden',
  }}>
    <DoneStat k="Lines of code" v="142 → 37" sub="–74%" lime />
    <DoneStat k="Lighthouse" v="58 → 98" sub="performance" lime />
    <DoneStat k="Bundle" v="487 KB → 89 KB" sub="–82%" lime />
    <DoneStat k="Mobile-ready" v="No → Fluid" sub="all breakpoints" />
    <DoneStat k="A11y score" v="63 → 100" sub="WCAG AA" />
    <button onClick={onDeploy} className="btn btn-primary" style={{
      borderRadius: 0, borderLeft: '1px solid var(--border)', padding: '0 24px',
      borderTop: 'none', borderBottom: 'none', borderRight: 'none',
      gap: 8, alignSelf: 'stretch',
    }}>
      {ic.upload} Deploy guide {ic.arr}
    </button>
  </div>
);
const DoneStat = ({ k, v, sub, lime }) => (
  <div style={{ padding: '14px 18px', borderRight: '1px solid var(--border)' }}>
    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)', letterSpacing: '0.14em', marginBottom: 6 }}>{k.toUpperCase()}</div>
    <div style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 18, color: 'var(--ghost)', letterSpacing: '-0.01em' }}>{v}</div>
    <div style={{ fontSize: 11, color: lime ? 'var(--lime)' : 'var(--lavender)', marginTop: 2 }}>{sub}</div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════
// AI SUGGESTIONS — tier-gated. Locked teaser for Starter. Full for Pro/Premium.
// ════════════════════════════════════════════════════════════════════════
const AI_SUGGESTIONS = [
  { id: 'darkmode',  icon: '◑', accent: '#FCD34D',
    name: 'Add dark mode',
    why: 'Your output uses CSS custom properties — flipping in a theme toggle is ~4 lines. Most visitors expect it now.',
    impact: '+18% session time', time: '~3s', kind: 'transform' },
  { id: 'images',    icon: '⚡', accent: '#34D399',
    name: 'Squeeze your hero image',
    why: 'bg.webp is still 142 KB. Re-encoded at quality 78 it lands at ~38 KB with no visible loss.',
    impact: '−104 KB · faster LCP', time: '~1s', kind: 'optimise' },
  { id: 'sitemap',   icon: '◈', accent: '#A78BFA',
    name: 'Generate sitemap.xml',
    why: 'We detected 4 pages and no sitemap. Adding one (plus robots.txt) helps SEO indexing.',
    impact: 'Better discovery', time: '~1s', kind: 'addon' },
  { id: 'tailwind',  icon: '🌬', accent: '#38BDF8',
    name: 'Convert to Tailwind',
    why: 'Your hero.module.css is small enough to inline cleanly. Easier for a team to maintain.',
    impact: '−1 file · DX win', time: '~6s', kind: 'transform', premium: true },
];

const AiSuggestions = ({ tier, onDeploy }) => {
  const isStarter = tier === 'starter';
  const isPremium = tier === 'premium';
  const shown = isPremium ? AI_SUGGESTIONS : AI_SUGGESTIONS.filter(s => !s.premium);
  const [customPrompt, setCustomPrompt] = React.useState('');

  return (
    <section style={{
      marginTop: 4, padding: '22px 24px',
      background: 'var(--slate)', border: '1px solid var(--border)', borderRadius: 14,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
        <div>
          <EyebrowLabel style={{ marginBottom: 6 }}>
            <span style={{
              width: 18, height: 18, borderRadius: 5,
              background: 'linear-gradient(135deg, var(--indigo), var(--indigo-dk))',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 12px rgba(91,76,255,0.5)',
            }}>
              <NuMark size={11} />
            </span>
            NUSITE SUGGESTS · POWERED BY CLAUDE
            {isPremium && <span style={{ marginLeft: 4 }} className="chip lime">PREMIUM</span>}
          </EyebrowLabel>
          <h2 style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', textWrap: 'balance' }}>
            {isStarter
              ? <>We see <span style={{ color: 'var(--indigo-lt)' }}>three quick wins</span> in your output.</>
              : <>{shown.length} ways to make this even sharper.</>}
          </h2>
        </div>
        {!isStarter && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm">Dismiss all</button>
            <button className="btn btn-lime btn-sm">{ic.zap} Run all ({shown.length})</button>
          </div>
        )}
      </div>

      {/* The actual content — locked for starter */}
      <div style={{ position: 'relative' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: `repeat(${shown.length}, 1fr)`, gap: 10,
          filter: isStarter ? 'blur(6px) saturate(0.6)' : 'none',
          opacity: isStarter ? 0.55 : 1,
          pointerEvents: isStarter ? 'none' : 'auto',
          transition: 'filter .2s',
        }}>
          {shown.map(s => <SuggestionCard key={s.id} s={s} premium={isPremium} />)}
        </div>

        {/* Premium-only custom prompt */}
        {isPremium && (
          <div style={{
            marginTop: 14, padding: '12px 14px', borderRadius: 12,
            background: 'var(--void-2)', border: '1px dashed var(--border-strong)',
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--lime)' }}>
              ✦ PREMIUM
            </span>
            <input
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ask Claude something specific — e.g. ‘add a contact form section in the brand style’"
              style={{
                flex: 1, minWidth: 240, padding: '10px 12px',
                background: 'transparent', fontSize: 13, fontFamily: 'var(--dm)',
                color: 'var(--ghost)',
              }}
            />
            <button className="btn btn-primary btn-sm" disabled={!customPrompt.trim()} style={!customPrompt.trim() ? { opacity: 0.4 } : null}>
              Send {ic.arr}
            </button>
          </div>
        )}

        {/* Starter locked overlay */}
        {isStarter && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'auto',
          }}>
            <div style={{
              padding: '20px 26px', borderRadius: 14,
              background: 'rgba(28,28,46,0.85)', backdropFilter: 'blur(8px)',
              border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-3)',
              display: 'flex', alignItems: 'center', gap: 18, maxWidth: 600, textAlign: 'left',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: 'var(--indigo-tint)',
                color: 'var(--indigo-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <LockIcon size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                  Unlock AI suggestions
                </div>
                <div style={{ color: 'var(--lavender)', fontSize: 12.5, lineHeight: 1.5 }}>
                  Pro analyses every output and tells you what to fix next — in one click.
                </div>
              </div>
              <button className="btn btn-lime btn-sm" style={{ flexShrink: 0 }}>Upgrade to Pro</button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {!isStarter && (
        <div style={{
          marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
          fontSize: 12, color: 'var(--lavender)',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span className="spark" style={{ width: 5, height: 5 }}></span>
            Suggestions don't use your monthly transforms.
          </span>
          <div style={{ flex: 1 }}></div>
          <span>Or skip ahead →</span>
          <button onClick={onDeploy} className="btn btn-ghost btn-sm">{ic.upload} Deploy as-is</button>
        </div>
      )}
    </section>
  );
};

const SuggestionCard = ({ s, premium }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: 14, borderRadius: 12, background: 'var(--slate-lt)',
        border: `1px solid ${hover ? s.accent + '80' : 'var(--border)'}`,
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', gap: 10, minHeight: 180,
        transition: 'all .2s',
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover ? `0 8px 24px ${s.accent}20` : 'none',
      }}
    >
      <span style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: s.accent }}></span>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          width: 30, height: 30, borderRadius: 8, background: `${s.accent}20`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
          border: `1px solid ${s.accent}40`,
        }}>{s.icon}</span>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--lavender)',
          padding: '2px 6px', background: 'var(--slate-hi)', borderRadius: 4,
        }}>{s.kind.toUpperCase()}</span>
      </div>

      <div>
        <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 14.5, marginBottom: 5, letterSpacing: '-0.01em' }}>
          {s.name}
        </div>
        <div style={{ fontSize: 12, color: 'var(--lavender)', lineHeight: 1.5 }}>{s.why}</div>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10, color: s.accent, letterSpacing: '0.08em',
          padding: '3px 8px', borderRadius: 100, background: `${s.accent}15`, border: `1px solid ${s.accent}30`,
        }}>{s.impact}</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)' }}>·</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)' }}>{s.time}</span>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <button className="btn btn-lime btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: 11.5 }}>
          {ic.zap} Apply
        </button>
        {premium && (
          <button className="btn btn-ghost btn-sm" style={{ padding: '8px 10px', fontSize: 11.5 }}>
            Preview
          </button>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
// FAILED
// ════════════════════════════════════════════════════════════════════════
const FailedView = () => (
  <div className="scene crackle" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
      <div style={{ maxWidth: 720, width: '100%', textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 22, background: 'rgba(255,76,76,0.1)',
          border: '1px solid rgba(255,76,76,0.3)', color: 'var(--error)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22,
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M12 3v9m0 4v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <EyebrowLabel style={{ justifyContent: 'center', marginBottom: 10, color: 'var(--error)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--error)' }}></span>
          PARTIAL FAILURE · STAGE 3 OF 5
        </EyebrowLabel>
        <h1 style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 44, letterSpacing: '-0.025em', marginBottom: 12 }}>
          We hit a snag.
        </h1>
        <p style={{ color: 'var(--lavender)', fontSize: 16, maxWidth: 540, margin: '0 auto 28px' }}>
          Three of the four input files transformed cleanly. <span style={{ color: 'var(--ghost)' }}>script.js</span> uses an inline IIFE we couldn't safely refactor — your call.
        </p>

        <div style={{
          textAlign: 'left', display: 'inline-block', minWidth: 480, maxWidth: '100%',
          background: 'var(--slate)', border: '1px solid var(--border)', borderRadius: 12,
          padding: '16px 20px', fontFamily: 'var(--mono)', fontSize: 12.5,
        }}>
          <div style={{ color: 'var(--error)', marginBottom: 8, letterSpacing: '0.06em', fontSize: 11 }}>ERROR · NU-422</div>
          <div style={{ color: 'var(--ghost)', marginBottom: 4 }}>script.js:42 — unresolved <span style={{ color: 'var(--lime)' }}>window.legacy_init</span></div>
          <div style={{ color: 'var(--lavender)' }}>// Skipping file. 3 of 4 succeeded.</div>
        </div>

        <div style={{ marginTop: 28, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-ghost">Skip this file & finish</button>
          <button className="btn btn-ghost">Get the partial result</button>
          <button className="btn btn-primary">Retry with custom prompt</button>
        </div>
        <p style={{ marginTop: 18, color: 'var(--lavender)', fontSize: 12 }}>
          ✦ No transform credit was used. Retries are on us.
        </p>
      </div>
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════
// Stepper at bottom of every state
// ════════════════════════════════════════════════════════════════════════
const Stepper = ({ state, stageIdx }) => (
  <div className="stages">
    {PIPELINE.map((s, i) => {
      const isActive = state === 'running' && i === stageIdx;
      const isDone = (state === 'done') || (state === 'running' && i < stageIdx) || (state === 'failed' && i < 2);
      const isFail = state === 'failed' && i === 2;
      return (
        <div key={s.id} className={`step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`} style={isFail ? { background: 'rgba(255,76,76,0.06)' } : null}>
          <span className="num" style={isFail ? { background: 'var(--error)', borderColor: 'var(--error)', color: '#fff' } : null}>
            {isDone ? ic.check : isFail ? ic.x : (i + 1)}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 12, color: 'var(--ghost)', letterSpacing: '0.01em' }}>
              {s.label}
            </div>
            <div style={{ fontSize: 11, color: 'var(--lavender)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {s.desc}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const currentStageIdx = (progress) => {
  for (let i = 0; i < PIPELINE.length; i++) {
    const [lo, hi] = PIPELINE[i].range;
    if (progress >= lo && progress < hi) return i;
  }
  return PIPELINE.length - 1;
};

Object.assign(window, { Engine });
