// Script para crear citas de prueba
const API_URL = "http://localhost:4000/api";
const DOCTOR_ID = 1;

async function createTestAppointments() {
  try {
    console.log("Creando citas de prueba para doctor", DOCTOR_ID, "...");

    const response = await fetch(`${API_URL}/doctors/${DOCTOR_ID}/test-appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Error:", response.status, error);
      return;
    }

    const data = await response.json();
    console.log("✅ Citas de prueba creadas:", data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

createTestAppointments();
