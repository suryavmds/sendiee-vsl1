export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { fullName, email, phone, businessName, website } = req.body;

  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Fire-and-forget: send initial lead data to n8n webhook 1
  const webhookUrl = process.env.N8N_WEBHOOK_URL_1?.trim();
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(webhookSecret ? { "x-webhook-secret": webhookSecret } : {}),
      },
      body: JSON.stringify({
        fullName,
        email,
        phone,
        businessName: businessName || "",
        website: website || "",
        submittedAt: new Date().toISOString(),
        step: "initial",
      }),
    }).catch((err) => {
      console.error("n8n webhook-1 error:", err);
    });
  }

  return res.status(200).json({ ok: true });
}
