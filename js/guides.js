// Search and category filter for resources/guides.html (the controls were on the page with no script behind them).
(function () {
  "use strict";

  var cards = Array.prototype.slice.call(document.querySelectorAll(".guide-card"));
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".guides-filters .filter-btn"));
  var search = document.getElementById("guidesSearch");
  var searchButton = document.querySelector(".guides-search .search-btn");
  var status = document.getElementById("guidesStatus");
  var category = "all";

  function apply() {
    var query = search ? search.value.trim().toLowerCase() : "";
    var shown = 0;
    cards.forEach(function (card) {
      var inCategory = category === "all" || card.getAttribute("data-category") === category;
      var matches = !query || card.textContent.toLowerCase().indexOf(query) !== -1;
      var visible = inCategory && matches;
      card.style.display = visible ? "" : "none";
      if (visible) {
        shown += 1;
      }
    });
    if (status) {
      status.textContent = shown === 1 ? "1 guide shown" : shown + " guides shown";
    }
  }

  buttons.forEach(function (button) {
    button.setAttribute("aria-pressed", button.classList.contains("active") ? "true" : "false");
    button.addEventListener("click", function () {
      category = button.getAttribute("data-filter") || "all";
      buttons.forEach(function (other) {
        var on = other === button;
        other.classList.toggle("active", on);
        other.setAttribute("aria-pressed", on ? "true" : "false");
      });
      apply();
    });
  });

  if (search) {
    search.addEventListener("input", apply);
  }
  if (searchButton) {
    searchButton.addEventListener("click", function () {
      apply();
      if (search) {
        search.focus();
      }
    });
  }
})();
