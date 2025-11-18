import { connectDB, getDB } from "./database.js";

const seedData = async () => {
  try {
    await connectDB();
    const db = getDB();

    const productos = [
      { name: "Taza Cerámica", sku: "TAZ-001", price: 9.99, stock: 50 },
      { name: "Camisa Negra", sku: "CAM-NEG-002", price: 19.99, stock: 15 },
      { name: "Cuaderno A5", sku: "CUE-A5-003", price: 4.5, stock: 0 },
    ];

    for (const producto of productos) {
      const existe = await db.get("SELECT * FROM products WHERE sku = ?", [
        producto.sku,
      ]);

      if (!existe) {
        await db.run(
          "INSERT INTO products (name, sku, price, stock, status) VALUES (?, ?, ?, ?, ?)",
          [
            producto.name,
            producto.sku,
            producto.price,
            producto.stock,
            producto.stock > 0 ? "active" : "inactive",
          ]
        );
        console.log(`producto ${producto.name} agregado`);
      } else {
        console.log(`producto ${producto.name} ya existe`);
      }
    }

    console.log("datos de ejemplo cargados");
    process.exit(0);
  } catch (error) {
    console.error("error al cargar datos:", error);
    process.exit(1);
  }
};

seedData();
