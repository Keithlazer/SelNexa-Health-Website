class ResourceTracker {
    constructor() {
        this.downloads = {};
        this.views = {};
        this.recommendations = {};
        this.initializeTracking();
    }

    initializeTracking() {
        // Track resource views
        document.querySelectorAll('.resource-card').forEach(card => {
            this.trackView(card);
        });

        // Track resource downloads
        document.querySelectorAll('.btn-secondary').forEach(button => {
            if (button.textContent.includes('Download')) {
                this.trackDownload(button);
            }
        });

        // Initialize recommendation system
        this.initializeRecommendations();
    }

    trackView(resourceCard) {
        const resourceId = resourceCard.dataset.resourceId;
        const resourceType = resourceCard.dataset.resourceType;
        const timestamp = new Date().toISOString();

        // Store view data
        if (!this.views[resourceId]) {
            this.views[resourceId] = {
                count: 0,
                type: resourceType,
                timestamps: []
            };
        }

        this.views[resourceId].count++;
        this.views[resourceId].timestamps.push(timestamp);

        // Send view data to analytics
        this.sendAnalytics('view', {
            resourceId,
            resourceType,
            timestamp
        });
    }

    trackDownload(button) {
        const resourceId = button.closest('.resource-card').dataset.resourceId;
        const resourceType = button.closest('.resource-card').dataset.resourceType;
        const timestamp = new Date().toISOString();

        // Store download data
        if (!this.downloads[resourceId]) {
            this.downloads[resourceId] = {
                count: 0,
                type: resourceType,
                timestamps: []
            };
        }

        this.downloads[resourceId].count++;
        this.downloads[resourceId].timestamps.push(timestamp);

        // Send download data to analytics
        this.sendAnalytics('download', {
            resourceId,
            resourceType,
            timestamp
        });
    }

    initializeRecommendations() {
        // Get user's resource interaction history
        const userHistory = this.getUserHistory();

        // Calculate recommendations based on user history
        this.calculateRecommendations(userHistory);

        // Display recommendations
        this.displayRecommendations();
    }

    getUserHistory() {
        // In a real implementation, this would fetch from a backend
        return {
            views: this.views,
            downloads: this.downloads
        };
    }

    calculateRecommendations(userHistory) {
        const recommendations = {};

        // Analyze user's resource type preferences
        const typePreferences = this.analyzeTypePreferences(userHistory);

        // Get similar resources based on preferences
        Object.keys(typePreferences).forEach(type => {
            recommendations[type] = this.getSimilarResources(type, userHistory);
        });

        this.recommendations = recommendations;
    }

    analyzeTypePreferences(userHistory) {
        const preferences = {};
        let totalInteractions = 0;

        // Count interactions by type
        Object.values(userHistory.views).forEach(view => {
            preferences[view.type] = (preferences[view.type] || 0) + view.count;
            totalInteractions += view.count;
        });

        Object.values(userHistory.downloads).forEach(download => {
            preferences[download.type] = (preferences[download.type] || 0) + download.count;
            totalInteractions += download.count;
        });

        // Calculate percentages
        Object.keys(preferences).forEach(type => {
            preferences[type] = (preferences[type] / totalInteractions) * 100;
        });

        return preferences;
    }

    getSimilarResources(type, userHistory) {
        // In a real implementation, this would use a more sophisticated algorithm
        return document.querySelectorAll(`.resource-card[data-resource-type="${type}"]`)
            .filter(card => !userHistory.views[card.dataset.resourceId])
            .slice(0, 3);
    }

    displayRecommendations() {
        const recommendationsContainer = document.querySelector('.recommendations-container');
        if (!recommendationsContainer) return;

        Object.entries(this.recommendations).forEach(([type, resources]) => {
            const typeSection = document.createElement('div');
            typeSection.className = 'recommendation-section';
            typeSection.innerHTML = `
                <h3>Recommended ${type}</h3>
                <div class="recommendation-grid">
                    ${Array.from(resources).map(resource => this.createRecommendationCard(resource)).join('')}
                </div>
            `;
            recommendationsContainer.appendChild(typeSection);
        });
    }

    createRecommendationCard(resource) {
        return `
            <div class="recommendation-card">
                <h4>${resource.querySelector('h3').textContent}</h4>
                <p>${resource.querySelector('p').textContent}</p>
                <a href="${resource.querySelector('.btn-secondary').href}" class="btn btn-secondary">
                    ${resource.querySelector('.btn-secondary').textContent}
                </a>
            </div>
        `;
    }

    sendAnalytics(eventType, data) {
        // In a real implementation, this would send data to an analytics service
        console.log(`Analytics Event: ${eventType}`, data);
    }
}

// Initialize resource tracking when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.resourceTracker = new ResourceTracker();
}); 