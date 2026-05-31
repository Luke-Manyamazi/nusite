// ── Theme ──
const THEME_KEY = "nusite-theme";
const root = document.documentElement;
const savedTheme =
  localStorage.getItem(THEME_KEY) ||
  (window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark");
if (savedTheme === "light") root.setAttribute("data-theme", "light");
document.getElementById("themeToggle").addEventListener("click", () => {
  const isLight = root.getAttribute("data-theme") === "light";
  if (isLight) {
    root.removeAttribute("data-theme");
    localStorage.setItem(THEME_KEY, "dark");
  } else {
    root.setAttribute("data-theme", "light");
    localStorage.setItem(THEME_KEY, "light");
  }
});

// ── Nav scroll state ──
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ── Mobile menu ──
const ham = document.getElementById("hamburger");
const mm = document.getElementById("mobileMenu");
ham?.addEventListener("click", () => {
  const open = mm.classList.toggle("open");
  ham.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
});
mm?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    mm.classList.remove("open");
    document.body.style.overflow = "";
    ham.setAttribute("aria-expanded", "false");
  }),
);

// ── Marquee items ──
const stack = [
  {
    name: "React",
    svg: '<svg viewBox="-11.5 -10.232 23 20.463" fill="currentColor"><circle r="2.05"/><g fill="none" stroke="currentColor" stroke-width="1"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>',
  },
  { name: "Next.js" },
  { name: "Tailwind CSS" },
  { name: "Vercel" },
  { name: "GitHub" },
  { name: "Netlify" },
  { name: "Astro" },
  { name: "Vite" },
];
const mqTrack = document.getElementById("marquee");
const buildItem = (s) => {
  const el = document.createElement("div");
  el.className = "marquee-item";
  el.innerHTML = `${s.svg ?? ""}<span>${s.name}</span>`;
  return el;
};
// duplicate for seamless loop
[...stack, ...stack].forEach((s) => mqTrack.appendChild(buildItem(s)));

// ── Reveal on scroll ──
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ── Pricing toggle ──
const toggle = document.getElementById("priceToggle");
toggle.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-mode]");
  if (!btn) return;
  const mode = btn.dataset.mode;
  toggle
    .querySelectorAll("button")
    .forEach((b) => b.classList.toggle("active", b === btn));
  toggle.classList.toggle("annual", mode === "annual");
  document.querySelectorAll(".amount").forEach((a) => {
    a.textContent = a.dataset[mode];
  });
  const subText =
    mode === "annual"
      ? "Billed annually · 2 months free"
      : "Billed monthly · Cancel anytime";
  document.getElementById("proSub").textContent = subText;
  document.getElementById("premSub").textContent = subText;
});

// ── FAQ accordion ──
document.querySelectorAll(".qitem").forEach((item) => {
  const btn = item.querySelector(".qbtn");
  const ans = item.querySelector(".qans");
  btn.addEventListener("click", () => {
    const open = item.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
    if (open) {
      ans.style.maxHeight = ans.scrollHeight + "px";
    } else {
      ans.style.maxHeight = "0px";
    }
  });
});

// Initialize EmailJS
emailjs.init("Ko4bFs7L6F3fglooi");

// Waitlist form
const form = document.getElementById("waitlistForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const input = form.querySelector("input[type=email]");

  // Validate email
  if (!input.value || !input.value.includes("@")) {
    input.focus();

    input.style.outline = "2px solid #C8FF00";

    setTimeout(() => {
      input.style.outline = "";
    }, 800);

    return;
  }

  try {
    // Send email
    await emailjs.send("service_quynnqd", "template_7z9jbz5", {
      user_email: input.value,
      time: new Date().toLocaleString(),
    });

    // Success UI
    form.style.display = "none";

    document.getElementById("wformFoot").style.display = "none";

    document.getElementById("wsuccess").classList.add("show");
  } catch (error) {
    console.error(error);

    alert("Something went wrong. Please try again.");
  }
});

// ── Copy link ──
document.getElementById("copyLink")?.addEventListener("click", (e) => {
  navigator.clipboard?.writeText("https://nusite.app").catch(() => {});
  e.target.textContent = "Copied ✓";
  setTimeout(() => (e.target.textContent = "Copy link"), 1800);
});

// ── Footer mini form ──
const ff = document.getElementById("footForm");
ff.addEventListener("submit", (e) => {
  e.preventDefault();
  const v = ff.querySelector("input").value;
  if (!v || !v.includes("@")) return;
  ff.querySelector("input").value = "";
  document.getElementById("footFormMsg").textContent =
    "✓ You\u2019re subscribed.";
});

// ── Hero code typewriter ──
const oldEl = document.getElementById("oldCode");
const newEl = document.getElementById("newCode");

const oldLines = [
  '<span class="tag">&lt;table</span> <span class="attr">cellpadding=</span><span class="txt">"4"</span><span class="tag">&gt;</span>',
  '  <span class="tag">&lt;tr&gt;&lt;td</span> <span class="attr">bgcolor=</span><span class="txt">"#eee"</span><span class="tag">&gt;</span>',
  '    <span class="tag">&lt;font</span> <span class="attr">size=</span><span class="txt">"4"</span><span class="tag">&gt;</span>Hello',
  '    <span class="tag">&lt;/font&gt;</span>',
  '  <span class="tag">&lt;/td&gt;&lt;/tr&gt;</span>',
  '<span class="tag">&lt;/table&gt;</span>',
  '<span class="tag">&lt;center&gt;</span>',
  '  <span class="tag">&lt;img</span> <span class="attr">src=</span><span class="txt">"hero.gif"</span><span class="tag">/&gt;</span>',
  '<span class="tag">&lt;/center&gt;</span>',
];
const newLines = [
  '<span class="kw">export default</span> <span class="kw">function</span> <span class="tag">Hero</span>() {',
  '  <span class="kw">return</span> (',
  '    <span class="tag">&lt;section</span> <span class="attr">className</span>=<span class="txt">"hero"</span><span class="tag">&gt;</span>',
  '      <span class="tag">&lt;h1&gt;</span>Hello<span class="tag">&lt;/h1&gt;</span>',
  '      <span class="tag">&lt;Image</span> <span class="attr">src</span>=<span class="txt">{hero}</span> <span class="tag">/&gt;</span>',
  '    <span class="tag">&lt;/section&gt;</span>',
  "  );",
  "}",
];

// type old then new
function typeInto(el, lines, perChar, lineDelay) {
  return new Promise((resolve) => {
    let li = 0;
    function nextLine() {
      if (li >= lines.length) return resolve();
      const line = lines[li];
      const target = document.createElement("div");
      el.appendChild(target);
      // Simpler: append HTML in segments
      let i = 0;
      // Build a plain version where we add the line all at once (perf), faking with quick reveal.
      target.innerHTML = line + '<span class="caret"></span>';
      // remove caret from previous line
      if (li > 0) {
        const prev = el.children[li - 1];
        const c = prev.querySelector(".caret");
        if (c) c.remove();
      }
      li++;
      setTimeout(nextLine, lineDelay);
    }
    nextLine();
  });
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  (async function loop() {
    while (true) {
      oldEl.innerHTML = "";
      newEl.innerHTML = "";
      document.querySelector(".badge-complete").style.animation = "none";
      await typeInto(oldEl, oldLines, 0, 110);
      await new Promise((r) => setTimeout(r, 350));
      await typeInto(newEl, newLines, 0, 110);
      // re-trigger badge
      const b = document.querySelector(".badge-complete");
      b.style.animation = "";
      b.style.opacity = "0";
      b.getBoundingClientRect();
      b.style.animation = "pop .4s cubic-bezier(.2,.7,.2,1) .1s forwards";
      await new Promise((r) => setTimeout(r, 3800));
    }
  })();
} else {
  oldEl.innerHTML = oldLines.map((l) => `<div>${l}</div>`).join("");
  newEl.innerHTML = newLines.map((l) => `<div>${l}</div>`).join("");
}
