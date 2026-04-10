export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "https://www.selnexahealth.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
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

    var origin = request.headers.get("Origin");
    if (env.ALLOWED_ORIGIN && origin && origin !== env.ALLOWED_ORIGIN) {
      return new Response(JSON.stringify({ error: "Origin not allowed" }), {
        status: 403,
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

    var resendApiKey = env.RESEND_API_KEY;
    var recipientEmail = env.WISHLIST_TO_EMAIL;
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
      "Email: " + (payload.email || ""),
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
        reply_to: payload.email,
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
