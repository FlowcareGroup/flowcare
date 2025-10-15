import { LoginCredentials, SignUpData } from "@/types/auth.types";

// If you need the patients API URL, use the following:
const API_PATIENTS_URL = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/patients`
  : "http://localhost:4000/api/patients";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000/api";

export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await fetch(`${API_PATIENTS_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    console.log(data);
    const user = data.user;
    const accessToken = data.accessToken;
    //const refreshToken = data.refresh_token;
    return { user, accessToken };
  } catch (error) {
    console.error("Error en login:", error);
    return { user: null, error: "Error en login" };
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

export const register = async (userData: SignUpData) => {
  try {
    const response = await fetch(`${API_PATIENTS_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return { user: data.user, ...data };
  } catch (error) {
    console.error("Error en registro:", error);
    return { user: null, error: "Error en registro" };
  }
};
