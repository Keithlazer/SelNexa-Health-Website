class SymptomChecker {
    constructor() {
        this.bodyParts = {
            head: ['Headache', 'Dizziness', 'Fever'],
            chest: ['Chest Pain', 'Shortness of Breath', 'Cough'],
            abdomen: ['Stomach Pain', 'Nausea', 'Vomiting'],
            back: ['Back Pain', 'Muscle Ache', 'Stiffness'],
            limbs: ['Joint Pain', 'Swelling', 'Numbness']
        };
        
        this.selectedSymptoms = new Set();
        this.init();
    }

    init() {
        this.createBodyMap();
        this.setupEventListeners();
    }

    createBodyMap() {
        const container = document.createElement('div');
        container.className = 'symptom-checker';
        container.innerHTML = `
            <div class="body-map">
                <svg viewBox="0 0 200 400" class="human-body">
                    <!-- Head -->
                    <circle cx="100" cy="50" r="30" class="body-part" data-part="head"/>
                    <!-- Torso -->
                    <rect x="70" y="80" width="60" height="120" class="body-part" data-part="chest"/>
                    <rect x="70" y="200" width="60" height="100" class="body-part" data-part="abdomen"/>
                    <!-- Back -->
                    <rect x="70" y="80" width="60" height="220" class="body-part" data-part="back"/>
                    <!-- Arms -->
                    <rect x="20" y="100" width="50" height="20" class="body-part" data-part="limbs"/>
                    <rect x="130" y="100" width="50" height="20" class="body-part" data-part="limbs"/>
                    <!-- Legs -->
                    <rect x="70" y="300" width="20" height="80" class="body-part" data-part="limbs"/>
                    <rect x="110" y="300" width="20" height="80" class="body-part" data-part="limbs"/>
                </svg>
            </div>
            <div class="symptom-panel">
                <h3>Selected Symptoms</h3>
                <div class="selected-symptoms"></div>
                <div class="symptom-suggestions"></div>
            </div>
        `;
        document.body.appendChild(container);
    }

    setupEventListeners() {
        document.querySelectorAll('.body-part').forEach(part => {
            part.addEventListener('click', (e) => {
                const bodyPart = e.target.dataset.part;
                this.showSymptomOptions(bodyPart);
            });
        });
    }

    showSymptomOptions(bodyPart) {
        const symptoms = this.bodyParts[bodyPart];
        const panel = document.querySelector('.symptom-suggestions');
        
        panel.innerHTML = `
            <h4>Common Symptoms for ${bodyPart}</h4>
            <div class="symptom-list">
                ${symptoms.map(symptom => `
                    <label class="symptom-option">
                        <input type="checkbox" value="${symptom}">
                        ${symptom}
                    </label>
                `).join('')}
            </div>
        `;

        // Add event listeners to checkboxes
        panel.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.selectedSymptoms.add(e.target.value);
                } else {
                    this.selectedSymptoms.delete(e.target.value);
                }
                this.updateSelectedSymptoms();
            });
        });
    }

    updateSelectedSymptoms() {
        const container = document.querySelector('.selected-symptoms');
        container.innerHTML = Array.from(this.selectedSymptoms).map(symptom => `
            <div class="selected-symptom">
                <span>${symptom}</span>
                <button class="remove-symptom" data-symptom="${symptom}">×</button>
            </div>
        `).join('');

        // Add event listeners to remove buttons
        container.querySelectorAll('.remove-symptom').forEach(button => {
            button.addEventListener('click', (e) => {
                const symptom = e.target.dataset.symptom;
                this.selectedSymptoms.delete(symptom);
                this.updateSelectedSymptoms();
            });
        });

        // Show recommendations if symptoms are selected
        if (this.selectedSymptoms.size > 0) {
            this.showRecommendations();
        }
    }

    showRecommendations() {
        const recommendations = this.getRecommendations();
        const panel = document.querySelector('.symptom-suggestions');
        
        panel.innerHTML = `
            <h4>Recommendations</h4>
            <div class="recommendations">
                ${recommendations.map(rec => `
                    <div class="recommendation">
                        <h5>${rec.title}</h5>
                        <p>${rec.description}</p>
                        ${rec.action ? `<button class="action-btn">${rec.action}</button>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    getRecommendations() {
        const recommendations = [];
        
        // Check for emergency symptoms
        if (this.selectedSymptoms.has('Chest Pain') || 
            this.selectedSymptoms.has('Shortness of Breath')) {
            recommendations.push({
                title: 'Emergency Care Needed',
                description: 'Please seek immediate medical attention or call emergency services.',
                action: 'Call Emergency Services'
            });
        }

        // Check for urgent care
        if (this.selectedSymptoms.has('Fever') && 
            this.selectedSymptoms.has('Headache')) {
            recommendations.push({
                title: 'Urgent Care Recommended',
                description: 'Please schedule an appointment with your healthcare provider.',
                action: 'Book Appointment'
            });
        }

        // General recommendations
        if (recommendations.length === 0) {
            recommendations.push({
                title: 'Monitor Symptoms',
                description: 'Keep track of your symptoms and seek medical attention if they worsen.',
                action: 'Start Symptom Tracking'
            });
        }

        return recommendations;
    }
}

// Initialize symptom checker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SymptomChecker();
}); 