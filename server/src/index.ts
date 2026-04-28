import "dotenv/config";

import express from "express";
import cors from "cors";

import healthRoute from "./routes/health.route";
import leadRoute from "./routes/lead.route";
import internalRoutes from "./routes/internal.route";
import { errorHandler } from "./middleware/errorHandler";
import helmet from "helmet";

const requiredEnvVars = ['DATABASE_URL', 'N8N_WEBHOOK_URL', 'INTERNAL_API_KEY', 'FRONTEND_URL'];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`)
    }
}

const app = express();
const PORT: number = Number(process.env.PORT) || 3030;

app.use(express.json());
app.use(helmet())
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
    })
);

app.use('/', healthRoute);
app.use('/api/leads', leadRoute)
app.use('/api/internal', internalRoutes)

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
