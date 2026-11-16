
import express from "express";
import RoutingDetector from "./middlewares/routingDetector.middleware.js";
import serviceRouter from "./routes/services.router.js";
import bookingRouter from "./routes/bookings.router.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(RoutingDetector);

// Ruta principal
app.get("/", (req, res) => {
  res.json({ mensaje: "Index" });
});

// Rutas de la API
app.use("/api/services", serviceRouter);
app.use("/api/bookings", bookingRouter);

export default app;
