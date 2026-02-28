import { useEffect } from "react";
import Head from "next/head";
import { trackBookingStart } from "@/lib/analytics";

export default function BookingLight() {
    useEffect(() => {
        trackBookingStart();
    }, []);

    return (
        <>
            <Head>
                <title>Book a Demo — Sendiee</title>
                <meta name="description" content="Schedule a 30-minute demo with the Sendiee team to see how AI can automate your WhatsApp &amp; Instagram sales." />
                <link rel="manifest" href="/manifest.json" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <meta name="theme-color" content="#f8f9fc" />
                <meta property="og:image" content="/og_image.png" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="Sendiee" />
            </Head>

            <div className="light-theme">
                <iframe
                    src="https://cal.com/sendiee-ghwxv7/30min"
                    className="booking-fullscreen"
                    frameBorder="0"
                    title="Book a Demo"
                    allow="payment"
                />
            </div>
        </>
    );
}

export async function getServerSideProps() {
    return { props: {} };
}
