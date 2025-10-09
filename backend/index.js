import express from "express";
import usersRouter from "./example/routers/users.routing.js";
import PatientRouter from "./routers/Patient.Router.js";
// import  prisma  from "./.lib/prisma.js";
const app = express();

app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/patient", PatientRouter);
// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
