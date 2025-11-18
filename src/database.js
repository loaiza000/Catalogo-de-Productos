import sqlite3 from "sqlite3";
import { open } from "sqlite";

sqlite3.verbose();

let db = null;

export async function connectDB() {
  try {
    db = await open({
      filename: "./database.sqlite",
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        sku TEXT UNIQUE NOT NULL,
        price REAL NOT NULL CHECK (price >= 0),
        stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
      )
    `);

    console.log("conexión a sqlite establecida correctamente");
    return db;
  } catch (error) {
    console.error("error al conectar a la base de datos:", error);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) {
    throw new Error("la base de datos no ha sido inicializada");
  }
  return db;
}
