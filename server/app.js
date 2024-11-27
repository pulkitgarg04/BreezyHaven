import express from "express";
const app = express();

import userRouter from "./routes/user.routes.js";

app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

app.use("/users", userRouter);

export { app };