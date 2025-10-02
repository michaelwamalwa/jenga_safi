// lib/forecast.ts
// Generates carbon emission/savings forecasts based on recorded trends



type TrendPoint = {
  time: Date | string;
  emissions: number;
  savings: number;
  net: number;
};

type ForecastPoint = {
  time: string;      // ISO date
  emissions: number;
  savings: number;
  net: number;
};

/**
 * Basic time-series forecast using linear regression.
 * You can later swap this out for ARIMA, Prophet, or ML-powered models.
 */
export function generateForecast(trend: TrendPoint[]): ForecastPoint[] {
  if (!trend.length) return [];

  // Sort by time
  const sorted = [...trend].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  const emissions = sorted.map((t) => t.net);
  const timeIdx = sorted.map((_, i) => i);

  // Simple linear regression (least squares)
  const n = emissions.length;
  const sumX = timeIdx.reduce((a, b) => a + b, 0);
  const sumY = emissions.reduce((a, b) => a + b, 0);
  const sumXY = timeIdx.reduce((a, b, i) => a + b * emissions[i], 0);
  const sumX2 = timeIdx.reduce((a, b) => a + b * b, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX || 1);
  const intercept = (sumY - slope * sumX) / n;

  // Forecast for next 6 periods (e.g., months, weeks depending on input granularity)
  const horizon = 6;
  const forecasts: ForecastPoint[] = [];

  for (let i = 1; i <= horizon; i++) {
    const x = n + i;
    const net = slope * x + intercept;

    forecasts.push({
      time: new Date(
        new Date(sorted[sorted.length - 1].time).getTime() + i * 24 * 60 * 60 * 1000
      ).toISOString(), // daily steps — adjust granularity as needed
      emissions: Math.max(0, net), // ensure non-negative
      savings: 0, // can extend to savings forecast separately
      net: Math.max(0, net),
    });
  }

  return forecasts;
}
