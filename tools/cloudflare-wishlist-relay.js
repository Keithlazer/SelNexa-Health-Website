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
      "Access-Control-Allow-Headers": "Content-Type, X-Requested-With",
      "Cache-Control": "no-store",
      "Vary": "Origin"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    if (origin && !allowedOrigins.includes(origin)) {
      return new Response(JSON.stringify({ error: "Origin not allowed" }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    var contentLength = Number(request.headers.get("Content-Length") || "0");
    if (contentLength > 32768) {
      return new Response(JSON.stringify({ error: "Payload too large" }), {
        status: 413,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    var payload;
    try {
      payload = await request.json();
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    if (!payload || !payload.name || !payload.email) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    if (payload.website || payload._gotcha || payload.company_url || payload.fax) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    var email = String(payload.email || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    var ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (env.SUBMISSION_RATE_LIMIT_KV && ip !== "unknown") {
      var now = Date.now();
      var windowKey = "form:" + ip + ":" + Math.floor(now / 60000);
      var count = Number(await env.SUBMISSION_RATE_LIMIT_KV.get(windowKey) || "0") + 1;
      if (count > 5) {
        return new Response(JSON.stringify({ error: "Too many submissions" }), {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      await env.SUBMISSION_RATE_LIMIT_KV.put(windowKey, String(count), { expirationTtl: 120 });
    }

    var resendApiKey = env.RESEND_API_KEY;
    var recipientEmail = payload.booking_type === "wishlist"
      ? env.WISHLIST_TO_EMAIL
      : (env.SCHEDULING_TO_EMAIL || env.WISHLIST_TO_EMAIL);
    var fromEmail = env.WISHLIST_FROM_EMAIL || "SelNexa Wishlist <noreply@selnexahealth.com>";

    if (!resendApiKey || !recipientEmail) {
      return new Response(JSON.stringify({ error: "Worker secrets not configured" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    var lines = [
      "New SelNexa wishlist submission",
      "",
      "Name: " + (payload.name || ""),
      "Email: " + email,
      "Phone: " + (payload.phone || ""),
      "Facility: " + (payload.facility_name || payload.facility || payload.facility_type || ""),
      "Country: " + (payload.country || ""),
      "Interest: " + (payload.interest || ""),
      "Booking Type: " + (payload.booking_type || "wishlist"),
      "Source Page: " + (payload.source_path || ""),
      "Message: " + (payload.message || "")
    ];

    var resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + resendApiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipientEmail],
        reply_to: email,
        subject: "SelNexa Wishlist Signup: " + (payload.name || "New Contact"),
        text: lines.join("\n")
      })
    });

    if (!resendResponse.ok) {
      var resendError = await resendResponse.text();
      return new Response(JSON.stringify({ error: "Failed to send email", details: resendError }), {
        status: 502,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
};
