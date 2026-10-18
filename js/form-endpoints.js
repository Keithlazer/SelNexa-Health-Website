(function configureSelNexaFormEndpoints() {
  if (typeof window === "undefined") {
    return;
  }

  // Where the demo, contact and updates forms send submissions (JSON POST).
  // While this is empty, submitting a form opens a pre-filled email to contact@selnexahealth.com instead,
  // so nothing a visitor types is lost. Point it at a relay such as tools/cloudflare-wishlist-relay.js.
  // Do not put a raw recipient email address here.
  window.SELNEXA_FORM_ENDPOINT = window.SELNEXA_FORM_ENDPOINT || "";

  // Older per-form settings, still honoured if set.
  window.SELNEXA_SCHEDULING_ENDPOINT = window.SELNEXA_SCHEDULING_ENDPOINT || "";
  window.SELNEXA_WISHLIST_ENDPOINT = window.SELNEXA_WISHLIST_ENDPOINT || "";
})();
