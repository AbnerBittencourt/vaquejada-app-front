import { EventStatusEnum } from "@/types/enums/api-enums";

const API_URL = import.meta.env.API_URL || "http://localhost:3000";

export async function listEvents() {
  const response = await fetch(`${API_URL}/events`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Erro ao listar eventos");
  }
  return await response.json();
}

export async function createEvent(eventData: {
  name: string;
  startAt: string;
  endAt: string;
  purchaseClosedAt: string;
  status: EventStatusEnum;
  address?: string;
  city?: string;
  state?: string;
  description: string;
  bannerUrl?: string;
  isPublic: boolean;
  organizerId: string;
}) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar evento");
  }
  return await response.json();
}
