/**
 * Sendiee Analytics — GA4 helpers
 * GA4 ID: G-K5BDWQ2X3M
 * Note: Meta Pixel events are managed via Google Tag Manager.
 */

/* ── Primitives ── */

export function trackGAEvent(eventName, params = {}) {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", eventName, params);
    }
}

/* ── Convenience wrappers ── */

/** Fire on every page view (route change) */
export function trackPageView(pageName) {
    trackGAEvent("page_view", { page_title: pageName });
}

/** CTA button click — "Book Appointment" etc. */
export function trackButtonClick(buttonName, section) {
    trackGAEvent("cta_click", {
        button_text: buttonName,
        section,
    });
}

/** User lands on /booking (GA only — no FB Lead per user request) */
export function trackBookingStart() {
    trackGAEvent("begin_booking");
}

/** Booking confirmed — fires GA booking_complete */
export function trackBookingComplete(attendeeName, email) {
    trackGAEvent("booking_complete", {
        attendee_name: attendeeName || "",
        email: email || "",
    });
}

/** Demo link click on the confirmation page */
export function trackDemoClick(demoTitle, platform) {
    trackGAEvent("demo_click", {
        demo_title: demoTitle,
        platform,
    });
}

/** Section scrolled into viewport */
export function trackSectionView(sectionName) {
    trackGAEvent("section_view", { section_name: sectionName });
}
