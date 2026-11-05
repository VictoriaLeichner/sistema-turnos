import { config } from 'dotenv';

// 1. Cargar las variables de entorno desde el archivo .env
config();

// 2. Leer las variables de entorno
const configuracion = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
};

// 3. Validar que las variables requeridas estén configuradas
if (!process.env.PORT) {
  console.error('Error: falta configurar la variable PORT en el archivo .env.');
  process.exit(1);
}

if (!process.env.NODE_ENV) {
  console.error('Error: falta configurar la variable NODE_ENV en el archivo .env.');
  process.exit(1);
}

export default configuracion;
