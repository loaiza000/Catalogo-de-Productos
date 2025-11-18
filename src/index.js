import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database.js";
import productoRouter from "./routes/product.routes.js";

dotenv.config();

const app = express();

app.set("port", process.env.PORT);
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/products", productoRouter);

app.get("/", (req, res) => {
  res.json({ message: "API de catálogo de productos" });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(app.get("port"), () => {
      console.log(`servidor corriendo en puerto ${app.get("port")}`);
    });
  } catch (error) {
    console.error("error al iniciar servidor:", error);
    process.exit(1);
  }
};

startServer();