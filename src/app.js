import app from "./server.js";
import env from "./config/env.config.js";

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});