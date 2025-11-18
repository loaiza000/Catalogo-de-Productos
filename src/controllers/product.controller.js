import { getDB } from "../database.js";
import { handleError } from "../helpers/errorHandler.js";
import { response } from "../helpers/response.js";

const productosController = {}

productosController.getProducts = async (req, res) => {
  try {
    const db = getDB();
    const products = await db.all('SELECT * FROM products');
    response(res, 200, true, products, "Lista de productos");
  } catch (error) {
    return handleError(res, error);
  }
};

productosController.createProduct = async (req, res) => {
  try {
    const { name, sku, price, stock = 0 } = req.body;
    const db = getDB();

    if (!name || !sku) {
      return response(res, 400, false, "", "Nombre y SKU son obligatorios");
    }
    
    if (price === undefined || price === null || isNaN(price)) {
      return response(res, 400, false, "", "El precio es obligatorio y debe ser un número válido");
    }
    
    if (price < 0) {
      return response(res, 400, false, "", "El precio no puede ser negativo");
    }
    
    if (isNaN(stock) || !Number.isInteger(Number(stock))) {
      return response(res, 400, false, "", "El stock debe ser un número entero válido");
    }
    
    if (stock < 0) {
      return response(res, 400, false, "", "El stock no puede ser negativo");
    }
  
    const existingProduct = await db.get('SELECT * FROM products WHERE sku = ?', [sku]);
    if (existingProduct) {
      return response(res, 400, false, "", "El SKU ya existe");
    }

    const result = await db.run(
      'INSERT INTO products (name, sku, price, stock, status) VALUES (?, ?, ?, ?, ?)',
      [name, sku, price, stock, stock > 0 ? 'active' : 'inactive']
    );

    const newProduct = await db.get('SELECT * FROM products WHERE id = ?', [result.lastID]);
    
    response(res, 201, true, newProduct, "Producto creado exitosamente");
  } catch (error) {
    return handleError(res, error);
  }
};

productosController.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const db = getDB();
    
    if (stock === undefined || stock === null || isNaN(stock)) {
      return response(res, 400, false, "", "El stock es obligatorio y debe ser un número válido");
    }
    
    if (!Number.isInteger(Number(stock))) {
      return response(res, 400, false, "", "El stock debe ser un número entero");
    }
    
    if (stock < 0) {
      return response(res, 400, false, "", "El stock no puede ser negativo");
    }

    const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      return response(res, 404, false, "", "Producto no encontrado");
    }

    const status = stock > 0 ? 'active' : 'inactive';
    await db.run(
      'UPDATE products SET stock = ?, status = ? WHERE id = ?',
      [stock, status, id]
    );

    const updatedProduct = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    
    response(res, 200, true, updatedProduct, "Stock actualizado exitosamente");
  } catch (error) {
    return handleError(res, error);
  }
};

productosController.reindexProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      return response(res, 404, false, "", "Producto no encontrado");
    }

    setTimeout(async () => {
      try {
        console.log(`Reindexando producto con ID: ${id}`);
      } catch (error) {
        console.error(`Error en la reindexación del producto ${id}:`, error);
      }
    }, 2000);

    return response(res, 200, true, "", "Reindexación en proceso");
  } catch (error) {
    return handleError(res, error);
  }
};

export default productosController;
