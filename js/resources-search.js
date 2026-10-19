// Search box and category filter for resources.html (also reads ?q= from the URL).
(function () {
  var searchInput = document.getElementById("resource-search");
  var filterSelect = document.getElementById("resource-filter");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".resource-card"));

  function applyFilters() {
    var query = (searchInput.value || "").toLowerCase().trim();
    var category = filterSelect.value;

    cards.forEach(function (card) {
      var text = card.textContent.toLowerCase();
      var cardCategory = card.getAttribute("data-category");
      var queryMatch = query.length === 0 || text.indexOf(query) >= 0;
      var categoryMatch = category === "all" || cardCategory === category;
      card.style.display = queryMatch && categoryMatch ? "block" : "none";
    });
  }

  searchInput.addEventListener("input", applyFilters);
  filterSelect.addEventListener("change", applyFilters);

  var params = new URLSearchParams(window.location.search);
  var incomingQuery = params.get("q");
  if (incomingQuery) {
    searchInput.value = incomingQuery;
    applyFilters();
  }
})();
