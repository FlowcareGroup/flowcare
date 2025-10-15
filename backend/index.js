import express from "express";
import usersRouter from "./example/routers/users.routing.js";
import patientsRouter from "./src/routers/patients.routing.js";
import clinicsRouter from "./src/routers/clinics.routing.js";

import { getOrCreateUser } from "./src/controllers/patients.controller.js";

// import  prisma  from "./.lib/prisma.js";
const app = express();

app.use(express.json());
// BD de prueba 
app.use("/api/users", usersRouter);

// Rutas de la aplicación

app.use("/api/patients", patientsRouter);
app.use("/api/clinics", clinicsRouter);
app.get("/api/get-or-create-user", getOrCreateUser);

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
