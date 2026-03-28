import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  trackButtonClick,
  clarityTrackQualifyStart,
  clarityTrackStep1Complete,
  clarityTrackStep1Error,
  clarityTrackStep2Error,
  clarityTrackStepBack,
  clarityTrackPhoneCountryChange,
  clarityTrackQualifyResult,
  clarityIdentifyLead,
} from "@/lib/analytics";
import { parsePhoneNumber } from "libphonenumber-js";

const STORAGE_KEY = "sendiee_qualify_data";

// ── Country codes (flag emoji + dial code + name) ──────────────────────────
const COUNTRIES = [
  { code: "IN", dial: "+91", flag: "🇮🇳", name: "India" },
  { code: "US", dial: "+1", flag: "🇺🇸", name: "United States" },
  { code: "GB", dial: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "AE", dial: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "AU", dial: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "CA", dial: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "SG", dial: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "MY", dial: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "DE", dial: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "FR", dial: "+33", flag: "🇫🇷", name: "France" },
  { code: "NL", dial: "+31", flag: "🇳🇱", name: "Netherlands" },
  { code: "IT", dial: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "ES", dial: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "BR", dial: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "MX", dial: "+52", flag: "🇲🇽", name: "Mexico" },
  { code: "AR", dial: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "ZA", dial: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "NG", dial: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "KE", dial: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "PK", dial: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "BD", dial: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "LK", dial: "+94", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "NP", dial: "+977", flag: "🇳🇵", name: "Nepal" },
  { code: "PH", dial: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "ID", dial: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "TH", dial: "+66", flag: "🇹🇭", name: "Thailand" },
  { code: "VN", dial: "+84", flag: "🇻🇳", name: "Vietnam" },
  { code: "JP", dial: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "KR", dial: "+82", flag: "🇰🇷", name: "South Korea" },
  { code: "CN", dial: "+86", flag: "🇨🇳", name: "China" },
  { code: "SA", dial: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "QA", dial: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "KW", dial: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "BH", dial: "+973", flag: "🇧🇭", name: "Bahrain" },
  { code: "OM", dial: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "EG", dial: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "TR", flag: "🇹🇷", dial: "+90", name: "Turkey" },
  { code: "RU", dial: "+7", flag: "🇷🇺", name: "Russia" },
  { code: "IL", dial: "+972", flag: "🇮🇱", name: "Israel" },
  { code: "NZ", dial: "+64", flag: "🇳🇿", name: "New Zealand" },
];

const DEFAULT_COUNTRY = COUNTRIES[0]; // India

// ── PhoneInput Component ────────────────────────────────────────────────────
function PhoneInput({ id, value, onChange, onCountryChange }) {
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  const selectCountry = (c) => {
    setCountry(c);
    setOpen(false);
    setSearch("");
    if (onCountryChange) onCountryChange(c.code);
  };

  // Notify parent of initial country on mount
  useEffect(() => {
    if (onCountryChange) onCountryChange(DEFAULT_COUNTRY.code);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Strip existing dial code prefix from stored value when switching countries
  const phoneNumber = value.startsWith(country.dial)
    ? value.slice(country.dial.length).trimStart()
    : value;

  const handleNumberChange = (e) => {
    const raw = e.target.value.replace(/[^0-9\s\-]/g, "");
    onChange(raw ? `${country.dial} ${raw}` : "");
  };

  return (
    <div className="phone-input-wrapper" ref={dropdownRef}>
      {/* Country selector button */}
      <button
        type="button"
        className="phone-country-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Select country code"
      >
        <span className="phone-flag">{country.flag}</span>
        <span className="phone-dial">{country.dial}</span>
        <svg
          className={`phone-chevron${open ? " open" : ""}`}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Number input */}
      <input
        id={id}
        type="tel"
        className="phone-number-input"
        placeholder="98765 43210"
        value={phoneNumber}
        onChange={handleNumberChange}
        autoComplete="tel-national"
      />

      {/* Dropdown */}
      {open && (
        <div className="phone-dropdown">
          <div className="phone-search-wrap">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M10 10L12.5 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              className="phone-search-input"
              placeholder="Search country…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ul className="phone-country-list">
            {filtered.length === 0 && (
              <li className="phone-country-empty">No results</li>
            )}
            {filtered.map((c) => (
              <li
                key={c.code}
                className={`phone-country-item${c.code === country.code ? " selected" : ""}`}
                onClick={() => selectCountry(c)}
              >
                <span className="phone-flag">{c.flag}</span>
                <span className="phone-country-name">{c.name}</span>
                <span className="phone-country-dial">{c.dial}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Option arrays ───────────────────────────────────────────────────────────
const NICHE_OPTIONS = [
  "E-commerce",
  "Real Estate",
  "Education / Coaching",
  "SaaS / Tech",
  "Healthcare",
  "Finance",
  "Clothing / Fashion",
  "Fitness",
  "Life Coaching",
  "Other",
];

const BUDGET_OPTIONS = [
  "Below ₹5,000",
  "₹10K – ₹25K",
  "₹25K – ₹50K",
  "₹50K+",
];

const GOAL_OPTIONS = [
  "Generate more leads",
  "Automate sales / operations",
  "Improve customer support",
  "Scale existing business",
  "Just exploring",
];

const LEADS_OPTIONS = [
  "Less than 100",
  "100 – 500",
  "500 – 2,000",
  "2,000+",
];

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  businessName: "",
  website: "",
  niche: "",
  budget: "",
  goal: "",
  leadsPerMonth: "",
};

function RadioGrid({ options, value, onChange, name }) {
  return (
    <div className="radio-grid">
      {options.map((opt) => (
        <label
          key={opt}
          className={`radio-option${value === opt ? " radio-selected" : ""}`}
        >
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

export default function QualifyLight() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [phoneCountry, setPhoneCountry] = useState("IN"); // ISO country code for validation

  // Tag Clarity session on mount
  useEffect(() => {
    clarityTrackQualifyStart("light");
  }, []);

  // Load saved form data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {}
  }, [form]);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));
  const setPhone = (val) => setForm((f) => ({ ...f, phone: val }));
  const handlePhoneCountryChange = (code) => {
    const countryName = COUNTRIES.find((c) => c.code === code)?.name || code;
    setPhoneCountry(code);
    clarityTrackPhoneCountryChange(code, countryName);
  };
  const setRadio = (field) => (val) =>
    setForm((f) => ({ ...f, [field]: val }));

  const validateStep1 = () => {
    if (!form.fullName.trim()) return { field: "fullName", msg: "Please enter your full name." };
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      return { field: "email", msg: "Please enter a valid email address." };
    if (!form.phone.trim()) return { field: "phone", msg: "Please enter your WhatsApp number." };
    try {
      const parsed = parsePhoneNumber(form.phone, phoneCountry);
      if (!parsed || !parsed.isValid()) {
        const countryName =
          COUNTRIES.find((c) => c.code === phoneCountry)?.name || phoneCountry;
        return { field: "phone", msg: `Please enter a valid ${countryName} phone number.` };
      }
    } catch {
      return { field: "phone", msg: "Please enter a valid phone number." };
    }
    return null;
  };

  const validateStep2 = () => {
    if (!form.niche) return { field: "niche", msg: "Please select your business niche." };
    if (!form.budget) return { field: "budget", msg: "Please select your investment range." };
    if (!form.goal) return { field: "goal", msg: "Please select your primary goal." };
    if (!form.leadsPerMonth) return { field: "leadsPerMonth", msg: "Please select your monthly lead volume." };
    return null;
  };

  const handleNext = async () => {
    const err = validateStep1();
    if (err) {
      setError(err.msg);
      clarityTrackStep1Error(err.field, err.msg);
      return;
    }
    setError("");

    // Identify lead in Clarity so session is searchable by email
    clarityIdentifyLead(form.email, form.fullName);
    clarityTrackStep1Complete(phoneCountry);

    // Fire-and-forget: send initial answers to N8N_WEBHOOK_URL_1
    fetch("/api/qualify-initial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        businessName: form.businessName,
        website: form.website,
      }),
    }).catch(() => {});

    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) {
      setError(err.msg);
      clarityTrackStep2Error(err.field);
      return;
    }
    setError("");
    setLoading(true);
    trackButtonClick("Submit Qualify Form", "qualify");

    try {
      const res = await fetch("/api/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.qualified) {
        clarityTrackQualifyResult(true, form.niche, form.budget);
        const params = new URLSearchParams({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          businessName: form.businessName,
          website: form.website,
          niche: form.niche,
          budget: form.budget,
          goal: form.goal,
          leadsPerMonth: form.leadsPerMonth,
        });
        router.push(`/v1/booking?${params.toString()}`);
      } else {
        clarityTrackQualifyResult(false, form.niche, form.budget);
        router.push("/v1/thankyou");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Book a Free Demo — Sendiee</title>
        <meta
          name="description"
          content="Answer a few quick questions and book your free Sendiee demo."
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#f8f9fc" />
      </Head>

      <main className="qualify-page light-theme">
        <div className="qualify-container">
          {/* Logo */}
          <a href="/v1" className="qualify-logo-link">
            <img
              src="/logo/logo-dark.svg"
              alt="Sendiee"
              className="qualify-logo"
            />
          </a>

          {/* Progress */}
          <div className="qualify-progress">
            <div className="qualify-progress-bar">
              <div
                className="qualify-progress-fill"
                style={{ width: step === 1 ? "50%" : "100%" }}
              />
            </div>
            <p className="qualify-progress-label">Step {step} of 2</p>
          </div>

          <div className="qualify-card">
            {step === 1 ? (
              <>
                <div className="qualify-card-header">
                  <div className="qualify-step-badge">01</div>
                  <h1 className="qualify-title">Let's get you started</h1>
                  <p className="qualify-subtitle">
                    Fill in your basic details to book your free Sendiee demo.
                  </p>
                </div>

                <form
                  onSubmit={(e) => { e.preventDefault(); handleNext(); }}
                  className="qualify-form"
                  noValidate
                >
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="q-fullName-v1">
                        Full Name <span className="required">*</span>
                      </label>
                      <input
                        id="q-fullName-v1"
                        type="text"
                        placeholder="Rahul Sharma"
                        value={form.fullName}
                        onChange={set("fullName")}
                        autoComplete="name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="q-email-v1">
                        Email Address <span className="required">*</span>
                      </label>
                      <input
                        id="q-email-v1"
                        type="email"
                        placeholder="you@business.com"
                        value={form.email}
                        onChange={set("email")}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="q-phone-v1">
                        WhatsApp Number <span className="required">*</span>
                      </label>
                      <PhoneInput
                        id="q-phone-v1"
                        value={form.phone}
                        onChange={setPhone}
                        onCountryChange={handlePhoneCountryChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="q-businessName-v1">Business Name</label>
                      <input
                        id="q-businessName-v1"
                        type="text"
                        placeholder="Your Company Pvt. Ltd."
                        value={form.businessName}
                        onChange={set("businessName")}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="q-website-v1">Website / Profile Link</label>
                    <input
                      id="q-website-v1"
                      type="url"
                      placeholder="https://yourwebsite.com or Instagram profile URL"
                      value={form.website}
                      onChange={set("website")}
                    />
                  </div>

                  {error && <p className="form-error">{error}</p>}

                  <button type="submit" className="qualify-btn">
                    Continue →
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="qualify-card-header">
                  <div className="qualify-step-badge">02</div>
                  <h1 className="qualify-title">A few quick questions</h1>
                  <p className="qualify-subtitle">
                    Help us understand your business so we can personalise your demo.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="qualify-form" noValidate>
                  <div className="form-group">
                    <label>
                      What is your business niche?{" "}
                      <span className="required">*</span>
                    </label>
                    <RadioGrid
                      name="niche-v1"
                      options={NICHE_OPTIONS}
                      value={form.niche}
                      onChange={setRadio("niche")}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      What's your monthly investment budget for growth & automation?{" "}
                      <span className="required">*</span>
                    </label>
                    <RadioGrid
                      name="budget-v1"
                      options={BUDGET_OPTIONS}
                      value={form.budget}
                      onChange={setRadio("budget")}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      What is your primary goal?{" "}
                      <span className="required">*</span>
                    </label>
                    <RadioGrid
                      name="goal-v1"
                      options={GOAL_OPTIONS}
                      value={form.goal}
                      onChange={setRadio("goal")}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      How many leads / messages do you receive per month?{" "}
                      <span className="required">*</span>
                    </label>
                    <RadioGrid
                      name="leadsPerMonth-v1"
                      options={LEADS_OPTIONS}
                      value={form.leadsPerMonth}
                      onChange={setRadio("leadsPerMonth")}
                    />
                  </div>

                  {error && <p className="form-error">{error}</p>}

                  <div className="qualify-actions">
                    <button
                      type="button"
                      className="qualify-btn-back"
                      onClick={() => {
                        clarityTrackStepBack();
                        setError("");
                        setStep(1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="qualify-btn"
                      disabled={loading}
                    >
                      {loading ? "Submitting…" : "Book My Free Demo →"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          <p className="qualify-trust">
            🔒 Your information is secure and will never be shared.
          </p>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
