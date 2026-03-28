import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { trackBookingStart } from "@/lib/analytics";

export default function Booking({ calUrl }) {
  useEffect(() => {
    trackBookingStart();
  }, []);

  return (
    <>
      <Head>
        <title>Book a Demo — Sendiee</title>
        <meta
          name="description"
          content="Schedule a 30-minute demo with the Sendiee team to see how AI can automate your WhatsApp & Instagram sales."
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

      <iframe
        src={calUrl}
        className="booking-fullscreen"
        frameBorder="0"
        title="Book a Demo"
        allow="payment"
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const BASE_URL = "https://cal.sendiee.com/sales/demo";
  const { name, email, phone, businessName, website, niche, budget, goal, leadsPerMonth } =
    context.query;

  const params = new URLSearchParams();

  if (name) params.set("name", name);
  if (email) params.set("email", email);
  // Cal.com phone prefill
  if (phone) params.set("phone", phone);
  // Pass additional context in notes field
  const notesParts = [];
  if (niche) notesParts.push(`Niche: ${niche}`);
  if (budget) notesParts.push(`Budget: ${budget}`);
  if (goal) notesParts.push(`Goal: ${goal}`);
  if (leadsPerMonth) notesParts.push(`Leads/mo: ${leadsPerMonth}`);
  if (businessName) notesParts.push(`Business: ${businessName}`);
  if (website) notesParts.push(`Website: ${website}`);
  if (notesParts.length) params.set("notes", notesParts.join(" | "));

  const calUrl =
    params.toString() ? `${BASE_URL}?${params.toString()}` : BASE_URL;

  return { props: { calUrl } };
}