import Link from "next/link";
import Image from "next/image";
import NavAuthPopout from "@/components/NavAuthPopout";
import HomeCourseList from "@/components/HomeCourseList";
import CodeAnimation from "@/components/CodeAnimation";
import HomeScrollMotion from "@/components/HomeScrollMotion";

const T = {
  p1:     "#293c2d",
  p2:     "#1f2e22",
  p3:     "#141e16",
  card:   "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.10)",
  t1:     "#ffffff",
  t2:     "rgba(255,255,255,0.65)",
  t3:     "rgba(255,255,255,0.40)",
  orange: "#e1fc9d",
  brass:  "#e1fc9d",
  btn:    "#e1fc9d",
  btnTxt: "#0f1f0f",
};

const C = ({ children, className = "" }) => (
  <div
    className={className}
    style={{
      maxWidth: "1200px",
      margin: "0 auto",
      paddingLeft:  "max(24px, env(safe-area-inset-left, 0px))",
      paddingRight: "max(24px, env(safe-area-inset-right, 0px))",
    }}
  >
    {children}
  </div>
);

const Eyebrow = ({ children }) => (
  <span style={{ fontFamily: "var(--font-inter)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: T.brass }}>
    {children}
  </span>
);

const H2 = ({ children, size = "lg" }) => (
  <h2 style={{ fontFamily: "var(--font-polysans)", fontWeight: 400, letterSpacing: size === "lg" ? "-0.8px" : "-0.64px", lineHeight: 1.15, fontSize: size === "lg" ? "clamp(28px,4vw,40px)" : "clamp(24px,3vw,32px)", color: T.t1, textWrap: "balance", margin: 0 }}>
    {children}
  </h2>
);

const Body = ({ children, muted = false, style = {} }) => (
  <p style={{ fontFamily: "var(--font-inter)", fontSize: "16px", lineHeight: 1.65, color: muted ? T.t3 : T.t2, margin: 0, ...style }}>
    {children}
  </p>
);

const Divider = () => <div style={{ borderTop: `1px solid ${T.border}` }} />;

function Header() {
  return (
    <header style={{ position: "fixed", top: "16px", left: 0, right: 0, zIndex: 100, pointerEvents: "none" }}>
      <C className="flex" style={{ paddingTop: 0, paddingBottom: 0 }}>
      <div className="glass-nav" style={{ pointerEvents: "auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 10px 10px 20px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
          <Image src="/Logo/TrainityFullWhite.svg" alt="Trainity" width={130} height={32} priority />
        </Link>

        <nav className="hidden md:flex items-center gap-6" style={{ padding: "0 8px" }}>
          {[["About", "#why"], ["Courses", "#courses"], ["Reviews", "#reviews"], ["FAQ", "#faq"]].map(([label, href]) => (
            <a key={label} href={href} className="nav-link" style={{ fontFamily: "var(--font-polysans)", fontSize: "15px", fontWeight: 400, letterSpacing: "-0.02em", color: T.t1, textDecoration: "none" }}>
              {label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <NavAuthPopout btn="signin" color={T.t2} />
          <NavAuthPopout btn="register" />
        </div>
      </div>
      </C>
    </header>
  );
}



function Hero() {
  return (
    <section id="hero" style={{
      position: "relative",
      minHeight: "100vh",
      background: "#080b08",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      columnGap: "48px",
      paddingLeft:  "max(40px, env(safe-area-inset-left, 0px))",
      paddingRight: "max(40px, env(safe-area-inset-right, 0px))",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 18% 92%, rgba(41,60,45,0.90) 0%, rgba(20,38,22,0.55) 35%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "28px", paddingTop: "120px", paddingBottom: "80px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-polysans)", fontWeight: 400, fontSize: "clamp(48px,5.5vw,80px)", lineHeight: 0.92, letterSpacing: "-2px", color: T.t1, textWrap: "balance", margin: 0 }}>
            Learn to Code.<br />
            <span style={{ color: "rgba(255,255,255,0.28)" }}>Build Real Skills.</span>
          </h1>
        </div>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "16px", lineHeight: 1.65, color: "rgba(255,255,255,0.52)", maxWidth: "380px", margin: 0 }}>
          Access free, structured courses taught by industry experts — from your first line of code to full-stack apps.
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link href="/auth/register" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: T.btn, color: T.btnTxt, borderRadius: "8px", padding: "12px 24px", fontFamily: "var(--font-polysans)", fontSize: "15px", fontWeight: 400, letterSpacing: "-0.02em", textDecoration: "none" }}>
            Start Learning Free
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <Link href="#courses" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "transparent", color: "rgba(255,255,255,0.70)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "12px 24px", fontFamily: "var(--font-polysans)", fontSize: "15px", fontWeight: 400, letterSpacing: "-0.02em", textDecoration: "none" }}>
            Browse Courses
          </Link>
        </div>
        <div style={{ display: "flex", gap: "32px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {[["100+","Video Lessons"],["1K+","Active Learners"],["4.8★","Avg. Rating"]].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "var(--font-polysans)", fontSize: "22px", fontWeight: 400, letterSpacing: "-0.03em", color: T.t1 }}>{num}</div>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "3px", letterSpacing: "0.04em" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: "560px" }}>
          <CodeAnimation />
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "200px", background: "linear-gradient(to bottom, transparent 0%, #1f2e22 100%)", pointerEvents: "none", zIndex: 2 }} />
    </section>
  );
}

function WhyAndHow() {
  const benefits = [
    { title: "Structured Curriculum", desc: "Built systematically from beginner to advanced — a clear path, no guesswork." },
    { title: "Expert Instructors", desc: "Industry professionals who teach what actually matters in the field." },
    { title: "Learn on Your Terms", desc: "Your pace, your schedule. All materials accessible anytime, forever." },
  ];
  const steps = [
    { num: "01", title: "Create Your Free Account", desc: "Sign up in under a minute. No credit card, no commitment — just access to everything immediately." },
    { num: "02", title: "Pick a Learning Path", desc: "Choose from Front End, Back End, or Frameworks. Start from zero or pick up where your skills are." },
    { num: "03", title: "Build and Ship Projects", desc: "Apply what you learn through real projects. Finish with a portfolio that shows — not just tells — what you can do." },
  ];

  return (
    <section id="why" style={{ background: T.p2, paddingTop: "100px", paddingBottom: "100px" }}>
      <C>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px 80px", marginBottom: "64px", alignItems: "end" }}>
          <div>
            <Eyebrow>Why Trainity</Eyebrow>
            <h2 style={{ fontFamily: "var(--font-polysans)", fontWeight: 400, fontSize: "clamp(28px,4vw,40px)", letterSpacing: "-0.8px", lineHeight: 1.1, color: T.t1, margin: "12px 0 0", textWrap: "balance" }}>
              Everything you need to start building.
            </h2>
          </div>
          <div>
            <Body>No fluff, no filler — just the skills employers look for, with a process simple enough to start today.</Body>
          </div>
        </div>

        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0", marginBottom: "0" }}>
          <div style={{ position: "absolute", top: "28px", left: "calc(16.66% + 16px)", right: "calc(16.66% + 16px)", height: "1px", background: `linear-gradient(to right, ${T.border}, rgba(255,255,255,0.20), ${T.border})`, zIndex: 0 }} />

          {benefits.map((b, i) => (
            <div key={b.title} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 24px", textAlign: "center" }}>
              <div style={{ position: "relative", zIndex: 1, width: "56px", height: "56px", borderRadius: "50%", border: `1px solid ${T.border}`, background: T.p2, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-polysans)", fontSize: "13px", letterSpacing: "0.04em", color: T.orange }}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div style={{ width: "1px", height: "24px", background: T.border, marginBottom: "20px", flexShrink: 0 }} />
              <div style={{ border: `1px solid ${T.border}`, borderRadius: "8px", padding: "28px 24px", background: "rgba(255,255,255,0.02)", width: "100%" }}>
                <h3 style={{ fontFamily: "var(--font-polysans)", fontSize: "16px", fontWeight: 400, letterSpacing: "-0.02em", color: T.t1, margin: "0 0 10px" }}>{b.title}</h3>
                <Body muted style={{ fontSize: "14px" }}>{b.desc}</Body>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "56px", marginTop: "56px" }}>
          <Eyebrow>How it works</Eyebrow>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "40px", marginTop: "32px" }}>
            {steps.map((s) => (
              <div key={s.num} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <span style={{ fontFamily: "var(--font-polysans)", fontSize: "36px", fontWeight: 400, letterSpacing: "-0.04em", color: "rgba(255,255,255,0.10)", lineHeight: 1 }}>{s.num}</span>
                <div>
                  <h3 style={{ fontFamily: "var(--font-polysans)", fontSize: "17px", fontWeight: 400, letterSpacing: "-0.02em", color: T.t1, margin: "0 0 8px", textWrap: "balance" }}>{s.title}</h3>
                  <Body muted style={{ fontSize: "14px" }}>{s.desc}</Body>
                </div>
              </div>
            ))}
          </div>
        </div>

      </C>
    </section>
  );
}

function Partnership() {
  const bullets = [
    "Structured from the very basics to advanced projects",
    "Taught by practitioners who work in the industry",
    "Content updated to reflect current standards",
  ];
  return (
    <section style={{ background: T.p2, paddingTop: "100px", paddingBottom: "100px" }}>
      <C>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "60px", alignItems: "center" }}>

          <div style={{ position: "relative", aspectRatio: "1/1", borderRadius: "6px 0 0 6px", overflow: "hidden" }}>
            <Image src="/homepage/sandhika.png" alt="Sandhika Galih — Web Programming UNPAS" fill sizes="(max-width:768px) 100vw,50vw" style={{ objectFit: "cover" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Eyebrow>Special Collaboration</Eyebrow>
            <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.15, color: T.t1, margin: 0, textWrap: "balance" }}>
              Curriculum backed by Web Programming UNPAS.
            </h2>
            <Body>We partnered with Sandhika Galih from Web Programming UNPAS to build a curriculum that is relevant, in-depth, and aligned with what the industry actually expects from developers today.</Body>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {bullets.map((b) => (
                <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span style={{ marginTop: "4px", flexShrink: 0, width: "16px", height: "16px", borderRadius: "50%", background: T.orange, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l2 2 3-3.5" stroke="#0f1f0f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: T.t2, lineHeight: 1.5 }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </C>
    </section>
  );
}

function Categories() {
  const cats = [
    { title: "Front End Development", desc: "HTML, CSS, JavaScript — build everything the user sees and interacts with.", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5l4 4-4 4M9 15h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { title: "Back End Development", desc: "Servers, databases, APIs — build the logic that powers applications.", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="12" width="14" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="6" cy="14" r="1" fill="currentColor"/></svg> },
    { title: "Frameworks & Libraries", desc: "React, Next.js, and more — accelerate development with the right tools.", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3l7 4v6l-7 4-7-4V7l7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
  ];
  return (
    <section id="courses" style={{ background: T.p1, paddingTop: "100px", paddingBottom: "100px" }}>
      <C>
        <div style={{ marginBottom: "56px" }}>
          <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "clamp(24px,3vw,32px)", fontWeight: 400, letterSpacing: "-0.64px", lineHeight: 1.19, color: T.t1, margin: 0 }}>
            Course Categories We Offer
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "24px" }}>
          {cats.map((c) => (
            <div key={c.title} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: T.card, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: T.t1 }}>
                {c.icon}
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-polysans)", fontSize: "17px", fontWeight: 400, letterSpacing: "-0.02em", color: T.t1, margin: "0 0 8px" }}>{c.title}</h3>
                <Body muted>{c.desc}</Body>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "80px", marginBottom: "40px" }}>
          <Eyebrow>Courses</Eyebrow>
          <div style={{ marginTop: "10px" }}><H2 size="sm">Featured Courses</H2></div>
        </div>
        <HomeCourseList />
      </C>
    </section>
  );
}

function Metrics() {
  const metrics = [
    { value: "100+", label: "Quality video lessons covering modern web technologies" },
    { value: "1K+",  label: "Active learners enrolled across all tracks" },
    { value: "4.8★", label: "Average course rating from verified students" },
    { value: "3",    label: "Structured learning tracks: Front End, Back End, Frameworks" },
  ];
  const reviews = [
    { name: "Andi R.", rating: 5, quote: "The material is very well-structured and easy to understand. From zero to building my own projects." },
    { name: "Siti N.", rating: 5, quote: "The instructor explains things clearly and gets straight to practice — incredibly helpful for beginners." },
    { name: "Budi S.", rating: 4, quote: "A solid platform. The curriculum feels like a bootcamp but free and flexible." },
  ];
  return (
    <section id="reviews" style={{ background: T.p3, paddingTop: "100px", paddingBottom: "100px" }}>
      <C>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "60px", alignItems: "start", marginBottom: "80px" }}>
          <div>
            <Eyebrow>By the Numbers</Eyebrow>
            <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.15, color: T.t1, margin: "12px 0 16px", textWrap: "balance" }}>
              The results speak for themselves.
            </h2>
            <Body>Trainity is built around outcomes — real skills, real projects, and real numbers that reflect the quality of every course we offer.</Body>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {metrics.map((m, i) => (
              <div key={m.value} style={{ display: "flex", alignItems: "center", gap: "24px", padding: "20px 0", borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
                <span style={{ fontFamily: "var(--font-polysans)", fontSize: "30px", fontWeight: 400, letterSpacing: "-0.02em", color: T.orange, minWidth: "70px", fontVariantNumeric: "tabular-nums" }}>{m.value}</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "14px", lineHeight: 1.5, color: T.t2 }}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "64px" }}>
          <div style={{ marginBottom: "40px" }}>
            <Eyebrow>Testimonials</Eyebrow>
            <div style={{ marginTop: "10px" }}><H2 size="sm">What our learners say.</H2></div>
            <Body style={{ marginTop: "10px" }}>Real experiences from people who have been through the courses.</Body>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "1px", background: T.border }}>
            {reviews.map((r) => (
              <div key={r.name} style={{ background: T.p3, padding: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: T.card, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "var(--font-polysans)", fontSize: "14px", color: T.t1 }}>{r.name[0]}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", fontWeight: 500, color: T.t1, margin: 0 }}>{r.name}</p>
                    <span style={{ fontSize: "12px", color: T.orange }}>{"★".repeat(r.rating)}</span>
                  </div>
                </div>
                <Body muted>&ldquo;{r.quote}&rdquo;</Body>
              </div>
            ))}
          </div>
        </div>

        <div id="faq" style={{ borderTop: `1px solid ${T.border}`, paddingTop: "64px", marginTop: "64px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))", gap: "60px", alignItems: "start" }}>
            <div>
              <Eyebrow>Support</Eyebrow>
              <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "clamp(24px,3vw,32px)", fontWeight: 400, letterSpacing: "-0.64px", lineHeight: 1.19, color: T.t1, margin: "12px 0 0", textWrap: "balance" }}>
                Frequently asked questions
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { q: "Are all courses on Trainity free?", a: "Yes, access to all courses on Trainity is completely free. Just create an account and start learning — no cost, no commitment." },
                { q: "What topics are available?", a: "Trainity offers three learning tracks: Front End Development (HTML, CSS, JavaScript), Back End Development, and Frameworks & Libraries (React, Next.js, and more)." },
                { q: "Is there a certificate after completing a course?", a: "Yes, completing a course earns you a certificate you can share on LinkedIn or add to your portfolio." },
                { q: "Who are the instructors at Trainity?", a: "Trainity's curriculum is backed by Sandhika Galih from Web Programming UNPAS, developed by industry practitioners with real-world experience." },
                { q: "Can I learn with no prior coding experience?", a: "Absolutely. Every track is designed from the ground up, suitable for complete beginners and those looking to level up their skills." },
                { q: "How long do I have access to course materials?", a: "Lifetime access. You can revisit any material at any time, with no expiry." },
              ].map((item) => (
                <details key={item.q} style={{ borderTop: `1px solid ${T.border}` }}>
                  <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", cursor: "pointer", listStyle: "none", borderBottom: `1px solid ${T.border}`, fontFamily: "var(--font-inter)", fontSize: "15px", fontWeight: 500, color: T.t1, gap: "16px" }}>
                    {item.q}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: T.t3 }} aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </summary>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", lineHeight: 1.7, color: T.t2, padding: "16px 0 20px", margin: 0, borderBottom: `1px solid ${T.border}` }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </C>
    </section>
  );
}


function Footer() {
  const nav = {
    Learn:   [["About","/#why"],["Courses","/#courses"],["Reviews","/#reviews"],["FAQ","/#faq"]],
    Account: [["Register","/auth/register"],["Sign In","/auth/login"],["Reset Password","/auth/forgot-password"]],
  };
  return (
    <footer style={{ background: "#080b08", paddingTop: "72px", paddingBottom: "40px", borderTop: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes footerWave {
          0%   { transform: translateX(-40%) scaleY(1); }
          50%  { transform: translateX(20%) scaleY(1.35); }
          100% { transform: translateX(-40%) scaleY(1); }
        }
      `}</style>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-60%", left: "-60%", width: "220%", height: "260%", background: "radial-gradient(ellipse at 30% 50%, rgba(41,60,45,0.62) 0%, rgba(20,38,22,0.34) 35%, transparent 60%)", animation: "footerWave 9s ease-in-out infinite", transformOrigin: "center center" }} />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
      <C>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", paddingBottom: "48px", borderBottom: `1px solid ${T.border}`, marginBottom: "48px" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 400, letterSpacing: "-0.02em", color: T.t1, margin: "0 0 8px" }}>
              See what learning could look like.
            </h2>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t3, margin: 0 }}>
              Free coding education for everyone.
            </p>
          </div>
          <Link href="/auth/register" style={{ fontFamily: "var(--font-polysans)", fontSize: "14px", fontWeight: 400, letterSpacing: "-0.02em", background: T.btn, color: T.btnTxt, borderRadius: "8px", padding: "10px 20px", textDecoration: "none", flexShrink: 0 }}>
            Get Started Free
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "48px" }}>
          <div>
            <Image src="/Logo/TrainityFullWhite.svg" alt="Trainity" width={120} height={30} />
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", lineHeight: 1.65, color: T.t3, marginTop: "16px", maxWidth: "260px" }}>
              Thank you for visiting. We hope your experience at Trainity sparks something new.
            </p>
            <a href="https://github.com/Tuknwm/tuknwm-TrainityProject" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "16px", fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t2, textDecoration: "none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              GitHub
            </a>
          </div>

          {Object.entries(nav).map(([heading, links]) => (
            <div key={heading}>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: T.t3, margin: "0 0 16px" }}>{heading}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {links.map(([label, href]) => (
                  <Link key={label} href={href} style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t2, textDecoration: "none" }}>{label}</Link>
                ))}
              </div>
            </div>
          ))}
          <div>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: T.t3, margin: "0 0 16px" }}>Payment</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {["/payment/ShopeePay.svg","/payment/QRIS.svg","/payment/GoPay.svg","/payment/OVO.svg","/payment/DANA.svg"].map((src) => (
                <div key={src} style={{ width: "72px", height: "40px", background: "#ffffff", borderRadius: "6px", overflow: "hidden", padding: "5px", flexShrink: 0 }}>
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "24px" }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3, margin: 0 }}>
            © {new Date().getFullYear()} <span style={{ color: T.t2 }}>Trainity</span>. All rights reserved.
          </p>
        </div>
      </C>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <>
      <HomeScrollMotion>
      <main>
      <Header />
      <Hero />
      <WhyAndHow />
      <Partnership />
      <Categories />
      <Metrics />
      <Footer />
      </main>
      </HomeScrollMotion>
    </>
  );
}
