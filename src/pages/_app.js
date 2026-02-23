import "@/styles/globals.css";
import "@/styles/phone-preview.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Sendiee — AI-Powered WhatsApp & Instagram Sales Automation</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
