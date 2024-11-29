import express from "express";
const app = express();

import userRouter from "./routes/user.routes.js";
import managerRouter from "./routes/manager.router.js";
import adminRouter from "./routes/admin.router.js";

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use("/users", userRouter);
app.use("/managers", managerRouter);
app.use("/admins", adminRouter);

export { app };