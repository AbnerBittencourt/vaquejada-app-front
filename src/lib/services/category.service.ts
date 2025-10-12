import { api } from "@/api/api-connection";
import { CreateCategoryResponse } from "@/types/api";

// Listar categorias
export async function listCategories() {
  const response = await api.get("/categories");
  return response.data;
}

// Criar categoria
export async function createCategory(data: Partial<CreateCategoryResponse>) {
  const response = await api.post("/categories", data);
  return response.data;
}

// Buscar categoria por ID
export async function getCategoryById(categoryId: string) {
  const response = await api.get(`/categories/${categoryId}`);
  return response.data;
}

// Atualizar categoria
export async function updateCategory(
  categoryId: string,
  data: Partial<CreateCategoryResponse>
) {
  const response = await api.put(`/categories/${categoryId}`, data);
  return response.data;
}

// Deletar categoria
export async function deleteCategory(categoryId: string) {
  const response = await api.delete(`/categories/${categoryId}`);
  return response.data;
}
