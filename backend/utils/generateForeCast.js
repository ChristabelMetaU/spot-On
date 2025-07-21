/** @format */
function generateForecast(data, intervals = [15, 30, 50]) {
  const now = Date.now();
  const recent = data.slice(-20); // use recent 20 entries
  const weights = recent.map((_, i) => i + 1); // increasing weights
  const weightedSum = recent.reduce(
    (sum, point, i) => sum + point.value * weights[i],
    0
  );
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const prediction = totalWeight ? weightedSum / totalWeight : 0;

  return intervals.map((minutes) => ({
    time: new Date(now + minutes * 60000),
    predictedAvailability: prediction,
  }));
}

module.exports = generateForecast;
