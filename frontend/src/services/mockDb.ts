export let mockUsers = [
  {
    id: 1,
    email: "demo@flowcare.com",
    password: "Demo1234", // En producción, nunca guardes contraseñas en texto plano
    name: "Demo User",
  },
];

// Simula un push (insert) en la "DB" mock
export function addMockUser(user: { id: number; email: string; password: string; name: string }) {
  mockUsers.push(user);
}
