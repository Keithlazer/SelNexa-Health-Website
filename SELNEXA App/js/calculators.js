export function bmi(weight, height) {
  if (!weight || !height) return null;
  const h = height / 100;
  return +(weight / (h * h)).toFixed(1);
}
// Add risk-score, dosage calculators similarly 