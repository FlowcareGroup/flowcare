import { LoginCredentials, SignUpData } from "@/types/auth.types";

const BACKEND_URL = "http://localhost:4000/api/auth";

export const login = async (credentials: LoginCredentials) => {
 try {
     const response = await fetch(`${BACKEND_URL}/login`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(credentials),
     });
     const data = await response.json();
     const user = data.user;
     const accessToken = data.accessToken;
     const refreshToken = data.refreshToken;
     return { user, accessToken, refreshToken };
 } catch (error) {
     console.error("Error en login:", error);
     return { user: null, error: "Error en login" };
 }
};

export const register = async (userData: SignUpData) => {
    try {
        const response = await fetch(`${BACKEND_URL}/register`, {
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