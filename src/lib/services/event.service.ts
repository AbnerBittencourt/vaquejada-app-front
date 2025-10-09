import { CreateEventDto } from "@/types/dtos/event.dto";
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

export async function createEvent(eventData: CreateEventDto) {
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

export async function getEventById(eventId: string) {
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Erro ao obter evento");
  }
  return await response.json();
}

export async function getEventCategories(eventId: string, token: string) {
  const response = await fetch(
    `${API_URL}/event-categories?eventId=${eventId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao obter categorias do evento");
  }

  return await response.json();
}

export async function updateEvent(
  eventId: string,
  eventData: Partial<CreateEventDto>,
  token: string
) {
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar evento");
  }

  return await response.json();
}

export async function createEventCategory(
  eventCategoryData: {
    eventId: string;
    categoryId: string;
    price: number;
    passwordLimit: number;
    startAt: string;
    endAt: string;
    maxRunners: number;
  },
  token: string
) {
  const response = await fetch(`${API_URL}/event-categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventCategoryData),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar categoria do evento");
  }

  return await response.json();
}

export async function updateEventCategory(
  eventCategoryId: string,
  eventCategoryData: Partial<{
    eventId: string;
    categoryId: string;
    passwordLimit: number;
    price: number;
    startAt: string;
    endAt: string;
    maxRunners: number;
  }>,
  token: string
) {
  const response = await fetch(
    `${API_URL}/event-categories/${eventCategoryId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventCategoryData),
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao atualizar categoria do evento");
  }

  return await response.json();
}

export async function deleteEventCategory(
  eventId: string,
  eventCategoryId: string
) {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_URL}/event-categories/${eventCategoryId}/${eventId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
