import request from "supertest";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "../database.js";
import productoRouter from "../routes/product.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/products", productoRouter);

const API_KEY = process.env.API_KEY;

beforeAll(async () => {
  await connectDB();
});

describe("API de Productos", () => {
  test("GET /products - debería retornar lista de productos", async () => {
    const response = await request(app).get("/products");
    
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("POST /products - debería crear un producto con API key válida", async () => {
    const nuevoProducto = {
      name: "Producto Test",
      sku: `TEST-${Date.now()}`,
      price: 15.99,
      stock: 10,
    };

    const response = await request(app)
      .post("/products")
      .set("x-api-key", API_KEY)
      .send(nuevoProducto);

    expect(response.status).toBe(201);
    expect(response.body.ok).toBe(true);
    expect(response.body.data.name).toBe(nuevoProducto.name);
  });

  test("POST /products - debería fallar sin API key", async () => {
    const nuevoProducto = {
      name: "Producto Sin Auth",
      sku: "SIN-AUTH-001",
      price: 10,
      stock: 5,
    };

    const response = await request(app).post("/products").send(nuevoProducto);

    expect(response.status).toBe(401);
    expect(response.body.ok).toBe(false);
  });

  test("POST /products - debería validar campos obligatorios", async () => {
    const productoInvalido = {
      price: 10,
      stock: 5,
    };

    const response = await request(app)
      .post("/products")
      .set("x-api-key", API_KEY)
      .send(productoInvalido);

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
  });

  test("PATCH /products/:id/stock - debería actualizar el stock", async () => {
    const response = await request(app)
      .patch("/products/1/stock")
      .set("x-api-key", API_KEY)
      .send({ stock: 100 });

    expect([200, 404]).toContain(response.status);
  });

  test("POST /products/:id/reindex - debería retornar 202", async () => {
    const response = await request(app)
      .post("/products/1/reindex")
      .set("x-api-key", API_KEY);

    expect([202, 404]).toContain(response.status);
  });
});
