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

  async getServices() {
    try {
      const data = await readFile(this.databasePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      throw new Error(
        `No se pudieron obtener los servicios: ${error.message}`,
      );
    }
  }

  async getServiceById(idService) {
    const data = await this.getServices();
    return data.find((service) => service.id === Number(idService)) ?? null;
  }

  async addService(serviceData) {
    // Validar que estén presentes todos los campos obligatorios
    for (const field of REQUIRED_FIELDS) {
      if (serviceData[field] === undefined || serviceData[field] === null) {
        throw new Error(`El campo ${field} es obligatorio.`);
      }
    }

    // Obtener los servicios existentes
    const data = await this.getServices();

    // Generar automáticamente el próximo ID
    const id =
      data.length > 0
        ? Math.max(...data.map((service) => service.id)) + 1
        : 1;

    // Crear el nuevo servicio sin permitir que se imponga un ID externo
    const { id: ignoredId, ...serviceFields } = serviceData;
    const newService = { id, ...serviceFields };

    data.push(newService);
    await this.#save(data);

    return { payload: newService, status: "Ok" };
  }

  async updateService(idService, updatedServiceData) {
    const services = await this.getServices();

    const index = services.findIndex(
      (service) => service.id === Number(idService),
    );

    if (index === -1) {
      return { payload: null, status: "NotOk" };
    }

    const { id, ...dataToUpdate } = updatedServiceData;

    services[index] = {
      ...services[index],
      ...dataToUpdate,
    };

    await this.#save(services);

    return { payload: services[index], status: "ok" };
  }

  async deleteService(idService) {
    const data = await this.getServices();
    const id = Number(idService);
    const filteredData = data.filter((service) => service.id !== id);

    if (data.length === filteredData.length) {
      return {
        payload: idService,
        status: "NotOk",
        message: "El servicio no existe.",
      };
    }

    await this.#save(filteredData);

    return {
      payload: idService,
      status: "Ok",
      message: "Servicio eliminado correctamente.",
    };
  }
}