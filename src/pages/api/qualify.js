// Disqualifying options per field
const DISQUALIFY_NICHE = ["Clothing / Fashion", "Fitness", "Life Coaching"];
const DISQUALIFY_BUDGET = ["Below ₹5,000"];
const DISQUALIFY_GOAL = ["Just exploring"];
const DISQUALIFY_LEADS = ["Less than 100"];

function isQualified(body) {
  const { niche, budget, goal, leadsPerMonth } = body;
  if (DISQUALIFY_NICHE.includes(niche)) return false;
  if (DISQUALIFY_BUDGET.includes(budget)) return false;
  if (DISQUALIFY_GOAL.includes(goal)) return false;
  if (DISQUALIFY_LEADS.includes(leadsPerMonth)) return false;
  return true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    fullName,
    email,
    phone,
    businessName,
    website,
    niche,
    budget,
    goal,
    leadsPerMonth,
  } = req.body;

  // Basic validation
  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const qualified = isQualified(req.body);

  // Fire-and-forget: send to n8n webhook (non-blocking)
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
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
        niche: niche || "",
        budget: budget || "",
        goal: goal || "",
        leadsPerMonth: leadsPerMonth || "",
        qualified,
        submittedAt: new Date().toISOString(),
      }),
    }).catch((err) => {
      console.error("n8n webhook error:", err);
    });
  }

  return res.status(200).json({ qualified });
}
