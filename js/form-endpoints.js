(function configureSelNexaFormEndpoints() {
  if (typeof window === "undefined") {
    return;
  }

  // Use backend relay endpoints here. Do not place raw recipient emails in frontend code.
  // Example relay URL: https://your-worker-subdomain.workers.dev
  window.SELNEXA_SCHEDULING_ENDPOINT = window.SELNEXA_SCHEDULING_ENDPOINT || "";
  window.SELNEXA_WISHLIST_ENDPOINT = window.SELNEXA_WISHLIST_ENDPOINT || "";
})();
