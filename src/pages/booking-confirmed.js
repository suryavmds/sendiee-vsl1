import { useEffect } from "react";
import Head from "next/head";
import { trackBookingComplete, trackDemoClick } from "@/lib/analytics";

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

function formatDateTime(isoString) {
  if (!isoString) return null;
  try {
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return isoString;
  }
}

export default function BookingConfirmed({ email, attendeeName, uid, startTime, endTime }) {
  const displayName = attendeeName ? attendeeName.split(" ")[0] : null;
  const formattedStart = formatDateTime(startTime);
  const rescheduleLink = uid ? `https://cal.sendiee.com/reschedule/${uid}` : null;
  const cancelLink = uid ? `https://cal.sendiee.com/cancel/${uid}` : null;

  useEffect(() => {
    trackBookingComplete(attendeeName, email);
  }, [attendeeName, email]);

  return (
    <>
      <Head>
        <title>Demo Scheduled — Sendiee</title>
        <meta
          name="description"
          content="Your Sendiee demo has been scheduled. Try our live demos in the meantime."
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#07070d" />
        <meta property="og:image" content="/og_image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Sendiee" />
      </Head>

      <main className="confirmed-page">
        <div className="confirmed-content">
          {/* Success Icon */}
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

          <h1 className="confirmed-h1">
            {displayName
              ? `${displayName}, Your Demo is Scheduled!`
              : "Demo Scheduled!"}
          </h1>

          <p className="confirmed-sub">
            {email ? (
              <>
                A meeting invite has been sent to <strong>{email}</strong>.
                <br />
                Please join at the scheduled time.
              </>
            ) : (
              <>
                You will receive a meeting invite in your email.
                <br />
                Please join at the scheduled time.
              </>
            )}
          </p>

          {/* Meeting details card */}
          {formattedStart && (
            <div className="meeting-details-card">
              <div className="meeting-detail-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{formattedStart}</span>
              </div>

              {(rescheduleLink || cancelLink) && (
                <div className="meeting-actions">
                  {rescheduleLink && (
                    <a
                      href={rescheduleLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="meeting-action-btn meeting-reschedule"
                    >
                      Reschedule
                    </a>
                  )}
                  {cancelLink && (
                    <a
                      href={cancelLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="meeting-action-btn meeting-cancel"
                    >
                      Cancel
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          <img src="/logo/logo.svg" alt="Sendiee" className="confirmed-logo" />

          {/* Demo CTA */}
          <div className="confirmed-demo-section">
            <h2>
              {displayName
                ? `${displayName}, try our realtime demos`
                : "In the meantime, try our realtime demos"}
            </h2>
            <p>
              These demos are integrated in WhatsApp — experience Sendiee AI
              live.
            </p>

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

export async function getServerSideProps(context) {
  // Cal.com sometimes sends the same param twice (prefill + booking form),
  // which Next.js parses as an array. Always take the first value.
  const first = (val) => (Array.isArray(val) ? val[0] : val) ?? null;

  return {
    props: {
      email: first(context.query.email),
      attendeeName: first(context.query.attendeeName),
      uid: first(context.query.uid),
      startTime: first(context.query.startTime),
      endTime: first(context.query.endTime),
    },
  };
}
