aq
document.addEventListener('DOMContentLoaded', function() {
***************** 
+*
    const   filterButtons = document.querySelectorAll('.filter-btn');
    const webinarGrids = document.querySelectorAll('.webinars-grid');
    const categorySelect = document.getElementById('categorySelect');
    const searchInput = document.getElementById('webinarSearch');
    const webinarCards = document.querySelectorAll('.webinar-card');

    // Function to show selected webinar type (upcoming/past)
    function showWebinarType(type) {
        webinarGrids.forEach(grid => {
            if (grid.id === type + 'Webinars') {
                grid.classList.remove('hidden');
            } else {
                grid.classList.add('hidden');
            }
        });

        // Update active state of filter buttons
        filterButtons.forEach(btn => {
            if (btn.dataset.filter === type) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Function to filter webinars by category
    function filterByCategory(category) {
        webinarCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Function to search webinars
    function searchWebinars(query) {
        const searchTerm = query.toLowerCase();
        webinarCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const speaker = card.querySelector('.speaker-info h4').textContent.toLowerCase();

            if (title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                speaker.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Add click event listeners to filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.filter;
            showWebinarType(type);
        });
    });

    // Add change event listener to category select
    categorySelect.addEventListener('change', (e) => {
        filterByCategory(e.target.value);
    });

    // Add input event listener to search
    searchInput.addEventListener('input', (e) => {
        searchWebinars(e.target.value);
    });

    // Initialize with upcoming webinars
    showWebinarType('upcoming');
}); 