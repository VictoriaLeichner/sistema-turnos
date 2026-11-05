# Sistema de Turnos

API REST desarrollada con Node.js y Express para gestionar los servicios de un centro de belleza, spa y peluquería. Permite consultar, filtrar, crear, actualizar y eliminar servicios, cuyos datos se almacenan en un archivo JSON.

## Instalación y ejecución

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/VictoriaLeichner/sistema-turnos.git
   ```

2. Ingresar a la carpeta del proyecto:

   ```bash
   cd sistema-turnos
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

4. Crear un archivo `.env` en la raíz del proyecto y configurar las variables de entorno:

   ```dotenv
   PORT=8080
   NODE_ENV=development
   ```

5. Ejecutar la aplicación:

   ```bash
   node src/app.js
   ```

El servidor estará disponible en `http://localhost:8080`.

## Recurso Services

Cada servicio contiene los siguientes campos:

| Campo | Descripción |
|---|---|
| `id` | Identificador único generado automáticamente. |
| `name` | Nombre del servicio. |
| `description` | Descripción del servicio. |
| `duration` | Duración en minutos. |
| `price` | Precio del servicio. |
| `category` | Categoría del servicio. |
| `available` | Disponibilidad (`true` o `false`). |

Ejemplo:

```json
{
  "id": 1,
  "name": "Manicura tradicional",
  "description": "Limado y esmaltado de uñas",
  "duration": 45,
  "price": 8000,
  "category": "belleza",
  "available": true
}
```

El `id` se genera automáticamente y no debe enviarse al crear un servicio.

Los campos `name`, `description`, `duration`, `price`, `category` y `available` son obligatorios al crear y actualizar un servicio.

## Endpoints

Ruta base: `/api/services`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/services` | Obtener todos los servicios. |
| GET | `/api/services/:sid` | Obtener un servicio por ID. |
| POST | `/api/services` | Crear un servicio. |
| PUT | `/api/services/:sid` | Actualizar un servicio. |
| DELETE | `/api/services/:sid` | Eliminar un servicio. |

### Filtros

El endpoint GET permite filtrar servicios mediante query params:

- `?category=belleza`: filtra por categoría.
- `?available=true`: filtra por disponibilidad.
- `?category=belleza&available=true`: combina ambos filtros.

### Ejemplo de creación (POST)

Body en formato JSON:

```json
{
  "name": "Masaje relajante",
  "description": "Masaje corporal relajante",
  "duration": 60,
  "price": 15000,
  "category": "bienestar",
  "available": true
}
```

El sistema genera automáticamente el ID del nuevo servicio.

### Ejemplo de actualización (PUT)

Body en formato JSON:

```json
{
  "name": "Manicura tradicional",
  "description": "Limado y esmaltado de uñas",
  "duration": 45,
  "price": 9500,
  "category": "belleza",
  "available": false
}
```

La actualización reemplaza los datos del servicio. Se deben enviar todos los campos obligatorios y el ID se conserva sin modificaciones.

### Códigos de respuesta HTTP

- `200`: operación exitosa.
- `201`: recurso creado correctamente.
- `400`: faltan campos obligatorios.
- `404`: servicio no encontrado.
- `500`: error interno del servidor.

## ServiceManager

La clase `ServiceManager` centraliza la lógica de gestión y persistencia de los servicios en el archivo `services.json`.

Sus métodos son:

- `getServices(filters)`: obtiene los servicios y permite aplicar filtros.
- `getServiceById(id)`: busca un servicio por su identificador.
- `addService(serviceData)`: crea un servicio y genera su ID automáticamente.
- `updateService(id, updatedServiceData)`: actualiza un servicio sin modificar su ID.
- `deleteService(id)`: elimina un servicio.

## Tecnologías

- Node.js
- Express
- JavaScript (ES Modules)
- dotenv
- JSON