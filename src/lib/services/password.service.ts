const API_URL = import.meta.env.API_URL || "http://localhost:3000";

export const getCategoryPasswords = async (
  eventId: string,
  categoryId: string
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const response = await fetch(
    `${API_URL}/passwords?eventId=${eventId}&categoryId=${categoryId}`,
    { method: "GET", headers }
  );

  if (!response.ok) {
    throw new Error("Erro ao carregar senhas da categoria");
  }

  return response.json();
};
