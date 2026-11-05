import express from "express";
import RoutingDetector from "./middlewares/routingDetector.middleware.js";
import serviceRouter from "./routes/services.router.js";
//settings

const app = express();

//middlewares
app.use(express.json());
app.use(RoutingDetector);

//routes
app.get('/', (req,res) => {
    res.json({"mensaje": "Index"})

})

app.use('/api/services', serviceRouter);

export default app