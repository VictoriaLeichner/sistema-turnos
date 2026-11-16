const REQUIRED_FIELDS = ["clientName", "clientEmail", "date", "time"];

export function validateBooking(req, res, next) {
  const data = req.body;

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

  next();
}