import { useEffect, useRef, useCallback } from "react";
import PhonePreview from "@/components/PhonePreview";
import Head from "next/head";
import { trackButtonClick, trackSectionView } from "@/lib/analytics";

const CLIENT_LOGOS = Array.from({ length: 8 }, (_, i) => `/clients/v1/${i + 1}.png`);

const PAIN_POINTS = [
  {
    icon: "❌",
    title: "Replies are too slow",
    desc: "Customers expect instant answers. If you make them wait, they buy from competitors.",
  },
  {
    icon: "❌",
    title: "Missed follow-ups",
    desc: "Your team forgets to chase down leads who ghosted.",
  },
  {
    icon: "❌",
    title: "Language barriers",
    desc: "You lose sales because you can't reply in your customer's regional language or handle voice notes.",
  },
  {
    icon: "❌",
    title: "High overhead",
    desc: "You're paying ₹30k–₹40k/month for staff just to reply to basic questions.",
  },
];

const FEATURES = [
  {
    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    title: "Instant, Multi-Language Replies",
    desc: "Sendiee answers instantly in the customer's preferred language — even voice notes, just like a real human.",
  },
  {
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    title: "Smart Lead Categorization",
    desc: "AI detects intent and tags leads as Interested, Added to Cart, Converted, or Still Deciding.",
  },
  {
    icon: "M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3",
    title: "Relentless Auto Follow-Ups",
    desc: "If a customer goes quiet, Sendiee gently nudges them. No lead gets left behind.",
  },
  {
    icon: "M18 20V10M12 20V4M6 20v-6",
    title: "Meta Pixel Integration",
    desc: "Feeds conversion data back to your Meta Pixel. Better optimized ads and lower ad spend.",
  },
];

const INDUSTRIES = [
  { icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", label: "E-Commerce" },
  { icon: "M22 12h-4l-3 9L9 3l-3 9H2", label: "Healthcare" },
  { icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-4 0h4", label: "Real Estate" },
  { icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75", label: "Services" },
  { icon: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z", label: "Education" },
  { icon: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z", label: "Marketing" },
];

export default function Home() {
  const revealRefs = useRef([]);

  // Track which sections have already been reported
  const trackedSections = useRef(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            // GA section_view (fire once per section)
            const sectionName = entry.target.dataset.section;
            if (sectionName && !trackedSections.current.has(sectionName)) {
              trackedSections.current.add(sectionName);
              trackSectionView(sectionName);
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  // Duplicate logos for infinite scroll
  const logoSet = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <>
      <Head>
        <title>Sendiee — AI-Powered WhatsApp &amp; Instagram Sales Automation</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#07070d" />
        {/* OG Image */}
        <meta property="og:image" content="/og_image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Sendiee" />
      </Head>

      <main>
        {/* ====== HERO ====== */}
        <section className="hero">
          <div className="hero-content">
            {/* Logo */}
            <img
              src="/logo/logo.svg"
              alt="Sendiee"
              className="hero-logo"
            />

            {/* Small Title */}
            <h3 className="hero-h3">
              AI-POWERED SALES AUTOMATION
            </h3>

            {/* Big Title */}
            <h1 className="hero-h1">
              STOP LOSING YOUR
              <br />
              <span className="highlight">WHATSAPP & INSTAGRAM</span>
              <br />
              LEADS
            </h1>

            {/* Sub-copy */}
            <p className="hero-p">
              Here's How We Helped a Brand Increase <strong>WhatsApp Sales</strong> by <strong>40%</strong> in Just <strong>30 Days</strong>—<strong>Without Hiring</strong> More Sales Reps.
            </p>

            {/* CTA Button */}
            <a
              href="/booking"
              className="hero-cta-btn"
              onClick={() => trackButtonClick("Book Demo", "hero")}
            >
              Book Demo &gt;
            </a>

            {/* Social Proof Row */}
            <div className="hero-social-proof">
              {/* Left Arrow */}
              {/* <svg className="hero-arrow hero-arrow-left" width="40" height="50" viewBox="0 0 40 50" fill="none">
                <path d="M30 5C20 5 10 15 10 25C10 35 15 40 20 45" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M15 42L20 47L23 40" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg> */}

              <div className="hero-proof-center">
                {/* Client Avatars */}
                <div className="hero-avatars">
                  {['c1', 'c2', 'c3', 'c4'].map((i) => (
                    <img
                      key={i}
                      src={`/clients/${i}.png`}
                      alt={`Client ${i}`}
                      className="hero-avatar"
                    />
                  ))}
                </div>

                {/* Rating */}
                <div className="hero-rating">
                  <span className="hero-stars">★★★★★</span>
                  <span className="hero-rating-text">4.95 Rating</span>
                </div>
              </div>

              {/* Right Arrow */}
              {/* <svg className="hero-arrow hero-arrow-right" width="40" height="50" viewBox="0 0 40 50" fill="none">
                <path d="M10 5C20 5 30 15 30 25C30 35 25 40 20 45" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M25 42L20 47L17 40" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg> */}
            </div>

            {/* Video Embed */}
            <div className="hero-video-frame">
              <div className="hero-video-wrap">
                {/* <iframe
                  src="https://www.youtube.com/embed/6iYVN2KJ_wI?rel=0"
                  title="Sendiee Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                /> */}
                <iframe src="https://player.vimeo.com/video/1167476714?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="400" height="300" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerPolicy="strict-origin-when-cross-origin" title="Sendiee Demo"></iframe>
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="hero-features">
              {["24/7 Support", "Multilingual Reply", "AI Followup", "AI Lead Segmentation"].map((f) => (
                <div key={f} className="hero-feature-item">
                  <svg className="hero-check" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="9" fill="#7c3aed" />
                    <path d="M5.5 9.5L7.5 11.5L12.5 6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== METRICS ====== */}
        <section className="metrics reveal" ref={addRevealRef} data-section="metrics">
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-value">40%</div>
              <div className="metric-label">Avg. Sales Increase</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">95%</div>
              <div className="metric-label">Faster AI Response Time</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">2.5X</div>
              <div className="metric-label">ROI on Ad Spend</div>
            </div>
          </div>
        </section>

        {/* ====== CLIENT LOGOS ====== */}
        <section className="marquee-section">
          <div className="marquee-track">
            {[...logoSet, ...logoSet].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Client ${(i % 12) + 1}`}
                className="marquee-logo"
              />
            ))}
          </div>
        </section>

        {/* ====== PAIN POINTS ====== */}
        <section className="pain-section reveal" ref={addRevealRef} data-section="pain_points">
          <p className="section-label">The Real Problem</p>
          <h2 className="section-title">
            Getting Enquiries is Easy.
            <br />
            Closing Them is the Hard Part.
          </h2>
          <p className="section-subtitle">
            Does this sound familiar? You're spending money on ads, your phone
            is buzzing with WhatsApp and Instagram DMs, but at the end of the
            month, your sales numbers don't match your lead volume.
          </p>

          <div className="pain-list">
            {PAIN_POINTS.map((item, i) => (
              <div key={i} className="pain-item">
                <span className="pain-icon">{item.icon}</span>
                <div className="pain-text">
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <a
              href="/booking"
              className="section-cta"
              onClick={() => trackButtonClick("Book Demo", "pain_points")}
            >
              Book Demo &gt;
            </a>
          </div>
        </section>

        {/* ====== META PARTNER BADGE ====== */}
        <div className="meta-partner-badge">
          <img src="/logo/meta_partner.png" alt="Meta Business Partner" />
        </div>

        {/* ====== SOLUTION / MEET SENDIEE ====== */}
        <section className="solution-section reveal" ref={addRevealRef} data-section="solution">
          <div className="solution-content">
            <p className="section-label">The Solution</p>
            <h2 className="section-title">
              Meet Sendiee AI: Your 24/7 Automated Sales Assistant
            </h2>
            <p className="solution-intro">
              We don't replace your people; we fix your system. Sendiee is an
              Official Meta Tech Provider that takes over your chats so you can
              focus on scaling.
            </p>

            <div className="features-grid">
              {FEATURES.map((f, i) => (
                <div key={i} className="feature-card">
                  <div className="feature-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={f.icon} />
                    </svg>
                  </div>
                  <div className="feature-card-text">
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <a
                href="/booking"
                className="section-cta"
                onClick={() => trackButtonClick("Book Demo", "solution")}
              >
                Book Demo &gt;
              </a>
            </div>
          </div>
        </section>

        {/* ====== PHONE PREVIEW ====== */}
        <PhonePreview />

        {/* ====== INDUSTRY CARDS ====== */}
        <section className="industry-section reveal" ref={addRevealRef} data-section="industries">
          <div className="solution-content" style={{ maxWidth: "100%" }}>
            <p className="section-label">Who Is This For?</p>
            <h2 className="section-title">
              Built for Every Industry
            </h2>
          </div>
          <div className="industry-grid">
            {INDUSTRIES.map((ind, i) => (
              <div key={i} className="industry-card">
                <div className="industry-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ind.icon} />
                  </svg>
                </div>
                <span>{ind.label}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <a
              href="/booking"
              className="section-cta"
              onClick={() => trackButtonClick("Book Demo", "industries")}
            >
              Book Demo &gt;
            </a>
          </div>
        </section>

        {/* ====== META PARTNER BADGE ====== */}
        {/* <div className="meta-partner-section">
          <img src="/logo/meta_partner.png" alt="Meta" />
          <span>Meta Business Partner</span>
        </div> */}
        <div className="meta-partner-section">
          <img src="/mbp.png" alt="Meta" />
        </div>

        {/* ====== FINAL CTA ====== */}
        {/* <section className="final-cta reveal" id="book" ref={addRevealRef}>
          <div className="final-cta-content">
            <p className="section-label">Take Action Now</p>
            <h2 className="section-title">
              Ready to Let AI Close Conversations For&nbsp;You?
            </h2>
            <p className="section-subtitle">
              Stop paying your team to act like chatbots, and stop letting hot
              leads go cold. Book a 1-on-1 demo with our team today. We'll look
              at your current setup and show you exactly how Sendiee can be
              integrated into your business to automate follow-ups and scale
              your revenue.
            </p>

            <div className="calendar-embed">
              <span className="calendar-embed-icon">📅</span>
              <span>Calendar / Booking Widget Embed</span>
            </div>
          </div>
        </section> */}

        {/* ====== FOOTER ====== */}
        <footer className="footer">
          <p>Copyright © 2026 Sendiee. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
