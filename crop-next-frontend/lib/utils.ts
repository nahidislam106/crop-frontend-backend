import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-c9ek.onrender.com";

export function formatNumber(n: number | null | undefined, decimals = 1): string {
  if (n === null || n === undefined) return "—";
  return n.toFixed(decimals);
}

export function getStatusColor(key: string, value: number): "green" | "yellow" | "red" {
  switch (key) {
    case "temperature":
    case "weather_temperature":
      return value >= 20 && value <= 35 ? "green" : value < 15 || value > 40 ? "red" : "yellow";
    case "humidity":
    case "weather_humidity":
      return value >= 40 && value <= 80 ? "green" : value < 30 || value > 90 ? "red" : "yellow";
    case "ph":
    case "pH":
      return value >= 6 && value <= 7.5 ? "green" : value < 5.5 || value > 8 ? "red" : "yellow";
    case "conductivity":
    case "EC":
      return value >= 0.5 && value <= 2.5 ? "green" : value < 0.3 || value > 3 ? "red" : "yellow";
    case "nitrogen":
    case "N":
    case "phosphorus":
    case "P":
    case "potassium":
    case "K":
      return value > 0 ? "green" : "red";
    default:
      return "green";
  }
}

export const STATUS_STYLES = {
  green:  "bg-green-100  text-green-700  border-green-200",
  yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
  red:    "bg-red-100    text-red-700    border-red-200",
};

export const STATUS_DOT = {
  green:  "bg-green-500",
  yellow: "bg-yellow-500",
  red:    "bg-red-500",
};
