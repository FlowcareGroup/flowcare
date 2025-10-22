import { LoginCredentials, SignUpData } from "@/types";

// If you need the patients API URL, use the following:
const API_PATIENTS_URL = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/patients`
  : "http://localhost:4000/api/patients";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000/api";

export const login = async (credentials: LoginCredentials) => {
  try {
    console.log("🔗 Conectando a:", `${API_PATIENTS_URL}/login`);

    const response = await fetch(`${API_PATIENTS_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error HTTP:", response.status, errorText);
      throw new Error(`Error ${response.status}: ${errorText || "Error de autenticación"}`);
    }

    const data = await response.json();
    console.log("✅ Login exitoso, datos:", data);

    return data; // { user: {...}, accessToken: "..." }
  } catch (error: any) {
    console.error("💥 Error en login:", error);
    throw error; // Propagar el error
  }
};

export const getOrCreateUser = async (email: string, name: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/get-or-create-user?email=${email}&name=${name}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
      },
      ...data,
    };
  } catch (error) {
    console.error("Error en getOrCreateUser:", error);
    return {
      user: null,
      error: error instanceof Error ? error.message : "Error en getOrCreateUser",
    };
  }
};

export const signUp = async (userData: SignUpData) => {
  try {
    const response = await fetch(`${API_PATIENTS_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return { ...data };
  } catch (error) {
    console.error("Error en registro:", error);
    return { user: null, error: "Error en registro" };
  }
};
