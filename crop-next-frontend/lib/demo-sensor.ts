export interface SoilReadingLike {
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  temperature?: number;
  humidity?: number;
  ph?: number;
  conductivity?: number;
  timestamp?: number;
}

export const DEMO_SENSOR_DATA_ENABLED = process.env.NEXT_PUBLIC_DEMO_SENSOR_DATA === "true";

function randomBetween(min: number, max: number, decimals = 1): number {
  const value = min + Math.random() * (max - min);
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

type SoilProfile = {
  temperature: [number, number];
  humidity: [number, number];
  ph: [number, number];
  conductivity: [number, number];
};

const DEMO_SOIL_PROFILES: SoilProfile[] = [
  { temperature: [24, 32], humidity: [55, 78], ph: [5.8, 6.8], conductivity: [0.4, 1.2] },
  { temperature: [23, 31], humidity: [60, 85], ph: [5.5, 7.0], conductivity: [0.6, 1.8] },
  { temperature: [25, 35], humidity: [45, 70], ph: [6.0, 7.4], conductivity: [0.3, 1.0] },
];

function getDemoProfile(): SoilProfile {
  const index = Math.floor(Math.random() * DEMO_SOIL_PROFILES.length);
  return DEMO_SOIL_PROFILES[index];
}

export function withDemoSoilReading<T extends SoilReadingLike>(reading: T | null): T | null {
  if (!DEMO_SENSOR_DATA_ENABLED) return reading;

  const profile = getDemoProfile();

  return {
    ...(reading ?? {}),
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
    temperature: randomBetween(profile.temperature[0], profile.temperature[1], 1),
    humidity: randomBetween(profile.humidity[0], profile.humidity[1], 1),
    ph: randomBetween(profile.ph[0], profile.ph[1], 2),
    conductivity: randomBetween(profile.conductivity[0], profile.conductivity[1], 2),
    timestamp: Date.now(),
  } as T;
}