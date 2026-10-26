import path from 'node:path';
import './config/env.config.js';
import ServiceManager from './managers/ServiceManager.js';

const DATABASE_NAME = 'services.json';
const DATABASE_PATH = path.join(import.meta.dirname, "data", DATABASE_NAME);

const manager = new ServiceManager(DATABASE_PATH);

console.log({"Services:": await manager.getServices()});
console.log({"Service by ID 3:": await manager.getServiceById(3)});

const newService = {
    name: "Ritual spa de relajación",
    description: "Experiencia de bienestar que combina exfoliación corporal, hidratación y masaje relajante.",
    duration: 120,
    price: 45000,
    category: "Spa y estética",
    available: true
}

// console.log({"New Services:": await manager.addService(newService)});

const updateServiceData = {
    name: "Ritual spa de relajación",
    description: "Experiencia de bienestar que combina exfoliación corporal, hidratación y masaje relajante.",
    duration: 120,
    price: 55000,
    category: "Spa y estética",
    available: true
}

console.log({"Update Service:": await manager.updateService(20, updateServiceData)});

console.log({"Deleted Service:": await manager.deleteService(20)});



