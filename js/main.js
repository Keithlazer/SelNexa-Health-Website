(function loadSelNexaCoreScripts() {
  function appendScript(src, id) {
    if (document.getElementById(id)) {
      return;
    }

    var script = document.createElement("script");
    script.src = src;
    script.id = id;
    script.async = false;
    (document.head || document.documentElement).appendChild(script);
  }

  appendScript("/js/i18n.js", "selnexa-i18n-script");
  appendScript("/js/site-core.js", "selnexa-site-core-script");
})();
