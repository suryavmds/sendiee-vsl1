import { useRouter } from "next/router";
import Head from "next/head";
import { trackDemoClick } from "@/lib/analytics";

const STORAGE_KEY = "sendiee_qualify_data";

const DEMOS = [
  {
    title: "Sales WhatsApp Demo",
    desc: "See how Sendiee handles product inquiries & closes sales on WhatsApp.",
    href: "https://wa.me/917094087000?text=Hi",
    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    color: "#25D366",
  },
  {
    title: "Healthcare Demo",
    desc: "Experience AI appointment booking & patient follow-ups.",
    href: "https://wa.me/919047475906?text=Hi",
    icon: "M22 12h-4l-3 9L9 3l-3 9H2",
    color: "#3b82f6",
  },
  {
    title: "Real Estate Demo",
    desc: "Watch how Sendiee qualifies leads & schedules property viewings.",
    href: "https://wa.me/919150518946?text=Hi",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-4 0h4",
    color: "#f59e0b",
  },
  {
    title: "Sales Instagram Demo",
    desc: "See automated DM replies & story engagement in action.",
    href: "https://ig.me/m/7land.shop",
    icon: "M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 12 7.5v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
    color: "#e040fb",
  },
];

export default function ThankYouLight() {
  const router = useRouter();

  const handleBookDirectly = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        const params = new URLSearchParams();
        if (data.fullName) params.set("name", data.fullName);
        if (data.email) params.set("email", data.email);
        if (data.phone) params.set("phone", data.phone);
        if (data.businessName) params.set("businessName", data.businessName);
        if (data.website) params.set("website", data.website);
        if (data.niche) params.set("niche", data.niche);
        if (data.budget) params.set("budget", data.budget);
        if (data.goal) params.set("goal", data.goal);
        if (data.leadsPerMonth) params.set("leadsPerMonth", data.leadsPerMonth);
        const qs = params.toString();
        router.push(qs ? `/v1/booking?${qs}` : "/v1/booking");
      } else {
        router.push("/v1/booking");
      }
    } catch {
      router.push("/v1/booking");
    }
  };

  return (
    <>
      <Head>
        <title>Thank You — Sendiee</title>
        <meta
          name="description"
          content="Thanks for your interest in Sendiee. Our team will reach out to you shortly."
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#f8f9fc" />
      </Head>

      <main className="confirmed-page light-theme">
        <div className="confirmed-content">
          {/* Icon */}
          <div className="confirmed-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#7c3aed" />
              <path
                d="M14 24l7 7 13-13"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="confirmed-h1">Thanks for your interest!</h1>
          <p className="confirmed-sub">
            We've received your details. Our team will review your business
            profile and <strong>reach out within 24–48 hours</strong> to
            discuss how Sendiee can help you grow.
          </p>

          <img
            src="/logo/logo-dark.svg"
            alt="Sendiee"
            className="confirmed-logo"
          />

          {/* Secondary CTA — navigates to /v1/booking embed with prefilled data */}
          <div className="thankyou-direct-book">
            <p>Can't wait? Book a slot directly on our calendar:</p>
            <button
              onClick={handleBookDirectly}
              className="thankyou-cal-link"
            >
              📅 Book a Demo Directly
            </button>
          </div>

          {/* Live demos */}
          <div className="confirmed-demo-section">
            <h2>In the meantime, try our live demos</h2>
            <p>These demos are integrated in WhatsApp — experience Sendiee AI live.</p>

            <div className="demo-grid">
              {DEMOS.map((demo, i) => (
                <a
                  key={i}
                  href={demo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="demo-card"
                  style={{ "--demo-color": demo.color }}
                  onClick={() =>
                    trackDemoClick(
                      demo.title,
                      demo.href.includes("wa.me") ? "whatsapp" : "instagram"
                    )
                  }
                >
                  <div
                    className="demo-card-icon"
                    style={{ background: demo.color }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={demo.icon} />
                    </svg>
                  </div>
                  <div className="demo-card-text">
                    <strong>{demo.title}</strong>
                    <span>{demo.desc}</span>
                  </div>
                  <svg
                    className="demo-card-arrow"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
