import { api } from "@/api/api-connection";
import { CreateFullUser } from "@/types/api";

// Buscar usuário logado
export async function getMe() {
  try {
    const response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao buscar usuário logado");
  }
}

// Criar usuário simples
export async function createUser(dados: {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
}) {
  const response = await api.post("/users", {
    name: dados.nome,
    email: dados.email,
    password: dados.senha,
    cpf: dados.cpf,
    phone: dados.telefone,
  });
  return response.data;
}

// Listar todos os usuários
export async function listUsers() {
  const response = await api.get("/users");
  return response.data;
}

// Criar usuário completo
export const createFullUser = async (userData: CreateFullUser) => {
  const response = await api.post("/users/full", userData);
  return response.data;
};

// Atualizar usuário
export const updateUser = async (
  userId: string,
  userData: Partial<CreateFullUser>
) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

// Buscar usuário por ID
export const getUserById = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};
