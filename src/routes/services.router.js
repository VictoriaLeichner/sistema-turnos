
import { Router } from "express";
import ServiceManager from "../managers/ServiceManager.js";

const router = Router();

const serviceManager = new ServiceManager("./src/data/services.json");

// GET /api/services
router.get("/", async (req, res) => {
  try {
    const filters = req.query;

    const services = await serviceManager.getServices(filters);

    res.status(200).json({
      message: "Servicios obtenidos correctamente",
      payload: services,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los servicios",
      error: error.message,
    });
  }
});

// GET /api/services/:id
router.get("/:sid", async (req, res) => {
  try {
    const idService = req.params.sid;

    const result = await serviceManager.getServiceById(idService);

    if (!result) {
      return res.status(404).json({
        message: "Servicio no encontrado",
        payload: null,
      });
    }

    res.status(200).json({
      message: "Servicio encontrado",
      payload: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el servicio",
      error: error.message,
    });
  }
});

// POST /api/services
router.post("/", async (req, res) => {
  try {
    const serviceData = req.body;

    const result = await serviceManager.addService(serviceData);

    res.status(201).json({
      message: "Servicio creado correctamente",
      payload: result.payload,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
});

// PUT /api/services/:id
router.put("/:sid", async (req, res) => {
  try {
    const idService = req.params.sid;
    const updatedServiceData = req.body;

    const result = await serviceManager.updateService(
      idService,
      updatedServiceData
    );

    if (result.status === "NotOk") {
      return res.status(404).json({
        message: "Servicio no encontrado",
        payload: null,
      });
    }

    res.status(200).json({
      message: "Servicio actualizado correctamente",
      payload: result.payload,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
});

// DELETE /api/services/:id
router.delete("/:sid", async (req, res) => {
  try {
    const idService = req.params.sid;

    const result = await serviceManager.deleteService(idService);

    if (result.status === "NotOk") {
      return res.status(404).json({
        message: "Servicio no encontrado",
        payload: null,
      });
    }

    res.status(200).json({
      message: result.message,
      payload: result.payload,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el servicio",
      error: error.message,
    });
  }
});

export default router;
