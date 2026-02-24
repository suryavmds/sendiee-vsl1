/**
 * Sendiee Analytics — Meta Pixel + GA4 helpers
 * Meta Pixel ID: 1637731963861404
 * GA4 ID: G-K5BDWQ2X3M
 */

/* ── Primitives ── */

export function trackFBEvent(eventName, params = {}) {
    if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", eventName, params);
    }
}

export function trackFBCustomEvent(eventName, params = {}) {
    if (typeof window !== "undefined" && window.fbq) {
        window.fbq("trackCustom", eventName, params);
    }
}

export function trackGAEvent(eventName, params = {}) {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", eventName, params);
    }
}

/* ── Convenience wrappers ── */

/** Fire on every page view (route change) */
export function trackPageView(pageName) {
    trackFBEvent("PageView");
    trackGAEvent("page_view", { page_title: pageName });
}

/** CTA button click — "Book Appointment" etc. */
export function trackButtonClick(buttonName, section) {
    trackFBEvent("ViewContent", {
        content_name: buttonName,
        content_category: section,
    });
    trackGAEvent("cta_click", {
        button_text: buttonName,
        section,
    });
}

/** User lands on /booking (GA only — no FB Lead per user request) */
export function trackBookingStart() {
    trackGAEvent("begin_booking");
}

/** Booking confirmed — fires FB Schedule + GA booking_complete */
export function trackBookingComplete(attendeeName, email) {
    trackFBEvent("Schedule", {
        ...(attendeeName && { content_name: attendeeName }),
        ...(email && { content_category: email }),
    });
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
