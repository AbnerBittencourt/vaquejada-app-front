const API_URL = import.meta.env.API_URL || "http://localhost:3000";

export async function listCategories(token: string) {
  const response = await fetch(`${API_URL}/categories`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao listar categorias");
  }
  return await response.json();
}
