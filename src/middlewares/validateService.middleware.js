
const REQUIRED_FIELDS = [
  "name",
  "description",
  "duration",
  "price",
  "category",
  "available",
];

export function validateService(req, res, next) {
  const data = req.body;
  const fields = Object.keys(data);

  // En POST se requieren todos los campos.
  if (req.method === "POST") {
    const missingFields = REQUIRED_FIELDS.filter(
      (field) => data[field] === undefined || data[field] === null,
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "NotOk",
        message: "Faltan campos obligatorios",
        missingFields,
      });
    }
  }

  // En PUT se requiere al menos un campo para actualizar.
  else if (req.method === "PUT" && fields.length === 0) {
    return res.status(400).json({
      status: "NotOk",
      message: "Ingrese al menos un campo para actualizar",
    });
  }

  next();
}
