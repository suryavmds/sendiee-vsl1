import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#07070d" />
        <meta
          name="description"
          content="Sendiee AI turns your WhatsApp and Instagram DMs into a 24/7 automated sales machine. Official Meta Tech Provider."
        />
        <meta property="og:title" content="Sendiee — AI-Powered WhatsApp & Instagram Sales Automation" />
        <meta property="og:description" content="See how we helped a brand increase WhatsApp sales by 40% in just 30 days." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
