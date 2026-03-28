import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { trackButtonClick } from "@/lib/analytics";

const STORAGE_KEY = "sendiee_qualify_data";

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
  const setRadio = (field) => (val) =>
    setForm((f) => ({ ...f, [field]: val }));

  const validateStep1 = () => {
    if (!form.fullName.trim()) return "Please enter your full name.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      return "Please enter a valid email address.";
    if (!form.phone.trim()) return "Please enter your WhatsApp number.";
    return "";
  };

  const validateStep2 = () => {
    if (!form.niche) return "Please select your business niche.";
    if (!form.budget) return "Please select your investment range.";
    if (!form.goal) return "Please select your primary goal.";
    if (!form.leadsPerMonth) return "Please select your monthly lead volume.";
    return "";
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) { setError(err); return; }
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
                      <input
                        id="q-phone-v1"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={set("phone")}
                        autoComplete="tel"
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
