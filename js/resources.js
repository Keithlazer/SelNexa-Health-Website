document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const resourceGrids = document.querySelectorAll('.resources-grid');

    // Function to show selected category and hide others
    function showCategory(categoryId) {
        resourceGrids.forEach(grid => {
            if (grid.id === categoryId) {
                grid.classList.remove('hidden');
            } else {
                grid.classList.add('hidden');
            }
        });

        // Update active state of tab buttons
        tabButtons.forEach(btn => {
            if (btn.dataset.category === categoryId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Add click event listeners to tab buttons
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            showCategory(category);
        });
    });

    // Initialize with the first category
    const firstCategory = tabButtons[0].dataset.category;
    showCategory(firstCategory);
}); 