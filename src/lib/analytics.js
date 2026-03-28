/**
 * Sendiee Analytics — GA4 + Microsoft Clarity helpers
 * GA4 ID: G-K5BDWQ2X3M
 * Clarity ID: vm3eacpx32
 * Note: Meta Pixel events are managed via Google Tag Manager.
 */

/* ─────────────────────────────────────────────
   GA4 PRIMITIVES
───────────────────────────────────────────── */

export function trackGAEvent(eventName, params = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

/* ── GA4 Convenience wrappers ── */

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

/* ─────────────────────────────────────────────
   MICROSOFT CLARITY PRIMITIVES
───────────────────────────────────────────── */

/**
 * Set a custom tag on the session — appears as a filterable dimension
 * in the Clarity dashboard (Recordings → Filter by tag).
 *
 * @param {string} key   e.g. "qualify_step", "drop_off_step"
 * @param {string} value e.g. "step_1", "phone_field"
 */
export function claritySet(key, value) {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    window.clarity("set", key, String(value));
  }
}

/**
 * Fire a named event that appears as a marker on the Clarity recording
 * timeline — useful for seeing exactly when something happened.
 *
 * @param {string} name   e.g. "qualify_error", "phone_country_changed"
 */
export function clarityEvent(name) {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    window.clarity("event", name);
  }
}

/**
 * Identify a user in Clarity so their session can be looked up by email.
 * Call this once you know who the user is (e.g. after step 1 submit).
 *
 * @param {string} userId        Unique ID — use email as a stable key
 * @param {string} [sessionId]   Optional custom session ID
 * @param {string} [pageId]      Optional custom page ID
 * @param {string} [friendlyName] Display name shown in Clarity UI
 */
export function clarityIdentify(userId, sessionId, pageId, friendlyName) {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    window.clarity("identify", userId, sessionId, pageId, friendlyName || userId);
  }
}

/* ─────────────────────────────────────────────
   QUALIFY FORM — CLARITY TRACKING WRAPPERS
   Use these in qualify.js / v1/qualify.js
───────────────────────────────────────────── */

/** Called when the qualify page mounts — tags the session immediately */
export function clarityTrackQualifyStart(version = "dark") {
  claritySet("page_variant", version);           // "dark" or "light"
  claritySet("qualify_step", "step_1");
  claritySet("funnel_stage", "qualify_form");
  clarityEvent("qualify_form_started");
  trackGAEvent("qualify_form_started", { variant: version });
}

/** Called when user successfully moves from step 1 → step 2 */
export function clarityTrackStep1Complete(phoneCountry) {
  claritySet("qualify_step", "step_2");
  claritySet("phone_country", phoneCountry);     // e.g. "IN", "US" — filterable!
  clarityEvent("qualify_step1_complete");
  trackGAEvent("qualify_step1_complete", { phone_country: phoneCountry });
}

/** Called when a validation error fires on step 1 */
export function clarityTrackStep1Error(field, errorMsg) {
  claritySet("last_error_field", field);         // e.g. "phone", "email"
  claritySet("last_error_msg", errorMsg);
  clarityEvent("qualify_step1_error");
  trackGAEvent("qualify_form_error", { step: 1, field, error: errorMsg });
}

/** Called when a validation error fires on step 2 */
export function clarityTrackStep2Error(field) {
  claritySet("last_error_field", field);
  clarityEvent("qualify_step2_error");
  trackGAEvent("qualify_form_error", { step: 2, field });
}

/** Called when user clicks Back (step 2 → step 1) — signals potential struggle */
export function clarityTrackStepBack() {
  clarityEvent("qualify_step_back");
  trackGAEvent("qualify_step_back");
}

/** Called when user changes the phone country code — filterable insight */
export function clarityTrackPhoneCountryChange(countryCode, countryName) {
  claritySet("phone_country", countryCode);
  clarityEvent("phone_country_changed");
  trackGAEvent("phone_country_changed", { country_code: countryCode, country_name: countryName });
}

/**
 * Called when final form is submitted and we get a qualification result.
 * Tags the session as "qualified" or "disqualified" — very useful for
 * filtering Clarity recordings by outcome.
 */
export function clarityTrackQualifyResult(qualified, niche, budget) {
  claritySet("qualify_result", qualified ? "qualified" : "disqualified");
  claritySet("lead_niche", niche);
  claritySet("lead_budget", budget);
  clarityEvent(qualified ? "qualify_qualified" : "qualify_disqualified");
  trackGAEvent("qualify_form_submitted", { qualified, niche, budget });
}

/**
 * Called when user identifies themselves (after step 1 proceed).
 * Links the Clarity session to a real person — searchable in dashboard.
 */
export function clarityIdentifyLead(email, fullName) {
  clarityIdentify(email, undefined, undefined, fullName);
  claritySet("lead_email", email);
}

/* ─────────────────────────────────────────────
   VIDEO TRACKING WRAPPERS
───────────────────────────────────────────── */

/**
 * Track Vimeo player milestones 
 * @param {string} milestone e.g. "play", "pause", "played_25_percent", "ended"
 */
export function trackVideoMilestone(milestone) {
  clarityEvent(`video_${milestone}`);
  trackGAEvent("video_engagement", { milestone });
}
