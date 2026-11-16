
import { Router } from "express";
import BookingManager from "../managers/BookingManager.js";
import { validateBooking } from "../middlewares/validateBooking.middleware.js";

const router = Router();

const bookingManager = new BookingManager(
  "./src/data/bookings.json",
  "./src/data/services.json",
);

// Crear una reserva.
router.post("/", validateBooking, async (req, res) => {
  try {
    const result = await bookingManager.createBooking(req.body);

    res.status(201).json({
      status: "Ok",
      message: "Reserva creada correctamente",
      payload: result.payload,
    });
  } catch (error) {
    res.status(500).json({
      status: "NotOk",
      message: error.message,
    });
  }
});

// Obtener una reserva por su ID.
router.get("/:bid", async (req, res) => {
  try {
    const booking = await bookingManager.getBookingById(req.params.bid);

    if (!booking) {
      return res.status(404).json({
        status: "NotOk",
        message: "Reserva no encontrada",
        payload: null,
      });
    }

    res.status(200).json({
      status: "Ok",
      message: "Reserva encontrada",
      payload: booking,
    });
  } catch (error) {
    res.status(500).json({
      status: "NotOk",
      message: error.message,
    });
  }
});

// Agregar un servicio a una reserva.
router.post("/:bid/services/:sid", async (req, res) => {
  const { bid, sid } = req.params;

  try {
    const result = await bookingManager.addServiceToBooking(bid, sid);

    if (result.status === "NotOk") {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      status: "NotOk",
      message: error.message,
    });
  }
});

export default router;
