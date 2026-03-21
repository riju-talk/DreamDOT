export interface AnalyticsData {
  impressions: number[];
  reach: number;
  engagement: number;
  monetization: {
    total: number;
    pending: number;
    history: { date: string; amount: number }[];
  };
  demographics: { label: string; value: number }[];
  topArtifacts: { id: string; title: string; views: number; change: number }[];
}

export const MOCK_ANALYTICS: AnalyticsData = {
  impressions: [120, 450, 300, 800, 600, 1200, 950, 1500, 1100, 1800, 2200, 1900],
  reach: 12450,
  engagement: 8.4,
  monetization: {
    total: 3450.75,
    pending: 120.50,
    history: [
      { date: "2026-03-15", amount: 45.20 },
      { date: "2026-03-16", amount: 12.00 },
      { date: "2026-03-17", amount: 89.40 },
      { date: "2026-03-18", amount: 33.10 },
      { date: "2026-03-19", amount: 156.00 },
      { date: "2026-03-20", amount: 42.00 },
      { date: "2026-03-21", amount: 78.50 },
    ]
  },
  demographics: [
    { label: "Digital Artists", value: 45 },
    { label: "Collectors", value: 25 },
    { label: "Visionaries", value: 20 },
    { label: "Curators", value: 10 },
  ],
  topArtifacts: [
    { id: "1", title: "Synthwave Explorations", views: 2450, change: 12 },
    { id: "3", title: "Neon Nights", views: 1800, change: 8 },
    { id: "4", title: "Abstract Fluids", views: 1200, change: -2 },
  ]
};

export const generateSparkline = (data: number[], width = 100, height = 30) => {
  if (data.length < 2) return "";
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const step = width / (data.length - 1);
  
  return data.map((val, i) => {
    const x = i * step;
    const y = height - ((val - min) / range) * height;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(" ");
};
