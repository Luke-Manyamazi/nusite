// payments.jsx — Stage 5 Payment flows. Five scenes: planPicker, checkout, success, billing, paywall.

// USD ≈ ZAR rate (illustrative, May 2026)
const ZAR_RATE = 18.8;
const zar = (usd) => `R ${Math.round(usd * ZAR_RATE).toLocaleString('en-ZA')}`;

const PLANS = [
  {
    id: 'starter', name: 'Starter', tagline: 'Kicking the tires',
    priceMonthly: 0, priceAnnual: 0,
    accent: 'var(--lavender)',
    blurb: 'Try NuSite without a card. Five transforms a month, paste-only input.',
    cta: 'Stay on Starter',
    features: [
      { ok: true, text: '5 transforms per month' },
      { ok: true, text: 'Paste input only' },
      { ok: true, text: '3 basic transformation types' },
      { ok: false, text: 'Deployment guide' },
      { ok: false, text: 'No NuSite watermark' },
      { ok: false, text: 'AI suggestions on output' },
      { ok: false, text: 'Saved project history' },
    ],
  },
  {
    id: 'pro', name: 'Pro', tagline: 'For freelancers & founders',
    priceMonthly: 10, priceAnnual: 8,
    badge: 'Most popular', featured: true,
    accent: 'var(--indigo-lt)',
    blurb: 'Everything you need to ship client work and personal projects fast.',
    cta: 'Start 7-day Pro trial',
    features: [
      { ok: true, text: '50 transforms per month' },
      { ok: true, text: 'Paste · ZIP · URL inputs' },
      { ok: true, text: 'All 8 transformation types' },
      { ok: true, text: 'Deployment guides included' },
      { ok: true, text: 'No NuSite watermark' },
      { ok: true, text: 'AI suggestions on every output' },
      { ok: true, text: '10 saved projects' },
      { ok: true, text: 'Email support' },
    ],
  },
  {
    id: 'premium', name: 'Premium', tagline: 'For agencies & power users',
    priceMonthly: 20, priceAnnual: 16,
    accent: 'var(--lime)',
    blurb: 'Unlimited everything. GitHub repos, custom prompts, batch mode.',
    cta: 'Go Premium',
    features: [
      { ok: true, text: 'Unlimited transforms' },
      { ok: true, text: 'All inputs incl. GitHub repos' },
      { ok: true, text: 'Custom prompts with Claude' },
      { ok: true, text: 'Side-by-side preview & sandbox' },
      { ok: true, text: 'Unlimited project history' },
      { ok: true, text: 'Priority support · < 4 hours' },
      { ok: true, text: 'Early access to new transforms' },
      { ok: true, text: 'Batch mode & custom recipes' },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════
// Top bar (shared)
// ════════════════════════════════════════════════════════════════════════
const BillingBar = ({ scene, currentPlan, onBack, secureCheckout, theme, setTheme }) => (
  <div className="billing-bar">
    <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ padding: '6px 10px' }}>
      {ic.arrL} Back
    </button>
    <div style={{ width: 1, height: 22, background: 'var(--border)' }}></div>
    <Logo size={28} wordSize={16} />
    {secureCheckout && (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--lavender)', fontFamily: 'var(--mono)', letterSpacing: '0.08em' }}>
        <SecureLock />
        SECURE CHECKOUT · 256-BIT
      </span>
    )}
    <div style={{ flex: 1 }}></div>
    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--lavender)', letterSpacing: '0.1em' }}>
      {scene.toUpperCase().replace('-', ' · ')}
    </span>
    <TierBadge tier={currentPlan} />
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="btn btn-ghost btn-sm" style={{ padding: 8, width: 32, height: 32 }}>
      {theme === 'dark' ? ic.sun : ic.moon}
    </button>
    <Avatar name="Kgomotso M." size={28} />
  </div>
);

const SecureLock = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <rect x="3" y="6" width="8" height="6" rx="1.4" fill="var(--success)" />
    <path d="M4.5 6V4.5a2.5 2.5 0 1 1 5 0V6" stroke="var(--success)" strokeWidth="1.4" />
  </svg>
);

// ════════════════════════════════════════════════════════════════════════
// 1. PLAN PICKER
// ════════════════════════════════════════════════════════════════════════
const PlanPicker = ({ currentPlan, billing, setBilling, onSelect }) => {
  return (
    <div className="scene" style={{ flex: 1, padding: '40px 32px 64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 700, marginBottom: 28 }}>
        <EyebrowLabel style={{ justifyContent: 'center', marginBottom: 12 }}>
          <span style={{ width: 24, height: 1, background: 'var(--lime)' }}></span>
          <span>STEP 1 · CHOOSE A PLAN</span>
          <span style={{ width: 24, height: 1, background: 'var(--lime)' }}></span>
        </EyebrowLabel>
        <h1 style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 52, lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: 12, textWrap: 'balance' }}>
          Pick the plan that <span style={{ color: 'var(--indigo-lt)' }}>fits</span>.
        </h1>
        <p style={{ color: 'var(--lavender)', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
          Cancel any time. Start with a 7-day Pro trial — no charge until it ends. Prices in USD; pay in your local currency at checkout.
        </p>
      </div>

      {/* Billing toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
        <div className="billing-toggle">
          <button className={billing === 'monthly' ? 'active' : ''} onClick={() => setBilling('monthly')}>Monthly</button>
          <button className={billing === 'annual' ? 'active' : ''} onClick={() => setBilling('annual')}>Annual</button>
        </div>
        <span className="save-sticker">
          {billing === 'annual' ? '✓' : '✦'} SAVE 2 MONTHS
        </span>
      </div>

      {/* Plans */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18,
        width: '100%', maxWidth: 1200, alignItems: 'stretch', marginBottom: 40,
      }} className="plans-grid">
        {PLANS.map(p => (
          <PlanCard
            key={p.id}
            plan={p}
            billing={billing}
            isCurrent={p.id === currentPlan}
            onSelect={() => onSelect(p.id)}
          />
        ))}
      </div>

      {/* Trust strip */}
      <div style={{
        display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap',
        padding: '20px 32px', background: 'var(--slate)', border: '1px solid var(--border)', borderRadius: 14,
        maxWidth: 920, width: '100%',
      }}>
        <TrustItem icon={<SecureLock />} k="Encrypted" v="Stripe-grade payments" />
        <TrustItem icon={<span>✦</span>} k="7-day trial" v="No charge until day 8" />
        <TrustItem icon="↩" k="Cancel anytime" v="No questions, no friction" />
        <TrustItem icon="🌍" k="Pay locally" v="ZAR, USD, EUR, GBP" />
      </div>

      <style>{`
        @media (max-width: 1024px){ .plans-grid{ grid-template-columns: 1fr !important; max-width: 480px } }
      `}</style>
    </div>
  );
};

const PlanCard = ({ plan, billing, isCurrent, onSelect }) => {
  const price = billing === 'annual' ? plan.priceAnnual : plan.priceMonthly;
  const cls = `plan-card ${plan.featured ? 'featured' : ''} ${plan.id === 'premium' ? 'premium-tier' : ''}`;
  return (
    <div className={cls}>
      {plan.featured && !isCurrent && <span className="plan-badge">★ MOST POPULAR</span>}
      {isCurrent && <span className="plan-badge current">YOUR PLAN</span>}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', color: plan.accent }}>
          {plan.name}
        </span>
        {plan.id === 'premium' && (
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--lime)', padding: '3px 7px', borderRadius: 4, background: 'var(--lime-tint)', border: '1px solid rgba(200,255,0,0.3)' }}>
            UNLIMITED
          </span>
        )}
      </div>
      <p style={{ color: 'var(--lavender)', fontSize: 12.5, marginBottom: 18 }}>{plan.tagline}</p>

      {/* Price */}
      <div style={{ marginBottom: 6 }}>
        {price === 0 ? (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 48, lineHeight: 1, letterSpacing: '-0.025em' }}>Free</span>
          </div>
        ) : (
          <div className="price-flip">
            <span style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 22, color: 'var(--lavender)', lineHeight: 1.2 }}>$</span>
            <span style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 56, lineHeight: 1, letterSpacing: '-0.025em' }}>{price}</span>
            <span style={{ fontFamily: 'var(--dm)', fontSize: 14, color: 'var(--lavender)', marginLeft: 4 }}>/ month</span>
          </div>
        )}
        {price > 0 && (
          <div style={{ fontSize: 12, color: 'var(--lavender)', marginTop: 4 }}>
            ≈ {zar(price)}/mo · {billing === 'annual' ? `billed ${zar(price * 12)} yearly` : 'billed monthly'}
          </div>
        )}
        {price > 0 && billing === 'annual' && (
          <div style={{ marginTop: 6 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lime)', letterSpacing: '0.1em' }}>
              ✦ SAVES {zar((plan.priceMonthly - plan.priceAnnual) * 12)} A YEAR
            </span>
          </div>
        )}
      </div>

      <p style={{ marginTop: 14, color: 'var(--lavender)', fontSize: 13, lineHeight: 1.55, minHeight: 42 }}>
        {plan.blurb}
      </p>

      <div style={{ height: 1, background: 'var(--border)', margin: '18px 0 14px' }}></div>

      {/* Features */}
      <div style={{ marginBottom: 22 }}>
        {plan.features.map((f, i) => (
          <div key={i} className={`fcheck ${f.ok ? '' : 'off'}`}>
            <span className="ck">{f.ok ? ic.check : ic.x}</span>
            <span>{f.text}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onSelect}
        disabled={isCurrent}
        className={`btn ${plan.featured ? 'btn-lime' : plan.id === 'premium' ? 'btn-primary' : 'btn-ghost'}`}
        style={{ width: '100%', justifyContent: 'center', marginTop: 'auto', minHeight: 48, fontSize: 14 }}
      >
        {isCurrent ? '✓ Current plan' : plan.cta}{!isCurrent && ' '}{!isCurrent && ic.arr}
      </button>
    </div>
  );
};

const TrustItem = ({ icon, k, v }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <span style={{
      width: 28, height: 28, borderRadius: 8, background: 'var(--slate-lt)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lime)',
      border: '1px solid var(--border)', fontSize: 13,
    }}>{icon}</span>
    <div>
      <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 13 }}>{k}</div>
      <div style={{ color: 'var(--lavender)', fontSize: 11.5 }}>{v}</div>
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════
// 2. CHECKOUT
// ════════════════════════════════════════════════════════════════════════
const Checkout = ({ selectedPlanId, billing, setBilling, onComplete, onBack }) => {
  const plan = PLANS.find(p => p.id === selectedPlanId) || PLANS[1];
  const price = billing === 'annual' ? plan.priceAnnual : plan.priceMonthly;
  const monthly = price;
  const yearly = price * 12;
  const subtotal = billing === 'annual' ? yearly : monthly;
  const tax = +(subtotal * 0.15).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  // Card form state — visible card preview updates
  const [cardNum, setCardNum] = React.useState('');
  const [cardName, setCardName] = React.useState('Kgomotso Mosiane');
  const [exp, setExp] = React.useState('');
  const [cvc, setCvc] = React.useState('');
  const [saveCard, setSaveCard] = React.useState(true);

  const trialEnds = new Date();
  trialEnds.setDate(trialEnds.getDate() + 7);
  const trialEndStr = trialEnds.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

  return (
    <div className="scene" style={{ flex: 1, padding: '32px 32px 56px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 1100 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <EyebrowLabel style={{ justifyContent: 'center', marginBottom: 10 }}>
            <span>STEP 2 · PAYMENT DETAILS</span>
          </EyebrowLabel>
          <h1 style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 36, letterSpacing: '-0.025em', marginBottom: 6 }}>
            Just one more step.
          </h1>
          <p style={{ color: 'var(--lavender)', fontSize: 14 }}>
            You won't be charged until <b style={{ color: 'var(--ghost)' }}>{trialEndStr}</b>. Cancel anytime before then.
          </p>
        </div>

        <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 22, alignItems: 'flex-start' }}>
          {/* LEFT — Order summary */}
          <div className="card" style={{ padding: 24, position: 'sticky', top: 84 }}>
            <EyebrowLabel style={{ marginBottom: 14 }}>ORDER SUMMARY</EyebrowLabel>

            {/* Selected plan card mini */}
            <div style={{
              padding: '14px 16px', borderRadius: 12, background: 'var(--indigo-tint)',
              border: '1px solid rgba(91,76,255,0.3)', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18,
            }}>
              <span style={{
                width: 38, height: 38, borderRadius: 9,
                background: plan.id === 'premium' ? 'rgba(200,255,0,0.2)' : 'var(--indigo)', color: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 16,
              }}>
                {plan.name[0]}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 15 }}>
                  NuSite {plan.name} · <span style={{ textTransform: 'capitalize' }}>{billing}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--lavender)' }}>{plan.tagline}</div>
              </div>
              <button onClick={onBack} style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--lavender)', padding: 4 }}>
                CHANGE
              </button>
            </div>

            {/* Billing toggle inside summary */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px', borderRadius: 10, background: 'var(--slate-lt)',
              border: '1px solid var(--border)', marginBottom: 18,
            }}>
              <span style={{ fontSize: 13, color: 'var(--lavender)' }}>Billing cycle</span>
              <div className="billing-toggle" style={{ padding: 3 }}>
                <button className={billing === 'monthly' ? 'active' : ''} onClick={() => setBilling('monthly')} style={{ padding: '4px 10px', fontSize: 11 }}>Monthly</button>
                <button className={billing === 'annual' ? 'active' : ''} onClick={() => setBilling('annual')} style={{ padding: '4px 10px', fontSize: 11 }}>Annual</button>
              </div>
            </div>

            {/* Line items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5 }}>
              <LineItem k={`${plan.name} · ${billing === 'annual' ? '12 months' : '1 month'}`} v={`$${subtotal.toFixed(2)}`} />
              <LineItem k="7-day free trial" v="−$0.00" lime />
              <LineItem k="VAT (15%)" v={`$${tax.toFixed(2)}`} muted />
              <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 15 }}>Total due today</span>
                <span style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>$0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--lavender)', fontSize: 11.5, fontFamily: 'var(--mono)', letterSpacing: '0.05em' }}>
                <span>After {trialEndStr}</span>
                <span>${total.toFixed(2)} · {zar(total)}</span>
              </div>
            </div>

            {/* Promo */}
            <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
              <input className="pf-input mono" placeholder="Promo code" style={{ flex: 1, fontSize: 13 }} />
              <button className="btn btn-ghost btn-sm">Apply</button>
            </div>
          </div>

          {/* RIGHT — Card form */}
          <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <EyebrowLabel>PAYMENT METHOD</EyebrowLabel>

            {/* Live card preview */}
            <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div className="ccard">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.16em', opacity: 0.6 }}>NUSITE · CHARGED VIA STRIPE</div>
                    <div style={{ marginTop: 4, fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
                      <span style={{ color: 'var(--lime)' }}>Nu</span>Site
                    </div>
                  </div>
                  <span style={{ fontSize: 22 }}>{cardBrandGlyph(cardNum)}</span>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 16, letterSpacing: '0.16em', marginBottom: 12 }}>
                    {formatCard(cardNum) || '•••• •••• •••• ••••'}
                  </div>
                  <div style={{ display: 'flex', gap: 18, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em' }}>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
                      {cardName || 'CARDHOLDER NAME'}
                    </span>
                    <span style={{ opacity: 0.7 }}>{exp || 'MM/YY'}</span>
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--lavender)' }}>
                  <span className="spark" style={{ width: 5, height: 5 }}></span>
                  <span>We use Stripe — we never see or store your card.</span>
                </div>
                <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--slate-lt)', border: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>✦ 7 days free</div>
                  <div style={{ fontSize: 12, color: 'var(--lavender)', lineHeight: 1.5 }}>
                    Try every Pro feature. We'll remind you 2 days before the trial ends. No charge if you cancel.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }}></div>

            {/* Email */}
            <div>
              <div className="pf-label">EMAIL · RECEIPT WILL BE SENT HERE</div>
              <input className="pf-input" defaultValue="kgomotso@studio.za" />
            </div>

            {/* Card */}
            <div>
              <div className="pf-label">
                CARD INFORMATION
                <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 4 }}>
                  <CardGlyph type="visa" />
                  <CardGlyph type="mc" />
                  <CardGlyph type="amex" />
                </span>
              </div>
              <input
                className="pf-input mono"
                placeholder="1234 1234 1234 1234"
                value={formatCard(cardNum)}
                onChange={(e) => setCardNum(e.target.value.replace(/\D/g, '').slice(0, 16))}
                style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: 'none' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                <input
                  className="pf-input mono"
                  placeholder="MM / YY"
                  value={exp}
                  onChange={(e) => setExp(formatExp(e.target.value))}
                  style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderRight: 'none' }}
                />
                <input
                  className="pf-input mono"
                  placeholder="CVC"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <div className="pf-label">CARDHOLDER NAME</div>
              <input className="pf-input" value={cardName} onChange={(e) => setCardName(e.target.value)} />
            </div>

            {/* Address */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 10 }}>
              <div>
                <div className="pf-label">COUNTRY</div>
                <select className="pf-input" defaultValue="ZA" style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238b85c1' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}>
                  <option value="ZA">South Africa</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="NG">Nigeria</option>
                  <option value="KE">Kenya</option>
                </select>
              </div>
              <div>
                <div className="pf-label">POSTAL / ZIP</div>
                <input className="pf-input mono" defaultValue="8001" />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--lavender)', cursor: 'pointer', userSelect: 'none' }}>
              <span style={{
                width: 18, height: 18, borderRadius: 5,
                background: saveCard ? 'var(--lime)' : 'transparent',
                border: '1.5px solid ' + (saveCard ? 'var(--lime)' : 'var(--border-strong)'),
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--void)',
              }}>{saveCard && ic.check}</span>
              <input type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} style={{ display: 'none' }} />
              Save card for renewals — you can update or remove it any time in Billing.
            </label>

            <button onClick={onComplete} className="btn btn-lime btn-lg" style={{ width: '100%', justifyContent: 'center', height: 56, fontSize: 15 }}>
              ✦ Start 7-day Pro trial — pay $0.00 today
              <span style={{ marginLeft: 4 }}>{ic.arr}</span>
            </button>

            <p style={{ fontSize: 11.5, color: 'var(--lavender)', textAlign: 'center', lineHeight: 1.6, marginTop: -4 }}>
              By starting your trial you agree to NuSite's <a href="#" style={{ color: 'var(--ghost)', textDecoration: 'underline' }}>Terms</a> and acknowledge our <a href="#" style={{ color: 'var(--ghost)', textDecoration: 'underline' }}>Privacy Policy</a>. You'll be charged ${total.toFixed(2)} on {trialEndStr} unless you cancel.
            </p>
          </div>
        </div>

        <div style={{
          marginTop: 20, padding: '14px 22px',
          background: 'var(--slate-lt)', border: '1px solid var(--border)', borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 22, justifyContent: 'center', flexWrap: 'wrap',
          fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--lavender)', letterSpacing: '0.06em',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><SecureLock /> SSL 256-BIT</span>
          <span>·</span>
          <span>POWERED BY STRIPE</span>
          <span>·</span>
          <span>PCI-DSS LEVEL 1</span>
          <span>·</span>
          <span>GDPR COMPLIANT</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px){ .checkout-grid{ grid-template-columns: 1fr !important } }
      `}</style>
    </div>
  );
};

const LineItem = ({ k, v, muted, lime }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', color: muted ? 'var(--lavender)' : 'var(--ghost)' }}>
    <span>{k}</span>
    <span style={{ fontFamily: 'var(--mono)', color: lime ? 'var(--lime)' : null }}>{v}</span>
  </div>
);

const formatCard = (n) => n.replace(/(.{4})/g, '$1 ').trim();
const formatExp = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};
const cardBrandGlyph = (num) => {
  if (num.startsWith('4')) return 'V';
  if (num.startsWith('5')) return 'M';
  if (num.startsWith('3')) return 'A';
  return '✦';
};
const CardGlyph = ({ type }) => {
  const label = type === 'visa' ? 'VISA' : type === 'mc' ? '●●' : 'AMEX';
  const bg = type === 'visa' ? '#1A1F71' : type === 'mc' ? '#EB001B' : '#006FCF';
  return (
    <span style={{
      width: 28, height: 18, borderRadius: 3, background: bg, color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 9, letterSpacing: '0.02em',
    }}>{label}</span>
  );
};

// ════════════════════════════════════════════════════════════════════════
// 3. SUCCESS — cinematic welcome
// ════════════════════════════════════════════════════════════════════════
const Success = ({ planId, onGo, onDashboard }) => {
  const plan = PLANS.find(p => p.id === planId) || PLANS[1];
  const unlocked = plan.features.filter(f => f.ok).slice(0, 6);
  const colors = ['#5B4CFF', '#C8FF00', '#7B6FFF', '#FFFFFF', '#5B4CFF', '#C8FF00'];

  return (
    <div className="scene success-stage">
      {/* Confetti */}
      {Array.from({ length: 24 }).map((_, i) => {
        const x = (i / 24) * 100;
        return (
          <span
            key={i}
            className="confetti"
            style={{
              left: `${x}%`,
              top: `${-(Math.random() * 20)}vh`,
              background: colors[i % colors.length],
              '--cx': `${(Math.random() - 0.5) * 60}vw`,
              '--cr': `${Math.random() * 1080}deg`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          ></span>
        );
      })}

      {/* Spark burst around orb */}
      <div className="success-orb">
        <NuMark size={56} />
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i / 14) * Math.PI * 2;
          const r = 200 + (i % 3) * 80;
          return (
            <span
              key={i}
              className="burst"
              style={{
                '--bx': `${Math.cos(angle) * r}px`,
                '--by': `${Math.sin(angle) * r}px`,
                animationDelay: `${i * 0.08}s`,
              }}
            ></span>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 36, maxWidth: 680, zIndex: 5 }}>
        <EyebrowLabel style={{ justifyContent: 'center', marginBottom: 12 }}>
          <span className="spark" style={{ width: 6, height: 6 }}></span>
          PAYMENT SUCCESSFUL · INV-NU-00482
        </EyebrowLabel>
        <h1 style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 80, lineHeight: 1, letterSpacing: '-0.035em', marginBottom: 16, textWrap: 'balance' }}>
          Welcome to <span style={{ color: 'var(--indigo-lt)' }}>{plan.name}</span><span style={{ color: 'var(--lime)' }}>.</span>
        </h1>
        <p style={{ color: 'var(--lavender)', fontSize: 17, maxWidth: 540, margin: '0 auto', textWrap: 'pretty' }}>
          Your account is upgraded. Here's everything that's now yours.
        </p>
      </div>

      {/* Unlocked grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
        width: '100%', maxWidth: 820, marginTop: 28, zIndex: 5,
      }} className="unlock-grid">
        {unlocked.map((u, i) => (
          <div key={i} style={{
            padding: '14px 16px', borderRadius: 12, background: 'rgba(28,28,46,0.6)',
            border: '1px solid var(--border-strong)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', gap: 12, position: 'relative',
            animation: `sceneIn .5s cubic-bezier(.2,.7,.2,1) both`,
            animationDelay: `${0.1 + i * 0.06}s`,
          }}>
            <span style={{
              width: 28, height: 28, borderRadius: '50%', background: 'var(--lime)',
              color: 'var(--void)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>{ic.check}</span>
            <span style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 13.5 }}>{u.text}</span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 12, marginTop: 32, zIndex: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={onGo} className="btn btn-lime btn-lg" style={{ minWidth: 260 }}>
          {ic.zap} Run my first {plan.name} transform {ic.arr}
        </button>
        <button onClick={onDashboard} className="btn btn-ghost btn-lg">
          Back to dashboard
        </button>
      </div>

      {/* Receipt */}
      <div style={{
        marginTop: 36, padding: '12px 22px',
        background: 'var(--slate-lt)', border: '1px solid var(--border)', borderRadius: 100,
        display: 'inline-flex', alignItems: 'center', gap: 20, fontSize: 12, color: 'var(--lavender)',
        fontFamily: 'var(--mono)', letterSpacing: '0.05em', zIndex: 5, flexWrap: 'wrap', justifyContent: 'center',
      }}>
        <span>INV-NU-00482</span>
        <span>·</span>
        <span>$0.00 PAID TODAY</span>
        <span>·</span>
        <span>RECEIPT SENT TO KGOMOTSO@STUDIO.ZA</span>
        <a href="#" style={{ color: 'var(--lime)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>DOWNLOAD PDF {ic.ext}</a>
      </div>

      <style>{`
        @media (max-width: 900px){ .unlock-grid{ grid-template-columns: 1fr !important; max-width: 480px } }
      `}</style>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
// 4. BILLING SETTINGS
// ════════════════════════════════════════════════════════════════════════
const INVOICES = [
  { id: 'NU-00482', date: '12 May 2026', desc: 'Pro · Annual',  amt: 110.40, status: 'PAID' },
  { id: 'NU-00329', date: '12 Apr 2026', desc: 'Pro · Monthly', amt: 11.50,  status: 'PAID' },
  { id: 'NU-00214', date: '12 Mar 2026', desc: 'Pro · Monthly', amt: 11.50,  status: 'PAID' },
  { id: 'NU-00118', date: '12 Feb 2026', desc: 'Pro · Monthly', amt: 11.50,  status: 'PAID' },
  { id: 'NU-00056', date: '12 Jan 2026', desc: 'Pro · Trial',   amt: 0.00,   status: 'PAID' },
];

const BillingSettings = ({ currentPlan, onChange, onCancel }) => {
  const plan = PLANS.find(p => p.id === currentPlan);
  const isFree = currentPlan === 'starter';

  return (
    <div className="scene" style={{ flex: 1, padding: '32px 32px 64px', maxWidth: 1180, margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: 28 }}>
        <EyebrowLabel style={{ marginBottom: 10 }}>
          <span style={{ width: 24, height: 1, background: 'var(--border)' }}></span>
          ACCOUNT · BILLING
        </EyebrowLabel>
        <h1 style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 40, letterSpacing: '-0.025em' }}>
          Billing & subscription
        </h1>
      </div>

      <div className="billing-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, alignItems: 'flex-start' }}>
        {/* LEFT column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Current plan card */}
          <div className="card scan-host" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: isFree ? 'var(--slate-lt)' : currentPlan === 'premium' ? 'rgba(200,255,0,0.15)' : 'var(--indigo)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  border: '1px solid var(--border-strong)',
                }}>
                  <NuMark size={28} />
                </div>
                <div>
                  <EyebrowLabel style={{ marginBottom: 4 }}>CURRENT PLAN</EyebrowLabel>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em' }}>NuSite {plan.name}</span>
                    {!isFree && (
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--lavender)' }}>
                        · ${plan.priceAnnual}/mo · billed annually
                      </span>
                    )}
                  </div>
                  <div style={{ marginTop: 4, color: 'var(--lavender)', fontSize: 13 }}>
                    {isFree
                      ? 'Free forever. Upgrade to unlock 50 transforms + all features.'
                      : `Renews 12 May 2027 · next charge ${zar(plan.priceAnnual * 12 * 1.15)}`}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={onChange} className={`btn ${isFree ? 'btn-lime' : 'btn-primary'}`} style={{ minWidth: 140 }}>
                  {isFree ? <>{ic.zap} Upgrade</> : 'Change plan'}
                </button>
                {!isFree && (
                  <button className="btn btn-ghost btn-sm">Switch to monthly</button>
                )}
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <EyebrowLabel>PAYMENT METHOD</EyebrowLabel>
              <button className="btn btn-ghost btn-sm">Add new card</button>
            </div>
            {isFree ? (
              <div style={{ padding: '20px 16px', borderRadius: 10, background: 'var(--slate-lt)', textAlign: 'center', color: 'var(--lavender)', fontSize: 13 }}>
                No card on file. You won't be charged.
              </div>
            ) : (
              <div style={{
                padding: '14px 18px', borderRadius: 12, background: 'var(--slate-lt)',
                border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <CardGlyph type="visa" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: '0.08em' }}>•••• •••• •••• 4242</div>
                  <div style={{ fontSize: 12, color: 'var(--lavender)', marginTop: 2 }}>Visa · expires 09/28 · default</div>
                </div>
                <button className="btn btn-ghost btn-sm">Update</button>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', borderColor: 'rgba(255,76,76,0.2)' }}>Remove</button>
              </div>
            )}
            <div style={{ marginTop: 14, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--lavender)' }}>
              <SecureLock />
              Securely processed by Stripe — we never see your card details.
            </div>
          </div>

          {/* Invoice history */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <EyebrowLabel>INVOICE HISTORY · LAST 5</EyebrowLabel>
              <a href="#" style={{ fontSize: 12, color: 'var(--lavender)' }}>Export CSV →</a>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '110px 1fr 100px 110px 60px',
              gap: 14, padding: '8px 22px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)', letterSpacing: '0.14em',
            }}>
              <span>DATE</span><span>DESCRIPTION</span><span style={{ textAlign: 'right' }}>AMOUNT</span><span>STATUS</span><span></span>
            </div>
            {INVOICES.map(inv => (
              <div key={inv.id} className="invoice-row">
                <span className="date">{inv.date}</span>
                <span className="desc">
                  <span style={{ color: 'var(--ghost)' }}>{inv.desc}</span>
                  <span style={{ color: 'var(--lavender)', fontFamily: 'var(--mono)', fontSize: 11, marginLeft: 8 }}>{inv.id}</span>
                </span>
                <span className="amt">${inv.amt.toFixed(2)}</span>
                <span className="stat">{inv.status}</span>
                <button style={{ color: 'var(--lavender)', padding: 6, justifySelf: 'end' }} title="Download PDF">{ic.upload}</button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT column — usage + danger zone */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Usage card */}
          <div className="card" style={{ padding: 22 }}>
            <EyebrowLabel style={{ marginBottom: 12 }}>USAGE · MAY</EyebrowLabel>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 42, lineHeight: 1, letterSpacing: '-0.025em' }}>
                {TIER_GATES[currentPlan].used}
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--lavender)' }}>
                / {TIER_GATES[currentPlan].monthlyLimit === Infinity ? '∞' : TIER_GATES[currentPlan].monthlyLimit}
              </span>
              <span style={{ marginLeft: 6, color: 'var(--lavender)', fontSize: 13 }}>transforms</span>
            </div>
            <UsageBar tier={currentPlan} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--lavender)', marginTop: 10 }}>
              <span>Resets in <b style={{ color: 'var(--ghost)' }}>8 days</b></span>
              {!isFree && <a href="#" style={{ color: 'var(--lime)' }}>Detailed usage →</a>}
            </div>

            {/* Sparkline */}
            <div style={{ marginTop: 16, padding: '14px 0 8px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)', letterSpacing: '0.12em', marginBottom: 10 }}>
                DAILY · LAST 14 DAYS
              </div>
              <DailyBars data={[0,2,1,3,0,1,2,4,1,0,2,3,1,2]} />
            </div>
          </div>

          {/* Account meta */}
          <div className="card" style={{ padding: 22 }}>
            <EyebrowLabel style={{ marginBottom: 12 }}>SUBSCRIPTION</EyebrowLabel>
            <MetaRow k="Subscribed since" v="14 January 2026" />
            <MetaRow k="Trial used" v={isFree ? 'No' : 'Yes · ended 21 Jan'} />
            <MetaRow k="Total paid" v={isFree ? '$0.00' : '$46.00'} />
            <MetaRow k="Billing email" v="kgomotso@studio.za" mono />
            <MetaRow k="Currency" v="USD · displays in ZAR" last />
          </div>

          {/* Danger zone */}
          {!isFree && (
            <div className="card" style={{ padding: 22, borderColor: 'rgba(255,76,76,0.18)' }}>
              <EyebrowLabel style={{ marginBottom: 12, color: 'var(--error)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--error)' }}></span>
                DANGER ZONE
              </EyebrowLabel>
              <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Cancel subscription</div>
              <div style={{ color: 'var(--lavender)', fontSize: 12.5, lineHeight: 1.55, marginBottom: 12 }}>
                You'll keep Pro access until your renewal date. We'll save your projects for 30 days.
              </div>
              <button onClick={onCancel} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', color: 'var(--error)', borderColor: 'rgba(255,76,76,0.2)' }}>
                Cancel subscription
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px){ .billing-grid{ grid-template-columns: 1fr !important } }
      `}</style>
    </div>
  );
};

const UsageBar = ({ tier }) => {
  const cap = TIER_GATES[tier].monthlyLimit;
  const used = TIER_GATES[tier].used;
  const pct = cap === Infinity ? 100 : Math.min(100, (used / cap) * 100);
  const unlim = cap === Infinity;
  return (
    <div style={{ position: 'relative', height: 10, background: 'var(--slate-lt)', borderRadius: 5, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0, width: `${pct}%`,
        background: unlim ? 'linear-gradient(90deg, var(--indigo), var(--lime))'
                  : pct > 80 ? 'linear-gradient(90deg, var(--indigo), var(--warning))'
                  : 'linear-gradient(90deg, var(--indigo-dk), var(--indigo))',
      }}></div>
      {!unlim && (
        <span className="spark" style={{
          position: 'absolute', left: `calc(${pct}% - 4px)`, top: '50%', transform: 'translateY(-50%)',
          width: 8, height: 8,
        }}></span>
      )}
    </div>
  );
};

const DailyBars = ({ data }) => {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 40 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, position: 'relative', height: '100%' }}>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: `${(v / max) * 100}%`, minHeight: v > 0 ? 3 : 0,
            background: i === data.length - 1 ? 'var(--lime)' : v === 0 ? 'var(--slate-hi)' : 'var(--indigo)',
            borderRadius: 2, transition: 'background .2s',
          }}></div>
        </div>
      ))}
    </div>
  );
};

const MetaRow = ({ k, v, mono, last }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 0', borderBottom: last ? 'none' : '1px solid var(--border)',
    fontSize: 13,
  }}>
    <span style={{ color: 'var(--lavender)' }}>{k}</span>
    <span style={{ fontFamily: mono ? 'var(--mono)' : 'var(--dm)', fontWeight: 500, color: 'var(--ghost)' }}>{v}</span>
  </div>
);

// ════════════════════════════════════════════════════════════════════════
// 5. PAYWALL MODAL — overlay on a faux dashboard
// ════════════════════════════════════════════════════════════════════════
const Paywall = ({ onUpgrade, onDismiss }) => {
  return (
    <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
      {/* faux dashboard backdrop */}
      <FauxDashboard />

      {/* modal */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(6,6,10,0.7)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <div className="scene" style={{
          width: '100%', maxWidth: 540, borderRadius: 20,
          background: 'var(--slate)', border: '1px solid var(--border-strong)',
          boxShadow: 'var(--shadow-3), 0 0 80px rgba(91,76,255,0.3)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* spark accent top */}
          <span style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--indigo), var(--lime), var(--indigo))' }}></span>
          <button onClick={onDismiss} style={{
            position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: 8,
            background: 'var(--slate-lt)', color: 'var(--lavender)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--border)',
          }}>{ic.x}</button>

          <div style={{ padding: '36px 32px 28px' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, background: 'var(--indigo-tint)',
              border: '1px solid rgba(91,76,255,0.3)', color: 'var(--indigo-lt)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
            }}>
              <LockIcon size={26} />
            </div>

            <EyebrowLabel style={{ marginBottom: 8, color: 'var(--warning)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)' }}></span>
              LIMIT REACHED · STARTER
            </EyebrowLabel>
            <h2 style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.025em', marginBottom: 10 }}>
              You've used all <span style={{ color: 'var(--indigo-lt)' }}>5</span> transforms.
            </h2>
            <p style={{ color: 'var(--lavender)', fontSize: 14, marginBottom: 22, lineHeight: 1.6 }}>
              Your free quota resets <b style={{ color: 'var(--ghost)' }}>12 June</b>. Upgrade to <b style={{ color: 'var(--ghost)' }}>Pro</b> to keep going right now — you'll get 10× the transforms plus everything Pro unlocks.
            </p>

            {/* Upgrade benefits mini list */}
            <div style={{
              padding: '14px 16px', borderRadius: 12, background: 'var(--slate-lt)',
              border: '1px solid var(--border)', marginBottom: 22,
            }}>
              <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="spark" style={{ width: 6, height: 6 }}></span>
                With Pro, immediately:
              </div>
              {[
                { ok: true, t: '50 transforms / month (vs 5)' },
                { ok: true, t: 'All 8 transformation types' },
                { ok: true, t: 'ZIP & URL inputs unlocked' },
                { ok: true, t: 'No NuSite watermark · 10 projects' },
              ].map((b, i) => (
                <div key={i} className="fcheck" style={{ padding: '4px 0' }}>
                  <span className="ck">{ic.check}</span>
                  <span style={{ fontSize: 13 }}>{b.t}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
              <button onClick={onUpgrade} className="btn btn-lime btn-lg" style={{ flex: 1, justifyContent: 'center', height: 52 }}>
                Upgrade to Pro · $10/mo
                <span style={{ marginLeft: 4 }}>{ic.arr}</span>
              </button>
            </div>
            <button onClick={onDismiss} style={{
              width: '100%', marginTop: 12, padding: '10px 0', textAlign: 'center',
              color: 'var(--lavender)', fontSize: 12.5,
            }}>
              I'll wait until 12 June →
            </button>
          </div>

          <div style={{
            padding: '12px 32px', borderTop: '1px solid var(--border)',
            background: 'var(--void-2)', display: 'flex', justifyContent: 'space-between',
            fontSize: 11, color: 'var(--lavender)', fontFamily: 'var(--mono)', letterSpacing: '0.08em',
          }}>
            <span>✦ 7-DAY FREE TRIAL</span>
            <span>CANCEL ANYTIME</span>
            <span>POWERED BY STRIPE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// A tiny fake dashboard to live behind the paywall
const FauxDashboard = () => (
  <div style={{ padding: '24px 32px', opacity: 0.7 }}>
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
      <div>
        <EyebrowLabel style={{ marginBottom: 10 }}>TUESDAY · 14:32</EyebrowLabel>
        <h1 style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 36, letterSpacing: '-0.02em' }}>
          Welcome back, <span style={{ color: 'var(--indigo-lt)' }}>Kgomotso.</span>
        </h1>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div className="card" style={{ padding: '10px 16px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lavender)', letterSpacing: '0.14em' }}>USED THIS MONTH</div>
          <div style={{ fontFamily: 'var(--syne)', fontWeight: 700, fontSize: 18, color: 'var(--warning)' }}>5 / 5</div>
        </div>
      </div>
    </div>
    <div className="card" style={{ padding: 22, minHeight: 280, opacity: 0.5 }}>
      <EyebrowLabel style={{ marginBottom: 10 }}>START A TRANSFORM</EyebrowLabel>
      <div style={{ fontFamily: 'var(--syne)', fontWeight: 800, fontSize: 22 }}>Drop something in.</div>
    </div>
  </div>
);

Object.assign(window, {
  PlanPicker, Checkout, Success, BillingSettings, Paywall, BillingBar, PLANS, ZAR_RATE, zar,
});
