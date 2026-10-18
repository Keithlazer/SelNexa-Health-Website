// Cloudflare Worker that receives the website's form submissions (JSON POST from js/site-core.js)
// and emails them through Resend. Deploy it, then put its URL in js/form-endpoints.js.
//
// Secrets and settings (Cloudflare dashboard or `wrangler secret put`):
//   RESEND_API_KEY      required
//   FORM_TO_EMAIL       required: where submissions go (SCHEDULING_TO_EMAIL / WISHLIST_TO_EMAIL still work)
//   FORM_FROM_EMAIL     optional sender, on a domain verified in Resend
//   ALLOWED_ORIGINS     optional, comma-separated (default https://www.selnexahealth.com)
//   SUBMISSION_RATE_LIMIT_KV  optional KV namespace for a 5-per-minute limit per IP
//
// Forms send: form ("demo", "contact" or "updates"), page, submitted_at, plus the fields below.

const FIELDS = [
  ["form", "Form"],
  ["name", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["organisation", "Organisation"],
  ["role", "Role"],
  ["institution_type", "Institution type"],
  ["country", "Country"],
  ["interest", "Request"],
  ["topic", "Topic"],
  ["message", "Message"],
  ["consent", "Consent to reply"],
  ["page", "Sent from page"],
  ["submitted_at", "Submitted at"]
];

const MAX_BYTES = 32768;

export default {
  async fetch(request, env) {
    const allowedOrigins = (env.ALLOWED_ORIGINS || env.ALLOWED_ORIGIN || "https://www.selnexahealth.com")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const origin = request.headers.get("Origin");
    const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Cache-Control": "no-store",
      "Vary": "Origin"
    };
    const reply = (status, body) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (request.method !== "POST") {
      return reply(405, { error: "Method not allowed" });
    }
    if (origin && !allowedOrigins.includes(origin)) {
      return reply(403, { error: "Origin not allowed" });
    }

    // Read the body with a size cap (Content-Length can be missing).
    const raw = await request.text();
    if (raw.length > MAX_BYTES) {
      return reply(413, { error: "Payload too large" });
    }
    let payload;
    try {
      payload = JSON.parse(raw);
    } catch (err) {
      return reply(400, { error: "Invalid JSON payload" });
    }
    if (!payload || typeof payload !== "object") {
      return reply(400, { error: "Invalid JSON payload" });
    }

    // Honeypot: pretend success so bots don't retry.
    if (payload.website || payload._gotcha || payload.company_url || payload.fax) {
      return reply(200, { ok: true });
    }

    const kind = ["demo", "contact", "updates"].includes(payload.form) ? payload.form : "contact";
    const email = String(payload.email || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return reply(400, { error: "Invalid email address" });
    }
    if (kind !== "updates" && !String(payload.name || "").trim()) {
      return reply(400, { error: "Missing required fields" });
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (env.SUBMISSION_RATE_LIMIT_KV && ip !== "unknown") {
      const windowKey = "form:" + ip + ":" + Math.floor(Date.now() / 60000);
      const count = Number((await env.SUBMISSION_RATE_LIMIT_KV.get(windowKey)) || "0") + 1;
      if (count > 5) {
        return reply(429, { error: "Too many submissions" });
      }
      await env.SUBMISSION_RATE_LIMIT_KV.put(windowKey, String(count), { expirationTtl: 120 });
    }

    const resendApiKey = env.RESEND_API_KEY;
    const recipientEmail = env.FORM_TO_EMAIL || env.SCHEDULING_TO_EMAIL || env.WISHLIST_TO_EMAIL;
    const fromEmail = env.FORM_FROM_EMAIL || env.WISHLIST_FROM_EMAIL || "SelNexa Health website <noreply@selnexahealth.com>";
    if (!resendApiKey || !recipientEmail) {
      return reply(500, { error: "Relay is not configured" });
    }

    const clean = (value) => String(value == null ? "" : value).slice(0, 4000);
    const lines = FIELDS.filter(([key]) => payload[key]).map(([key, label]) => label + ": " + clean(payload[key]));
    const subject = kind === "demo"
      ? "Demo request" + (payload.organisation ? ": " + clean(payload.organisation).slice(0, 120) : "")
      : kind === "updates"
      ? "Updates sign-up: " + email
      : "Website message" + (payload.topic ? ": " + clean(payload.topic).slice(0, 120) : "");

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + resendApiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipientEmail],
        reply_to: email,
        subject,
        text: lines.join("\n")
      })
    });

    if (!resendResponse.ok) {
      // Keep the provider's error in the Worker logs, not in the visitor's browser.
      console.log("Resend error", resendResponse.status, await resendResponse.text());
      return reply(502, { error: "Failed to send email" });
    }
    return reply(200, { ok: true });
  }
};
