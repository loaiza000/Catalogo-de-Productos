# API Catalogo de Productos

Una API simple para manejar un catalogo de productos con Node.js y Express

## Clonación del Repositorio

Para clonar este repositorio, utiliza el siguiente comando:

```bash
git clone https://github.com/loaiza000/Catalogo-de-Productos.git
```

## Instalación

Primero instala las dependencias:

```bash
npm install
```

Crea un archivo `.env` en la raíz con:

```
PORT=3000
API_KEY=api_key_privada
```

## Uso

Para iniciar el servidor en desarrollo:

```bash
npm run dev
```

El servidor corre en `http://localhost:3000`

### Cargar datos de ejemplo

Si quieres probar con datos de ejemplo:

```bash
npm run seed
```

Esto carga 3 productos de prueba en la base de datos

## Endpoints

### GET /products
Obtiene todos los productos. No requiere autenticación

```bash
URL http://localhost:3000/products
```

### POST /products
Crea un nuevo producto. Requiere header `x-api-key` con la clave configurada en `.env`

```bash
URL POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${API_KEY}" \
  -d '{"name":"Laptop","sku":"LAP-001","price":899.99,"stock":5}'
```

**Validaciones:**
- `name` y `sku` son obligatorios
- `sku` debe ser único
- `price` debe ser >= 0
- `stock` debe ser >= 0

### PATCH /products/:id/stock
Actualiza el stock de un producto. Requiere header `x-api-key` con la clave configurada en `.env`

```bash
URL PATCH http://localhost:3000/products/1/stock \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${API_KEY}" \
  -d '{"stock":25}'
```

### POST /products/:id/reindex
Simula un trabajo asíncrono de reindexación. Responde con 202 y procesa en background por 2-3 segundos

```bash
URL POST http://localhost:3000/products/1/reindex \
  -H "x-api-key: ${API_KEY}"
```

## Tests

Para correr los tests:

```bash
npm test
```

Los tests verifican:
- Obtener lista de productos
- Crear productos con validaciones
- Autenticación con API key
- Actualización de stock
- Endpoint de reindexación

## Base de datos

Usa SQLite. El archivo `database.sqlite` se crea automáticamente al iniciar el servidor

## Estructura

```
src/
├── controllers/     # Lógica de negocio
├── database.js      # Configuración de SQLite
├── helpers/         # Funciones auxiliares
├── middleware/      # Autenticación
├── routes/          # Rutas de la API
├── tests/           # Tests
└── index.js         # Punto de entrada
```

## Notas

- La API key está configurada en el archivo `.env` para mantenerla privada
- Los productos con stock 0 se marcan como `inactive` automáticamente
- Los logs se muestran en consola con morgan