
import { readFile, writeFile } from "node:fs/promises";

export default class ServiceManager {
  constructor(databasePath) {
    this.databasePath = databasePath;
  }

  // Guarda los servicios actualizados en el archivo JSON.
  async #save(services) {
    await writeFile(this.databasePath, JSON.stringify(services, null, 2));
  }

  // Obtiene los servicios y aplica los filtros recibidos.
  async getServices(filters = {}) {
    try {
      const data = await readFile(this.databasePath, "utf-8");
      let services = JSON.parse(data);

      const { category, available } = filters;

      // Filtrar por categoría.
      if (category) {
        services = services.filter(
          (service) =>
            service.category.toLowerCase() === category.toLowerCase(),
        );
      }

      // Filtrar por disponibilidad.
      if (available !== undefined) {
        services = services.filter(
          (service) => service.available === (available === "true"),
        );
      }

      return services;
    } catch (error) {
      throw new Error(`No se pudieron obtener los servicios: ${error.message}`);
    }
  }

  // Busca un servicio por su ID.
  async getServiceById(idService) {
    const data = await this.getServices();

    const service = data.find((service) => service.id === Number(idService));

    return service ?? null;
  }

  // Agrega un servicio nuevo con un ID generado automáticamente.
  async addService(serviceData) {
    const data = await this.getServices();

    const newId =
      data.length > 0
        ? Math.max(...data.map((serviceData) => serviceData.id)) + 1
        : 1;

    // Evitar que se utilice un ID enviado desde el body.
    const { id: ignoredId, ...serviceFields } = serviceData;

    const newService = {
      id: newId,
      ...serviceFields,
    };

    data.push(newService);

    await this.#save(data);

    return {
      payload: newService,
      status: "Ok",
    };
  }

  // Actualiza los datos de un servicio existente.
  async updateService(idService, updatedServiceData) {
    const services = await this.getServices();

    const index = services.findIndex(
      (service) => service.id === Number(idService),
    );

    if (index === -1) {
      return {
        payload: null,
        status: "NotOk",
      };
    }

    // Evitar que se modifique el ID del servicio.
    const { id: ignoredId, ...dataToUpdate } = updatedServiceData;

    // Mantener los datos anteriores y reemplazar solo los recibidos.
    services[index] = {
      ...services[index],
      ...dataToUpdate,
    };

    await this.#save(services);

    return {
      payload: services[index],
      status: "Ok",
    };
  }

  // Elimina un servicio del archivo JSON.
  async deleteService(idService) {
    const data = await this.getServices();
    const id = Number(idService);

    const filteredData = data.filter((service) => service.id !== id);

    if (data.length === filteredData.length) {
      return {
        payload: null,
        status: "NotOk",
        message: "El servicio no existe.",
      };
    }

    await this.#save(filteredData);

    return {
      payload: id,
      status: "Ok",
      message: "Servicio eliminado correctamente.",
    };
  }
}
