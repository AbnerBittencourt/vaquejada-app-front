const API_URL = import.meta.env.API_URL || "http://localhost:3000";

export async function listSubscriptions() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/subscriptions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao listar eventos");
  }
  return await response.json();
}
