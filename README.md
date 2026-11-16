# Sistema de Turnos

API REST desarrollada con Node.js y Express para gestionar los servicios y las reservas de un centro de belleza, spa y peluquería.

El proyecto permite consultar, crear, actualizar y eliminar servicios, así como crear reservas y agregarles servicios. La información se almacena en archivos JSON mediante FileSystem, por lo que los datos se conservan al reiniciar el servidor.

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

## Persistencia de datos

La información se almacena en dos archivos JSON ubicados en `src/data/`:

- `services.json`: contiene los servicios disponibles.
- `bookings.json`: contiene las reservas creadas.

Los datos se leen y actualizan mediante FileSystem, utilizando las operaciones de lectura y escritura de archivos de Node.js.

## Recurso Services

Cada servicio contiene los siguientes campos:

| Campo | Descripción |
|---|---|
| `id` | Identificador generado automáticamente. |
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

### Endpoints de Services

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

Todos los campos son obligatorios. El sistema genera automáticamente el ID del nuevo servicio.

### Ejemplo de actualización (PUT)

Body en formato JSON:

```json
{
  "price": 18000
}
```

La actualización permite enviar solamente los campos que se desean modificar. Los demás datos del servicio se conservan y el ID no puede modificarse.

## Recurso Bookings

Cada reserva contiene los siguientes campos:

| Campo | Descripción |
|---|---|
| `id` | Identificador generado automáticamente. |
| `clientName` | Nombre del cliente. |
| `clientEmail` | Correo electrónico del cliente. |
| `date` | Fecha de la reserva. |
| `time` | Horario de la reserva. |
| `status` | Estado de la reserva. |
| `services` | Array de servicios asociados a la reserva. |

Ejemplo de una reserva:

```json
{
  "id": 1,
  "clientName": "Victoria",
  "clientEmail": "victoria@gmail.com",
  "date": "2026-11-20",
  "time": "15:30",
  "status": "pending",
  "services": []
}
```

El ID se genera automáticamente. Al crear una reserva, el array `services` comienza vacío y el estado inicial es `pending`.

### Endpoints de Bookings

Ruta base: `/api/bookings`

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/bookings` | Crear una reserva. |
| GET | `/api/bookings/:bid` | Obtener una reserva por ID. |
| POST | `/api/bookings/:bid/services/:sid` | Agregar un servicio a una reserva. |

### Ejemplo de creación (POST)

Body en formato JSON:

```json
{
  "clientName": "Victoria",
  "clientEmail": "victoria@gmail.com",
  "date": "2026-11-20",
  "time": "15:30"
}
```

Los campos `clientName`, `clientEmail`, `date` y `time` son obligatorios. El sistema genera automáticamente el ID, establece el estado inicial y crea la reserva con el array de servicios vacío.

### Agregar un servicio a una reserva

Para agregar un servicio se utiliza la siguiente ruta:

`POST /api/bookings/:bid/services/:sid`

- `bid`: identificador de la reserva.
- `sid`: identificador del servicio existente que se desea agregar.

Los servicios se almacenan dentro de la reserva mediante su ID y una cantidad.

Ejemplo:

```json
{
  "services": [
    {
      "service": 1,
      "quantity": 1
    }
  ]
}
```

Si se agrega nuevamente un servicio que ya está asociado a la reserva, se incrementa su cantidad en lugar de crear otro elemento.

## Códigos de respuesta HTTP

- `200`: operación exitosa.
- `201`: recurso creado correctamente.
- `400`: faltan campos obligatorios o no se proporcionaron campos para actualizar.
- `404`: servicio o reserva no encontrados.
- `500`: error interno del servidor.

## Managers

### ServiceManager

Centraliza la lógica de gestión y persistencia de los servicios en `services.json`.

Sus métodos son:

- `getServices(filters)`: obtiene los servicios y permite aplicar filtros.
- `getServiceById(id)`: busca un servicio por su identificador.
- `addService(serviceData)`: crea un servicio y genera su ID automáticamente.
- `updateService(id, updatedServiceData)`: actualiza los campos recibidos sin modificar el ID.
- `deleteService(id)`: elimina un servicio.

### BookingManager

Centraliza la lógica de gestión y persistencia de las reservas en `bookings.json`.

Sus métodos son:

- `createBooking(bookingData)`: crea una reserva y genera su ID automáticamente.
- `getBookingById(id)`: busca una reserva por su identificador.
- `addServiceToBooking(idBooking, idService)`: agrega un servicio existente a una reserva e incrementa su cantidad si ya estaba asociado.

## Tecnologías

- Node.js
- Express
- JavaScript (ES Modules)
- dotenv
- FileSystem (`node:fs/promises`)
- JSON