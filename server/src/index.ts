import "dotenv/config";

import express from "express";
import cors from "cors";

import healthRoute from "./routes/health.route";
import leadRoute from "./routes/lead.route";
import internalRoutes from "./routes/internal.route";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT: number = Number(process.env.PORT) || 3030;

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
    })
);
app.use(express.json());

app.use('/', healthRoute);
app.use('/api/leads', leadRoute)
app.use('/api/internal', internalRoutes)

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
