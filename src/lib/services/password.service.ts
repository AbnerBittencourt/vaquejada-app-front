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

export const purchasePasswords = async (data: {
  eventId: string;
  categoryId: string;
  passwordIds: string[];
}) => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${API_URL}/passwords/purchase`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao processar compra");
  }

  return response.json();
};
