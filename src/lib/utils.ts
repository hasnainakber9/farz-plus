import { clsx, type ClassValue } from "clsx";
import type { CareScoreLabel } from "./types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function careScoreLabel(score: number): CareScoreLabel {
  if (score >= 85) return "Stable";
  if (score >= 70) return "Watch";
  if (score >= 50) return "Needs Attention";
  return "High Risk";
}

export function whatsappLink(message: string) {
  const phone = process.env.NEXT_PUBLIC_FARZ_WHATSAPP ?? "923001234567";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const brand = {
  black: "#050410",
  navy: "#0B1B6A",
  signalBlue: "#0E4B82",
  careTeal: "#126379",
  green: "#4CD364",
  trustGreen: "#269F66",
  mint: "#A0E7B4",
  emergency: "#FF4D5A",
  warning: "#FFC857",
  info: "#43B0C1",
};
