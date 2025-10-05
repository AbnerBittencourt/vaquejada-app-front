import { CreateFullUser } from "@/types/api";

const API_URL = import.meta.env.API_URL || "http://localhost:3000";

export async function getMe(token: string) {
  return fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createUser(dados: {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
}) {
  return fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: dados.nome,
      email: dados.email,
      password: dados.senha,
      cpf: dados.cpf,
      phone: dados.telefone,
    }),
  });
}

export async function listUsers(token: string) {
  return fetch(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export const createFullUser = async (userData: CreateFullUser) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/users/full`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar usuário");
  }

  return response.json();
};

export const updateUser = async (
  userId: string,
  userData: Partial<CreateFullUser>,
  token: string
) => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar usuário");
  }

  return response.json();
};

export const getUserById = async (userId: string, token: string) => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar usuário");
  }

  return response.json();
};
