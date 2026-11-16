
import { readFile, writeFile } from "node:fs/promises";
import ServiceManager from "./ServiceManager.js";

export default class BookingManager {
  constructor(databasePath, servicesPath) {
    this.databasePath = databasePath;
    this.servicesManager = new ServiceManager(servicesPath);
  }

  // Guarda las reservas en el archivo JSON.
  async #save(bookings) {
    await writeFile(this.databasePath, JSON.stringify(bookings, null, 2));
  }

  // Obtiene todas las reservas guardadas.
  async getBookings() {
    try {
      const data = await readFile(this.databasePath, "utf-8");
      const bookings = JSON.parse(data);
      return bookings;
    } catch (error) {
      throw new Error(`No se pudieron obtener las reservas: ${error.message}`);
    }
  }

  // Busca una reserva por su ID.
  async getBookingById(idBooking) {
    const data = await this.getBookings();

    const booking = data.find(
      (booking) => booking.id === Number(idBooking)
    );

    return booking ?? null;
  }

  // Crea una reserva nueva y le asigna un ID.
  async createBooking(bookingData) {
    const data = await this.getBookings();

    const newId =
      data.length > 0
        ? Math.max(...data.map((booking) => booking.id)) + 1
        : 1;

    const newBooking = {
      id: newId,
      clientName: bookingData.clientName.trim(),
      clientEmail: bookingData.clientEmail.trim(),
      date: bookingData.date.trim(),
      time: bookingData.time.trim(),
      status: "pending",
      services: [],
    };

    data.push(newBooking);

    await this.#save(data);

    return {
      payload: newBooking,
      status: "Ok",
    };
  }

  // Agrega un servicio a una reserva existente.
  
// Agrega un servicio a una reserva existente.
async addServiceToBooking(idBooking, idService) {
  const bookings = await this.getBookings();

  const booking = bookings.find(
    (booking) => booking.id === Number(idBooking)
  );

  if (!booking) {
    return {
      payload: null,
      status: "NotOk",
      message: "Reserva no encontrada",
    };
  }

  // Verificar que el servicio exista.
  const service = await this.servicesManager.getServiceById(idService);

  if (!service) {
    return {
      payload: null,
      status: "NotOk",
      message: "Servicio no encontrado",
    };
  }

  // Si el servicio ya está agregado, incrementar su cantidad.
  const existingService = booking.services.find(
    (item) => item.service === Number(idService)
  );

  if (existingService) {
    existingService.quantity += 1;
  } else {
    booking.services.push({
      service: Number(idService),
      quantity: 1,
    });
  }

  await this.#save(bookings);

  return {
    payload: booking,
    status: "Ok",
    message: "Servicio agregado a la reserva correctamente",
  };
}
}
