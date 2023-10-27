import express from "express";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import databseConn from "./config/database.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

databseConn();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoute);
app.get("/", (req, res) => res.send("Server is ready"));

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.SERVER_PORT, () => console.log("Server up and running"));
