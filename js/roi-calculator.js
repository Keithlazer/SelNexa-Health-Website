document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('roi-calculator-widget');
  if (!container) return;

  container.innerHTML = `
    <div class="roi-card">
      <h3 class="roi-title">Calculate Your Clinic's Savings</h3>
      <div class="roi-row">
        <label>Patients per Day: <span id="roi-patients-value">30</span></label>
        <input id="roi-patients" type="range" min="10" max="200" value="30">
      </div>
      <div class="roi-row">
        <label>Avg. Staff Hourly Rate ($)</label>
        <input id="roi-rate" type="number" value="5" min="1">
      </div>
      <div class="roi-results">
        <p class="muted">By switching to SelNexa, you could save:</p>
        <div class="roi-amount" id="roi-amount">$0 / mo</div>
        <div class="roi-hours" id="roi-hours">Reclaim 0 hours / mo</div>
      </div>
    </div>
  `;

  const patientsEl = document.getElementById('roi-patients');
  const rateEl = document.getElementById('roi-rate');
  const patientsVal = document.getElementById('roi-patients-value');
  const amountEl = document.getElementById('roi-amount');
  const hoursEl = document.getElementById('roi-hours');

  function calculate() {
    const patients = Number(patientsEl.value);
    const rate = Number(rateEl.value) || 0;
    const minutesSavedPerPatient = 10; // assumption
    const daysOpenPerMonth = 26;

    const hoursSavedMonth = Math.round(((patients * minutesSavedPerPatient) * daysOpenPerMonth) / 60);
    const moneySaved = Math.round(hoursSavedMonth * rate);

    patientsVal.textContent = patients;
    amountEl.textContent = `$${moneySaved} / mo`;
    hoursEl.textContent = `Reclaim ${hoursSavedMonth} hours / mo`;
  }

  patientsEl.addEventListener('input', calculate);
  rateEl.addEventListener('input', calculate);

  calculate();
});
