import Head from "next/head";

export default function Booking() {
    return (
        <>
            <Head>
                <title>Book a Demo — Sendiee</title>
                <meta name="description" content="Schedule a 30-minute demo with the Sendiee team to see how AI can automate your WhatsApp & Instagram sales." />
                <link rel="manifest" href="/manifest.json" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <meta name="theme-color" content="#07070d" />
            </Head>

            <iframe
                src="https://cal.com/sendiee-ghwxv7/30min"
                className="booking-fullscreen"
                frameBorder="0"
                title="Book a Demo"
                allow="payment"
            />
        </>
    );
}

export async function getServerSideProps() {
    return { props: {} };
}