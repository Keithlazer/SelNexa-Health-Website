// Topic and date filters for blog.html.
(function () {
    var topicFilter = document.getElementById("blog-topic-filter");
    var dateFilter = document.getElementById("blog-date-filter");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".blog-card"));

    function applyFilters() {
        var topic = topicFilter.value;
        var date = dateFilter.value;

        cards.forEach(function (card) {
            var topicMatch = topic === "all" || card.getAttribute("data-topic") === topic;
            var dateMatch = date === "all" || card.getAttribute("data-date") === date;
            card.style.display = topicMatch && dateMatch ? "block" : "none";
        });
    }

    topicFilter.addEventListener("change", applyFilters);
    dateFilter.addEventListener("change", applyFilters);
})();
