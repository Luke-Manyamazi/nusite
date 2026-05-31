// deploy.jsx — Deploy Guide view. Host picker + step-by-step instructions.

const HOSTS = [
  {
    id: 'vercel',
    name: 'Vercel',
    desc: 'Zero-config Next.js · edge network · free hobby tier.',
    badge: 'Recommended',
    logo: <DeployLogo letter="▲" bg="#000" fg="#fff" />,
    accent: '#fff',
    detected: true,
    steps: [
      { label: 'Install the CLI',     cmd: 'npm i -g vercel' },
      { label: 'Sign in',             cmd: 'vercel login' },
      { label: 'Deploy this project', cmd: 'cd studio-lebani && vercel deploy --prod' },
    ],
    url: 'studio-lebani.vercel.app',
    time: '~90 seconds',
    cost: 'Free',
  },
  {
    id: 'netlify',
    name: 'Netlify',
    desc: 'Drag-and-drop or Git auto-deploy · forms · functions.',
    logo: <DeployLogo letter="N" bg="#00C7B7" fg="#fff" />,
    accent: '#00C7B7',
    steps: [
      { label: 'Install the CLI',  cmd: 'npm i -g netlify-cli' },
      { label: 'Sign in',          cmd: 'netlify login' },
      { label: 'Initialise',       cmd: 'netlify init' },
      { label: 'Deploy to prod',   cmd: 'netlify deploy --prod' },
    ],
    url: 'studio-lebani.netlify.app',
    time: '~2 minutes',
    cost: 'Free',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Pages',
    desc: 'Global edge · unlimited bandwidth · Git auto-deploy.',
    logo: <DeployLogo letter="☁" bg="#F38020" fg="#fff" />,
    accent: '#F38020',
    steps: [
      { label: 'Push your project to GitHub', cmd: 'git push origin main' },
      { label: 'Open dash.cloudflare.com',    cmd: '→ Pages → Create a project' },
      { label: 'Connect the repo',            cmd: 'Framework preset · Next.js' },
      { label: 'Deploy',                       cmd: 'Click Save and Deploy' },
    ],
    url: 'studio-lebani.pages.dev',
    time: '~2 minutes',
    cost: 'Free',
  },
  {
    id: 'github',
    name: 'GitHub Pages',
    desc: 'Free static hosting straight from a repo.',
    logo: <DeployLogo letter="●" bg="#181717" fg="#fff" />,
    accent: '#8B85C1',
    steps: [
      { label: 'Push to a public repo',         cmd: 'git push origin main' },
      { label: 'Open repo Settings → Pages',    cmd: '→ Build and deployment' },
      { label: 'Source: GitHub Actions',        cmd: 'Next.js Static workflow' },
      { label: 'Save — first deploy starts',    cmd: '~2 min until live' },
    ],
    url: 'studio.github.io/lebani',
    time: '~3 minutes',
    cost: 'Free',
  },
  {
    id: 'firebase',
    name: 'Firebase',
    desc: 'Google Cloud-backed hosting · custom domain · SSL.',
    logo: <DeployLogo letter="🔥" bg="#FFCA28" fg="#000" />,
    accent: '#FFA000',
    steps: [
      { label: 'Install the CLI',          cmd: 'npm i -g firebase-tools' },
      { label: 'Sign in',                  cmd: 'firebase login' },
      { label: 'Initialise hosting',       cmd: 'firebase init hosting' },
      { label: 'Deploy',                    cmd: 'firebase deploy --only hosting' },
    ],
    url: 'studio-lebani.web.app',
    time: '~2 minutes',
    cost: 'Free tier · 10 GB',
  },
  {
    id: 'cpanel',
    name: 'cPanel · shared',
    desc: 'Old-school shared host? We have you. FTP-style upload.',
    logo: <DeployLogo letter="cP" bg="#FF6C2C" fg="#fff" />,
    accent: '#FF6C2C',
    steps: [
      { label: 'Download the ZIP',                       cmd: 'studio-lebani.zip · 89 KB' },
      { label: 'Login to your cPanel',                   cmd: 'usually yourhost.com:2083' },
      { label: 'Open File Manager → public_html',        cmd: '/home/<you>/public_html' },
      { label: 'Upload + Extract the ZIP',               cmd: 'Right-click → Extract here' },
    ],
    url: 'yourdomain.co.za',
    time: '~4 minutes',
    cost: 'Existing hosting',
  },
  {
    id: 'aws',
    name: 'AWS Amplify',
    desc: 'AWS-native hosting with CI/CD from any Git provider.',
    logo: <DeployLogo letter="aws" bg="#232F3E" fg="#FF9900" small />,
    accent: '#FF9900',
    steps: [
      { label: 'Open console.aws.amazon.com/amplify', cmd: 'Amplify Hosting → New app' },
      { label: 'Connect your Git provider',           cmd: 'GitHub / GitLab / CodeCommit' },
      { label: 'Pick the repo + branch',              cmd: 'main · auto-detect Next.js' },
      { label: 'Save and deploy',                      cmd: '~3 min for first build' },
    ],
    url: 'main.d123abc.amplifyapp.com',
    time: '~4 minutes',
    cost: 'Pay-as-you-use',
  },
  {
    id: 'docker',
    name: 'Docker · VPS',
    desc: 'Self-host on any VPS, droplet or homelab.',
    logo: <DeployLogo letter="🐳" bg="#2496ED" fg="#fff" />,
    accent: '#2496ED',
    steps: [
      { label: 'Build the image',          cmd: 'docker build -t studio-lebani .' },
      { label: 'Run locally to verify',    cmd: 'docker run -p 3000:3000 studio-lebani' },
      { label: 'Push to a registry',       cmd: 'docker push you/studio-lebani:latest' },
      { label: 'Pull + run on the VPS',    cmd: 'docker run -d -p 80:3000 you/studio-lebani' },
    ],
    url: 'your.vps.ip:80',
    time: '~6 minutes',
    cost: 'Existing VPS',
  },
];

// Visual fallback "logo" tile (since we can't recreate copyrighted marks)
function DeployLogo({ letter, bg, fg, small }) {
  return (
    <span style={{
      width: 38, height: 38, borderRadius: 9,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: bg, color: fg,
      fontFamily: 'var(--syne)', fontWeight: 800, fontSize: small ? 11 : 18,
      letterSpacing: small ? '-0.02em' : '-0.04em',
      flexShrink: 0, border: '1px solid rgba(0,0,0,0.2)',
    }}>{letter}</span>
  );
}

// ════════════════════════════════════════════════════════════════════════
// DeployView
// ════════════════════════════════════════════════════════════════════════
const DeployView = ({ onBackToResult }) => {
  const [hostId, setHostId] = React.useState('vercel');
  const [doneSteps, setDoneSteps] = React.useState(new Set());
  const host = HOSTS.find(h => h.id === hostId);

  // Reset progress when host changes
  React.useEffect(() => { setDoneSteps(new Set()); }, [hostId]);

  const toggleStep = (i) => {
    setDoneSteps(s => {
      const n = new Set(s);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };
  const allDone = doneSteps.size === host.steps.length;

  return (
    <div className="scene" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 28px 24px', minHeight: 0, gap: 16, overflow: 'auto' }}>
      {/* Top heading */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <EyebrowLabel style={{ marginBottom: 8 }}>
            <span className="spark" style={{ width: 6, height: 6 }}></span>
            DEPLOY GUIDE · TAILORED TO YOUR OUTPUT
          </EyebrowLabel>
          <h1 style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', textWrap: 'balance' }}>
            Ship <span style={{ color: 'var(--indigo-lt)' }}>studio-lebani</span> in a few minutes.
          </h1>
          <p style={{ color: 'var(--lavender)', fontSize: 14, marginTop: 6, maxWidth: 560 }}>
            We detected a <b style={{ color: 'var(--ghost)' }}>Next.js project</b>. Pick where you want to host it — instructions below adapt to your choice.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={onBackToResult}>{ic.arrL} Back to result</button>
          <button className="btn btn-ghost btn-sm">{ic.upload} Download project · 89 KB</button>
        </div>
      </div>

      <div className="deploy-grid" style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 18, alignItems: 'flex-start' }}>

        {/* LEFT — Host picker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'sticky', top: 76 }}>
          <EyebrowLabel>
            <span style={{ width: 14, height: 1, background: 'var(--border)' }}></span>
            PICK YOUR HOST
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }}></span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9.5 }}>{HOSTS.length}</span>
          </EyebrowLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {HOSTS.map(h => (
              <HostCard
                key={h.id}
                host={h}
                selected={h.id === hostId}
                onClick={() => setHostId(h.id)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — Selected host guide */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
          {/* Header card with summary */}
          <div className="card scan-host" style={{ padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            {host.logo}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>{host.name}</span>
                {host.badge && <span className="chip lime">{host.badge}</span>}
                {host.detected && <span className="chip success">✦ Auto-detected</span>}
              </div>
              <div style={{ color: 'var(--lavender)', fontSize: 13 }}>{host.desc}</div>
            </div>
            <DeployMeta k="Est. time" v={host.time} />
            <DeployMeta k="Cost" v={host.cost} />
            <DeployMeta k="URL preview" v={host.url} mono />
          </div>

          {/* Steps */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <EyebrowLabel>STEP-BY-STEP · {host.steps.length} STEPS</EyebrowLabel>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--lavender)' }}>
                {doneSteps.size}/{host.steps.length} done
              </span>
            </div>
            <div style={{ padding: '8px 0' }}>
              {host.steps.map((s, i) => (
                <DeployStep
                  key={i}
                  num={i + 1}
                  step={s}
                  done={doneSteps.has(i)}
                  active={!doneSteps.has(i) && [...doneSteps].length === i}
                  last={i === host.steps.length - 1}
                  onToggle={() => toggleStep(i)}
                  accent={host.accent}
                />
              ))}
            </div>
            <div style={{ padding: '16px 22px', borderTop: '1px solid var(--border)', background: 'var(--void-2)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--lavender)' }}>
                <span className="spark" style={{ width: 5, height: 5 }}></span>
                Stuck on a step? <a href="#" style={{ color: 'var(--ghost)', textDecoration: 'underline', textDecorationColor: 'var(--border-strong)' }}>Open the {host.name} docs</a>
              </span>
              <div style={{ flex: 1 }}></div>
              <button className="btn btn-ghost">Copy all commands</button>
              <button className="btn btn-lime" disabled={!allDone} style={!allDone ? { opacity: 0.4 } : null}>
                {allDone ? <>✦ Open {host.url} {ic.ext}</> : <>Mark all complete to ship</>}
              </button>
            </div>
          </div>

          {/* Post-deploy checklist */}
          <div className="card" style={{ padding: 22 }}>
            <EyebrowLabel style={{ marginBottom: 14 }}>
              <span>AFTER YOU SHIP</span>
              <span style={{ flex: 1, height: 1, background: 'var(--border)' }}></span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9.5 }}>OPTIONAL</span>
            </EyebrowLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <PostStep title="Connect domain" sub={`Point yourdomain.co.za at ${host.name}`} />
              <PostStep title="Enable analytics" sub="Plausible · Vercel · GA4" />
              <PostStep title="Set up redirects" sub="Old URLs → new pages" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px){
          .deploy-grid{ grid-template-columns: 1fr !important }
        }
      `}</style>
    </div>
  );
};

const HostCard = ({ host, selected, onClick }) => (
  <button onClick={onClick} style={{
    padding: '12px 14px', borderRadius: 12, textAlign: 'left',
    background: selected ? 'var(--slate-hi)' : 'var(--slate)',
    border: `1.5px solid ${selected ? host.accent : 'var(--border)'}`,
    display: 'flex', alignItems: 'center', gap: 12, position: 'relative',
    transition: 'all .15s',
    boxShadow: selected ? `0 6px 24px ${host.accent}30` : 'none',
  }}>
    {host.logo}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 14, color: 'var(--ghost)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {host.name}
        </span>
        {host.badge && (
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em',
            padding: '2px 6px', borderRadius: 4, background: 'var(--lime)', color: 'var(--void)', fontWeight: 600,
          }}>{host.badge.toUpperCase()}</span>
        )}
        {host.detected && !host.badge && <span className="spark" style={{ width: 5, height: 5 }}></span>}
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--lavender)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {host.desc}
      </div>
    </div>
    {selected && (
      <span style={{
        width: 20, height: 20, borderRadius: '50%', background: host.accent,
        color: '#000', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{ic.check}</span>
    )}
  </button>
);

const DeployStep = ({ num, step, done, active, last, onToggle, accent }) => {
  const [copied, setCopied] = React.useState(false);
  const copy = (e) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(step.cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div style={{
      padding: '14px 22px 18px', borderBottom: last ? 'none' : '1px solid var(--border)',
      display: 'flex', gap: 14, alignItems: 'flex-start', position: 'relative',
    }}>
      {/* Vertical line connecting steps */}
      {!last && (
        <span style={{
          position: 'absolute', left: 31, top: 40, bottom: -1, width: 1,
          background: done ? `linear-gradient(180deg, ${accent || 'var(--indigo)'}, var(--border))` : 'var(--border)',
        }}></span>
      )}
      <button onClick={onToggle} style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: done ? 'var(--lime)' : active ? 'var(--indigo-tint)' : 'var(--slate-lt)',
        border: `1.5px solid ${done ? 'var(--lime)' : active ? 'var(--indigo)' : 'var(--border-strong)'}`,
        color: done ? 'var(--void)' : active ? 'var(--indigo-lt)' : 'var(--lavender)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 12,
        boxShadow: done ? '0 0 12px var(--lime)' : 'none',
      }}>
        {done ? ic.check : num}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 14, marginBottom: 8, textDecoration: done ? 'line-through' : 'none', textDecorationColor: 'var(--lavender)' }}>
          {step.label}
        </div>
        <div style={{
          position: 'relative', borderRadius: 10, background: 'var(--void-2)',
          border: '1px solid var(--border)', overflow: 'hidden',
        }}>
          <pre style={{
            padding: '12px 14px', paddingRight: 88,
            fontFamily: 'var(--mono)', fontSize: 12.5, lineHeight: 1.5,
            color: 'var(--ghost)', whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0,
          }}>
            <span style={{ color: 'var(--lavender)' }}>$ </span>{step.cmd}
          </pre>
          <button onClick={copy} style={{
            position: 'absolute', top: 8, right: 8,
            padding: '4px 10px', borderRadius: 6,
            background: copied ? 'var(--lime)' : 'var(--slate-lt)',
            color: copied ? 'var(--void)' : 'var(--lavender)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', fontWeight: 600,
            transition: 'all .15s',
          }}>
            {copied ? '✓ COPIED' : 'COPY'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PostStep = ({ title, sub }) => (
  <div style={{
    padding: '14px 16px', borderRadius: 10, background: 'var(--slate-lt)',
    border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--lavender-dk)' }}></span>
      <span style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 13 }}>{title}</span>
    </div>
    <div style={{ color: 'var(--lavender)', fontSize: 11.5, paddingLeft: 14 }}>{sub}</div>
  </div>
);

const DeployMeta = ({ k, v, mono }) => (
  <div>
    <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--lavender)', letterSpacing: '0.14em', marginBottom: 3 }}>{k.toUpperCase()}</div>
    <div style={{ fontFamily: mono ? 'var(--mono)' : 'var(--syne)', fontWeight: mono ? 500 : 700, fontSize: mono ? 12 : 14, color: 'var(--ghost)' }}>{v}</div>
  </div>
);

Object.assign(window, { DeployView, HOSTS });
