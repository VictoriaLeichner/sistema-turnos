import { readFile, writeFile } from "node:fs/promises";

const REQUIRED_FIELDS = [
  "name",
  "description",
  "duration",
  "price",
  "category",
  "available",
];

export default class ServiceManager {
  constructor(databasePath) {
    this.databasePath = databasePath;
  }

  async #save(services) {
    await writeFile(this.databasePath, JSON.stringify(services, null, 2));
  }

  async getServices(filters = {}) {
    try {
      const data = await readFile(this.databasePath, "utf-8");
      let services = JSON.parse(data);

      const { category, available } = filters;

      if (category) {
        services = services.filter(
          (service) =>
            service.category.toLowerCase() === category.toLowerCase(),
        );
      }

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

  async getServiceById(idService) {
    const data = await this.getServices();

    const service = data.find((service) => service.id === Number(idService));

    return service ?? null;
  }

  async addService(serviceData) {
    for (const field of REQUIRED_FIELDS) {
      if (serviceData[field] === undefined || serviceData[field] === null) {
        const error = new Error(`El campo ${field} es obligatorio.`);
        error.statusCode = 400;
        throw error;
      }
    }

    const data = await this.getServices();

    const newId =
      data.length > 0
        ? Math.max(...data.map((serviceData) => serviceData.id)) + 1
        : 1;

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

  async updateService(idService, updatedServiceData) {
    //Valida campos obligatorios
    for (const field of REQUIRED_FIELDS) {
      if (
        updatedServiceData[field] === undefined ||
        updatedServiceData[field] === null
      ) {
        const error = new Error(`El campo ${field} es obligatorio.`);
        error.statusCode = 400;
        throw error;
      }
    }

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

    const { id: ignoredId, ...dataToUpdate } = updatedServiceData;

    services[index] = {
      id: services[index].id,
      ...dataToUpdate,
    };

    await this.#save(services);

    return {
      payload: services[index],
      status: "Ok",
    };
  }

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
