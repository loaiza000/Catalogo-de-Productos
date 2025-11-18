import { Router } from "express";
import productosController from "../controllers/product.controller.js";
import { apiKeyAuth } from "../middleware/auth.middleware.js";

const productoRouter = Router();

productoRouter.get("/", productosController.getProducts);
productoRouter.post("/", apiKeyAuth, productosController.createProduct);
productoRouter.patch("/:id/stock", apiKeyAuth, productosController.updateStock);
productoRouter.post("/:id/reindex", apiKeyAuth, productosController.reindexProduct);

export default productoRouter;
