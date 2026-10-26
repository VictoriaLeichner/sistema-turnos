# Sistema de Turnos

Aplicación desarrollada con Node.js para administrar servicios de un centro de belleza, spa y peluquería. Los servicios se almacenan en un archivo JSON.

## Instalación y ejecución

**1. Clonar el repositorio**

```bash
git clone https://github.com/VictoriaLeichner/sistema-turnos.git
```

**2. Ingresar a la carpeta del proyecto**

```bash
cd sistema-turnos
```

**3. Instalar las dependencias**

```bash
npm install
```

**4. Configurar las variables de entorno**

Crear un archivo `.env` en la raíz del proyecto y completar las variables indicadas en `.env.example`:

```dotenv
PORT=8080
NODE_ENV=development
```

**5. Ejecutar la aplicación**

```bash
node src/app.js
```

## Métodos disponibles

La clase `ServiceManager` permite:

- `getServices()`: obtener todos los servicios.
- `getServiceById(id)`: buscar un servicio por ID.
- `addService(serviceData)`: agregar un servicio con ID automático.
- `updateService(id, updatedData)`: actualizar un servicio.
- `deleteService(id)`: eliminar un servicio.

## Tecnologías

- Node.js
- JavaScript (ES Modules)
- dotenv
- JSON
