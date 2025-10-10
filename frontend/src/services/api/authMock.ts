import { mockUsers, addMockUser } from "../mockDb";

export async function mockLogin(email: string, password: string) {
  await new Promise((res) => setTimeout(res, 500));
  const user = mockUsers.find((u) => u.email === email && u.password === password);
  if (user) {
    return { success: true, user };
  }
  return { success: false, error: "Credenciales incorrectas" };
}

export async function mockRegister(email: string, password: string, name: string) {
  await new Promise((res) => setTimeout(res, 500));
  const exists = mockUsers.some((u) => u.email === email);
  if (exists) {
    return { success: false, error: "El usuario ya existe" };
  }
  // Simula push en la "DB" mock
  const newUser = { id: Date.now(), email, password, name };
  addMockUser(newUser);
  return { success: true, user: newUser };
}
